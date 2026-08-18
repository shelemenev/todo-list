import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import '@testing-library/jest-dom';

describe('App — Todo List', () => {
  beforeEach(() => {
    render(<App />);
  });

  const getAddButton = () => screen.getByRole('button', { name: /добавить/i });
  const getInputPlaceholder = () => screen.getByPlaceholderText('Новая задача');

  const selectAllFilter = async () => {
    const allBtn = screen.queryByRole('button', { name: /все/i });
    if (allBtn) {
      await userEvent.click(allBtn);
      await waitFor(() => expect(allBtn).toBeInTheDocument());
    }
  };

  const findTaskByText = async (text: string) => {
    return await screen.findByText(text, { exact: false });
  };

  describe('Добавление задачи', () => {
    it('добавляет задачу и отображает её в списке', async () => {
      await selectAllFilter();
      const input = getInputPlaceholder();
      const addBtn = getAddButton();
      const taskText = 'Новая задача';

      await userEvent.type(input, taskText);
      await userEvent.click(addBtn);

      expect(await findTaskByText(taskText)).toBeInTheDocument();
    });

    it('не добавляет задачу с пустым текстом', async () => {
      await selectAllFilter();
      const initialCount = screen.queryAllByRole('listitem').length;
      const addBtn = getAddButton();

      await userEvent.click(addBtn);

      await waitFor(() => {
        expect(screen.queryAllByRole('listitem')).toHaveLength(initialCount);
      });
    });
  });

  describe('Фильтрация задач', () => {
    it('корректно фильтрует активные и завершённые задачи', async () => {
      await selectAllFilter();
      const input = getInputPlaceholder();
      const addBtn = getAddButton();

      await userEvent.type(input, 'Выполненная задача');
      await userEvent.click(addBtn);

      const textEl = await screen.findByText('Выполненная задача', { exact: false });

      const taskItem = textEl.closest('li');
      if (!taskItem) {
        throw new Error('Не удалось найти родительский <li> для задачи');
      }

      const { getByTestId } = within(taskItem);
      const checkbox = getByTestId('task-checkbox');
      await userEvent.click(checkbox);

      await userEvent.clear(input);
      await userEvent.type(input, 'Активная задача');
      await userEvent.click(addBtn);

      const filters = screen.getAllByRole('button');
      const completedFilterBtn = filters.find((b) => b.textContent?.includes('Выполненные'));
      if (!completedFilterBtn) throw new Error('Кнопка "Выполненные" не найдена');

      await userEvent.click(completedFilterBtn);

      expect(await screen.findByText('Выполненная задача')).toBeInTheDocument();
      expect(screen.queryByText('Активная задача')).not.toBeInTheDocument();
    });
  });

  describe('Inline-редактирование задачи', () => {
    it('показывает кнопку "Редактировать" для активной задачи', async () => {
      await selectAllFilter();
      
      const input = getInputPlaceholder();
      const addBtn = getAddButton();

      await userEvent.type(input, 'Задача для редактирования');
      await userEvent.click(addBtn);

      const textEl = await screen.findByText('Задача для редактирования', { exact: false });

      const taskItem = textEl.closest('li');
      if (!taskItem) {
        throw new Error('Не удалось найти родительский <li> для задачи');
      }

      const { queryByTestId } = within(taskItem);
      const editBtn = queryByTestId('edit-btn');

      expect(editBtn).toBeInTheDocument();
    });

    it('позволяет начать редактирование и сохранить через кнопку "Сохранить"', async () => {
      await selectAllFilter();
      
      const input = getInputPlaceholder();
      const addBtn = getAddButton();

      await userEvent.type(input, 'Задача для редактирования');
      await userEvent.click(addBtn);

      const textElements = await screen.findAllByText('Задача для редактирования', { exact: false });
      
      const firstTextEl = textElements[0];
      
      const taskItem = firstTextEl.closest('li');
      if (!taskItem) {
        throw new Error('Не удалось найти родительский <li>');
      }

      const { getByTestId, queryByTestId } = within(taskItem);

      const editBtn = getByTestId('edit-btn');
      await userEvent.click(editBtn);

      expect(queryByTestId('edit-input')).toBeInTheDocument();

      const editInput = getByTestId('edit-input');
      await userEvent.clear(editInput);
      await userEvent.type(editInput, 'Отредактированная задача');

      const saveBtn = getByTestId('save-btn'); 
      await userEvent.click(saveBtn);

      expect(screen.queryByTestId('edit-input')).not.toBeInTheDocument();
      expect(await screen.findByText('Отредактированная задача')).toBeInTheDocument();
    });

    it('отменяет редактирование по Escape', async () => {
      await selectAllFilter();
      
      const input = getInputPlaceholder();
      const addBtn = getAddButton();

      await userEvent.type(input, 'Задача для отмены');
      await userEvent.click(addBtn);

      const textEl = await screen.findByText('Задача для отмены', { exact: false });

      const taskItem = textEl.closest('li');
      if (!taskItem) {
        throw new Error('Не удалось найти родительский <li> для задачи');
      }

      const { getByTestId, queryByTestId } = within(taskItem);
      
      const editBtn = getByTestId('edit-btn');
      await userEvent.click(editBtn);

      expect(queryByTestId('edit-input')).toBeInTheDocument();
      const editInput = getByTestId('edit-input');
      
      await userEvent.click(editInput);
      await userEvent.keyboard('[Escape]');

      expect(screen.queryByTestId('edit-input')).not.toBeInTheDocument();
      expect(await screen.findByText('Задача для отмены')).toBeInTheDocument();
    });

    it('отменяет редактирование кнопкой "Отмена"', async () => {
      await selectAllFilter();
      
      const input = getInputPlaceholder();
      const addBtn = getAddButton();

      await userEvent.type(input, 'Задача для отмены кнопкой');
      await userEvent.click(addBtn);

      const textEl = await screen.findByText('Задача для отмены кнопкой', { exact: false });

      const taskItem = textEl.closest('li');
      if (!taskItem) {
        throw new Error('Не удалось найти родительский <li> для задачи');
      }

      const { getByTestId } = within(taskItem);
      
      const editBtn = getByTestId('edit-btn');
      await userEvent.click(editBtn);

      expect(await screen.findByTestId('edit-input')).toBeInTheDocument();
      const editInput = getByTestId('edit-input');

      await userEvent.click(editInput);

      const cancelBtn = getByTestId('cancel-btn'); 
      await userEvent.click(cancelBtn);

      expect(screen.queryByTestId('edit-input')).not.toBeInTheDocument();
      expect(await screen.findByText('Задача для отмены кнопкой')).toBeInTheDocument();
    });

    it('не показывает кнопку редактирования для завершённой задачи', async () => {
      await selectAllFilter();
      
      const input = getInputPlaceholder();
      const addBtn = getAddButton();

      await userEvent.type(input, 'Завершённая задача');
      await userEvent.click(addBtn);

      const textEl = await screen.findByText('Завершённая задача', { exact: false });

      const taskItem = textEl.closest('li');
      if (!taskItem) {
        throw new Error('Не удалось найти родительский <li> для задачи');
      }

      const { getByTestId, queryByTestId } = within(taskItem);

      const checkbox = getByTestId('task-checkbox');
      await userEvent.click(checkbox);

      expect(checkbox).toBeChecked();

      const editBtn = queryByTestId('edit-btn');
      expect(editBtn).toBeNull();
    });
  });

  describe('Удаление задачи', () => {

    it('удаляет задачу из списка', async () => {
      await selectAllFilter();
      
      const input = getInputPlaceholder();
      const addBtn = getAddButton();
      const taskText = 'Задача для удаления';

      await userEvent.type(input, taskText);
      await userEvent.click(addBtn);

      const textEl = await screen.findByText(taskText, { exact: false });
      
      const taskItem = textEl.closest('li');
      if (!taskItem) {
        throw new Error('Не удалось найти родительский <li> для задачи');
      }

      const { getByTestId } = within(taskItem);

      const deleteBtn = getByTestId('delete-btn');
      await userEvent.click(deleteBtn);

      expect(screen.queryByText(taskText)).toBeNull();
    });
  });

  describe('Переключение статуса задачи', () => {

    it('переключает статус задачи по клику на чекбокс', async () => {
      await selectAllFilter();

      const input = getInputPlaceholder();
      const addBtn = getAddButton();
      const taskText = 'Задача для переключения';

      await userEvent.type(input, taskText);
      await userEvent.click(addBtn);

      const textEl = await screen.findByText(taskText, { exact: false });

      const taskItem = textEl.closest('li');
      if (!taskItem) {
        throw new Error('Не удалось найти родительский <li> для задачи');
      }

      const { getByTestId } = within(taskItem);

      const checkbox = getByTestId('task-checkbox');

      expect(checkbox).not.toBeChecked();

      await userEvent.click(checkbox);

      expect(checkbox).toBeChecked();
    });
  });
});
