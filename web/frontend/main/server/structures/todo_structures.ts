export type TodoItemResolver = {
    id: string;
    noteId: string;
    text: string;
    completed: boolean;
}

export type TodoItemServer = {
    todoItemId: string;
    todoItemTitle: string;
    isChecked: boolean;
    noteId: string;
    createdTime: string;
}
