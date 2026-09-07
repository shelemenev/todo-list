import { useState } from 'react'
import type { TaskFormProps } from '../../types'
import styles from './TaskForm.module.scss'
import type { FormEvent, KeyboardEvent } from 'react'

export const TaskForm = ({ onAdd }: TaskFormProps) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value.trim())
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.TaskForm}>
      <input
        className={styles.Input}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Новая задача…"
        aria-label="Текст задачи"
      />
      <button type="submit" className={styles.SubmitButton}>
        Добавить
      </button>
    </form>
  )
}
