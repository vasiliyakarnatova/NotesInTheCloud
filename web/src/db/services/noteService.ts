const Note = require('../models/note');
const Editor = require('../models/editor');

import { INote } from '../interfaces/note';

import { v4 as uuidv4 } from 'uuid';

export type INoteUpdate = Partial<Pick<INote, 'title' | 'description'>>;

export const addEditorToNote = async (noteId: string, name: string) => {
    return await Editor.query().insert({ noteId, name });
};

// createNote(...) => addEditorToNote(...)
export const createNote = async (title: string, description: string, author: string) => {
    const noteId = uuidv4(); 
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const newNote = await Note.query().insert({ noteId, title, description, author, createdAt, updatedAt });
    return newNote;
};

export const getNote = async (noteId: string) => {
    return await Note.query().findOne({ noteId: noteId });
};

export const getNotesFromUser = async (userName: string) => {
    return await Note.query()
    .leftJoin('editor', 'note.noteId', 'editor.noteId')
    .orWhere('editor.name', userName);
};

export const updateNote = async (noteId: string, data: INoteUpdate) => {
    const note = await Note.query().findById(noteId);
    if (!note) {
        throw new Error('Note not found');
    }

    const updatedData = {
        ...data,
        updated_at: new Date().toISOString()
    };
    return await note.$query().patchAndFetch(updatedData); 
};

// deleteNote(...) => deleteEditor(...) for this note
export const deleteNote = async (noteId: string) => {
    return await Note.query().deleteById(noteId);
};