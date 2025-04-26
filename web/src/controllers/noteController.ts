import { Request, Response } from "express"
import { createNote, deleteNote, getNote, getNotesFromUser, updateNote } from "../db/services/noteService"
import { StatusCodes } from "http-status-codes";
import { USER_ID } from "../utils/utils";

export const getNotes = async (req: Request, res: Response) => {
    const userId = req.headers[USER_ID] as string;
    
    const notes = await getNotesFromUser(userId);
    if (!notes) {
        res.status(StatusCodes.NO_CONTENT).json("user with this username not found");
        return;
    }

    res.status(StatusCodes.OK).json(notes);
};

export const getNoteFromUser = async (req: Request, res: Response) => {
    const { noteId } = req.params;

    const note = await getNote(noteId);
    if (!note) {
        res.status(StatusCodes.NO_CONTENT).json(`note with id ${noteId} not found`);
        return;
    }

    res.status(StatusCodes.OK).json(note);
};

export const createNoteForUser = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const author = req.headers[USER_ID] as string;

    let titleLength: number = title?.length || 0;
    if (titleLength === 0) {
        res.status(StatusCodes.BAD_REQUEST).json("note is requered to have a title");
        return;
    }

    const newNote = await createNote(title, description, author);
    if (newNote === undefined) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error while creating new note");
        return;
    }

    res.status(StatusCodes.CREATED).json(newNote);
};

export const updateNoteById = async (req: Request, res: Response) => {
    const { noteId } = req.params;

    const { title, description } = req.body;
    if (title) {
        let titleLength: number = title?.length || 0;
        if (titleLength === 0) {
            res.status(StatusCodes.BAD_REQUEST).json("note is requered to have a title with at least 1 symbol");
            return;
        }
    }

    const updatedNote = await updateNote(noteId, { title, description });
    if (!updatedNote) {
        res.status(StatusCodes.BAD_REQUEST).json(`note with id ${ noteId } not found`);
        return;
    }

    res.status(StatusCodes.OK).json(updatedNote);
};

export const deleteNoteById = async (req: Request, res: Response) => {
    const { noteId } = req.params;

    const deletedNote = await deleteNote(noteId);
    if (!deletedNote) {
        res.status(StatusCodes.BAD_REQUEST).json(`note with id ${ noteId } not found`);
        return;
    }

    res.status(StatusCodes.OK).json(deletedNote);
};