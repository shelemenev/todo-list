import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterButtons } from './FilterButtons'
import '@testing-library/jest-dom'

describe('FilterButtons', () => {
  it('рендерит все три кнопки фильтров', () => {
    render(<FilterButtons status="all" onStatusChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /Все/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Активные/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Завершённые/i })).toBeInTheDocument()
  })

  it('вызывает onStatusChange с правильным значением при клике на "Активные"', async () => {
    const mockChange = vi.fn()

    render(<FilterButtons status="all" onStatusChange={mockChange} />)

    const activeBtn = screen.getByRole('button', { name: /Активные/i })
    await userEvent.click(activeBtn)

    expect(mockChange).toHaveBeenCalledTimes(1)
    expect(mockChange).toHaveBeenCalledWith('active')
  })

  it('вызывает onStatusChange с правильным значением при клике на "Завершённые"', async () => {
    const mockChange = vi.fn()

    render(<FilterButtons status="all" onStatusChange={mockChange} />)

    const completedBtn = screen.getByRole('button', { name: /Завершённые/i })
    await userEvent.click(completedBtn)

    expect(mockChange).toHaveBeenCalledTimes(1)
    expect(mockChange).toHaveBeenCalledWith('completed')
  })

  it('визуально выделяет активную кнопку через aria-pressed', () => {
    render(<FilterButtons status="active" onStatusChange={vi.fn()} />)

    const activeBtn = screen.getByRole('button', { name: /Активные/i })
    expect(activeBtn).toHaveAttribute('aria-pressed', 'true')

    const allBtn = screen.getByRole('button', { name: /Все/i })
    expect(allBtn).toHaveAttribute('aria-pressed', 'false')

    const completedBtn = screen.getByRole('button', { name: /Завершённые/i })
    expect(completedBtn).toHaveAttribute('aria-pressed', 'false')
  })
})
