const TodoItem = require('../models/todoItem');

import {ITodoItem} from '../interfaces/todoItem';

export type ITodoItemUpdate = Partial<Pick<ITodoItem, 'todoItemTitle' | 'isChecked'>>;

export const createTodo = async (noteId: string, todoItemTitle: string) => {
    return TodoItem.query().insert({ noteId, todoItemTitle});
};

export const deleteTodo = async (todoItemId: string) => {
    return TodoItem.query().deleteById(todoItemId);
}

export const updateTodo = async (TodoItemId: string, todoItemTitle: string, isChecked: boolean) => {
    return TodoItem.query().patchAndFetch({ todoItemTitle, isChecked });
};
