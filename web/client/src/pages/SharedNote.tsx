import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Edit, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { NoteWithTodos, InsertTodoItem } from "@shared/schema";

export default function SharedNote() {
  const { shareId } = useParams<{ shareId: string }>();
  const [, setLocation] = useLocation();
  const [note, setNote] = useState<NoteWithTodos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSharedNote() {
      if (!shareId) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/shared/${shareId}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError("This shared note doesn't exist or has been removed.");
          } else {
            setError("Failed to load this shared note. Please try again later.");
          }
          return;
        }
        
        const data = await res.json();
        setNote(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
      } catch (err) {
        console.error("Error fetching shared note:", err);
        setError("An error occurred while trying to load this note.");
      } finally {
        setLoading(false);
      }
    }

    fetchSharedNote();
  }, [shareId]);

  const handleEdit = () => {
    if (!note) return;
    setIsEditing(true);
    setEditedTitle(note.title);
    setEditedContent(note.content);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!note) return;
    
    try {
      setIsSaving(true);
      
      const res = await apiRequest("PUT", `/api/notes/${note.id}`, {
        title: editedTitle,
        content: editedContent
      });
      
      if (!res.ok) throw new Error("Failed to save changes");
      
      const updatedNote = await res.json();
      setNote(updatedNote);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Changes saved successfully"
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTodo = async () => {
    if (!note?.id || !newTodoText.trim()) return;
    
    try {
      const res = await apiRequest("POST", "/api/todos", {
        noteId: note.id,
        text: newTodoText,
        completed: false
      });
      
      if (!res.ok) throw new Error("Failed to add todo item");
      
      const newTodo = await res.json();

      setNote(prev => prev ? {
        ...prev,
        todoItems: [...prev.todoItems, newTodo]
      } : null);
      
      setNewTodoText("");
      
      toast({
        title: "Success",
        description: "Todo item added"
      });
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "Error",
        description: "Failed to add todo item",
        variant: "destructive"
      });
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      const res = await apiRequest("PUT", `/api/todos/${id}`, {
        completed: !completed
      });
      
      if (!res.ok) throw new Error("Failed to update todo item");
      
      const updatedTodo = await res.json();
      
      setNote(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          todoItems: prev.todoItems.map(todo => 
            todo.id === id ? updatedTodo : todo
          )
        };
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      toast({
        title: "Error",
        description: "Failed to update todo item",
        variant: "destructive"
      });
    }
  };

  // For read-only view
  const formattedContent = note?.content?.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      {i < (note?.content?.split('\n').length || 0) - 1 && <br />}
    </span>
  )) || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-6 w-full mb-1" />
          <Skeleton className="h-6 w-full mb-1" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-800 mb-4">{error}</h2>
          <Button onClick={() => setLocation("/")}>
            Go Back to Notes
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            {isEditing ? (
              <Input 
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-2xl font-medium h-12"
                placeholder="Note title"
              />
            ) : (
              <h1 className="text-3xl font-bold">{note?.title || "Untitled Note"}</h1>
            )}

            {note?.allowEdit && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-1"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleEdit}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[200px] mb-8"
              placeholder="Note content"
            />
          ) : note?.content && (
            <div className="bg-white border border-gray-200 rounded-md p-6 mb-8 min-h-[200px]">
              <p className="whitespace-pre-wrap text-gray-800">
                {formattedContent}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">To-Do Items</h2>
            
            {/* Todo list */}
            {note?.todoItems && note.todoItems.length > 0 && (
              <ul className="space-y-2 mb-6">
                {note.todoItems.map(todo => (
                  <li key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    {note.allowEdit && (
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id, todo.completed)}
                        className="h-5 w-5"
                      />
                    )}
                    <span className={`flex-1 ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {todo.text}
                    </span>
                    {todo.completed && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Completed
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            
            {note?.allowEdit && (
              <div className="flex gap-2 mt-4">
                <Input
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="Add a new todo item"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                />
                <Button 
                  onClick={handleAddTodo}
                  disabled={!newTodoText.trim()}
                >
                  Add
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8 text-sm text-gray-500">
            {note?.allowEdit 
              ? "This is a shared note that you can edit" 
              : "This is a read-only shared note"}
          </div>
        </div>
      )}
    </div>
  );
}