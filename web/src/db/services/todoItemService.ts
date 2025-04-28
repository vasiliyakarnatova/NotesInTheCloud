const TodoItem = require('../models/todoItem');

import {ITodoItem} from '../interfaces/todoItem';

import { v4 as uuidv4 } from 'uuid';

export type ITodoItemUpdate = Partial<Pick<ITodoItem, 'todoItemTitle' | 'isChecked'>>;

export const createTodo = async (noteId: string, todoItemTitle: string) => {
    const todoItemId = uuidv4(); 
    const createdTime = new Date().toISOString();
    return TodoItem.query().insert({ todoItemId, noteId, todoItemTitle, isChecked: false, createdTime});
};

export const deleteTodo = async (todoItemId: string) => {
    return TodoItem.query().deleteById(todoItemId);
}

export const updateTodo = async (todoItemId: string, data: ITodoItemUpdate) => {
    const todoItem = await TodoItem.query().findById(todoItemId);
    if (!todoItem) {
        throw new Error('Note not found');
    }

    return await todoItem.$query().patchAndFetch(data); 
};
