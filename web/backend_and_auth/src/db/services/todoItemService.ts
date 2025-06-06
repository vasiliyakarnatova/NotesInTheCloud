const TodoItem = require('../models/todoItem');

import {ITodoItem} from '../interfaces/todoItem';

import { v4 as uuidv4 } from 'uuid';

export type ITodoItemUpdate = Partial<Pick<ITodoItem, 'todoItemTitle' | 'isChecked'>>;

export const getTodos = async (noteId: string) => {
    const todos = await TodoItem.query()
            .select('todo_item.*')
            .where('todo_item.note_id', noteId);
    return todos;
}

export const createTodo = async (noteId: string, todoItemTitle: string) => {
    const todoItemId = uuidv4(); 
    const createdTime = new Date().toISOString();
    return await TodoItem.query().insert({ todoItemId, noteId, todoItemTitle, isChecked: false, createdTime});
};

export const deleteTodo = async (todoItemId: string) => {
    const todoForDeleting = await TodoItem.query().findOne({ todo_item_id: todoItemId });
    console.log(todoForDeleting);
    const isDeleted = await TodoItem.query().deleteById(todoItemId);
    if (isDeleted != 1) {
        return undefined;
    }

    return todoForDeleting;
}

export const updateTodo = async (todoItemId: string, data: ITodoItemUpdate) => {
    const todoItem = await TodoItem.query().findById(todoItemId);
    if (!todoItem) {
        throw new Error('Note not found');
    }

    return await todoItem.$query().patchAndFetch(data); 
};
