import { useMemo, useState } from 'react'
import { ArrowIcon } from '../components/Icons'
import { formatDateKey, getTodayKey } from '../utils/date'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getCalendarDays(displayDate) {
  const year = displayDate.getFullYear()
  const month = displayDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - startOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })
}

export default function CalendarPage({ tasks, onEdit }) {
  const [displayDate, setDisplayDate] = useState(new Date())
  const calendarDays = useMemo(() => getCalendarDays(displayDate), [displayDate])
  const currentMonth = displayDate.getMonth()
  const todayKey = getTodayKey()

  function moveMonth(amount) {
    setDisplayDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  }

  return (
    <>
      <header className="page-header calendar-heading">
        <div>
          <p className="eyebrow">Your month at a glance</p>
          <h1>{new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(displayDate)}</h1>
          <p className="page-intro">Every active task appears on its chosen due date.</p>
        </div>
        <div className="calendar-controls">
          <button className="secondary-button compact" onClick={() => setDisplayDate(new Date())}>Today</button>
          <button className="icon-button" onClick={() => moveMonth(-1)} aria-label="Previous month"><ArrowIcon direction="left" /></button>
          <button className="icon-button" onClick={() => moveMonth(1)} aria-label="Next month"><ArrowIcon /></button>
        </div>
      </header>

      <section className="calendar-shell">
        <div className="weekday-row">
          {weekdays.map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="calendar-grid">
          {calendarDays.map((date) => {
            const dateKey = formatDateKey(date)
            const dayTasks = tasks.filter((task) => task.dueDate === dateKey)
            const outsideMonth = date.getMonth() !== currentMonth
            return (
              <div
                key={dateKey}
                className={`calendar-day ${outsideMonth ? 'outside-month' : ''} ${dateKey === todayKey ? 'today' : ''}`}
              >
                <div className="day-number-row">
                  <span>{date.getDate()}</span>
                  {dayTasks.length > 0 && <small>{dayTasks.length}</small>}
                </div>
                <div className="calendar-task-list">
                  {dayTasks.slice(0, 3).map((task) => (
                    <button
                      key={task.id}
                      className={`calendar-task priority-${task.priority.toLowerCase()}`}
                      onClick={() => onEdit(task)}
                      title={`Edit ${task.title}`}
                    >
                      {task.title}
                    </button>
                  ))}
                  {dayTasks.length > 3 && <span className="more-tasks">+{dayTasks.length - 3} more</span>}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}