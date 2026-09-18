import { useState, type FC } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FilterButtons } from './FilterButtons'
import type { TaskStatus } from '../../types'

const meta: Meta<typeof FilterButtons> = {
  title: 'Components/FilterButtons',
  component: FilterButtons,
  tags: ['autodocs'],
  argTypes: {
    status: {
      description: 'Текущий фильтр задач: все, только активные или только завершённые',
      control: 'radio',
      options: ['all', 'active', 'completed'],
      table: {
        category: 'Данные',
        type: { summary: 'TaskStatus' },
        defaultValue: { summary: 'all' },
      },
    },
    onStatusChange: {
      description: 'Колбэк смены фильтра. Вызывается с новым значением статуса',
      table: {
        category: 'Колбэки',
        type: { summary: '(status: TaskStatus) => void' },
      },
      action: 'onStatusChange',
    },
  },
  args: {
    status: 'all' as TaskStatus,
    onStatusChange: (status: TaskStatus) => console.log('onStatusChange:', status),
  },
}

export default meta

type Story = StoryObj<typeof FilterButtons>

const FilterButtonsStory: FC<{
  status?: TaskStatus
  onStatusChange?: (status: TaskStatus) => void
}> = ({ status: initialStatus = 'all', onStatusChange }) => {
  const [status, setStatus] = useState<TaskStatus>(initialStatus)

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }

  return (
    <div style={{ maxWidth: '400px', padding: '20px' }}>
      <FilterButtons status={status} onStatusChange={handleStatusChange} />

      <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
        Текущий фильтр: <strong>{status}</strong>
      </p>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <FilterButtonsStory onStatusChange={args.onStatusChange} />,
}

export const ActiveSelected: Story = {
  args: {
    status: 'active',
  },
  render: (args) => <FilterButtonsStory status={args.status} onStatusChange={args.onStatusChange} />,
}

export const CompletedSelected: Story = {
  args: {
    status: 'completed',
  },
  render: (args) => <FilterButtonsStory status={args.status} onStatusChange={args.onStatusChange} />,
}