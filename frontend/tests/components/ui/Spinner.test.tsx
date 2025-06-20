/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { Spinner } from '@/components/ui/Spinner';

describe('Spinner', () => {
  it('рендерит спиннер', () => {
    render(<Spinner />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('рендерит полноэкранный спиннер', () => {
    render(<Spinner fullScreen />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
}); 