import React, { createContext, useContext, useState } from 'react'

export interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app-theme')
    if (saved === 'light' || saved === 'dark') {
      return saved as 'light' | 'dark'
    }
    return 'light'
  })

  if (typeof window !== 'undefined') {
    document.body.classList.toggle('theme-dark', theme === 'dark')
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('app-theme', newTheme)
    document.body.classList.toggle('theme-dark', newTheme === 'dark')
  }

  const setThemeInternal = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    localStorage.setItem('app-theme', newTheme)
    document.body.classList.toggle('theme-dark', newTheme === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeInternal }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
