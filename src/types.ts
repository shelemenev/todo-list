export type TaskStatus = 'all' | 'active' | 'completed'

export interface Task {
  id: string
  text: string
  completed: boolean
}

export interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export interface TaskItemProps {
  id: string
  text: string
  completed: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export interface FilterButtonsProps {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => void
}