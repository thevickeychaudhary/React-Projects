export type DateFilter = 'all' | 'today' | 'thisWeek' | 'custom'

export interface CustomDateRange {
  start: Date
  end: Date
}

export interface DateFilterState {
  type: DateFilter
  customRange?: CustomDateRange
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function isThisWeek(date: Date): boolean {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  
  return date >= startOfWeek && date <= endOfWeek
}

export function isInCustomRange(date: Date, range: CustomDateRange): boolean {
  const start = new Date(range.start)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(range.end)
  end.setHours(23, 59, 59, 999)
  
  return date >= start && date <= end
}

export function filterTasksByDate<T extends { createdAt: number }>(
  tasks: T[],
  filter: DateFilterState
): T[] {
  if (filter.type === 'all') {
    return tasks
  }
  
  return tasks.filter(task => {
    const taskDate = new Date(task.createdAt)
    
    switch (filter.type) {
      case 'today':
        return isToday(taskDate)
      case 'thisWeek':
        return isThisWeek(taskDate)
      case 'custom':
        return filter.customRange ? isInCustomRange(taskDate, filter.customRange) : false
      default:
        return true
    }
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateRange(range: CustomDateRange): string {
  return `${formatDate(range.start)} - ${formatDate(range.end)}`
}

