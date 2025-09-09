import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriorityBadge } from '../PriorityBadge'
import { type Priority } from '../../context/TaskContext'

const mockPriority: Priority = {
  id: 'high',
  label: 'High',
  color: '#f97316',
  order: 2
}

describe('PriorityBadge', () => {
  it('renders priority badge with label', () => {
    render(<PriorityBadge priority={mockPriority} />)
    
    expect(screen.getByText('High')).toBeInTheDocument()
    const dot = screen.getByTitle('High')
    expect(dot).toHaveStyle({ backgroundColor: '#f97316' })
  })

  it('renders priority badge without label when showLabel is false', () => {
    render(<PriorityBadge priority={mockPriority} showLabel={false} />)
    
    expect(screen.queryByText('High')).not.toBeInTheDocument()
    const dot = screen.getByTitle('High')
    expect(dot).toHaveStyle({ backgroundColor: '#f97316' })
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<PriorityBadge priority={mockPriority} size="small" />)
    let dot = screen.getByTitle('High')
    expect(dot).toHaveClass('w-2', 'h-2')

    rerender(<PriorityBadge priority={mockPriority} size="medium" />)
    dot = screen.getByTitle('High')
    expect(dot).toHaveClass('w-3', 'h-3')

    rerender(<PriorityBadge priority={mockPriority} size="large" />)
    dot = screen.getByTitle('High')
    expect(dot).toHaveClass('w-4', 'h-4')
  })

  it('applies custom className', () => {
    render(<PriorityBadge priority={mockPriority} className="custom-class" />)
    
    const container = screen.getByText('High').closest('div')
    expect(container).toHaveClass('custom-class')
  })
})
