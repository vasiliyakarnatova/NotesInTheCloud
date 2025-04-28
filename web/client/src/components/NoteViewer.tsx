import { Trash2, Info, UserPlus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TodoSection from "./TodoSection";
import type { NoteWithTodos } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NoteViewerProps {
  note: NoteWithTodos;
  onEdit: () => void;
  onDelete: () => void;
  onAddTodo: (text: string) => void;
  onUpdateTodo: (id: number, completed: boolean) => void;
  onDeleteTodo: (id: number) => void;
  isLoading: boolean;
}

export default function NoteViewer({
  note,
  onEdit,
  onDelete,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  isLoading,
}: NoteViewerProps) {
  const [editorUsername, setEditorUsername] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [noteDetails, setNoteDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isAddingEditor, setIsAddingEditor] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const { toast } = useToast();
  
  // Load note details when dialog opens
  const loadNoteDetails = async () => {
    if (!note?.id) return;
    
    try {
      setLoadingDetails(true);
      const res = await fetch(`/api/notes/${note.id}/details`);
      if (!res.ok) throw new Error("Failed to load note details");
      const details = await res.json();
      setNoteDetails(details);
    } catch (error) {
      console.error("Error loading note details:", error);
      toast({ 
        title: "Error", 
        description: "Failed to load note details", 
        variant: "destructive" 
      });
    } finally {
      setLoadingDetails(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-40 w-full mb-6" />
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const [allowEdit, setAllowEdit] = useState(false);

  // Generating share link 
  const generateShareLink = async () => {
    try {
      setIsGeneratingLink(true);
      
      const res = await apiRequest("PUT", `/api/notes/${note.id}/share`, { 
        isPublic: true,
        allowEdit: allowEdit
      });
      
      if (!res.ok) throw new Error("Failed to share note");
      const updatedNote = await res.json();
      
      // Create and set link
      const baseUrl = window.location.origin;
      const newShareLink = `${baseUrl}/shared/${updatedNote.shareId}`;
      setShareLink(newShareLink);
      
      toast({ 
        title: "Success", 
        description: allowEdit 
          ? "Share link generated with edit permissions" 
          : "Share link generated for read-only access"
      });
      
      return newShareLink;
    } catch (error) {
      console.error("Error generating share link:", error);
      toast({ 
        title: "Error", 
        description: "Failed to generate share link", 
        variant: "destructive" 
      });
      return "";
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleAddEditor = async () => {
    if (!editorUsername || !note.id) return;
    
    try {
      setIsAddingEditor(true);
      
      const res = await apiRequest("POST", `/api/notes/${note.id}/editors`, {
        username: editorUsername
      });
      
      if (!res.ok) throw new Error("Failed to add editor");
      
      toast({ 
        title: "Success", 
        description: `Added ${editorUsername} as editor` 
      });
      
      // Reload details
      await loadNoteDetails();
    
      setEditorUsername("");
    } catch (error) {
      console.error("Error adding editor:", error);
      toast({ 
        title: "Error", 
        description: `Failed to add ${editorUsername} as editor`, 
        variant: "destructive" 
      });
    } finally {
      setIsAddingEditor(false);
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    return d.toLocaleString();
  };

  const formattedContent = note?.content?.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      {i < (note?.content?.split('\n').length || 0) - 1 && <br />}
    </span>
  )) || [];

  return (
    <div className="p-6">
      <div className="relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-900">{note?.title || "Untitled"}</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
            
            {/* Info button */}
            <Dialog onOpenChange={(open) => {
              if (open) loadNoteDetails();
            }}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Note information"
                >
                  <Info className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Note Information</DialogTitle>
                  <DialogDescription>
                    Details about this note
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  {loadingDetails ? (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <strong>Created:</strong> {formatDate(note.createdAt)}
                      </div>
                      <div>
                        <strong>Last Modified:</strong> {formatDate(note.updatedAt || note.createdAt)}
                      </div>
                      <div>
                        <strong>Author:</strong> User {note.userId}
                      </div>
                      <div>
                        <strong>Editors:</strong> {
                          noteDetails?.editors?.length > 0 
                            ? noteDetails.editors.map((e: any) => e.username).join(", ") 
                            : "None"
                        }
                      </div>
                      <div>
                        <strong>Public:</strong> {note.isPublic ? "Yes" : "No"}
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Editor button */}
            <Dialog onOpenChange={(open) => {
              if (open) loadNoteDetails();
            }}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Add editor"
                >
                  <UserPlus className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Editor</DialogTitle>
                  <DialogDescription>
                    Add a user who can edit this note
                  </DialogDescription>
                </DialogHeader>
                
                {/* Current editors */}
                {noteDetails?.editors?.length > 0 && (
                  <div className="py-2">
                    <h4 className="text-sm font-medium mb-2">Current Editors:</h4>
                    <div className="text-sm space-y-1">
                      {noteDetails.editors.map((editor: any) => (
                        <div key={editor.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>User {editor.id}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              console.log(`Remove editor: ${editor.id}`);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add new editor */}
                <div className="flex gap-3 py-4">
                  <Input 
                    placeholder="Username" 
                    value={editorUsername}
                    onChange={(e) => setEditorUsername(e.target.value)}
                  />
                  <Button 
                    onClick={handleAddEditor}
                    disabled={isAddingEditor}
                  >
                    {isAddingEditor ? "Adding..." : "Add"}
                  </Button>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Share button */}
            <Dialog onOpenChange={(open) => {
              if (open && note?.isPublic && note?.shareId) {
                const baseUrl = window.location.origin;
                setShareLink(`${baseUrl}/shared/${note.shareId}`);
              }
            }}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Share note"
                >
                  <Share2 className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Note</DialogTitle>
                  <DialogDescription>
                    Anyone with this link can view this note
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Share mode selection */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Sharing Options:</h4>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="read-only" 
                          name="share-type"
                          checked={!allowEdit}
                          onChange={() => setAllowEdit(false)}
                          className="h-4 w-4"
                        />
                        <label htmlFor="read-only" className="text-sm font-medium">
                          Read only
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="editable" 
                          name="share-type"
                          checked={allowEdit}
                          onChange={() => setAllowEdit(true)} 
                          className="h-4 w-4"
                        />
                        <label htmlFor="editable" className="text-sm font-medium">
                          Allow editing
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Link generation/copying */}
                  <div className="flex gap-3 pt-2">
                    <Input 
                      value={shareLink} 
                      readOnly 
                      placeholder="Click 'Generate Link' to create a sharing link"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button 
                      onClick={async () => {
                        const link = await generateShareLink();
                        if (link) {
                          navigator.clipboard.writeText(link);
                          toast({
                            title: "Link Copied",
                            description: "Share link copied to clipboard"
                          });
                        }
                      }}
                      disabled={isGeneratingLink}
                    >
                      {isGeneratingLink ? "Generating..." : shareLink ? "Copy Link" : "Generate Link"}
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Delete button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onDelete}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Delete note"
            >
              <Trash2 className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-md p-4 mb-6 min-h-[150px]">
          <p className="whitespace-pre-wrap">
            {formattedContent}
          </p>
        </div>
        
        <TodoSection
          todos={note?.todoItems || []}
          onAddTodo={(text) => onAddTodo(text)}
          onUpdateTodo={(id, completed) => onUpdateTodo(id, completed)}
          onDeleteTodo={(id) => onDeleteTodo(id)}
        />
      </div>
    </div>
  );
}
