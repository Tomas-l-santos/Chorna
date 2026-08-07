import EmptyState from '../components/EmptyState'
import { TrashIcon } from '../components/Icons'
import { formatCompletedDate, formatReadableDate } from '../utils/date'

export default function CompletedPage({ tasks, onDelete, onNavigateToTasks }) {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Proof of progress</p>
          <h1>Completed moments.</h1>
          <p className="page-intro">Finished work stays visible until you decide to clear it.</p>
        </div>
        <div className="completion-score">
          <strong>{tasks.length}</strong>
          <span>completed</span>
        </div>
      </header>

      {tasks.length > 0 ? (
        <section className="completed-grid" aria-label="Completed tasks">
          {tasks.map((task) => (
            <article className="completed-card" key={task.id}>
              <div className="completed-check">✓</div>
              <div className="completed-content">
                <div className="task-card-topline">
                  <span className="category-chip">{task.category}</span>
                  <span className="completed-time">Finished {formatCompletedDate(task.completedAt)}</span>
                </div>
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <div className="completed-footer">
                  <span>Originally due {formatReadableDate(task.dueDate)}</span>
                  <button className="delete-text-button" onClick={() => onDelete(task)}>
                    <TrashIcon />
                    Delete permanently
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Nothing completed yet"
          message="Complete an active task and it will move here automatically."
          actionLabel="View active tasks"
          onAction={onNavigateToTasks}
        />
      )}
    </>
  )
}