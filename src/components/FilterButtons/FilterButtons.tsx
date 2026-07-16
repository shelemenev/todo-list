import React from 'react'
import styles from './FilterButtons.module.scss'
import type { FilterButtonsProps } from '../../types'

export const FilterButtons: React.FC<FilterButtonsProps> = ({ status, onStatusChange }) => {
  const buttons = [
    { key: 'all' as const, label: 'Все' },
    { key: 'active' as const, label: 'Активные' },
    { key: 'completed' as const, label: 'Выполненные' },
  ];

  return (
    <div className={styles.FilterButtons}>
      {buttons.map((btn) => (
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
