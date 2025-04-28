import setupDb from "./db-setup.ts";
import { createTodo, updateTodo, deleteTodo } from './services/todoItemService'

setupDb();

// (async () => {
//     const todoItem = await createTodo("3ac01184-f3ad-4888-a787-c5e65289322d", "Make todo");
//     console.log(todoItem);
// })();

// (async () => {
//     const todoItem = await createTodo("3ac01184-f3ad-4888-a787-c5e65289322d", "Make todo");
//     console.log(todoItem);
// })();

// (async () => {
//     const updatedTodo = await updateTodo("44ca9b2a-021b-421a-a688-563a5a872719", {todoItemTitle: "Make first todo", isChecked: true});
//     console.log(updatedTodo);
// })();

// (async () => {
//     const todoItemId = "44ca9b2a-021b-421a-a688-563a5a872719";
//     return await deleteTodo(todoItemId);
// })();