import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import NoteList from "../components/NoteList";
import NoteViewer from "../components/NoteViewer";
import NoteEditor from "../components/NoteEditor";
import type { Note, NoteWithTodos } from "../shared/schema";
import "../styles/main.css";

interface TempTodoItem {
  id: string; 
  text: string;
  completed: boolean;
}

type ViewMode = "view" | "create" | "edit";

const Home = () => {
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("view");
  const { toast } = useToast();

  const { data: notes = [], isLoading: isLoadingNotes } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const { 
    data: activeNote, 
    isLoading: isLoadingActiveNote 
  } = useQuery<NoteWithTodos>({
    queryKey: ["/api/notes", activeNoteId],
    enabled: activeNoteId !== null,
    queryFn: async (): Promise<NoteWithTodos> => {
      if (!activeNoteId) throw new Error("No note ID provided");
      console.log(`Manual fetching note with ID: ${activeNoteId}`);
      const res = await fetch(`/api/notes/${activeNoteId}`);
      if (!res.ok) throw new Error(`Failed to fetch note: ${res.status}`);
      const data = await res.json();
      console.log("Received note data:", data);
      return data as NoteWithTodos;
    },
    staleTime: 10000
  });

  useEffect(() => {
    if (activeNote) {
      console.log("Active note changed:", activeNote);
    }
  }, [activeNote]);

  const createNoteMutation = useMutation({
    mutationFn: async (note: { title: string; content: string }) => {
      console.log("Creating note:", note);
      const res = await apiRequest("POST", "/api/notes", note);
      return res.json();
    },
    onSuccess: (data) => {
      console.log("Note created with ID:", data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    
      setActiveNoteId(data.id);
      setViewMode("view");
      
      toast({
        title: "Success",
        description: "Note created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({
      id,
      note,
    }: {
      id: number;
      note: { title: string; content: string };
    }) => {
      const res = await apiRequest("PUT", `/api/notes/${id}`, note);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes", variables.id] });
      setViewMode("view");
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      if (activeNoteId) {
        queryClient.invalidateQueries({ queryKey: ["/api/notes", activeNoteId] });
      }
      setActiveNoteId(null);
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    },
  });

  // Create todo item mutation
  const createTodoMutation = useMutation({
    mutationFn: async ({ noteId, text }: { noteId: number; text: string }) => {
      console.log("Creating todo with noteId:", noteId, "and text:", text);
      const res = await apiRequest("POST", "/api/todos", {
        noteId,
        text,
        completed: false,
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      console.log("Todo created successfully for note:", variables.noteId);
      queryClient.invalidateQueries({ queryKey: ["/api/notes", variables.noteId] });
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
    },
    onError: (error) => {
      console.error("Failed to add todo:", error);
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    },
  });

  // Update todo item mutation
  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, noteId, completed }: { id: number; noteId: number; completed: boolean }) => {
      const res = await apiRequest("PUT", `/api/todos/${id}`, { completed });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes", variables.noteId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    },
  });

  // Delete todo item mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async ({ id, noteId }: { id: number; noteId: number }) => {
      await apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes", variables.noteId] });
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    },
  });

  const handleSelectNote = (id: number) => {
    console.log("Selecting note with ID:", id);
    setActiveNoteId(id);
    setViewMode("view");
  };

  const handleAddNote = () => {
    setActiveNoteId(null);
    setViewMode("create");
  };

  const handleEditNote = () => {
    setViewMode("edit");
  };

  const handleCancelEdit = () => {
    if (activeNoteId) {
      setViewMode("view");
    } else {
      
      setViewMode("view");
      if (notes.length > 0) {
        setActiveNoteId(notes[0].id);
      }
    }
  };

  const handleSaveNote = (note: { 
    title: string; 
    content: string; 
    tempTodos?: TempTodoItem[] 
  }) => {
    if (viewMode === "create") {
      createNoteMutation.mutate(note, {
        onSuccess: (createdNote) => {
          if (note.tempTodos && note.tempTodos.length > 0) {
            note.tempTodos.forEach(todo => {
              createTodoMutation.mutate({
                noteId: createdNote.id,
                text: todo.text
              });
            });
          }
        }
      });
    } else if (viewMode === "edit" && activeNoteId) {
      const { tempTodos, ...noteData } = note; 
      updateNoteMutation.mutate({ id: activeNoteId, note: noteData });
    }
  };

  const handleDeleteNote = (id: number) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(id);
    }
  };

  const handleAddTodo = (noteId: number, text: string) => {
    if (text.trim()) {
      createTodoMutation.mutate({ noteId, text });
    }
  };

  const handleUpdateTodo = (id: number | string, noteId: number, completed: boolean) => {
    if (typeof id === 'number') {
      updateTodoMutation.mutate({ id, noteId, completed });
    } else {
      console.log("Updating temporary todo:", id, completed);
    }
  };

  const handleDeleteTodo = (id: number | string, noteId: number) => {
    if (typeof id === 'number') {
      deleteTodoMutation.mutate({ id, noteId });
    } else {
      console.log("Deleting temporary todo:", id);
    }
  };

  if (activeNoteId === null && notes && notes.length > 0 && viewMode === "view" && !isLoadingNotes) {
    setActiveNoteId(notes[0].id);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar with note list */}
      <NoteList
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={handleSelectNote}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        isLoading={isLoadingNotes}
      />

      {/* Main content area */}
      <div className="w-[calc(100%-250px)] h-full overflow-y-auto bg-gray-50">
        {viewMode === "view" && (
          <>
            {activeNoteId && activeNote ? (
              <NoteViewer
                note={activeNote}
                onEdit={handleEditNote}
                onDelete={() => handleDeleteNote(activeNote.id)}
                onAddTodo={(text) => handleAddTodo(activeNote.id, text)}
                onUpdateTodo={(todoId, completed) => 
                  handleUpdateTodo(todoId, activeNote.id, completed)
                }
                onDeleteTodo={(todoId) => handleDeleteTodo(todoId, activeNote.id)}
                isLoading={isLoadingActiveNote}
              />
            ) : isLoadingActiveNote ? (
              <div className="p-6">
                <div className="animate-pulse space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-64"></div>
                  <div className="h-40 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-40"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : notes.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center p-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-2">No notes yet</h2>
                  <p className="text-gray-500 mb-4">Create your first note by clicking the Add Note button</p>
                  <Button 
                    className="bg-[#4285F4] hover:bg-[#3b77db]"
                    onClick={handleAddNote}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-center p-6">
                  <h2 className="text-gray-500">Select a note to view</h2>
                </div>
              </div>
            )}
          </>
        )}

        {(viewMode === "create" || viewMode === "edit") && (
          <>
            {viewMode === "create" ? (
              // Create mode 
              <NoteEditor
                onSave={handleSaveNote}
                onCancel={handleCancelEdit}
                isCreating={true}
                isLoading={false}
                isPending={createNoteMutation.isPending}
                onAddTodo={(text) => text} 
                onUpdateTodo={(id, completed) => handleUpdateTodo(id, -1, completed)} 
                onDeleteTodo={(id) => handleDeleteTodo(id, -1)} 
              />
            ) : (
              // Edit mode 
              activeNote ? (
                <NoteEditor
                  note={activeNote}
                  onSave={handleSaveNote}
                  onCancel={handleCancelEdit}
                  isCreating={false}
                  isLoading={isLoadingActiveNote}
                  isPending={updateNoteMutation.isPending}
                  onAddTodo={(text) => handleAddTodo(activeNote.id, text)}
                  onUpdateTodo={(id, completed) => handleUpdateTodo(id, activeNote.id, completed)}
                  onDeleteTodo={(id) => handleDeleteTodo(id, activeNote.id)}
                />
              ) : (
                // Loading state for edit mode
                <div className="p-6">
                  <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-64"></div>
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                    <div className="h-40 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;