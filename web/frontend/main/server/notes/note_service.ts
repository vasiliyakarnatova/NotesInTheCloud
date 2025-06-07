import { FullNoteServer, NoteResolver, NoteWithTodosResolver } from "server/structures/note_structures";
import { TodoItemResolver, TodoItemServer } from "server/structures/todo_structures";
import { convertFullNoteToNote, convertFullNoteToNoteWithTodos, convertResponseNotesToNotes } from "./note_converter";
import { convertTodoItemServerToResolver } from "../tasks/task_converter";

const getNotes = async (username: string): Promise<NoteResolver[]> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user_id': username,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const notes: NoteResolver[] = convertResponseNotesToNotes(username, await response.json());
    return notes;
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return []; 
  }
};

const getNote = async (username: string, noteId: string): Promise<NoteWithTodosResolver | null> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/' + noteId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user_id': username,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const note: NoteWithTodosResolver = convertFullNoteToNoteWithTodos(await response.json());
    return note;
  }
  catch (error) {
    console.error('Failed to fetch notes:', error);
    return null; 
  }
};

const createNote = async (username: string, title: string, description: string): Promise<NoteResolver | null> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user_id': username,
      }, body: JSON.stringify({
        'title': title,
        'description': description,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const note: NoteResolver = convertFullNoteToNote(await response.json());
    console.log('Fetched notes:', note);
    
    return note;
  }
  catch (error) {
    console.error('Failed to fetch notes:', error);
    return null; 
  }
}

const updateNote = async (username: string, noteId: string, title: string, description: string): Promise<NoteResolver | null> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/' + noteId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user_id': username
      }, body: JSON.stringify({
        'title': title,
        'description': description,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const note: NoteResolver = convertFullNoteToNote(await response.json());
    console.log('Fetched notes:', note);

    return null;
  }
  catch (error) {
    console.error('Failed to fetch notes:', error);
    return null; 
  }
}

const deleteNote = async (username: string, noteId: string): Promise<void> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/' + noteId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'user_id': username
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

  }
  catch (error) {
    console.error('Failed to fetch notes:', error);
  }
}

const createTask = async (username: string, noteId: string, title: string): Promise<TodoItemResolver | null> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/' + noteId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user_id': username
      }, body: JSON.stringify({
        'title': title
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const task: TodoItemResolver = convertTodoItemServerToResolver(await response.json());
    console.log(task);
    
    return null;
  }
  catch (error) {
    console.error('Failed to fetch notes:', error);
    return null; 
  }
}

const updateTask = async (username: string, noteId: string, taskId: string, title: string, isChecked: boolean): Promise<TodoItemResolver | null> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/' + noteId + '/' + taskId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user_id': username
      }, body: JSON.stringify({
        'title': title,
        'isChecked': isChecked,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const note: TodoItemResolver = convertTodoItemServerToResolver(await response.json());
    console.log(note);

    return null;
  }
  catch (error) {
    console.error('Failed to fetch notes:', error);
    return null; 
  }
}

const deleteTask = async (username: string, noteId: string, taskId: string): Promise<void> => {
  try {
    const response = await fetch('http://localhost:8081/api/NotesInTheCloud/' + noteId + '/' + taskId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'user_id': username
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

  }
  catch (error) {
    console.error('Failed to fetch notes:', error);
  }
}

export { getNotes, getNote, createNote, updateNote, deleteNote, createTask, updateTask, deleteTask };