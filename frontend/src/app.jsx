import { useEffect, useMemo, useState } from 'react'
import * as taskApi from './api'
import ConfirmDialog from './components/ConfirmDialog'
import Sidebar from './components/Sidebar'
import TaskForm from './components/TaskForm'
import CalendarPage from './pages/CalendarPage'
import CompletedPage from './pages/CompletedPage'
import TasksPage from './pages/TasksPage'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [currentPage, setCurrentPage] = useState('tasks')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [formTask, setFormTask] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      setError('')
      const data = await taskApi.getTasks()
      setTasks(data)
    } catch (requestError) {
      setError(`${requestError.message} Make sure the Flask server is running on port 5000.`)
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateForm() {
    setFormTask(null)
    setIsFormOpen(true)
  }

  function openEditForm(task) {
    setFormTask(task)
    setIsFormOpen(true)
  }

  async function saveTask(taskData) {
    try {
      setIsSaving(true)
      setError('')
      if (formTask) {
        const updatedTask = await taskApi.updateTask(formTask.id, taskData)
        setTasks((current) => current.map((task) => task.id === updatedTask.id ? updatedTask : task))
      } else {
        const newTask = await taskApi.createTask(taskData)
        setTasks((current) => [...current, newTask])
        setCurrentPage('tasks')
      }
      setIsFormOpen(false)
      setFormTask(null)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function markComplete(taskId) {
    try {
      setError('')
      const completedTask = await taskApi.completeTask(taskId)
      setTasks((current) => current.map((task) => task.id === taskId ? completedTask : task))
      setCurrentPage('completed')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function confirmDelete() {
    if (!taskToDelete) return
    try {
      setError('')
      await taskApi.deleteTask(taskToDelete.id)
      setTasks((current) => current.filter((task) => task.id !== taskToDelete.id))
      setTaskToDelete(null)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const activeTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks])
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks])

  function renderPage() {
    if (currentPage === 'calendar') {
      return <CalendarPage tasks={activeTasks} onEdit={openEditForm} />
    }
    if (currentPage === 'completed') {
      return (
        <CompletedPage
          tasks={completedTasks}
          onDelete={setTaskToDelete}
          onNavigateToTasks={() => setCurrentPage('tasks')}
        />
      )
    }
    return (
      <TasksPage
        tasks={activeTasks}
        onAddTask={openCreateForm}
        onEdit={openEditForm}
        onComplete={markComplete}
        onDelete={setTaskToDelete}
      />
    )
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onAddTask={openCreateForm}
        counts={{ active: activeTasks.length, completed: completedTasks.length }}
      />

      <main className="main-content">
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button onClick={() => setError('')} aria-label="Dismiss error">×</button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-state">
            <div className="loading-orbit" />
            <p>Loading your timeline...</p>
          </div>
        ) : renderPage()}
      </main>

      {isFormOpen && (
        <TaskForm
          task={formTask}
          onClose={() => setIsFormOpen(false)}
          onSubmit={saveTask}
          isSaving={isSaving}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title={`Delete “${taskToDelete.title}”?`}
          message="This removes the task from the database and cannot be undone."
          confirmLabel="Delete task"
          onConfirm={confirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </div>
  )
}