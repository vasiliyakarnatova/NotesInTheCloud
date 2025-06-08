export const USER_ID = "user_id"

import { Request, Response } from "express";
import { IUser } from "../../../db/interfaces/user";
import { getUserByEmail, getUserByUserName } from "../../../db/services/userService";
import { StatusCodes } from "http-status-codes";
import { FullNoteOutput } from "../types/structures/note_structures";
import { getNote } from "../../../db/services/noteService";
import { INote } from "../../../db/interfaces/note";
import { getTodos } from "../../../db/services/todoItemService";
import { ITodoItem } from "../../../db/interfaces/todoItem";
import { getEditorsByNoteId } from "../../../db/services/editorService";
import { IEditor } from "../../../db/interfaces/editor";
import noteConverter from "../types/converters/noteConverter";

export const containsUsername = async (username: string) => {
    try {
        const user = await getUserByUserName(username) as IUser | undefined;
        
        if (user !== undefined) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export const containsEmail = async (email: string) => {
    try {
        const user = await getUserByEmail(email) as IUser | undefined;
        
        if (user !== undefined) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export const getUser = async (username: string) => {
    try {
        const user = await getUserByUserName(username) as IUser | undefined;

        if (user === undefined) {
            return undefined;
        } else {
            return user;
        }

    } catch (error) {
        return undefined;
    }
}

export const currentUser = async (req:Request, res:Response): Promise<any> => {
    if (req.session && req.session.userInSession) {
        res.status(StatusCodes.OK).json(req.session.userInSession);
        return req.session.userInSession;
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authenticated" });
        return undefined;
    }
};

export type Camelable<T> = {
  [K in keyof T]: T[K];
} & Record<string, unknown>;

export const getFullNoteOutputById = async (noteId: string): Promise<FullNoteOutput | null> => {
    const note = await getNote(noteId) as INote | undefined;
    if (!note) {
        return null;
    }
    
    const todos = await getTodos(noteId) as ITodoItem[] | undefined;
    if (!todos) {
        return null;
    }

    const editors = await getEditorsByNoteId(noteId) as IEditor[] | undefined;
    if (!editors) {
        return null;
    }    

    const outputNote = noteConverter.toFullNoteOutput(note, todos, editors);
    return outputNote;
}