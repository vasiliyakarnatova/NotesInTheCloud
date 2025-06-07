import { EditorResolver } from "server/structures/editor_structures";
import { convertEditorServerToResolver } from "./editor_conventor";

const createEditor = async (username: string, noteId: string, userId: string): Promise<EditorResolver | null> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/' + noteId, {
      method: 'POST',
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

export { createEditor }