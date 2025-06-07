import { IEditor } from "../../../../db/interfaces/editor"
import { INote } from "../../../../db/interfaces/note"
import { ITodoItem } from "../../../../db/interfaces/todoItem"
import { FullNoteOutput, NoteOutput } from "../../types/structures/note_structures"
import camelcaseKeys from 'camelcase-keys';
import { Camelable } from "../../utils/utils";

class NoteConverter {
    dbNoteToNoteOutput(dbNote: INote): NoteOutput {
        const noteOutput: NoteOutput = {
            id: dbNote.noteId,
            title: dbNote.title,
            description: dbNote.description,
        };

        return noteOutput;
    }

    toFullNoteOutput(dbNote: INote, dbTodos: ITodoItem[], dbEditors: IEditor[]): FullNoteOutput {
        const camelNote = camelcaseKeys(dbNote as Camelable<INote>, { deep: true });

        const noteOutput: FullNoteOutput = {
            id: camelNote.noteId,
            title: camelNote.title,
            description: camelNote.description,
            author: camelNote.author,
            createdAt: camelNote.createdAt,
            modifiedAt: camelNote.updatedAt,
            todos: dbTodos,
            editors: dbEditors,
        };
        
        return noteOutput;
    }
}

const noteConverter = new NoteConverter();
export default noteConverter; 