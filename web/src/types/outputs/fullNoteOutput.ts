import { Editor } from "../editor";
import { Task } from "../task";

export interface FullNoteOutput {
    id: string;
    title: string;
    description: string;
    author: string;
    createdAt: string;
    modifiedAt: string;
    editors: Editor[]
    todos: Task[]
}