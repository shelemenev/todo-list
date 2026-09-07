import styles from './FilterButtons.module.scss'
import type { FilterButtonsProps, TaskStatus } from '../../types'

export const FilterButtons = ({ status, onStatusChange }: FilterButtonsProps) => {
  const filters: TaskStatus[] = ['all', 'active', 'completed']

  return (
    <div className={styles.FilterButtons}>
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={status === filter ? styles.Active : styles.Button}
          onClick={() => onStatusChange(filter)}
          aria-pressed={status === filter}
          aria-label={
            filter === 'all'
              ? 'Показать все задачи'
              : filter === 'active'
              ? 'Показать активные задачи'
              : 'Показать завершённые задачи'
          }
        >
          {filter === 'all'
            ? 'Все'
            : filter === 'active'
            ? 'Активные'
            : 'Завершённые'}
        </button>
      ))}
    </div>
  )
}
