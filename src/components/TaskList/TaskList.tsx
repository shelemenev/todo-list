import { memo } from 'react'
import { TaskItem } from '../TaskItem/TaskItem'
import styles from './TaskList.module.scss'
import type { TaskListProps } from '../../types'

export const TaskList = memo(({
  tasks,
  onToggle,
  onDelete,
  onEdit,
}: TaskListProps): React.ReactElement => {
  if (tasks.length === 0) {
    return <p className={styles.EmptyList}>Список задач пуст</p>
  }

  return (
    <ul className={styles.TaskList}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          text={task.text}
          completed={task.completed}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
})
