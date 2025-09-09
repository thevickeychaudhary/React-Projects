import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TaskProvider, useTasks } from '../TaskContext'

// Test component that uses the context
function TestComponent() {
  const { state, addTask, toggleTask, deleteTask, setDateFilter } = useTasks()
  
  return (
    <div>
      <div data-testid="task-count">{state.filteredTasks.length}</div>
      <button onClick={() => addTask({ title: 'Test Task', completed: false })}>
        Add Task
      </button>
      {state.filteredTasks.map(task => (
        <div key={task.id} data-testid={`task-${task.id}`}>
          <span>{task.title}</span>
          <button onClick={() => toggleTask(task.id)}>Toggle</button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
      <button onClick={() => setDateFilter({ type: 'today' })}>
        Filter Today
      </button>
    </div>
  )
}

describe('TaskContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('provides initial state', () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    )

    expect(screen.getByTestId('task-count')).toHaveTextContent('0')
  })

  it('adds tasks correctly', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    )

    fireEvent.click(screen.getByText('Add Task'))
    
    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('1')
    })
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('toggles task completion', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    )

    // Add a task first
    fireEvent.click(screen.getByText('Add Task'))
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    // Toggle the task
    const toggleButton = screen.getByText('Toggle')
    fireEvent.click(toggleButton)

    // Task should still be visible but marked as completed
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('deletes tasks correctly', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    )

    // Add a task first
    fireEvent.click(screen.getByText('Add Task'))
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    // Delete the task
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.queryByText('Test Task')).not.toBeInTheDocument()
      expect(screen.getByTestId('task-count')).toHaveTextContent('0')
    })
  })

  it('filters tasks by date', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    )

    // Add a task first
    fireEvent.click(screen.getByText('Add Task'))
    
    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('1')
    })

    // Apply today filter
    fireEvent.click(screen.getByText('Filter Today'))

    // Task should still be visible (created today)
    expect(screen.getByTestId('task-count')).toHaveTextContent('1')
  })

  it('persists data to localStorage', async () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    )

    // Add a task
    fireEvent.click(screen.getByText('Add Task'))
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
    })

    // Check if data is saved to localStorage
    const savedData = localStorage.getItem('todo-app-react-data')
    expect(savedData).toBeTruthy()
    
    const parsedData = JSON.parse(savedData!)
    expect(parsedData.tasks).toHaveLength(1)
    expect(parsedData.tasks[0].title).toBe('Test Task')
  })

  it('loads data from localStorage on mount', () => {
    // Pre-populate localStorage
    const mockData = {
      tasks: [{ id: '1', title: 'Saved Task', completed: false, createdAt: Date.now() }],
      priorities: []
    }
    localStorage.setItem('todo-app-react-data', JSON.stringify(mockData))

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    )

    expect(screen.getByText('Saved Task')).toBeInTheDocument()
    expect(screen.getByTestId('task-count')).toHaveTextContent('1')
  })
})
