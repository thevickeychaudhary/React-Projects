import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  isToday,
  isThisWeek,
  isInCustomRange,
  filterTasksByDate,
  formatDate,
  formatDateRange,
  type DateFilterState,
  type CustomDateRange
} from '../dateUtils'

interface TestTask {
  id: string
  title: string
  createdAt: number
}

describe('dateUtils', () => {
  let mockDate: Date

  beforeEach(() => {
    // Mock current date to 2024-01-15 (Monday)
    mockDate = new Date('2024-01-15T10:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date('2024-01-15T15:30:00Z')
      expect(isToday(today)).toBe(true)
    })

    it('should return false for yesterday', () => {
      const yesterday = new Date('2024-01-14T15:30:00Z')
      expect(isToday(yesterday)).toBe(false)
    })

    it('should return false for tomorrow', () => {
      const tomorrow = new Date('2024-01-16T15:30:00Z')
      expect(isToday(tomorrow)).toBe(false)
    })
  })

  describe('isThisWeek', () => {
    it('should return true for Monday (start of week)', () => {
      const monday = new Date('2024-01-15T10:00:00Z')
      expect(isThisWeek(monday)).toBe(true)
    })

    it('should return true for Friday (end of week)', () => {
      const friday = new Date('2024-01-19T10:00:00Z')
      expect(isThisWeek(friday)).toBe(true)
    })

    it('should return false for last week', () => {
      const lastWeek = new Date('2024-01-08T10:00:00Z')
      expect(isThisWeek(lastWeek)).toBe(false)
    })

    it('should return false for next week', () => {
      const nextWeek = new Date('2024-01-22T10:00:00Z')
      expect(isThisWeek(nextWeek)).toBe(false)
    })
  })

  describe('isInCustomRange', () => {
    it('should return true for date within range', () => {
      const range: CustomDateRange = {
        start: new Date('2024-01-10'),
        end: new Date('2024-01-20')
      }
      const testDate = new Date('2024-01-15')
      expect(isInCustomRange(testDate, range)).toBe(true)
    })

    it('should return false for date before range', () => {
      const range: CustomDateRange = {
        start: new Date('2024-01-10'),
        end: new Date('2024-01-20')
      }
      const testDate = new Date('2024-01-05')
      expect(isInCustomRange(testDate, range)).toBe(false)
    })

    it('should return false for date after range', () => {
      const range: CustomDateRange = {
        start: new Date('2024-01-10'),
        end: new Date('2024-01-20')
      }
      const testDate = new Date('2024-01-25')
      expect(isInCustomRange(testDate, range)).toBe(false)
    })
  })

  describe('filterTasksByDate', () => {
    const tasks: TestTask[] = [
      { id: '1', title: 'Today task', createdAt: new Date('2024-01-15T10:00:00Z').getTime() },
      { id: '2', title: 'This week task', createdAt: new Date('2024-01-17T10:00:00Z').getTime() },
      { id: '3', title: 'Last week task', createdAt: new Date('2024-01-08T10:00:00Z').getTime() },
      { id: '4', title: 'Next week task', createdAt: new Date('2024-01-22T10:00:00Z').getTime() }
    ]

    it('should return all tasks for "all" filter', () => {
      const filter: DateFilterState = { type: 'all' }
      const result = filterTasksByDate(tasks, filter)
      expect(result).toHaveLength(4)
    })

    it('should return only today tasks for "today" filter', () => {
      const filter: DateFilterState = { type: 'today' }
      const result = filterTasksByDate(tasks, filter)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Today task')
    })

    it('should return this week tasks for "thisWeek" filter', () => {
      const filter: DateFilterState = { type: 'thisWeek' }
      const result = filterTasksByDate(tasks, filter)
      expect(result).toHaveLength(2)
      expect(result.map(t => t.title)).toContain('Today task')
      expect(result.map(t => t.title)).toContain('This week task')
    })

    it('should return tasks in custom range', () => {
      const filter: DateFilterState = {
        type: 'custom',
        customRange: {
          start: new Date('2024-01-10'),
          end: new Date('2024-01-20')
        }
      }
      const result = filterTasksByDate(tasks, filter)
      expect(result).toHaveLength(2)
      expect(result.map(t => t.title)).toContain('Today task')
      expect(result.map(t => t.title)).toContain('This week task')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:00:00Z')
      const formatted = formatDate(date)
      expect(formatted).toBe('Jan 15, 2024')
    })
  })

  describe('formatDateRange', () => {
    it('should format date range correctly', () => {
      const range: CustomDateRange = {
        start: new Date('2024-01-10'),
        end: new Date('2024-01-20')
      }
      const formatted = formatDateRange(range)
      expect(formatted).toBe('Jan 10, 2024 - Jan 20, 2024')
    })
  })
})
