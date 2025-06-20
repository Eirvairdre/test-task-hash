/** @jest-environment jsdom */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/components/providers/ThemeProvider';
import { ReactNode } from 'react';

// Тестовый компонент для использования хука useTheme
const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-mode">{isDarkMode ? 'dark' : 'light'}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

// Вспомогательная функция для рендера с провайдером
const renderWithProvider = (ui: ReactNode) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('должен переключать тему по клику', () => {
    renderWithProvider(<TestComponent />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    const themeMode = screen.getByTestId('theme-mode');

    // Изначально светлая тема
    expect(themeMode).toHaveTextContent('light');

    // Клик для переключения на темную
    fireEvent.click(button);
    expect(themeMode).toHaveTextContent('dark');

    // Клик для переключения обратно на светлую
    fireEvent.click(button);
    expect(themeMode).toHaveTextContent('light');
  });

  it('должен устанавливать темную тему ночью (после 22:00)', () => {
    // Устанавливаем ночь
    const nightTime = new Date();
    nightTime.setHours(23);
    jest.setSystemTime(nightTime);
    
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  it('должен устанавливать светлую тему днем (после 10:00)', () => {
    // Устанавливаем день
    const dayTime = new Date();
    dayTime.setHours(14);
    jest.setSystemTime(dayTime);

    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  it('должен обновлять тему каждую минуту', () => {
    const dayTime = new Date();
    dayTime.setHours(21, 59, 30); // 21:59:30
    jest.setSystemTime(dayTime);

    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');

    // Проматываем время на 1 минуту вперед
    act(() => {
      jest.advanceTimersByTime(60 * 1000);
    });

    // Тема должна стать темной
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });
}); 