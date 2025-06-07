import { TodoItemResolver, TodoItemServer } from "./todo_structures";
import { EditorResolver, EditorServer } from "./editor_structures";

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
    editors: EditorResolver[];
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
    editors: EditorServer[];
    todos: TodoItemServer[];
}