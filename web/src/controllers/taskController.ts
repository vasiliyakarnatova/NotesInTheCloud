import { createTodo, deleteTodo, updateTodo } from "../db/services/todoItemService";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const createTask = async (req: Request, res: Response) => {
    const { noteId } = req.params;
    const { title } = req.body;

    const createdTask = await createTodo(noteId, title);
    if (!createdTask) {
        res.status(StatusCodes.BAD_REQUEST).json(`already exists todo with this name: ${ title }`);
        return;
    }

    res.status(StatusCodes.CREATED).json(createdTask);
}

export const deleteTask = async (req: Request, res: Response) => {
    const { taskId } = req.params;

    const deletedTodo = await deleteTodo(taskId);
    if (!deletedTodo) {
        res.status(StatusCodes.NO_CONTENT).json(`does not exist todo with this id: ${ taskId }`);
        return;
    }

    res.status(StatusCodes.OK).json(deletedTodo);
}

export const updateTask = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { title, isChecked } = req.body;

    const updatedTodo = await updateTodo(taskId, { todoItemTitle: title, isChecked });
    if (!updatedTodo) {
        res.status(StatusCodes.NO_CONTENT).json(`does not exist todo with this id: ${ taskId }`);
        return;
    }

    res.status(StatusCodes.OK).json(updatedTodo);
}