import { type Priority } from '../context/TaskContext'

interface PriorityBadgeProps {
  priority: Priority
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
  className?: string
}

export function PriorityBadge({ 
  priority, 
  size = 'medium', 
  showLabel = true,
  className = '' 
}: PriorityBadgeProps) {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  }

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full`}
        style={{ backgroundColor: priority.color }}
        title={priority.label}
      />
      {showLabel && (
        <span className={`${textSizeClasses[size]} font-medium`}>
          {priority.label}
        </span>
      )}
    </div>
  )
}
