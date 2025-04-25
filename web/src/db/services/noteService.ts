const Note = require('../models/note');
const Editor = require('../models/editor');

import { INote } from '../interfaces/note';
import { IEditor } from '../interfaces/editor';

export type INoteUpdate = Partial<Pick<INote, 'title' | 'description'>>;

export const addEditorToNote = async (noteId: string, userName: string) => {
    return Editor.query().insert({ noteId, userName });
};

export const createNote = async (title: string, description: string, author: string) => {
    const newNote = await Note.query().insert({ title, description, author });
    addEditorToNote(newNote.noteId, author);
    return newNote;
};

export const getNote = async (noteId: string) => {
    return await Note.query().findOne({ noteId });
};

export const getNotesFromUser = async (userName: string) => {
    return await Note.query()
    .leftJoin('editor', 'note.noteId', 'editor.noteId')
    .where('note.author', userName)
    .orWhere('editor.name', userName);
};

export const updateNote = async (noteId: string, data: INoteUpdate) => {
    return await Note.query().patchAndFetch(data); // patch - partly update + fetch - get updated row
};

export const deleteNote = async (noteId: string) => {
    await Editor.query().delete().where({ noteId });
    return await Note.query().deleteById(noteId);
};