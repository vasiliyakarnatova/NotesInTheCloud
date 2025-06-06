const Editor = require('../models/editor');

export const addEditorToNote = async (noteId: string, name: string) => {
    return await Editor.query().insert({ noteId, name });
};

export const getEditorByUsernameAndNoteId = async (userId: string, noteId: string) => {
    return await Editor.query()
        .where('name', userId)
        .andWhere('noteId', noteId)
        .first();
}

export const getEditorsByNoteId = async (noteId: string) => {
    return await Editor.query()
        .select('editor.*')
        .where('editor.noteId', noteId);
}
