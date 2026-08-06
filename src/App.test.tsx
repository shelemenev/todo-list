import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

import '@testing-library/jest-dom';

describe('App — полный интеграционный тест', () => {
  beforeEach(() => {
    render(<App />);
  });

  // --- Хелперы (селекторы) ---
  const getAddButton = () => screen.getByRole('button', { name: 'Добавить' });
  const getPlaceholderInput = () => screen.getByPlaceholderText('Новая задача');
  const getEditInput = () => screen.getByTestId('edit-input');
  const getSaveButton = () => screen.getByRole('button', { name: 'Сохранить' });
  const getCancelButton = () => screen.getByRole('button', { name: 'Отмена' });
  
  // ИСПРАВЛЕНИЕ 1: Кнопка удаления имеет aria-label, но нет текста. 
  // Ищем строго по aria-label, а не по тексту внутри тега.
  const getDeleteButton = () => screen.getByRole('button', { name: 'Удалить задачу' });
  
  const getEditButton = () => screen.getByRole('button', { name: 'Редактировать' });
  
  // ИСПРАВЛЕНИЕ 2: getByText не сработает, если текст находится внутри value инпута.
  // Для проверки текста задачи нам нужно быть гибче.
  const getTaskText = (text: string) => {
    // Сначала пробуем найти как обычный текст (для режима просмотра)
    const elements = screen.queryAllByText(new RegExp(text, 'i'));
    if (elements.length > 0) return elements[0];
    
    // Если не нашли, пробуем найти инпут с таким value (для режима редактирования)
    const inputs = screen.queryAllByTestId('edit-input');
    const matchingInput = inputs.find((input) => (input as HTMLInputElement).value === text);
    if (matchingInput) return matchingInput;

    throw new Error(`Не удалось найти элемент с текстом "\${text}" ни как текст, ни как value инпута`);
  };

  describe('Добавление задачи', () => {
    it('добавляет задачу и отображает её в списке', async () => {
      const input = getPlaceholderInput();
      const addButton = getAddButton();

      await userEvent.type(input, 'Новая задача');
      await userEvent.click(addButton);

      expect(getTaskText('Новая задача')).toBeInTheDocument();
    });

    it('не добавляет задачу с пустым или пробельным текстом', async () => {
      const input = getPlaceholderInput();
      const addButton = getAddButton();

      await userEvent.type(input, '   ');
      await userEvent.click(addButton);

      expect(screen.queryByText(/^\s*\$/u)).not.toBeInTheDocument();
    });
  });

  describe('Фильтрация задач', () => {
    it('корректно фильтрует активные и завершённые задачи', async () => {
      const input = getPlaceholderInput();
      const addButton = getAddButton();

      await userEvent.type(input, 'Выполненная задача');
      await userEvent.click(addButton);

      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      await userEvent.type(input, 'Активная задача');
      await userEvent.click(addButton);

      const filterButtons = screen.getAllByRole('button');
      const completedBtn = filterButtons.find((b) => b.textContent?.includes('Выполненные'));
      if (!completedBtn) throw new Error('Кнопка "Выполненные" не найдена');
      await userEvent.click(completedBtn);

      expect(getTaskText('Выполненная задача')).toBeInTheDocument();
      expect(screen.queryByText('Активная задача')).not.toBeInTheDocument();
    });
  });

  describe('Inline-редактирование задачи', () => {
    beforeEach(async () => {
      const input = getPlaceholderInput();
      const addButton = getAddButton();

      await userEvent.type(input, 'Задача для редактирования');
      await userEvent.click(addButton);
    });

    it('показывает кнопку "Редактировать" для активной задачи', () => {
      expect(getEditButton()).toBeInTheDocument();
    });

    it('позволяет начать редактирование и сохранить через кнопку "Сохранить"', async () => {
      await userEvent.click(getEditButton());
      
      // Ждем появления инпута
      await expect(getEditInput()).toBeInTheDocument();

      const editInput = getEditInput();
      await userEvent.clear(editInput);
      await userEvent.type(editInput, 'Отредактированная задача');

      await userEvent.click(getSaveButton());
      await expect(screen.queryByTestId('edit-input')).not.toBeInTheDocument();
      // ИСПРАВЛЕНИЕ: Используем наш умный getTaskText, который найдет текст даже если он теперь в span
      expect(getTaskText('Отредактированная задача')).toBeInTheDocument();
    });

    it('отменяет редактирование по Escape', async () => {
      await userEvent.click(getEditButton());
      const editInput = getEditInput();

      await userEvent.clear(editInput);
      await userEvent.type(editInput, 'Не сохранённая задача');

      await userEvent.keyboard('{Escape}');

      await expect(screen.queryByTestId('edit-input')).not.toBeInTheDocument();
      // ИСПРАВЛЕНИЕ: Проверяем, что вернулся исходный текст
      expect(getTaskText('Задача для редактирования')).toBeInTheDocument();
    });

    it('отменяет редактирование кнопкой "Отмена"', async () => {
      await userEvent.click(getEditButton());
      const editInput = getEditInput();

      await userEvent.clear(editInput);
      await userEvent.type(editInput, 'Не сохранённая задача');

      await userEvent.click(getCancelButton());

      await expect(screen.queryByTestId('edit-input')).not.toBeInTheDocument();
      // ИСПРАВЛЕНИЕ: Проверяем, что вернулся исходный текст
      expect(getTaskText('Задача для редактирования')).toBeInTheDocument();
    });

    it('не показывает кнопку редактирования для завершённой задачи', async () => {
      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      expect(screen.queryByRole('button', { name: 'Редактировать' })).not.toBeInTheDocument();
    });
  });

  describe('Удаление задачи', () => {
    beforeEach(async () => {
      const input = getPlaceholderInput();
      const addButton = getAddButton();

      await userEvent.type(input, 'Задача для удаления');
      await userEvent.click(addButton);
    });

    it('удаляет задачу из списка', async () => {
      // ИСПРАВЛЕНИЕ: Ищем кнопку по aria-label, так как внутри тега нет текста "Удалить"
      const deleteBtn = getDeleteButton();
      await userEvent.click(deleteBtn);
      
      expect(screen.queryByText('Задача для удаления')).not.toBeInTheDocument();
    });
  });

  describe('Переключение статуса задачи', () => {
    beforeEach(async () => {
      const input = getPlaceholderInput();
      const addButton = getAddButton();

      await userEvent.type(input, 'Задача для переключения');
      await userEvent.click(addButton);
    });

    it('переключает статус задачи по клику на чекбокс', async () => {
      const checkbox = screen.getByRole('checkbox');
      const labelText = getTaskText('Задача для переключения');

      await userEvent.click(checkbox);

      expect(checkbox).toBeChecked();
      expect(labelText).toBeInTheDocument();
    });
  });
});
