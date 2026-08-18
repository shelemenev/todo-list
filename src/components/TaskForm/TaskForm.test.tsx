import { vi } from 'vitest';         
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import { TaskForm } from './TaskForm';
import '@testing-library/jest-dom';

const user = userEvent.setup();      

describe('TaskForm', () => {
  it('вызывает onAddTask с правильной задачей при клике на кнопку "Добавить"', async () => {
    const onAddTask = vi.fn();
    render(<TaskForm onAddTask={onAddTask} />);

    const input = screen.getByPlaceholderText('Новая задача');
    const button = screen.getByRole('button', { name: /Добавить/i });

    await user.type(input, 'Купить молоко');
    await user.click(button);

    expect(onAddTask).toHaveBeenCalledTimes(1);
    
    expect(onAddTask).toHaveBeenCalledWith({
      id: expect.any(String),
      text: 'Купить молоко',
      completed: false,
    });
  });
});

it('вызывает onAddTask при нажатии Enter в поле ввода', async () => {
  const onAddTask = vi.fn();
  
  render(<TaskForm onAddTask={onAddTask} />);

  const input = screen.getByPlaceholderText('Новая задача'); 

  await user.type(input, 'Задача по Enter');
  
  await user.keyboard('{Enter}');

  expect(onAddTask).toHaveBeenCalledTimes(1);
});


it('не добавляет задачу при пустом вводе', async () => {
  const onAddTask = vi.fn(); 
  render(<TaskForm onAddTask={onAddTask} />);

  const button = screen.getByRole('button', { name: /Добавить/i });

  await user.click(button);

  expect(onAddTask).not.toHaveBeenCalled(); 
});

it('очищает инпут после добавления задачи', async () => {
  const onAddTask = vi.fn(); 
  render(<TaskForm onAddTask={onAddTask} />);

  const input = screen.getByPlaceholderText('Новая задача');
  const button = screen.getByRole('button', { name: /Добавить/i });

  await user.type(input, 'Новая задача');
  await user.click(button);

  expect(onAddTask).toHaveBeenCalledTimes(1);

  expect(input).toHaveValue('');
});

