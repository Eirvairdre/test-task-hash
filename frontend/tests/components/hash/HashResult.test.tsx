/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HashResult } from '@/components/hash/HashResult';

// Мок clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

describe('HashResult', () => {
  it('ничего не рендерит, если hash = null', () => {
    const { container } = render(<HashResult hash={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('отображает хеш и кнопку копирования', () => {
    render(<HashResult hash="abcdef123456" />);
    expect(screen.getByText('abcdef123456')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('копирует хеш в буфер обмена при клике', async () => {
    render(<HashResult hash="abcdef123456" />);
    fireEvent.click(screen.getByRole('button'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('abcdef123456');

    // Snackbar в портале, ищем в body
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/скопировано в буфер обмена/i);
  });
});
