import React, { useState } from 'react'
import styles from './TaskItem.module.scss'
import type { TaskItemProps } from '../../types'

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  text,
  completed,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(text)

  const handleToggle = () => onToggle(id)
  const handleDelete = () => onDelete(id)

  const handleSave = () => {
    if (!inputValue.trim()) {
      setInputValue(text)
      setIsEditing(false)
      return
    }
    onEdit?.(id, inputValue.trim())
    setTimeout(() => setIsEditing(false), 0)
  }

  const handleCancel = () => {
    setInputValue(text)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const canEdit = !completed && typeof onEdit === 'function'

  return (
    <li className={`${styles.TaskItem} ${completed ? styles.Completed : ''}`}>
      <label className={styles.Label} htmlFor={id}>
        <input
          id={id}
          className={styles.Checkbox}
          type="checkbox"
          checked={completed}
          aria-checked={completed}
          role="checkbox"
          tabIndex={0}
          onChange={handleToggle} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleToggle()
            }
          }}
        />
        
        {canEdit && isEditing ? (
          <input
            data-testid="edit-input" 
            className={styles.EditInput}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Редактировать задачу"
          />
        ) : (
          <span className={styles.Text}>{text}</span>
        )}
      </label>

      {canEdit ? (
        <div className={styles.ActionButtons}>
          {isEditing ? (
            <>
              <button
                className={styles.SaveButton}
                type="button"
                onClick={handleSave}
                aria-label="Сохранить"
              >
                Сохранить
              </button>
              <button
                className={styles.CancelButton}
                type="button"
                onClick={handleCancel}
                aria-label="Отмена"
              >
                Отмена
              </button>
            </>
          ) : (
            <button
              className={styles.EditButton}
              type="button"
              onClick={() => {
                setInputValue(text)
                setIsEditing(true)
              }}
              aria-label="Редактировать"
            >
              Редактировать
            </button>
          )}
        </div>
      ) : null}

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
