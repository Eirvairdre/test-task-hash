/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorModal } from '@/components/ui/ErrorModal';

describe('ErrorModal', () => {
  it('рендерит ошибку и кнопку закрытия', () => {
    const onClose = jest.fn();
    render(<ErrorModal open={true} error="Ошибка!" onClose={onClose} />);
    expect(screen.getByText('Ошибка!')).toBeInTheDocument();
    expect(screen.getByText(/закрыть/i)).toBeInTheDocument();
  });

  it('вызывает onClose при клике по кнопке закрытия', () => {
    const onClose = jest.fn();
    render(<ErrorModal open={true} error="Ошибка!" onClose={onClose} />);
    fireEvent.click(screen.getByText(/закрыть/i));
    expect(onClose).toHaveBeenCalled();
  });
}); 