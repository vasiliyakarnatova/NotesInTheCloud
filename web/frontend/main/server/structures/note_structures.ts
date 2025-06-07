import { TodoItemResolver, TodoItemServer } from "./todo_structures";

export type NoteResolver = {
    id: string;
    userId: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    allowEdit: boolean;
    shareId: string | null;
}

export type NoteWithTodosResolver = NoteResolver & {
    editors: any[];
    todoItems: TodoItemResolver[];
}

export type NoteServer = {
  id: string;
  title: string;
  description?: string;
};

export type FullNoteServer = {
    id: string;
    title: string;
    description: string;
    author: string;
    createdAt?: string;
    modifiedAt?: string;
    editors: any[];
    todos: TodoItemServer[];
}