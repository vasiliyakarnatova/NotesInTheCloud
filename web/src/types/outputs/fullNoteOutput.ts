import { IEditor } from "db/interfaces/editor";
import { ITodoItem } from "db/interfaces/todoItem";

export interface FullNoteOutput {
    id?: string;
    title: string;
    description: string;
    author: string;
    createdAt?: string;
    modifiedAt?: string;
    editors: IEditor[];
    todos: ITodoItem[];
}