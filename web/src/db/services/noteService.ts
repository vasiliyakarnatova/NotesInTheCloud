const Note = require('../models/note');
const Editor = require('../models/editor');

import { INote } from '../interfaces/note';

import { v4 as uuidv4 } from 'uuid';
import { transaction, Transaction } from 'objection';

export type INoteUpdate = Partial<Pick<INote, 'title' | 'description'>>;

export const createNote = async (title: string, description: string, author: string) => {
    try {
        const newNote = await transaction(Note.knex(), async (trx: Transaction) => {
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

export const getNote = async (noteId: string) => {
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

export const updateNote = async (noteId: string, data: INoteUpdate) => {
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

export const deleteNote = async (noteId: string) => {
    try {
        const note = await transaction(Note.knex(), async (trx: Transaction) => {
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