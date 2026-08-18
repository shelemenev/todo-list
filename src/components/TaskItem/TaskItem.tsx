import React, { useState, useCallback } from 'react';
import styles from './TaskItem.module.scss';
import type { TaskItemProps } from '../../types';

export const TaskItem = ({
  id,
  text,
  completed,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps): React.ReactElement => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);

  const handleToggle = useCallback(() => onToggle(id), [onToggle, id]);
  const handleDelete = useCallback(() => onDelete(id), [onDelete, id]);

  const handleSave = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setInputValue(text);
      setIsEditing(false);
      return;
    }

    onEdit?.(id, trimmed);
    setIsEditing(false);
  }, [inputValue, text, onEdit, id]);

  const handleCancel = useCallback(() => {
    setInputValue(text);
    setIsEditing(false);
  }, [text]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSave, handleCancel],
  );

  const canEdit = !completed && typeof onEdit === 'function';

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
          data-testid="task-checkbox" 
          onChange={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
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
                data-testid="save-btn"
              >
                Сохранить
              </button>
              <button
                className={styles.CancelButton}
                type="button"
                onClick={handleCancel}
                aria-label="Отмена"
                data-testid="cancel-btn"
              >
                Отмена
              </button>
            </>
          ) : (
            <button
              className={styles.EditButton}
              type="button"
              onClick={() => {
                setInputValue(text);
                setIsEditing(true);
              }}
              aria-label="Редактировать"
              data-testid="edit-btn" 
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
        data-testid="delete-btn" 
      >
        Удалить
      </button>
    </li>
  );
};
