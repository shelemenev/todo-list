import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from './TaskItem';
import { vi } from 'vitest'; 
import '@testing-library/jest-dom';

const mockCallbacks = {
  onToggle: vi.fn(),
  onDelete: vi.fn(),
  onEdit: vi.fn(),
};

const defaultProps = {
  id: '1',
  text: 'Задача',
  completed: false,
  ...mockCallbacks,
};

const renderTask = (props?: Partial<typeof defaultProps>) => {
  render(<TaskItem {...defaultProps} {...props} />);
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks(); 
});

describe('TaskItem', () => {
  it('отображает текст задачи', () => {
    renderTask();
    expect(screen.getByText('Задача')).toBeInTheDocument();
  });

  it('вызывает onToggle при клике на текст задачи', async () => {
    renderTask();
    const task = screen.getByText('Задача');
    await userEvent.click(task);
    expect(mockCallbacks.onToggle).toHaveBeenCalledTimes(1);
  });

  it('вызывает onDelete при клике на кнопку удаления', async () => {
    renderTask();
    const deleteBtn = screen.getByLabelText('Удалить задачу');
    await userEvent.click(deleteBtn);
    expect(mockCallbacks.onDelete).toHaveBeenCalledTimes(1);
    expect(mockCallbacks.onDelete).toHaveBeenCalledWith('1');
  });

  it('показывает кнопку редактирования только для активной задачи', () => {
    renderTask({ completed: false }); 
    
    expect(screen.getByTestId('edit-btn')).toBeInTheDocument();

    cleanup();
  });

  it('не показывает кнопку редактирования для завершённой задачи', () => {
    renderTask({ completed: true });

    expect(screen.queryByTestId('edit-btn')).not.toBeInTheDocument();
  });
});
