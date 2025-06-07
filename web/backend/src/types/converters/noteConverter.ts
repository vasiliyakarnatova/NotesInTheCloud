import { IEditor } from "../../../../db/interfaces/editor"
import { INote } from "../../../../db/interfaces/note"
import { ITodoItem } from "../../../../db/interfaces/todoItem"
import { FullNoteOutput, NoteOutput } from "../../types/structures/note_structures"

class NoteConverter {
    dbNoteToNoteOutput(dbNote: INote): NoteOutput {
        const noteOutput: NoteOutput = {
            id: dbNote.noteId,
            title: dbNote.title,
            description: dbNote.description,
        }

        return noteOutput
    }

    toFullNoteOutput(dbNote: INote, dbTodos: ITodoItem[], dbEditors: IEditor[]): FullNoteOutput {
        const noteOutput: FullNoteOutput = {
            id: dbNote.noteId,
            title: dbNote.title,
            description: dbNote.description,
            author: dbNote.author,
            createdAt: dbNote.created_at ,
            modifiedAt: dbNote.updated_at,
            todos: dbTodos,
            editors: dbEditors,
        }

        return noteOutput
    }
}

const noteConverter = new NoteConverter();
export default noteConverter; 