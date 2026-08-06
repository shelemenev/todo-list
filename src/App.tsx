import React, { useState, useCallback, useMemo } from 'react'
import type { Task, TaskStatus } from './types'
import { TaskForm } from './components/TaskForm/TaskForm'
import { TaskList } from './components/TaskList/TaskList'
import { FilterButtons } from './components/FilterButtons/FilterButtons'

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [status, setStatus] = useState<TaskStatus>('all')

  const addTask = useCallback((newTask: Task) => {
    setTasks((prev) => [newTask, ...prev])
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const editTask = useCallback((id: string, newText: string) => {
    if (!newText.trim()) return
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, text: newText.trim() }
          : t,
      ),
    )
  }, [])

  const filteredTasks = useMemo(() => {
    if (status === 'all') return tasks
    if (status === 'active') return tasks.filter((t) => !t.completed)
    return tasks.filter((t) => t.completed)
  }, [tasks, status])

  return (
    <main className="app-container">
      <h1 className="app-title">Список задач</h1>
      <TaskForm onAddTask={addTask} />
      <FilterButtons status={status} onStatusChange={setStatus} />
      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
      />
    </main>
  )
}

export default App
