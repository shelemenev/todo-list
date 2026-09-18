/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite'
import { useLayoutEffect } from 'react'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Тема',
      description: 'Переключение темы',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Светлая' },
          { value: 'dark', title: 'Тёмная' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme

      useLayoutEffect(() => {
        document.body.classList.toggle('theme-dark', theme === 'dark')
      }, [theme])

      return (
        <div className={theme === 'dark' ? 'theme-dark' : ''}>
          <Story />
        </div>
      )
    },
  ],
}

export default preview