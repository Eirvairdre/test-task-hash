/** @jest-environment jsdom */
import { render, screen, fireEvent, within } from '@testing-library/react';
import { HashForm } from '@/components/hash/HashForm';

describe('HashForm', () => {
  it('рендерит поля и кнопку', () => {
    render(<HashForm onSubmit={jest.fn()} isLoading={false} />);
    expect(screen.getByLabelText(/строка для хеширования/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /хешировать/i })).toBeInTheDocument();
  });

  it('блокирует кнопку при пустой строке', () => {
    render(<HashForm onSubmit={jest.fn()} isLoading={false} />);
    const input = screen.getByLabelText(/строка для хеширования/i);
    const button = screen.getByRole('button', { name: /хешировать/i });
    expect(button).toBeDisabled();
    fireEvent.change(input, { target: { value: 'some text' } });
    expect(button).not.toBeDisabled();
    fireEvent.change(input, { target: { value: ' ' } });
    expect(button).toBeDisabled();
  });

  it('вызывает onSubmit с корректными данными', () => {
    const onSubmit = jest.fn();
    render(<HashForm onSubmit={onSubmit} isLoading={false} />);
    fireEvent.change(screen.getByLabelText(/строка для хеширования/i), { target: { value: 'test' } });
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText(/sha256/i));
    fireEvent.click(screen.getByRole('button', { name: /хешировать/i }));
    expect(onSubmit).toHaveBeenCalledWith('test', 'sha256');
  });
}); 