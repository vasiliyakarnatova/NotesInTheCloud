import { TodoItemResolver, TodoItemServer } from "server/structures/todo_structures";

function convertTodoItemServerToResolver(sourceTask: TodoItemServer): TodoItemResolver {
    return {
        id: sourceTask.todoItemId,
        noteId: sourceTask.noteId,
        text: sourceTask.todoItemTitle,
        completed: sourceTask.isChecked
    }
}

export { convertTodoItemServerToResolver };