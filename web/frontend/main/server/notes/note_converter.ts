import { convertEditorServerToResolver } from "server/editors/editor_conventor";
import { FullNoteServer, NoteResolver, NoteServer, NoteWithTodosResolver } from "server/structures/note_structures";
import { TodoItemResolver } from "server/structures/todo_structures";
import { convertTodoItemServerToResolver } from "server/tasks/task_converter";

function convertResponseNotesToNotes(author: string, sourceNotes: NoteServer[]): NoteResolver[] {
    return sourceNotes.map(note => ({
    id: note.id,
    userId: author,
    title: note.title,
    content: note.description ?? '',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
    allowEdit: false,
    shareId: null
  }));
}

function convertFullNoteToNoteWithTodos(sourceNote: FullNoteServer): NoteWithTodosResolver {
    return {
        id: sourceNote.id,
        userId: sourceNote.author,
        title: sourceNote.title,
        content: sourceNote.description,
        createdAt: sourceNote.createdAt ? new Date(sourceNote.createdAt) : new Date(),
        updatedAt: sourceNote.modifiedAt ? new Date(sourceNote.modifiedAt) : new Date(),
        isPublic: false,
        allowEdit: true,
        shareId: null,
        editors: sourceNote.editors.map(editor => {
            return convertEditorServerToResolver(editor);
        }),
        todoItems: sourceNote.todos.map(todo => {
            return convertTodoItemServerToResolver(todo);
        })
    };
}

function convertFullNoteToNote(sourceNote: FullNoteServer): NoteResolver {
    return {
        id: sourceNote.id,
        userId: sourceNote.author,
        title: sourceNote.title,
        content: sourceNote.description,
        createdAt: sourceNote.createdAt ? new Date(sourceNote.createdAt) : new Date(),
        updatedAt: sourceNote.modifiedAt ? new Date(sourceNote.modifiedAt) : new Date(),
        isPublic: false,
        allowEdit: true,
        shareId: null
    }
}

export { convertFullNoteToNoteWithTodos, convertResponseNotesToNotes, convertFullNoteToNote};