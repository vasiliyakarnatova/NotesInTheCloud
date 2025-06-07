import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertTodoItemSchema, insertNoteEditorSchema } from "@shared/schema";
import { z } from "zod";
import { getNotes, getNote, createNote, updateNote, deleteNote, createTask, updateTask, deleteTask  } from "./notes/note_service";
import { createEditor } from "./editors/editor_service"
import { getCookie, getRemoveCookieHeader, USER_TOKEN } from "./utils/utils";
import { NoteResolver, NoteWithTodosResolver } from "./structures/note_structures";
import { TodoItemResolver } from "./structures/todo_structures";
import { EditorResolver } from "./structures/editor_structures";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/notes", async (req, res) => {
    const username = getCookie(req.headers.cookie, USER_TOKEN);
    let notes: NoteResolver[] = [];
    if (typeof username === 'string') {
      notes = await getNotes(username);
    } 

    res.json(notes);  
  });

  app.get("/api/notes/:id", async (req, res) => {
    const id = req.params.id;
    const username = getCookie(req.headers.cookie, USER_TOKEN);
    let note: NoteWithTodosResolver  | null = null;
    if (typeof username === 'string') {
      note = await getNote(username, id);
    }

    res.json(note);  
  });

  app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;
    
    const username = getCookie(req.headers.cookie, USER_TOKEN);
    let note: NoteResolver | null = null;
    if (typeof username === 'string') {
      note = await createNote(username, title, content);
    }
    
    res.status(201).json(note);
  }); 

  app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = req.params.id;
    
    const username = getCookie(req.headers.cookie, USER_TOKEN);
    let note: NoteResolver | null = null;
    if (typeof username === 'string') {
      note = await updateNote(username, id, title, content);
    }
    
    res.status(200).json(note);
  });

  app.delete("/api/notes/:id", async (req, res) => {
    const id = req.params.id;
    
    const username = getCookie(req.headers.cookie, USER_TOKEN);
    if (typeof username === 'string') {
      await deleteNote(username, id);
      res.status(200).json({ message: "Successfully deleted note" });
      return;
    }

    res.status(400).json({ message: "Failed deleting note" });
  });

  // Todo Items API routes
  app.post("/api/todos", async (req, res) => {
    if (!req.body.noteId) {
        return res.status(400).json({ 
          message: "Invalid todo data", 
          errors: [{ message: "noteId is required" }] 
       });
    }

    const { text, noteId } = req.body;

    const username = getCookie(req.headers.cookie, USER_TOKEN);
    let task: TodoItemResolver | null = null;
    if (typeof username === 'string') {
      task = await createTask(username, noteId, text);
    }

    res.status(201).json(task);
  });

  app.put("/api/todos/:id", async (req, res) => {
    // try {
    //   const id = parseInt(req.params.id);
    //   const validatedData = insertTodoItemSchema.partial().parse(req.body);
      
    //   const todoItem = await storage.updateTodoItem(id, validatedData);
      
    //   if (!todoItem) {
    //     return res.status(404).json({ message: "Todo item not found" });
    //   }
      
    //   res.json(todoItem);
    // } catch (error) {
    //   if (error instanceof z.ZodError) {
    //     return res.status(400).json({ message: "Invalid todo data", errors: error.errors });
    //   }
    //   res.status(500).json({ message: "Failed to update todo item" });
    // }

    console.log("Reached me!!!");
    const taskId = req.params.id;
    const { noteId, text, isChecked } = req.body;
    
    const username = getCookie(req.headers.cookie, USER_TOKEN);
    let task: TodoItemResolver | null = null;
    if (typeof username === 'string') {
      task = await updateTask(username, noteId, taskId, text, isChecked);
    }
    
    res.status(200).json(task);
  });

  app.delete("/api/todos/:id", async (req, res) => {
    // try {
    //   const id = parseInt(req.params.id);
    //   await storage.deleteTodoItem(id);
    //   res.status(204).send();
    // } catch (error) {
    //   res.status(500).json({ message: "Failed to delete todo item" });
    // }
    try {
      const taskId = req.params.id;
      const noteId = req.body.noteId;
      
      const username = getCookie(req.headers.cookie, USER_TOKEN);
      if (typeof username === 'string') {
        await deleteTask(username, noteId, taskId);
        res.status(200).json({ message: "Successfully deleted task" });
        return;
      }

      res.status(400).json({ message: "Failed to delete task" });
    } catch (error) {
      res.status(500).json({ message: "Failed to get note tasks" });
    }
  });

  // app.get("/api/notes/:id/editors", async (req, res) => {
  //   try {
  //     const id = parseInt(req.params.id);
  //     const editors = await storage.getNoteEditors(id);
  //     res.json(editors);
  //   } catch (error) {
  //     res.status(500).json({ message: "Failed to get note editors" });
  //   }
  // });

  app.post("/api/notes/:id/editors", async (req, res) => {
    // try {
    //   const noteId = parseInt(req.params.id);
    //   const userId = 1; 
      
    //   const editorData = {
    //     noteId,
    //     userId,
    //   };
      
    //   const validatedData = insertNoteEditorSchema.parse(editorData);
    //   const editor = await storage.addNoteEditor(validatedData);
      
    //   if (!editor) {
    //     return res.status(404).json({ message: "Note or user not found" });
    //   }
      
    //   res.status(201).json(editor);
    // } catch (error) {
    //   if (error instanceof z.ZodError) {
    //     return res.status(400).json({ message: "Invalid editor data", errors: error.errors });
    //   }
    //   res.status(500).json({ message: "Failed to add editor" });
    // }

    const noteId = req.params.id;
    const collaboratorId = req.body.userId;

    console.log(collaboratorId);
    let editor: EditorResolver | null = null;
    const username = getCookie(req.headers.cookie, USER_TOKEN);
    if (typeof username === 'string') {
      editor = await createEditor(username, noteId, collaboratorId);
    }
    
    res.status(200).json(editor);
  });

  app.delete("/api/notes/:noteId/editors/:userId", async (req, res) => {
    try {
      const noteId = parseInt(req.params.noteId);
      const userId = parseInt(req.params.userId);
      await storage.removeNoteEditor(noteId, userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove editor" });
    }
  });

  app.get("/api/shared/:shareId", async (req, res) => {
    try {
      const shareId = req.params.shareId;
      const note = await storage.getNoteByShareId(shareId);
      
      if (!note) {
        return res.status(404).json({ message: "Shared note not found" });
      }
      
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shared note" });
    }
  });

  app.put("/api/notes/:id/share", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const isPublic = req.body.isPublic === true;
      const allowEdit = req.body.allowEdit === true;
      
      const note = await storage.toggleNotePublic(id, isPublic);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      if (isPublic && note) {
        await storage.updateNote(id, { allowEdit });
      }
      
      const updatedNote = await storage.getNoteById(id);
      
      res.json(updatedNote);
    } catch (error) {
      res.status(500).json({ message: "Failed to update note sharing" });
    }
  });
  
app.get("/api/notes/:id/details", async (req, res) => {
    const id = req.params.id;
    
    const username = getCookie(req.headers.cookie, USER_TOKEN);
    let note: NoteWithTodosResolver  | null = null;
    if (typeof username === 'string') {
      note = await getNote(username, id);
    }
    
    res.json(note);  
  });

  // Logout API route
  app.get("/api/logout", async (req, res) => {
    res.clearCookie(USER_TOKEN, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({ message: "Logged out" });
  });

  app.put("/api/notes/:noteId/tasks/:taskId/checkbox", async (req, res) => {
    try {
      const { noteId, taskId } = req.params;
      const { text, completed } = req.body;

      const username = getCookie(req.headers.cookie, USER_TOKEN);
      let task: TodoItemResolver | null = null;
      if (typeof username === 'string') {
        task = await updateTask(username, noteId, taskId, text, completed);
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task checkbox" });
    }
  });

  app.put("/api/notes/:noteId/tasks/:taskId/edit", async (req, res) => {
    try {
      const { noteId, taskId } = req.params;
      const { text, isChecked } = req.body;
      
      const username = getCookie(req.headers.cookie, USER_TOKEN);
      let task: TodoItemResolver | null = null;
      if (typeof username === 'string') {
        task = await updateTask(username, noteId, taskId, text, isChecked);
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task text" });
    }
  });

  app.post("/cookie/:username", async (req, res) => {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }

    res.cookie(USER_TOKEN, username, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({ message: "Cookie set" });
  });

  app.get("/api/reminders", async (req, res) => {
    // TBA
  });

  app.post("/api/reminders", async (req, res) => {
    // TBA
  });

  app.put("/api/reminders/:id", async (req, res) => {
    // TBA
  });

  app.delete("/api/reminders/:id", async (req, res) => {
    // TBA
  });

  app.get("/api/notifications", async (req, res) => {
    // TBA
  });

  app.post("/api/notifications", async (req, res) => {
    // TBA
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    // TBA
  });

  app.delete("/api/notifications/id", async (req, res) => {
    // TBA
  });

  const httpServer = createServer(app);
  return httpServer;
}