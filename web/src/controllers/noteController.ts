import { Request, Response } from "express"
// import { db } from "../models/db";
import { createNote, getNote, getNotesFromUser } from "../db/services/noteService"
import { createUser } from "../db/services/userService"
import { Note } from "../types/note";

const USER_ID = "user_id"

export const getNotes = (req: Request, res: Response) => {
    
    
    const userId = req.headers[USER_ID] as string;
    const notes = getNotesFromUser(userId);
    res.status(200).json(notes);
}

export const getNoteFromUser = (req: Request, res: Response) => {
    const result = createUser({
        userName: "Miro",
        email: "miro@gmail.com",
        password: "1234"
    })
    res.json(result)
}

export const createNoteForUser = (req: Request, res: Response) => {
    const { title, description, author } = req.body;
    const newNote: Note = {
        id: "das",
        title,
        description,
        author,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
    };
    res.status(201).json(newNote);
};

export const updateNote = (req: Request, res: Response) => {

}

export const deleteNote = (req: Request, res: Response) => {

}