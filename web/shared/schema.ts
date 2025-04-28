import { pgTable, text, serial, integer, boolean, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  allowEdit: boolean("allow_edit").default(false).notNull(),
  shareId: uuid("share_id").defaultRandom(),
});

export const noteEditors = pgTable("note_editors", {
  noteId: integer("note_id").references(() => notes.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.noteId, table.userId] }),
  };
});

export const todoItems = pgTable("todo_items", {
  id: serial("id").primaryKey(),
  noteId: integer("note_id").references(() => notes.id).notNull(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false).notNull(),
});

// User Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Note Schemas
export const insertNoteSchema = createInsertSchema(notes).pick({
  userId: true,
  title: true,
  content: true,
  isPublic: true,
  allowEdit: true,
});

// TodoItem Schemas
export const insertTodoItemSchema = createInsertSchema(todoItems).pick({
  noteId: true,
  text: true,
  completed: true,
});

// NoteEditor Schemas
export const insertNoteEditorSchema = createInsertSchema(noteEditors).pick({
  noteId: true,
  userId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

export type InsertTodoItem = z.infer<typeof insertTodoItemSchema>;
export type TodoItem = typeof todoItems.$inferSelect;

export type InsertNoteEditor = z.infer<typeof insertNoteEditorSchema>;
export type NoteEditor = typeof noteEditors.$inferSelect;

// Extended Types for Frontend
export type NoteWithTodos = Note & {
  todoItems: TodoItem[];
};

export type NoteWithDetails = NoteWithTodos & {
  author: User;
  editors: User[];
};
