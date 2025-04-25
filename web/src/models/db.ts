import { Note } from "../types/note";
import { Task } from "../types/task";
import { User } from "../types/user";

let notes: Note[] = [
        {
          id: "note-1",
          title: "Buy groceries",
          description: "Milk, Bread, Eggs",
          author: "Miro", // Miro
          createdAt: "2025-04-23T12:00:00Z",
          modifiedAt: "2025-04-23T12:30:00Z",
        },
        {
          id: "note-2",
          title: "Work meeting notes",
          description: "Meeting at 10:00 AM. Discuss project timeline.",
          author: "Miro", // Miro
          createdAt: "2025-04-22T08:00:00Z",
          modifiedAt: "2025-04-22T09:00:00Z",
        },
        {
          id: "note-3",
          title: "Study plan",
          description: "Prepare for math exam.",
          author: "Pesho", // Pesho
          createdAt: "2025-04-21T14:00:00Z",
          modifiedAt: "2025-04-21T15:00:00Z",
        },
];

let users: User[] = [
    {
        username: "Miro",
        email: "miro@example.com",
        password: "miroPass123",
      }, {
        username: "Pesho",
        email: "pesho@example.com",
        password: "peshoSecure!",
      }, {
        username: "Ivan",
        email: "ivan@example.com",
        password: "ivanStrongPwd",
      },
];

const tasks: Task[] = [
    {
      id: "task-1",
      title: "Buy milk",
      isChecked: true,
      noteId: "note-1",
      createdTime: "2025-04-23T10:15:00Z",
    },
    {
      id: "task-2",
      title: "Send project update email",
      isChecked: false,
      noteId: "note-2",
      createdTime: "2025-04-23T11:00:00Z",
    },
    {
      id: "task-3",
      title: "Review algebra chapter",
      isChecked: false,
      noteId: "note-3",
      createdTime: "2025-04-22T16:45:00Z",
    },
    {
      id: "task-4",
      title: "Fix login bug",
      isChecked: true,
      noteId: "note-2",
      createdTime: "2025-04-21T09:30:00Z",
    },
    {
      id: "task-5",
      title: "Call the client",
      isChecked: false,
      noteId: "note-1",
      createdTime: "2025-04-23T13:20:00Z",
    },
  ];

class Database {
    private notes: Note[] = notes;
    private users: User[] = users;
    private tasks: Task[] = tasks;

    getNotes(userId: string): Note[] | undefined {
        return notes.filter(n => n.author === userId)
    }

    getNote(noteId: string): Note | undefined {
        return
    }

    createNote(userId: string, title: string, description: string): Note | undefined {
        return
    }

    updateNote(noteId: string, update: { title?:string; description?:string }): Note | undefined {
        return
    }

    deleteNote(noteId: string): Note | undefined {
        return
    }

    createTask(noteId: string, title: string): Task | undefined {
        return
    }

    deleteTask(taskId: string): Task | undefined {
        return
    }

    updateTask(taskId: string, title: string): Task | undefined {
        return
    }

    addEdditor(userId: string, noteId: string) {

    }
}

export const db = new Database(); 
