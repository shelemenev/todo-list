import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from './TaskForm'
import '@testing-library/jest-dom'

const user = userEvent.setup()

describe('TaskForm', () => {
  it('вызывает onAdd с текстом задачи при клике на кнопку "Добавить"', async () => {
    const onAdd = vi.fn()
    
    render(<TaskForm onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('Новая задача')
    const button = screen.getByRole('button', { name: /Добавить/i })

    await user.type(input, 'Купить молоко')
    await user.click(button)

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith('Купить молоко')
  })

  it('вызывает onAdd при нажатии Enter в поле ввода', async () => {
    const onAdd = vi.fn()
    render(<TaskForm onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('Новая задача')

    await user.type(input, 'Задача по Enter')
    await user.keyboard('{Enter}')

    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it('не вызывает onAdd при пустом вводе и клике на кнопку', async () => {
    const onAdd = vi.fn()
    render(<TaskForm onAdd={onAdd} />)

    const button = screen.getByRole('button', { name: /Добавить/i })

    await user.click(button)

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('очищает инпут после успешного добавления задачи', async () => {
    const onAdd = vi.fn()
    render(<TaskForm onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('Новая задача')
    const button = screen.getByRole('button', { name: /Добавить/i })

    await user.type(input, 'Новая задача')
    await user.click(button)

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('')
  })

  it('не очищает инпут и не вызывает onAdd, если ввод пустой', async () => {
    const onAdd = vi.fn()
    render(<TaskForm onAdd={onAdd} />)

    const input = screen.getByPlaceholderText('Новая задача')
    const button = screen.getByRole('button', { name: /Добавить/i })

    await user.click(button)

    expect(onAdd).not.toHaveBeenCalled()
    expect(input).toHaveValue('')
  })
})
