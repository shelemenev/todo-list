import { useTheme } from '../../context/ThemeContext'
import styles from './ThemeToggleButton.module.css'

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={styles['ThemeToggle']}
      aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
    >
      {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
    </button>
  )
}
