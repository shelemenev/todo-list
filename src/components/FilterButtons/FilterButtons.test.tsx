import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterButtons } from './FilterButtons'
import '@testing-library/jest-dom'

describe('FilterButtons', () => {
  it('рендерит все три кнопки фильтров', () => {
    render(<FilterButtons filter="all" onFilterChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /Все/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Активные/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Выполненные/i })).toBeInTheDocument()
  });

  it('вызывает onFilterChange с правильным значением при клике на "Активные"', async () => {
    const mockChange = vi.fn()
    
    render(<FilterButtons filter="all" onFilterChange={mockChange} />)

    const activeBtn = screen.getByRole('button', { name: /Активные/i })
    await userEvent.click(activeBtn)

    expect(mockChange).toHaveBeenCalledTimes(1)
    expect(mockChange).toHaveBeenCalledWith('active')
  })

  it('вызывает onFilterChange с правильным значением при клике на "Выполненные"', async () => {
    const mockChange = vi.fn()
    
    render(<FilterButtons filter="all" onFilterChange={mockChange} />)

    const completedBtn = screen.getByRole('button', { name: /Выполненные/i })
    await userEvent.click(completedBtn)

    expect(mockChange).toHaveBeenCalledTimes(1)
    expect(mockChange).toHaveBeenCalledWith('completed')
  })

  it('визуально выделяет активную кнопку (добавляет класс Active)', () => {
    render(<FilterButtons filter="active" onFilterChange={vi.fn()} />)

    const activeBtn = screen.getByRole('button', { name: /Активные/i })
    
    expect(activeBtn).toHaveClass('Active')
    
    const allBtn = screen.getByRole('button', { name: /Все/i })
    expect(allBtn).not.toHaveClass('Active')
  })
})
