import { users, noteEditors, type User, type InsertUser, type Note, type InsertNote, 
  type TodoItem, type InsertTodoItem, type NoteWithTodos, type NoteWithDetails, 
  type NoteEditor, type InsertNoteEditor } from "@shared/schema";
import { v4 as randomUUID } from "uuid";


export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllNotes(): Promise<Note[]>;
  getNoteById(id: number): Promise<Note | undefined>;
  getNoteWithTodos(id: number): Promise<NoteWithTodos | undefined>;
  getNoteWithDetails(id: number): Promise<NoteWithDetails | undefined>;
  getNoteByShareId(shareId: string): Promise<NoteWithTodos | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<void>;
  toggleNotePublic(id: number, isPublic: boolean): Promise<Note | undefined>;
  
  getTodoItemById(id: number): Promise<TodoItem | undefined>;
  getTodoItemsByNoteId(noteId: number): Promise<TodoItem[]>;
  createTodoItem(todoItem: InsertTodoItem): Promise<TodoItem>;
  updateTodoItem(id: number, todoItem: Partial<InsertTodoItem>): Promise<TodoItem | undefined>;
  deleteTodoItem(id: number): Promise<void>;
  
  getNoteEditors(noteId: number): Promise<User[]>;
  addNoteEditor(noteEditor: InsertNoteEditor): Promise<NoteEditor | undefined>;
  removeNoteEditor(noteId: number, userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private notes: Map<number, Note>;
  private todoItems: Map<number, TodoItem>;
  private noteEditors: Map<string, NoteEditor>; 
  private userIdCounter: number;
  private noteIdCounter: number;
  private todoItemIdCounter: number;

  constructor() {
    this.users = new Map();
    this.notes = new Map();
    this.todoItems = new Map();
    this.noteEditors = new Map();
    this.userIdCounter = 1;
    this.noteIdCounter = 1;
    this.todoItemIdCounter = 1;
    
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleUser: User = {
      id: this.userIdCounter++,
      username: 'user',
      password: 'password'
    };
    this.users.set(sampleUser.id, sampleUser);

    const now = new Date();
    const sampleNotes: Note[] = [
      {
        id: this.noteIdCounter++,
        userId: sampleUser.id,
        title: 'Project Ideas',
        content: 'Finish project',
        createdAt: now,
        updatedAt: now, 
        isPublic: false,
        allowEdit: false,
        shareId: randomUUID()
      },
      {
        id: this.noteIdCounter++,
        userId: sampleUser.id,
        title: 'Shopping List',
        content: 'Grocery items: - Milk - Bread - Eggs - Cheese',
        createdAt: now,
        updatedAt: now, 
        isPublic: false,
        allowEdit: false,
        shareId: randomUUID()
      },
      {
        id: this.noteIdCounter++,
        userId: sampleUser.id,
        title: 'Weekly Goals',
        content: "This week's priorities:\n- Finish React project\n- Start learning TypeScript\n- Update portfolio website\n- Exercise 4 times",
        createdAt: now,
        updatedAt: now, 
        isPublic: false,
        allowEdit: false,
        shareId: randomUUID()
      }
    ];

    sampleNotes.forEach(note => this.notes.set(note.id, note));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Note methods
  async getAllNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }

  async getNoteById(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async getNoteWithTodos(id: number): Promise<NoteWithTodos | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;

    const todoItems = await this.getTodoItemsByNoteId(id);
    return { ...note, todoItems };
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.noteIdCounter++;
    const now = new Date();
    const note: Note = { 
      id, 
      userId: insertNote.userId || null,
      title: insertNote.title,
      content: insertNote.content,
      createdAt: now,
      updatedAt: now,
      isPublic: insertNote.isPublic || false,
      allowEdit: insertNote.allowEdit || false,
      shareId: randomUUID() 
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: number, partialNote: Partial<InsertNote>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;

    const updatedNote: Note = { ...note, ...partialNote };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<void> {
    const todoItems = await this.getTodoItemsByNoteId(id);
    for (const todoItem of todoItems) {
      await this.deleteTodoItem(todoItem.id);
    }
    
    this.notes.delete(id);
  }

  async getTodoItemById(id: number): Promise<TodoItem | undefined> {
    return this.todoItems.get(id);
  }

  async getTodoItemsByNoteId(noteId: number): Promise<TodoItem[]> {
    return Array.from(this.todoItems.values()).filter(
      todoItem => todoItem.noteId === noteId
    );
  }

  async createTodoItem(insertTodoItem: InsertTodoItem): Promise<TodoItem> {
    const id = this.todoItemIdCounter++;
    const todoItem: TodoItem = { 
      ...insertTodoItem,
      id,
      completed: insertTodoItem.completed ?? false
    };
    this.todoItems.set(id, todoItem);
    return todoItem;
  }

  async updateTodoItem(id: number, partialTodoItem: Partial<InsertTodoItem>): Promise<TodoItem | undefined> {
    const todoItem = this.todoItems.get(id);
    if (!todoItem) return undefined;

    const updatedTodoItem: TodoItem = { ...todoItem, ...partialTodoItem };
    this.todoItems.set(id, updatedTodoItem);
    return updatedTodoItem;
  }

  async deleteTodoItem(id: number): Promise<void> {
    this.todoItems.delete(id);
  }

  async getNoteWithDetails(id: number): Promise<NoteWithDetails | undefined> {
    const noteWithTodos = await this.getNoteWithTodos(id);
    if (!noteWithTodos) return undefined;
    
    const author = await this.getUser(noteWithTodos.userId || 1);
    if (!author) return undefined;
    
    const editors = await this.getNoteEditors(id);
    
    return { ...noteWithTodos, author, editors };
  }
  
  async getNoteByShareId(shareId: string): Promise<NoteWithTodos | undefined> {
    const note = Array.from(this.notes.values()).find(note => 
      note.shareId === shareId && note.isPublic
    );
    if (!note) return undefined;
    
    return this.getNoteWithTodos(note.id);
  }
  
  async toggleNotePublic(id: number, isPublic: boolean): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const updatedNote = { 
      ...note, 
      isPublic,
      shareId: isPublic && !note.shareId ? randomUUID() : note.shareId 
    };
    
    this.notes.set(id, updatedNote);
    return updatedNote;
  }
  
  async getNoteEditors(noteId: number): Promise<User[]> {
    const editorEntries = Array.from(this.noteEditors.values())
      .filter(editor => editor.noteId === noteId);
    
    const editors: User[] = [];
    for (const entry of editorEntries) {
      const user = await this.getUser(entry.userId);
      if (user) editors.push(user);
    }
    
    return editors;
  }
  
  async addNoteEditor(noteEditor: InsertNoteEditor): Promise<NoteEditor | undefined> {
    const note = await this.getNoteById(noteEditor.noteId);
    const user = await this.getUser(noteEditor.userId);
    
    if (!note || !user) return undefined;

    const editorEntry: NoteEditor = {
      ...noteEditor,
      addedAt: new Date()
    };
    
    const key = `${noteEditor.noteId}-${noteEditor.userId}`;
    this.noteEditors.set(key, editorEntry);
    
    return editorEntry;
  }
  
  async removeNoteEditor(noteId: number, userId: number): Promise<void> {
    const key = `${noteId}-${userId}`;
    this.noteEditors.delete(key);
  }
}

export const storage = new MemStorage();
