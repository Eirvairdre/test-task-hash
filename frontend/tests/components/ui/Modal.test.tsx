/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/ui/Modal';

describe('Modal', () => {
  it('рендерит заголовок и содержимое', () => {
    render(
      <Modal open={true} title="Заголовок" onClose={jest.fn()}>
        <div>Контент</div>
      </Modal>
    );
    expect(screen.getByText('Заголовок')).toBeInTheDocument();
    expect(screen.getByText('Контент')).toBeInTheDocument();
  });

  it('вызывает onClose при клике по кнопке отмены', () => {
    const onClose = jest.fn();
    render(
      <Modal open={true} title="Заголовок" onClose={onClose}>
        <div>Контент</div>
      </Modal>
    );
    fireEvent.click(screen.getByText(/отмена/i));
    expect(onClose).toHaveBeenCalled();
  });

  it('вызывает onConfirm при клике по кнопке подтверждения', () => {
    const onConfirm = jest.fn();
    render(
      <Modal open={true} title="Заголовок" onClose={jest.fn()} onConfirm={onConfirm} confirmText="OK">
        <div>Контент</div>
      </Modal>
    );
    fireEvent.click(screen.getByText('OK'));
    expect(onConfirm).toHaveBeenCalled();
  });
}); 