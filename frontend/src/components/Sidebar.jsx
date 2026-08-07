import { CalendarIcon, CheckIcon, ListIcon, PlusIcon, SparkIcon } from './Icons'

const navigation = [
  { id: 'tasks', label: 'Active tasks', icon: ListIcon },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'completed', label: 'Completed', icon: CheckIcon },
]

export default function Sidebar({ currentPage, onNavigate, onAddTask, counts }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><SparkIcon /></div>
        <div>
          <p className="brand-name">CHRONA</p>
          <span>Make time visible</span>
        </div>
      </div>

      <button className="primary-button add-task-button" onClick={onAddTask}>
        <PlusIcon />
        Add new task
      </button>

      <nav className="navigation" aria-label="Main navigation">
        {navigation.map((item) => {
          const Icon = item.icon
          const count = item.id === 'tasks' ? counts.active : item.id === 'completed' ? counts.completed : null
          return (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-label"><Icon />{item.label}</span>
              {count !== null && <span className="nav-count">{count}</span>}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-note">
        <span className="note-orbit" />
        <p>Small steps become visible progress.</p>
      </div>
    </aside>
  )
}