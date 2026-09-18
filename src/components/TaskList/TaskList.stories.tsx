import { useState, type FC } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TaskList } from './TaskList'

interface Task {
  id: string
  text: string
  completed: boolean
}

const meta: Meta<typeof TaskList> = {
  title: 'Components/TaskList',
  component: TaskList,
  tags: ['autodocs'],
  argTypes: {
    tasks: {
      description: 'Массив задач для отображения. Если пустой — показывается сообщение «Список задач пуст»',
      table: {
        category: 'Данные',
        type: { summary: 'Task[]' },
        defaultValue: { summary: '[]' },
      },
    },
    onToggle: {
      description: 'Колбэк переключения статуса задачи. Передаётся в каждый TaskItem',
      table: {
        category: 'Колбэки',
        type: { summary: '(id: string) => void' },
      },
      action: 'onToggle',
    },
    onDelete: {
      description: 'Колбэк удаления задачи. Передаётся в каждый TaskItem',
      table: {
        category: 'Колбэки',
        type: { summary: '(id: string) => void' },
      },
      action: 'onDelete',
    },
    onEdit: {
      description: 'Колбэк редактирования текста задачи. Передаётся в каждый TaskItem. Если не передан — кнопка «Редактировать» скрыта у всех задач',
      table: {
        category: 'Колбэки',
        type: { summary: '((id: string, text: string) => void) | undefined' },
      },
      action: 'onEdit',
    },
  },
  args: {
    tasks: [
      { id: '1', text: 'Купить хлеб', completed: false },
      { id: '2', text: 'Выучить TypeScript', completed: true },
      { id: '3', text: 'Сделать стори', completed: false },
    ],
    onToggle: (id: string) => console.log('onToggle:', id),
    onDelete: (id: string) => console.log('onDelete:', id),
    onEdit: (id: string, text: string) => console.log('onEdit:', id, text),
  },
}

export default meta

type Story = StoryObj<typeof TaskList>

const TaskListStory: FC<{
  tasks?: Task[]
  onToggle?: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string, text: string) => void
}> = ({ tasks: initialTasks, onToggle, onDelete, onEdit }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks ?? [])

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
    onToggle?.(id)
  }

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    onDelete?.(id)
  }

  const handleEdit = (id: string, text: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text } : t))
    )
    onEdit?.(id, text)
  }

  return (
    <div style={{ maxWidth: '600px', padding: '20px' }}>
      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
        Задач: <strong>{tasks.length}</strong> | Активных:{' '}
        <strong>{tasks.filter((t) => !t.completed).length}</strong>
      </p>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <TaskListStory tasks={args.tasks} onToggle={args.onToggle} onDelete={args.onDelete} onEdit={args.onEdit} />,
}

export const AllCompleted: Story = {
  args: {
    tasks: [
      { id: '1', text: 'Купить хлеб', completed: true },
      { id: '2', text: 'Выучить TypeScript', completed: true },
    ],
  },
  render: (args) => <TaskListStory tasks={args.tasks} onToggle={args.onToggle} onDelete={args.onDelete} onEdit={args.onEdit} />,
}

export const Empty: Story = {
  args: {
    tasks: [],
  },
  render: (args) => <TaskListStory tasks={args.tasks} />,
}