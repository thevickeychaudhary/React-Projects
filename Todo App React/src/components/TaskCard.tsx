import React, { useState } from 'react'
import { type Task } from '../context/TaskContext'
import { useTasks } from '../context/TaskContext'
import { PriorityBadge } from './PriorityBadge'
import { formatDate } from '../utils/dateUtils'

interface TaskCardProps {
  task: Task
  className?: string
}

export function TaskCard({ task, className = '' }: TaskCardProps) {
  const { toggleTask, deleteTask, updateTask, getPriorityById } = useTasks()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [showPriorityMenu, setShowPriorityMenu] = useState(false)

  const priority = getPriorityById(task.priorityId)

  const handleToggle = () => {
    toggleTask(task.id)
  }

  const handleDelete = () => {
    deleteTask(task.id)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditTitle(task.title)
  }

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handlePrioritySelect = (priorityId: string) => {
    updateTask(task.id, { priorityId })
    setShowPriorityMenu(false)
  }

  const handleRemovePriority = () => {
    updateTask(task.id, { priorityId: undefined })
    setShowPriorityMenu(false)
  }

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${className}`}>
      <div className="task-header">
        {priority && (
          <div className="task-priority">
            <PriorityBadge priority={priority} size="small" />
          </div>
        )}
        <div className="task-actions">
          <button
            className="priority-btn"
            onClick={() => setShowPriorityMenu(!showPriorityMenu)}
            title="Set Priority"
          >
            ⚡
          </button>
          {showPriorityMenu && (
            <div className="priority-menu">
              <button
                className="priority-menu-item"
                onClick={handleRemovePriority}
              >
                No Priority
              </button>
              {useTasks().state.priorities.map(p => (
                <button
                  key={p.id}
                  className="priority-menu-item"
                  onClick={() => handlePrioritySelect(p.id)}
                >
                  <PriorityBadge priority={p} size="small" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="task-content">
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="checkbox"
          />
        </div>

        <div className="task-body">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="edit-input"
              autoFocus
            />
          ) : (
            <span 
              className={`task-title ${task.completed ? 'completed' : ''}`}
              onDoubleClick={handleEdit}
            >
              {task.title}
            </span>
          )}
          
          <div className="task-meta">
            <span className="task-date">
              {formatDate(new Date(task.createdAt))}
            </span>
          </div>
        </div>

        <div className="task-controls">
          {!isEditing && (
            <button
              className="edit-btn"
              onClick={handleEdit}
              title="Edit task"
            >
              ✏️
            </button>
          )}
          <button
            className="delete-btn"
            onClick={handleDelete}
            title="Delete task"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
