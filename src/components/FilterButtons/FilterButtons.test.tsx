import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterButtons } from './FilterButtons';
import '@testing-library/jest-dom';

describe('FilterButtons', () => {
  it('рендерит все кнопки фильтров', () => {
    render(<FilterButtons status="all" onStatusChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /Все/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Активные/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Выполненные/i })).toBeInTheDocument();
  });

  it('вызывает onStatusChange при клике на кнопку', async () => {
    const mockChange = vi.fn();
    render(<FilterButtons status="all" onStatusChange={mockChange} />);

    const activeBtn = screen.getByRole('button', { name: /Активные/i });
    await userEvent.click(activeBtn);

    expect(mockChange).toHaveBeenCalledTimes(1);
    expect(mockChange).toHaveBeenCalledWith('active');
  });
});
