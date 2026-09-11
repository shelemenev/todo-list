import { vi, expect, it, describe, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeContext'

const renderWithThemeProvider = (children: React.ReactNode) =>
  render(<ThemeProvider>{children}</ThemeProvider>)

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('сохраняет выбранную тему в localStorage при изменении', async () => {
    const SetThemeButton = () => {
      const { setTheme } = useTheme()
      return (
        <button data-testid="set-dark" onClick={() => setTheme('dark')}>
          Set Dark
        </button>
      )
    }

    const user = userEvent.setup()
    renderWithThemeProvider(<SetThemeButton />)

    const btn = screen.getByTestId('set-dark')
    await user.click(btn)

    expect(localStorage.getItem('app-theme')).toBe('dark')
  })

  it('загружает тему из localStorage при монтировании', () => {
    localStorage.setItem('app-theme', 'dark')

    const CheckTheme = () => {
      const { theme } = useTheme()
      return <div data-testid="theme-display" data-theme={theme} />
    }

    renderWithThemeProvider(<CheckTheme />)

    expect(document.body.classList.contains('theme-dark')).toBe(true)
  })

  it('переключает тему через toggleTheme и обновляет localStorage', async () => {
    const ToggleButton = () => {
      const { toggleTheme } = useTheme()
      return <button data-testid="toggle" onClick={toggleTheme}>Toggle</button>
    }

    const user = userEvent.setup()
    renderWithThemeProvider(<ToggleButton />)

    const btn = screen.getByTestId('toggle')
    await user.click(btn)

    expect(localStorage.getItem('app-theme')).toBe('dark')
    expect(document.body.classList.contains('theme-dark')).toBe(true)

    await user.click(btn)
    expect(localStorage.getItem('app-theme')).toBe('light')
    expect(document.body.classList.contains('theme-dark')).toBe(false)
  })

  it('синхронизирует класс theme-dark на body при изменении темы', async () => {
    const ThemeButtons = () => {
      const { setTheme } = useTheme()
      return (
        <>
          <button data-testid="set-light" onClick={() => setTheme('light')}>Set Light</button>
          <button data-testid="set-dark" onClick={() => setTheme('dark')}>Set Dark</button>
        </>
      )
    }

    const user = userEvent.setup()
    renderWithThemeProvider(<ThemeButtons />)

    await user.click(screen.getByTestId('set-dark'))
    expect(document.body.classList.contains('theme-dark')).toBe(true)

    await user.click(screen.getByTestId('set-light'))
    expect(document.body.classList.contains('theme-dark')).toBe(false)
  })

  it('использует light как тему по умолчанию, если в localStorage ничего нет', () => {
    localStorage.clear()

    const CheckDefault = () => {
      const { theme } = useTheme()
      return <div data-testid="default-check" data-theme={theme} />
    }

    renderWithThemeProvider(<CheckDefault />)

    expect(localStorage.getItem('app-theme')).toBeNull()
    expect(document.body.classList.contains('theme-dark')).toBe(false)
  })
})

describe('useTheme вне ThemeProvider', () => {
  it('выбрасывает ошибку, если используется без ThemeProvider', () => {
    const Component = () => {
      useTheme()
      return null
    }

    expect(() => render(<Component />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    )
  })
})