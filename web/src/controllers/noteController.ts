import { Request, Response } from "express"
import { db } from "../models/db";
import { Note } from "../types/note";

const USER_ID = "user_id"

export const getNotes = (req: Request, res: Response) => {
    const userId = req.headers[USER_ID] as string;
    const notes = db.getNotes(userId);
    res.status(200).json(notes)
}

export const getNote = (req: Request, res: Response) => {
    
}

export const createNote = (req: Request, res: Response) => {
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