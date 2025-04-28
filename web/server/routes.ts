import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertTodoItemSchema, insertNoteEditorSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getAllNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get notes" });
    }
  });

  app.get("/api/notes/:id", async (req, res) => {
    try {
      console.log(`Fetching note with ID: ${req.params.id}`);
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
      }
      
      const note = await storage.getNoteWithTodos(id);
      
      if (!note) {
        console.log(`Note with ID ${id} not found`);
        return res.status(404).json({ message: "Note not found" });
      }
      
      console.log(`Successfully found note: ${note.id} - ${note.title}`);
      res.json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      res.status(500).json({ message: "Failed to get note" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const validatedData = insertNoteSchema.parse({
        ...req.body,
        userId: 1, // Default user for now
      });
      
      const note = await storage.createNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNoteSchema.partial().parse({
        ...req.body,
        userId: 1, // Default user for now
      });
      
      const note = await storage.updateNote(id, validatedData);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNote(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Todo Items API routes
  app.post("/api/todos", async (req, res) => {
    try {
      console.log("Received todo data:", req.body);
      if (!req.body.noteId) {
        return res.status(400).json({ 
          message: "Invalid todo data", 
          errors: [{ message: "noteId is required" }] 
        });
      }
      
      const todoData = {
        noteId: parseInt(req.body.noteId),
        text: req.body.text || "New task",
        completed: req.body.completed === true,
      };
      
      const validatedData = insertTodoItemSchema.parse(todoData);
      const todoItem = await storage.createTodoItem(validatedData);
      res.status(201).json(todoItem);
    } catch (error) {
      console.error("Error creating todo:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid todo data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create todo item" });
    }
  });

  app.put("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTodoItemSchema.partial().parse(req.body);
      
      const todoItem = await storage.updateTodoItem(id, validatedData);
      
      if (!todoItem) {
        return res.status(404).json({ message: "Todo item not found" });
      }
      
      res.json(todoItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid todo data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update todo item" });
    }
  });

  app.delete("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTodoItem(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete todo item" });
    }
  });

  app.get("/api/notes/:id/editors", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const editors = await storage.getNoteEditors(id);
      res.json(editors);
    } catch (error) {
      res.status(500).json({ message: "Failed to get note editors" });
    }
  });

  app.post("/api/notes/:id/editors", async (req, res) => {
    try {
      const noteId = parseInt(req.params.id);
      const userId = 1; 
      
      const editorData = {
        noteId,
        userId,
      };
      
      const validatedData = insertNoteEditorSchema.parse(editorData);
      const editor = await storage.addNoteEditor(validatedData);
      
      if (!editor) {
        return res.status(404).json({ message: "Note or user not found" });
      }
      
      res.status(201).json(editor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid editor data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add editor" });
    }
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
    try {
      const id = parseInt(req.params.id);
      const noteDetails = await storage.getNoteWithDetails(id);
      
      if (!noteDetails) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(noteDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get note details" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
