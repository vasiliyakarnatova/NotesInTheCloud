import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import type { TodoItem } from "@shared/schema";

interface TodoSectionProps {
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onUpdateTodo: (id: number, completed: boolean) => void;
  onDeleteTodo: (id: number) => void;
}

export default function TodoSection({
  todos,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo
}: TodoSectionProps) {
  const [newTodoText, setNewTodoText] = useState("");

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim());
      setNewTodoText("");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-medium text-gray-900 mb-4">Todo List</h3>
      
      <div className="bg-white border border-gray-200 rounded-md p-4">
        {/* Todo List Items */}
        {!todos || todos.length === 0 ? (
          <p className="text-gray-500 mb-4">No tasks yet. Add a task below.</p>
        ) : (
          <div className="mb-4 space-y-2">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-2">
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={(checked) => 
                    onUpdateTodo(todo.id, checked === true)
                  }
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
                  onClick={() => onDeleteTodo(todo.id)}
                  aria-label="Delete todo"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Todo Input */}
        <div className="flex">
          <Input
            type="text"
            className="flex-grow rounded-r-none focus:ring-[#4285F4] focus:border-[#4285F4]"
            placeholder="Add new task..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTodo();
              }
            }}
          />
          <Button
            type="button"
            className="bg-[#4285F4] hover:bg-[#3b77db] rounded-l-none"
            onClick={handleAddTodo}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}



