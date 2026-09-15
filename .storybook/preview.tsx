import type { Preview } from '@storybook/react-webpack5'
import { useLayoutEffect } from 'react'

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
        document.body.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#f9f9f9'
      }, [theme])

      return (
        <div
          className={theme === 'dark' ? 'theme-dark' : ''}
          style={{
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f9f9f9',
            color: theme === 'dark' ? '#e0e0e0' : '#333',
            minHeight: '100%',
            padding: '16px',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview