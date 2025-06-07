import { EditorResolver, EditorServer } from "server/structures/editor_structures";

function convertEditorServerToResolver(sourceEditor: EditorServer): EditorResolver {
    return {
        id: sourceEditor.noteId,
        username: sourceEditor.name
    }
}

export { convertEditorServerToResolver };