import { Request, Response } from "express"
// import { db } from "../models/db";
import { createNote, getNote, getNotesFromUser } from "../db/services/noteService"
import { createUser } from "../db/services/userService"
import { Note } from "../types/note";

const USER_ID = "user_id"

export const getNotes = async (req: Request, res: Response) => {
    // const userId = req.headers[USER_ID] as string;
    // const notes = getNotesFromUser(userId);
    // res.status(200).json(notes);
}

export const getNoteFromUser = (req: Request, res: Response) => {

}

export const createNoteForUser = (req: Request, res: Response) => {
    const { title, description, author } = req.body;
    console.log(title);
    let titleLength: number = title?.length || 0;
    console.log(titleLength);

    if (titleLength === 0) {
        res.status(400).json("note is requered to have a title");
        return;
    }

    const newNote = createNote(title, description, author);
    res.status(201).json(newNote);
};

export const updateNote = (req: Request, res: Response) => {

}

export const deleteNote = (req: Request, res: Response) => {

}