import { Editor } from "../types/editor";
import { Note } from "../types/note";
import { FullNoteOutput } from "../types/outputs/fullNoteOutput";
import { NoteOutput } from "../types/outputs/noteOutput";
import { Task } from "../types/task";

class NoteConverter {
    dbNoteToNoteOutput(dbNote: Note): NoteOutput {
        const noteOutput: NoteOutput = {
            id: dbNote.id,
            title: dbNote.title,
            description: dbNote.description,
        }

        return noteOutput
    }

    toFullNoteOutput(dbNote: Note, dbTodos: Task[], dbEditors: Editor[]): NoteOutput {
        const noteOutput: FullNoteOutput = {
            id: dbNote.id,
            title: dbNote.title,
            description: dbNote.description,
            author: dbNote.author,
            createdAt: dbNote.createdAt,
            modifiedAt: dbNote.modifiedAt,
            todos: dbTodos,
            editors: dbEditors,
        }

        return noteOutput
    }
}

export const noteConverter = new NoteConverter() 