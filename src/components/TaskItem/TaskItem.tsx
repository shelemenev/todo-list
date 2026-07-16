import React from 'react'
import styles from './TaskItem.module.scss'
import type { TaskItemProps } from '../../types'

export const TaskItem: React.FC<TaskItemProps> = ({ id, text, completed, onToggle, onDelete }) => {
  const handleToggle = () => onToggle(id)
  const handleDelete = () => onDelete(id)

  return (
    <li className={`${styles.TaskItem} ${completed ? styles.Completed : ''}`}>
      <label className={styles.Label} onClick={handleToggle} htmlFor={id}>
        <input
          id={id}
          className={styles.Checkbox}
          type="checkbox"
          checked={completed}
          aria-checked={completed}
          role="checkbox"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleToggle()
            }
          }}
        />
        <span className={styles.Text}>{text}</span>
      </label>

      <button
        className={styles.DeleteButton}
        type="button"
        onClick={handleDelete}
        aria-label="Удалить задачу"
      >
        Удалить
      </button>
    </li>
  )
}
