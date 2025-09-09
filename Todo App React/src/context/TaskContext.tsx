import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { filterTasksByDate, type DateFilterState } from '../utils/dateUtils'

export interface Priority {
  id: string
  label: string
  color: string
  order: number
}

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: number
  priorityId?: string
}

interface TaskState {
  tasks: Task[]
  priorities: Priority[]
  dateFilter: DateFilterState
  filteredTasks: Task[]
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'SET_DATE_FILTER'; payload: DateFilterState }
  | { type: 'ADD_PRIORITY'; payload: Priority }
  | { type: 'UPDATE_PRIORITY'; payload: { id: string; updates: Partial<Priority> } }
  | { type: 'DELETE_PRIORITY'; payload: string }
  | { type: 'LOAD_DATA'; payload: { tasks: Task[]; priorities: Priority[] } }

const STORAGE_KEY = 'todo-app-react-data'

const defaultPriorities: Priority[] = [
  { id: 'critical', label: 'Critical', color: '#ef4444', order: 1 },
  { id: 'high', label: 'High', color: '#f97316', order: 2 },
  { id: 'medium', label: 'Medium', color: '#8b5cf6', order: 3 },
]

const initialState: TaskState = {
  tasks: [],
  priorities: defaultPriorities,
  dateFilter: { type: 'all' },
  filteredTasks: [],
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  let newState: TaskState

  switch (action.type) {
    case 'ADD_TASK':
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      }
      newState = {
        ...state,
        tasks: [newTask, ...state.tasks],
      }
      break

    case 'TOGGLE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      }
      break

    case 'DELETE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      }
      break

    case 'UPDATE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      }
      break

    case 'SET_DATE_FILTER':
      newState = {
        ...state,
        dateFilter: action.payload,
      }
      break

    case 'ADD_PRIORITY':
      newState = {
        ...state,
        priorities: [...state.priorities, action.payload].sort((a, b) => a.order - b.order),
      }
      break

    case 'UPDATE_PRIORITY':
      newState = {
        ...state,
        priorities: state.priorities.map(priority =>
          priority.id === action.payload.id
            ? { ...priority, ...action.payload.updates }
            : priority
        ).sort((a, b) => a.order - b.order),
      }
      break

    case 'DELETE_PRIORITY':
      newState = {
        ...state,
        tasks: state.tasks.map(task =>
          task.priorityId === action.payload ? { ...task, priorityId: undefined } : task
        ),
        priorities: state.priorities.filter(priority => priority.id !== action.payload),
      }
      break

    case 'LOAD_DATA':
      newState = {
        ...state,
        tasks: action.payload.tasks,
        priorities: action.payload.priorities,
      }
      break

    default:
      return state
  }

  // Apply date filtering
  newState.filteredTasks = filterTasksByDate(newState.tasks, newState.dateFilter)

  return newState
}

interface TaskContextType {
  state: TaskState
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  setDateFilter: (filter: DateFilterState) => void
  addPriority: (priority: Priority) => void
  updatePriority: (id: string, updates: Partial<Priority>) => void
  deletePriority: (id: string) => void
  getPriorityById: (id?: string) => Priority | undefined
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        dispatch({
          type: 'LOAD_DATA',
          payload: {
            tasks: data.tasks || [],
            priorities: data.priorities || defaultPriorities,
          },
        })
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error)
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tasks: state.tasks,
        priorities: state.priorities,
      }))
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
    }
  }, [state.tasks, state.priorities])

  const contextValue: TaskContextType = {
    state,
    addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
    toggleTask: (id) => dispatch({ type: 'TOGGLE_TASK', payload: id }),
    deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
    updateTask: (id, updates) => dispatch({ type: 'UPDATE_TASK', payload: { id, updates } }),
    setDateFilter: (filter) => dispatch({ type: 'SET_DATE_FILTER', payload: filter }),
    addPriority: (priority) => dispatch({ type: 'ADD_PRIORITY', payload: priority }),
    updatePriority: (id, updates) => dispatch({ type: 'UPDATE_PRIORITY', payload: { id, updates } }),
    deletePriority: (id) => dispatch({ type: 'DELETE_PRIORITY', payload: id }),
    getPriorityById: (id) => state.priorities.find(p => p.id === id),
  }

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}
