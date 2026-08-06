import React, { useState } from 'react'
import styles from './TaskForm.module.scss'
import type { Task, TaskFormProps } from '../../types'

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    }

    onAddTask(newTask)
    setText('')
  }

  return (
    <form className={styles.TaskForm} onSubmit={handleSubmit}>
      <input
        className={styles.Input}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Новая задача"
        autoComplete="off"
      />
      <button className={styles.SubmitButton} type="submit">
        Добавить
      </button>
    </form>
  )
}
