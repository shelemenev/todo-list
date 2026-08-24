import { useState } from 'react'
import type { TaskFormProps } from '../../types'
import styles from './TaskForm.module.scss'

export const TaskForm = ({ onAdd }: TaskFormProps) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value.trim())
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
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
