import { Trash2, Info, UserPlus, Share2, Bell, Clock, Edit, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TodoSection from "./TodoSection";
import type { NoteWithTodos, Reminder } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface NoteViewerProps {
  note: NoteWithTodos;
  onEdit: () => void;
  onDelete: () => void;
  onAddTodo: (text: string) => void;
  onUpdateTodo: (id: number, completed: boolean) => void;
  onEditTodo: (id: number, text: string) => void;
  onDeleteTodo: (id: number) => void;
  isLoading: boolean;
}

export default function NoteViewer({
  note,
  onEdit,
  onDelete,
  onAddTodo,
  onUpdateTodo,
  onEditTodo,
  onDeleteTodo,
  isLoading,
}: NoteViewerProps) {
  const [editorUsername, setEditorUsername] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [noteDetails, setNoteDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isAddingEditor, setIsAddingEditor] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isEditReminderDialogOpen, setIsEditReminderDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch reminders for this note
  const { data: reminders = [], isLoading: remindersLoading } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders", note.id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/reminders?noteId=${note.id}`);
      if (!response.ok) throw new Error("Failed to fetch reminders");
      return response.json();
    },
  });

  // Mutation for updating reminder
  const updateReminderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { reminderDate: string; message: string | null } }) => {
      const response = await apiRequest("PUT", `/api/reminders/${id}`, data);
      if (!response.ok) throw new Error("Failed to update reminder");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      toast({
        title: "Success",
        description: "Reminder updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update reminder",
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting reminder
  const deleteReminderMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/reminders/${id}`);
      if (!response.ok) throw new Error("Failed to delete reminder");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      toast({
        title: "Success",
        description: "Reminder deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete reminder",
        variant: "destructive",
      });
    },
  });
  
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

  // Generate share link by toggling note to public
  const generateShareLink = async () => {
    try {
      setIsGeneratingLink(true);
      
      // Make the note public if it's not already, and set the allowEdit flag
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

  // Handle adding editor
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
      
      // Clear input
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

  //Handle removing editor
  const handleRemoveEditor = async (editorId: string) => {
    if (!note.id || !editorId) return;
    console.log("Removing editor:", editorId);
    try {
      const res = await apiRequest("DELETE", `/api/notes/${note.id}/editors/${editorId}`);
      if (!res.ok) throw new Error("Failed to remove editor");

      toast({ 
        title: "Success", 
        description: "Editor removed successfully" 
      });

      // Reload details
      await loadNoteDetails();
    } catch (error) {
      console.error("Error removing editor:", error);
      toast({ 
        title: "Error", 
        description: "Failed to remove editor", 
        variant: "destructive" 
      });
    }
  }
  
  // Handle creating reminder
  const handleCreateReminder = async () => {
    if (!reminderDate || !reminderTime) {
      toast({
        title: "Error",
        description: "Please select both date and time for the reminder",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingReminder(true);
    try {
      const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
      
      const response = await apiRequest("POST", "/api/reminders", {
        noteId: note.id,
        reminderDate: reminderDateTime.toISOString(),
        message: reminderMessage.trim() || null,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Reminder created successfully",
        });
        setReminderDate("");
        setReminderTime("");
        setReminderMessage("");
        setIsReminderDialogOpen(false);
      } else {
        throw new Error("Failed to create reminder");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create reminder",
        variant: "destructive",
      });
    } finally {
      setIsCreatingReminder(false);
    }
  };

  // Handle editing reminder
  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    const reminderDateTime = new Date(reminder.reminderDate);
    setReminderDate(reminderDateTime.toISOString().split('T')[0]);
    setReminderTime(reminderDateTime.toTimeString().slice(0, 5));
    setReminderMessage(reminder.message || "");
    setIsEditReminderDialogOpen(true);
  };

  // Handle updating reminder
  const handleUpdateReminder = async () => {
    if (!editingReminder || !reminderDate || !reminderTime) {
      toast({
        title: "Error",
        description: "Please select both date and time for the reminder",
        variant: "destructive",
      });
      return;
    }

    const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
    
    updateReminderMutation.mutate({
      id: editingReminder.id,
      data: {
        reminderDate: reminderDateTime.toISOString(),
        message: reminderMessage.trim() || null,
      }
    });

    setIsEditReminderDialogOpen(false);
    setEditingReminder(null);
    setReminderDate("");
    setReminderTime("");
    setReminderMessage("");
  };

  // Handle deleting reminder
  const handleDeleteReminder = (id: number) => {
    deleteReminderMutation.mutate(id);
  };

  // Format date nicely
  const formatDate = (date: Date | string) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    return d.toLocaleString();
  };

  // Convert newlines to <br> tags for display
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

            {/* Create Reminder button */}
            <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Create Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Reminder</DialogTitle>
                  <DialogDescription>
                    Set a reminder for this note: {note?.title}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reminder-date">Date</Label>
                      <Input
                        id="reminder-date"
                        type="date"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reminder-time">Time</Label>
                      <Input
                        id="reminder-time"
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reminder-message">Message (optional)</Label>
                    <Textarea
                      id="reminder-message"
                      placeholder="Add a custom reminder message..."
                      value={reminderMessage}
                      onChange={(e) => setReminderMessage(e.target.value)}
                      className="h-20"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleCreateReminder}
                    disabled={isCreatingReminder}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCreatingReminder ? "Creating..." : "Create Reminder"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
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
            
            {/* Add Editor button */}
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
                              // This would be implemented to remove an editor
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
          noteId={note.id}
          onAddTodo={(text) => onAddTodo(text)}
          onUpdateTodo={(id, completed) => onUpdateTodo(id, completed)}
          onEditTodo={(id, text) => onEditTodo(id, text)}
          onDeleteTodo={(id) => onDeleteTodo(id)}
        />

        {/* Reminders Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Reminders
                {reminders.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {reminders.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {remindersLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : reminders.length === 0 ? (
                <p className="text-gray-500 text-sm">No reminders set for this note</p>
              ) : (
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">
                            {formatDate(reminder.reminderDate)}
                          </span>
                          {reminder.isTriggered && (
                            <Badge variant="outline" className="text-xs">
                              Triggered
                            </Badge>
                          )}
                        </div>
                        {reminder.message && (
                          <p className="text-sm text-gray-600 mt-1">
                            {reminder.message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReminder(reminder)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                          title="Edit reminder"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                          title="Delete reminder"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Reminder Dialog */}
        <Dialog open={isEditReminderDialogOpen} onOpenChange={setIsEditReminderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Reminder</DialogTitle>
              <DialogDescription>
                Update the reminder for: {note?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-reminder-date">Date</Label>
                  <Input
                    id="edit-reminder-date"
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-reminder-time">Time</Label>
                  <Input
                    id="edit-reminder-time"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-reminder-message">Message (optional)</Label>
                <Textarea
                  id="edit-reminder-message"
                  placeholder="Add a custom reminder message..."
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="h-20"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleUpdateReminder}
                disabled={updateReminderMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateReminderMutation.isPending ? "Updating..." : "Update Reminder"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
