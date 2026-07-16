import React from 'react'
import { TaskItem } from '../TaskItem/TaskItem'
import styles from './TaskList.module.scss'
import type { TaskListProps } from '../../types'


export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
  if (tasks.length === 0) {
    return <p className={styles.TaskItem}>Список задач пуст</p>
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
        />
      ))}
    </ul>
  )
}
