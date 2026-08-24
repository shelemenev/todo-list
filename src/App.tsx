import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Task, TaskStatus } from './types'
import { TaskForm } from './components/TaskForm/TaskForm'
import { TaskList } from './components/TaskList/TaskList'
import { FilterButtons } from './components/FilterButtons/FilterButtons'
import { ThemeToggleButton } from './components/ThemeToggle/ThemeToggleButton'

const TASKS_KEY = 'todo-tasks'
const FILTER_KEY = 'todo-filter'

export const App = (): React.ReactElement => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(TASKS_KEY)
    if (!stored) return []
    try {
      const parsed = JSON.parse(stored) as Task[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [status, setStatus] = useState<TaskStatus>(() => {
    const stored = localStorage.getItem(FILTER_KEY)
    if (!stored) return 'all'
    const parsed = stored as TaskStatus
    if (['all', 'active', 'completed'].includes(parsed)) {
      return parsed
    }
    return 'all'
  })

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, status)
  }, [status])

  const addTask = useCallback((text: string) => {
    if (!text.trim()) return
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
    }
    setTasks((prev) => [newTask, ...prev])
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const editTask = useCallback((id: string, newText: string) => {
    if (!newText.trim()) return
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: newText.trim() } : t
      )
    );
  }, [])

  const filteredTasks = useMemo<Task[]>(() => {
    if (status === 'all') return tasks
    if (status === 'active') return tasks.filter((t) => !t.completed)
    return tasks.filter((t) => t.completed)
  }, [tasks, status])

  return (
    <main className="app-container">
      <h1 className="app-title">Список задач</h1>

      <ThemeToggleButton />

      <TaskForm onAdd={addTask} />
      
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
