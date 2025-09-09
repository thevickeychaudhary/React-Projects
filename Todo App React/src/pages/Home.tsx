import React, { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import { FilterBar } from '../components/FilterBar'
import { TaskCard } from '../components/TaskCard'

export function Home() {
  const { state, addTask } = useTasks()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedPriorityId, setSelectedPriorityId] = useState<string>('')

  const handleAddTask = () => {
    const title = newTaskTitle.trim()
    if (!title) return

    addTask({
      title,
      completed: false,
      priorityId: selectedPriorityId || undefined,
    })

    setNewTaskTitle('')
    setSelectedPriorityId('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTask()
    }
  }

  const remainingCount = state.filteredTasks.filter(task => !task.completed).length
  const completedCount = state.filteredTasks.filter(task => task.completed).length

  return (
    <div className="home-page">
      <header className="page-header">
        <h1 className="page-title">Todo App</h1>
        <p className="page-subtitle">Enhanced with Date Filters & Priority Management</p>
      </header>

      <FilterBar className="home-filter-bar" />

      <div className="add-task-section">
        <div className="add-task-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="task-input"
          />
          
          <select
            value={selectedPriorityId}
            onChange={(e) => setSelectedPriorityId(e.target.value)}
            className="priority-select"
          >
            <option value="">No Priority</option>
            {state.priorities.map(priority => (
              <option key={priority.id} value={priority.id}>
                {priority.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim()}
            className="add-task-btn"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{state.filteredTasks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Remaining:</span>
          <span className="stat-value">{remainingCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{completedCount}</span>
        </div>
      </div>

      <div className="task-list">
        {state.filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found for the selected filter.</p>
            <p>Try changing the date filter or add a new task.</p>
          </div>
        ) : (
          state.filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  )
}
