import setupDb from '../db-setup.ts';
import { addEditorToNote, createNote, getNote, getNotesFromUser, updateNote, deleteNote } from '../services/noteService.ts'

setupDb();

// (async () => {
//     const note = await createNote("Demo note", "Create demo note", "Vasiliya");
//     console.log(note);
// })();

// (async () => {
//     const note = await createNote("Demo note second generation", "Create demo note second generation", "Vasiliya");
//     console.log(note);
// })();

// (async () => {
//     const editor = await addEditorToNote("3ac01184-f3ad-4888-a787-c5e65289322d", "Emiliya");
//     console.log(editor);
// })();

// (async () => {
//     const noteId = "3ac01184-f3ad-4888-a787-c5e65289322d";
//     const note = await getNote(noteId);
//     console.log(note);
// })();

// (async () => {
//     const username = "Vasiliya";
//     const users = await getNotesFromUser(username);
//     console.log(users);
// })();

// (async () => {
//     const updatedNote = await updateNote("3ac01184-f3ad-4888-a787-c5e65289322d", {title: "Update demo note"});
//     console.log(updatedNote);
// })();

// (async () => {
//     const updatedNote = await updateNote("3ac01184-f3ad-4888-a787-c5e65289322d", {description: "Update created demo note"});
//     console.log(updatedNote);
// })();

// (async () => {
//     const updatedNote = await updateNote("3ac01184-f3ad-4888-a787-c5e65289322d", {title: "First demo note", description: "Create first demo note"});
//     console.log(updatedNote);
// })();

// (async () => {
//     const noteId = "b364a7df-56bf-48bd-a4c0-f3dab2842536";
//     const deletedNote = await deleteNote(noteId);
// })();

// (async () => {
//     const noteId = "0c014da4-48ef-4960-9535-26d07c622e1f";
//     return await deleteNote(noteId);
// })();