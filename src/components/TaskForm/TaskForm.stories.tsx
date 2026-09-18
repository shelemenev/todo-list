import { useState, type FC } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TaskForm } from './TaskForm'

const meta: Meta<typeof TaskForm> = {
  title: 'Components/TaskForm',
  component: TaskForm,
  tags: ['autodocs'],
  argTypes: {
    onAdd: {
      description: 'Колбэк добавления новой задачи. Получает текст задачи.',
      table: {
        category: 'Колбэки',
        type: { summary: '(text: string) => void' },
      },
      action: 'onAdd',
    },
  },
  args: {
    onAdd: (text: string) => console.log('onAdd:', text),
  },
}

export default meta

type Story = StoryObj<typeof TaskForm>

const TaskFormStory: FC<{ onAdd?: (text: string) => void }> = ({
  onAdd,
}) => {
  const [tasks, setTasks] = useState<string[]>([])

  const handleAdd = (text: string) => {
    setTasks((prev) => [...prev, text])
    onAdd?.(text)
  }

  return (
    <div style={{ maxWidth: '400px', padding: '20px' }}>
      <TaskForm onAdd={handleAdd} />

      <h3>Список задач (для демонстрации работы):</h3>
      {tasks.length === 0 ? (
        <p>Пока нет задач.</p>
      ) : (
        <ul>
          {tasks.map((t, idx) => (
            <li key={`${t}-${idx}`}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const Default: Story = {
  render: (args) => <TaskFormStory onAdd={args.onAdd} />,
}