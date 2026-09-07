import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskList } from './TaskList'


it('рендерит список задач', () => {
  const mockTasks = [
    { id: '1', text: 'Задача 1', completed: false },
    { id: '2', text: 'Задача 2', completed: true },
  ]

  const onToggle = vi.fn()
  const onDelete = vi.fn()

  render(<TaskList tasks={mockTasks} onToggle={onToggle} onDelete={onDelete} onEdit={function (): void {
    throw new Error('Function not implemented.')
  } } />)

  expect(screen.getByText('Задача 1')).toBeTruthy()
  expect(screen.getByText('Задача 2')).toBeTruthy()
})


it('показывает сообщение "Список задач пуст", если задач нет', () => {
  const onToggle = vi.fn()
  const onDelete = vi.fn()
  const onEdit = vi.fn()

  render(
    <TaskList
      tasks={[]}
      onToggle={onToggle}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  )

  expect(screen.getByText('Список задач пуст')).toBeTruthy()
})

