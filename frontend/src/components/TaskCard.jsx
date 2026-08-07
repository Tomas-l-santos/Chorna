import { CheckIcon, EditIcon, TrashIcon } from './Icons'
import { formatReadableDate, isDueToday, isOverdue } from '../utils/date'

export default function TaskCard({ task, onEdit, onComplete, onDelete }) {
  const timingLabel = isOverdue(task) ? 'Overdue' : isDueToday(task) ? 'Today' : formatReadableDate(task.dueDate)

  return (
    <article className={`task-card priority-${task.priority.toLowerCase()}`}>
      <div className="task-card-orbit" aria-hidden="true"><span /></div>
      <div className="task-card-content">
        <div className="task-card-topline">
          <div className="task-meta">
            <span className="category-chip">{task.category}</span>
            <span className={`priority-chip ${task.priority.toLowerCase()}`}>{task.priority}</span>
          </div>
          <span className={`date-chip ${isOverdue(task) ? 'overdue' : ''}`}>{timingLabel}</span>
        </div>

        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}

        <div className="task-card-actions">
          <button className="complete-button" onClick={() => onComplete(task.id)}>
            <CheckIcon />
            Mark complete
          </button>
          <div className="small-actions">
            <button className="icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
              <EditIcon />
            </button>
            <button className="icon-button danger" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}