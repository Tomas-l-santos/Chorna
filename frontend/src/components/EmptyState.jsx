import { PlusIcon, SparkIcon } from './Icons'

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-orbit"><SparkIcon /></div>
      <h3>{title}</h3>
      <p>{message}</p>
      {onAction && (
        <button className="primary-button" onClick={onAction}>
          <PlusIcon />
          {actionLabel}
        </button>
      )}
    </div>
  )
}