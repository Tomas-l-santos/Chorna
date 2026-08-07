export function getTodayKey() {
  const today = new Date()
  return formatDateKey(today)
}

export function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatReadableDate(dateKey) {
  if (!dateKey) return 'No date'
  const date = new Date(`${dateKey}T00:00:00`)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatCompletedDate(isoDate) {
  if (!isoDate) return 'Recently'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))
}

export function isOverdue(task) {
  return !task.completed && task.dueDate < getTodayKey()
}

export function isDueToday(task) {
  return !task.completed && task.dueDate === getTodayKey()
}