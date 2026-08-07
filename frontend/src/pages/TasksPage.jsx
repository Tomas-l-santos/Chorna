import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import TaskCard from '../components/TaskCard'
import { getTodayKey, isOverdue } from '../utils/date'

const filters = [
  { id: 'all', label: 'All active' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'overdue', label: 'Overdue' },
]

export default function TasksPage({ tasks, onAddTask, onEdit, onComplete, onDelete }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const visibleTasks = useMemo(() => {
    const today = getTodayKey()
    return tasks.filter((task) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'today' && task.dueDate === today) ||
        (filter === 'upcoming' && task.dueDate > today) ||
        (filter === 'overdue' && isOverdue(task))

      const searchText = `${task.title} ${task.description} ${task.category}`.toLowerCase()
      return matchesFilter && searchText.includes(search.toLowerCase())
    })
  }, [tasks, filter, search])

  const todayCount = tasks.filter((task) => task.dueDate === getTodayKey()).length
  const overdueCount = tasks.filter(isOverdue).length
  const highPriorityCount = tasks.filter((task) => task.priority === 'High').length

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Your active timeline</p>
          <h1>Turn intention into motion.</h1>
          <p className="page-intro">A focused view of what deserves your attention next.</p>
        </div>
        <div className="date-badge">
          <span>{new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(new Date())}</span>
          <strong>{new Date().getDate()}</strong>
        </div>
      </header>

      <section className="stats-grid" aria-label="Task overview">
        <article><span>Active</span><strong>{tasks.length}</strong><small>tasks in motion</small></article>
        <article><span>Due today</span><strong>{todayCount}</strong><small>focus points</small></article>
        <article><span>High priority</span><strong>{highPriorityCount}</strong><small>need attention</small></article>
        <article><span>Overdue</span><strong>{overdueCount}</strong><small>reset the plan</small></article>
      </section>

      <section className="task-toolbar">
        <div className="filter-group" aria-label="Task filters">
          {filters.map((item) => (
            <button
              key={item.id}
              className={filter === item.id ? 'selected' : ''}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks..."
          aria-label="Search active tasks"
        />
      </section>

      {visibleTasks.length > 0 ? (
        <section className="task-list" aria-label="Active tasks">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title={tasks.length === 0 ? 'Your timeline is clear' : 'No tasks match this view'}
          message={tasks.length === 0 ? 'Add your first task and give the day a direction.' : 'Try a different filter or search phrase.'}
          actionLabel="Create first task"
          onAction={tasks.length === 0 ? onAddTask : null}
        />
      )}
    </>
  )
}