import React from 'react'
import styles from './FilterButtons.module.scss'
import type { FilterButtonsProps, TaskStatus } from '../../types'

const FILTER_BUTTONS: ReadonlyArray<{ key: TaskStatus; label: string }> = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'Активные' },
  { key: 'completed', label: 'Выполненные' },
]

export const FilterButtons = ({
  status,
  onStatusChange,
}: FilterButtonsProps): React.ReactElement => {
  return (
    <div className={styles.FilterButtons}>
      {FILTER_BUTTONS.map((btn) => (
        <button
          key={btn.key}
          className={`${styles.Button} ${status === btn.key ? styles.Active : ''}`}
          type="button"
          onClick={() => onStatusChange(btn.key)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  )
}
