import { useState, type FC } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TaskItem } from './TaskItem'

const meta: Meta<typeof TaskItem> = {
  title: 'Components/TaskItem',
  component: TaskItem,
  tags: ['autodocs'],
  argTypes: {
    id: {
      description: 'Уникальный идентификатор задачи. Используется как ключ и для привязки чекбокса к лейблу',
      table: {
        category: 'Данные',
        type: { summary: 'string' },
      },
    },
    text: {
      description: 'Текст задачи, отображаемый в списке',
      control: 'text',
      table: {
        category: 'Данные',
        type: { summary: 'string' },
      },
    },
    completed: {
      description: 'Статус завершённости. Если true — текст перечёркнут, кнопка редактирования скрыта',
      control: 'boolean',
      table: {
        category: 'Данные',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onToggle: {
      description: 'Колбэк переключения статуса задачи. Получает id задачи',
      table: {
        category: 'Колбэки',
        type: { summary: '(id: string) => void' },
      },
      action: 'onToggle',
    },
    onDelete: {
      description: 'Колбэк удаления задачи. Получает id задачи',
      table: {
        category: 'Колбэки',
        type: { summary: '(id: string) => void' },
      },
      action: 'onDelete',
    },
    onEdit: {
      description: 'Колбэк редактирования текста задачи. Если не передан — кнопка «Редактировать» не отображается',
      table: {
        category: 'Колбэки',
        type: { summary: '((id: string, text: string) => void) | undefined' },
      },
      action: 'onEdit',
    },
  },
  args: {
    id: 'task-1',
    text: 'Купить хлеб',
    completed: false,
    onToggle: (id: string) => console.log('onToggle:', id),
    onDelete: (id: string) => console.log('onDelete:', id),
    onEdit: (id: string, text: string) => console.log('onEdit:', id, text),
  },
}

export default meta

type Story = StoryObj<typeof TaskItem>

const TaskItemStory: FC<{
  id?: string
  text?: string
  completed?: boolean
  onToggle?: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string, text: string) => void
}> = ({
  id = 'task-1',
  text: initialText = 'Купить хлеб',
  completed: initialCompleted = false,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [completed, setCompleted] = useState(initialCompleted)
  const [text, setText] = useState(initialText)

  const handleToggle = (id: string) => {
    setCompleted((prev) => !prev)
    onToggle?.(id)
  }

  const handleEdit = (id: string, newText: string) => {
    setText(newText)
    onEdit?.(id, newText)
  }

  const handleDelete = (id: string) => {
    onDelete?.(id)
  }

  return (
    <div style={{ maxWidth: '600px', padding: '20px' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <TaskItem
          id={id}
          text={text}
          completed={completed}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </ul>

      <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
        Статус: <strong>{completed ? 'Завершена' : 'Активна'}</strong> | Текст: <strong>{text}</strong>
      </p>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <TaskItemStory {...args} />,
}

export const Completed: Story = {
  args: {
    text: 'Выучить TypeScript',
    completed: true,
  },
  render: (args) => <TaskItemStory {...args} />,
}

export const WithoutOnEdit: Story = {
  args: {
    text: 'Без редактирования',
    completed: false,
    onEdit: undefined,
  },
  render: (args) => <TaskItemStory {...args} />,
}