import { EditorResolver } from "server/structures/editor_structures";
import { convertEditorServerToResolver } from "./editor_conventor";

const createEditor = async (username: string, noteId: string, userId: string): Promise<EditorResolver | null> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/' + noteId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'user_id': username
      }, body: JSON.stringify({
        'collaboratorId': userId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const editor: EditorResolver = convertEditorServerToResolver(await response.json());
    console.log(editor);
    return editor;

  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return null; 
  }
};

const deleteEditor = async (username: string, noteId: string, editorId: string): Promise<void> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/' + noteId + '/editors/' + editorId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'user_id': username,
        'collaboratorId': editorId
      },
    });
    if (!response.ok) {
      console.log("PROBLEM");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return; 
  }
};

export { createEditor, deleteEditor }