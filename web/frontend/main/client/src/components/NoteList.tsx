import { Plus, Trash2, LogOut } from "lucide-react";
import NoteItem from "./NoteItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@shared/schema";

interface NoteListProps {
  notes: Note[];
  activeNoteId: number | null;
  onSelectNote: (id: number) => void;
  onAddNote: () => void;
  onDeleteNote: (id: number) => void;
  isLoading: boolean;
}

export default function NoteList({
  notes,
  activeNoteId,
  onSelectNote,
  onAddNote,
  onDeleteNote,
  isLoading,
}: NoteListProps) {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      // Redirect to login page or refresh
      window.location.href = "http://localhost:5173/login";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-[250px] min-w-[250px] bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-900">Notes</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <Button 
          className="w-full bg-[#4285F4] text-white hover:bg-[#3b77db] flex items-center justify-center"
          onClick={onAddNote}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Note
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 border-b border-gray-200">
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notes yet. Create your first note!
          </div>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={() => onSelectNote(note.id)}
              onDelete={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}