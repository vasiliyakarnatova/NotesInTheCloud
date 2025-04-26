const Note = require('../models/note');
const Editor = require('../models/editor');

import { Note } from 'types/note';
import { INote } from '../interfaces/note';

import { v4 as uuidv4 } from 'uuid';
import { Editor } from 'types/editor';
import { transaction, Transaction } from 'objection';

export type INoteUpdate = Partial<Pick<INote, 'title' | 'description'>>;

export const addEditorToNote = async (noteId: string, name: string): Promise<Editor | undefined> => {
    return await Editor.query().insert({ noteId, name });
};

export const createNote = async (title: string, description: string, author: string): Promise<Note | undefined> => {
    try {
        const newNote = await transaction(Note.knex(), async (trx: Transaction): Promise<Note | undefined> => {
            const noteId = uuidv4(); 
            const createdAt = new Date().toISOString();
            const updatedAt = createdAt;

            const insertedNote = await Note.query(trx)
                .insert({ noteId, title, description, author, createdAt, updatedAt });
            if (!insertedNote) {
                return undefined;
            }

            const newEditor = await Editor.query(trx).insert({ noteId: noteId, name: author });
            if (!newEditor) {
                return undefined;
            }

            return insertedNote;
        })

        return newNote;
    } catch (err) {
        console.log("something went wrong creating new Note: " + err);
        return undefined;
    }
};

export const getNote = async (noteId: string): Promise<Note | undefined> => {
    return await Note.query().findOne({ noteId: noteId });
};

export const getNotesFromUser = async (userName: string) => {
    const notes = await Note.query()
        .select('note.*')
        .join('editor', 'note.noteId', 'editor.noteId')
        .where('editor.name', userName);
    
    console.log(notes);
    return notes;
};

export const updateNote = async (noteId: string, data: INoteUpdate): Promise<Note | undefined> => {
    const note = await Note.query().findById(noteId);
    if (!note) {
        throw new Error('Note not found');
    }

    const updatedData = {
        ...data,
        updated_at: new Date().toISOString()
    };

    const update = await note.$query().patchAndFetch(updatedData); 
    return update;
};

export const deleteNote = async (noteId: string): Promise<Note | undefined> => {
    try {
        const note = await transaction(Note.knex(), async (trx: Transaction): Promise<Note | undefined> => {
            const deletedNote = await Note.query(trx).findOne({ noteId: noteId });
            if (!deletedNote) {
                return undefined;
            }

            const deletedEditors = await Editor.query(trx)
                .delete()
                .where('noteId', noteId);
            if (deletedEditors < 1) {
                return undefined;
            }

            const isDeleted = await Note.query(trx)
                .deleteById(noteId);
            if (isDeleted != 1) {
                return undefined;
            }

            return deletedNote;
        });

        return note;
    } catch (err) {
        console.log("something went wrong deleting Note: " + err);
        return undefined;
    }
};