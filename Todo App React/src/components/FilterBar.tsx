import { useState } from 'react'
import { formatDateRange, type DateFilter } from '../utils/dateUtils'
import { useTasks } from '../context/TaskContext'

interface FilterBarProps {
  className?: string
}

export function FilterBar({ className = '' }: FilterBarProps) {
  const { state, setDateFilter } = useTasks()
  const [showCustomRange, setShowCustomRange] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const handleFilterChange = (type: DateFilter) => {
    if (type === 'custom') {
      setShowCustomRange(true)
      setDateFilter({ type: 'custom' })
    } else {
      setShowCustomRange(false)
      setDateFilter({ type })
    }
  }

  const handleCustomRangeSubmit = () => {
    if (customStart && customEnd) {
      const startDate = new Date(customStart)
      const endDate = new Date(customEnd)
      
      if (startDate <= endDate) {
        setDateFilter({
          type: 'custom',
          customRange: { start: startDate, end: endDate }
        })
      }
    }
  }

  const getFilterLabel = () => {
    switch (state.dateFilter.type) {
      case 'today':
        return 'Today'
      case 'thisWeek':
        return 'This Week'
      case 'custom':
        return state.dateFilter.customRange 
          ? formatDateRange(state.dateFilter.customRange)
          : 'Custom Range'
      default:
        return 'All Tasks'
    }
  }

  return (
    <div className={`filter-bar ${className}`}>
      <div className="filter-section">
        <h3 className="filter-title">Date Filters</h3>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${state.dateFilter.type === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Tasks
          </button>
          <button
            className={`filter-btn ${state.dateFilter.type === 'today' ? 'active' : ''}`}
            onClick={() => handleFilterChange('today')}
          >
            Today
          </button>
          <button
            className={`filter-btn ${state.dateFilter.type === 'thisWeek' ? 'active' : ''}`}
            onClick={() => handleFilterChange('thisWeek')}
          >
            This Week
          </button>
          <button
            className={`filter-btn ${state.dateFilter.type === 'custom' ? 'active' : ''}`}
            onClick={() => handleFilterChange('custom')}
          >
            Custom Range
          </button>
        </div>
      </div>

      {showCustomRange && (
        <div className="custom-range-section">
          <div className="date-inputs">
            <div className="date-input-group">
              <label htmlFor="start-date">Start Date:</label>
              <input
                id="start-date"
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="date-input-group">
              <label htmlFor="end-date">End Date:</label>
              <input
                id="end-date"
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="date-input"
              />
            </div>
            <button
              onClick={handleCustomRangeSubmit}
              disabled={!customStart || !customEnd}
              className="apply-btn"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <div className="current-filter">
        <span className="filter-label">Current Filter:</span>
        <span className="filter-value">{getFilterLabel()}</span>
      </div>
    </div>
  )
}
