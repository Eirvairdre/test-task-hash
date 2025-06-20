import { formatDate } from '@/lib/utils/date';

describe('formatDate', () => {
  it('корректно форматирует дату', () => {
    expect(formatDate('2024-04-01T12:34:56.000Z')).toMatch(/\d{2}:\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}/);
  });

  it('корректно форматирует разные даты', () => {
    expect(formatDate('2023-12-31T23:59:59.000Z')).toContain('23:59:59');
    expect(formatDate('2022-01-01T00:00:00.000Z')).toContain('00:00:00');
  });
}); 