import React, { useState } from 'react'
import type { Task, TaskStatus } from './types'
import { TaskForm } from './components/TaskForm/TaskForm'
import { TaskList } from './components/TaskList/TaskList'
import { FilterButtons } from './components/FilterButtons/FilterButtons'

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [status, setStatus] = useState<TaskStatus>('all')

  const addTask = (newTask: Task) => setTasks((prev) => [newTask, ...prev])

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const filteredTasks =
    status === 'all'
      ? tasks
      : status === 'active'
      ? tasks.filter((t) => !t.completed)
      : tasks.filter((t) => t.completed)

  return (
    <main className="app-container">
      <h1 className="app-title">Список задач</h1>
      <TaskForm onAddTask={addTask} />
      <FilterButtons status={status} onStatusChange={setStatus} />
      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </main>
  )
}

export default App