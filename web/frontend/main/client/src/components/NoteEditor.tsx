import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import TodoSection from "./TodoSection";
import type { NoteWithTodos, TodoItem } from "@shared/schema";

interface TempTodoItem {
  id: string; 
  text: string;
  completed: boolean;
}

interface NoteEditorProps {
  note?: NoteWithTodos;
  onSave: (note: { title: string; content: string; tempTodos?: TempTodoItem[] }) => void;
  onCancel: () => void;
  isCreating: boolean;
  isLoading: boolean;
  isPending: boolean;
  onAddTodo?: (text: string) => void;
  onUpdateTodo?: (id: number | string, completed: boolean) => void;
  onDeleteTodo?: (id: number | string) => void;
}

export default function NoteEditor({
  note,
  onSave,
  onCancel,
  isCreating,
  isLoading,
  isPending,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  
  const [tempTodos, setTempTodos] = useState<TempTodoItem[]>([]);
  const [pendingTodoText, setPendingTodoText] = useState("");

  // Update form when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTempTodos([]);
    }
  }, [note]);

  // Add a temporary todo 
  const handleAddTempTodo = (text: string) => {
    if (text.trim()) {
      const newTodo: TempTodoItem = {
        id: `temp-${Date.now()}`,
        text: text.trim(),
        completed: false
      };
      setTempTodos([...tempTodos, newTodo]);
      setPendingTodoText("");
    }
  };

  // Update a temporary todo
  const handleUpdateTempTodo = (id: string, completed: boolean) => {
    setTempTodos(tempTodos.map(todo => 
      todo.id === id ? { ...todo, completed } : todo
    ));
  };

  // Delete a temporary todo
  const handleDeleteTempTodo = (id: string) => {
    setTempTodos(tempTodos.filter(todo => todo.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      title: title.trim() || "Untitled",
      content: content.trim() || "",
      ...(isCreating && { tempTodos })
    });
    
    
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-40 w-full mb-6" />
        <div className="flex justify-end gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-medium text-gray-900 mb-6">
        {isCreating ? "Create new note" : "Edit note"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="noteTitle" className="block font-medium text-gray-900 mb-2">
            Title
          </label>
          <Input
            id="noteTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className="w-full border-gray-300 focus:ring-[#4285F4] focus:border-[#4285F4]"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="noteContent" className="block font-medium text-gray-900 mb-2">
            Content
          </label>
          <Textarea
            id="noteContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your note content here..."
            className="w-full border-gray-300 focus:ring-[#4285F4] focus:border-[#4285F4] h-40"
          />
        </div>
        
        
        {isCreating ? (
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Todo List</h3>
            <div className="bg-white border border-gray-200 rounded-md p-4">
              {tempTodos.length > 0 ? (
                <div className="mb-4 space-y-2">
                  {tempTodos.map((todo) => (
                    <div key={todo.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onChange={(e) => handleUpdateTempTodo(todo.id, e.target.checked)}
                        className="rounded text-[#4285F4] focus:ring-[#4285F4]"
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className={`flex-1 ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.text}
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                        onClick={() => handleDeleteTempTodo(todo.id)}
                        aria-label="Delete todo"
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3.5 5C3.22386 5 3 5.22386 3 5.5C3 5.77614 3.22386 6 3.5 6C3.77614 6 4 5.77614 4 5.5C4 5.22386 3.77614 5 3.5 5ZM5 5.5C5 5.22386 5.22386 5 5.5 5C5.77614 5 6 5.22386 6 5.5C6 5.77614 5.77614 6 5.5 6C5.22386 6 5 5.77614 5 5.5ZM7.5 5C7.22386 5 7 5.22386 7 5.5C7 5.77614 7.22386 6 7.5 6C7.77614 6 8 5.77614 8 5.5C8 5.22386 7.77614 5 7.5 5ZM9 5.5C9 5.22386 9.22386 5 9.5 5C9.77614 5 10 5.22386 10 5.5C10 5.77614 9.77614 6 9.5 6C9.22386 6 9 5.77614 9 5.5ZM11.5 5C11.2239 5 11 5.22386 11 5.5C11 5.77614 11.2239 6 11.5 6C11.7761 6 12 5.77614 12 5.5C12 5.22386 11.7761 5 11.5 5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-4">No tasks yet. Add a task below.</p>
              )}
              
              {/*todo input */}
              <div className="flex">
                <Input
                  type="text"
                  className="flex-grow rounded-r-none focus:ring-[#4285F4] focus:border-[#4285F4]"
                  placeholder="Add new task..."
                  value={pendingTodoText}
                  onChange={(e) => setPendingTodoText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTempTodo(pendingTodoText);
                    }
                  }}
                />
                <Button
                  type="button"
                  className="bg-[#4285F4] hover:bg-[#3b77db] rounded-l-none"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddTempTodo(pendingTodoText);
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ) : (
          note && onAddTodo && onUpdateTodo && onDeleteTodo && (
            <div className="mb-6">
              <TodoSection
                todos={note.todoItems || []}
                onAddTodo={onAddTodo}
                onUpdateTodo={onUpdateTodo}
                onDeleteTodo={onDeleteTodo}
              />
            </div>
          )
        )}
        
        <div className="flex justify-end mt-6 space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#4285F4] hover:bg-[#3b77db]"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
