import { useEffect, useState } from 'react'
import { CloseIcon } from './Icons'
import { getTodayKey } from '../utils/date'

const emptyTask = {
  title: '',
  description: '',
  dueDate: getTodayKey(),
  priority: 'Medium',
  category: 'Development',
}

export default function TaskForm({ task, onClose, onSubmit, isSaving }) {
  const [formData, setFormData] = useState(emptyTask)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        category: task.category,
      })
    } else {
      setFormData({ ...emptyTask, dueDate: getTodayKey() })
    }
  }, [task])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!formData.title.trim()) {
      setFormError('Give the task a clear title before saving it.')
      return
    }
    if (!formData.dueDate) {
      setFormError('Choose a due date so the task can appear in the calendar.')
      return
    }

    setFormError('')
    await onSubmit(formData)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{task ? 'Refine the plan' : 'Capture the moment'}</p>
            <h2 id="task-form-title">{task ? 'Edit task' : 'Create a task'}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close task form">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Task title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Finish portfolio landing page"
              maxLength="100"
              autoFocus
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add the detail you will need later..."
              rows="4"
            />
          </label>

          <div className="form-grid">
            <label>
              Due date
              <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
            </label>
            <label>
              Priority
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>

          <label>
            Category
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Development, University, Personal..."
              maxLength="30"
            />
          </label>

          {formError && <p className="form-error">{formError}</p>}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button" disabled={isSaving}>
              {isSaving ? 'Saving...' : task ? 'Save changes' : 'Add to timeline'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}