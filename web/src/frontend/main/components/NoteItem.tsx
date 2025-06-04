import { Trash2 } from "lucide-react";
import { cn } from "../lib/utils";
import type { Note } from "../shared/schema";

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function NoteItem({ note, isActive, onClick, onDelete }: NoteItemProps) {
  const preview = note.content.length > 40
    ? `${note.content.substring(0, 40)}...`
    : note.content;

  return (
    <div 
      className={cn(
        "p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer relative",
        isActive && "border-l-[3px] border-l-[#4285F4]"
      )}
      onClick={onClick}
    >
      <div className="pr-8">
        <h3 className="font-medium text-gray-900">{note.title}</h3>
        <p className="text-sm text-gray-500 truncate">{preview}</p>
      </div>
      <button 
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        onClick={onDelete}
        aria-label="Delete note"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
