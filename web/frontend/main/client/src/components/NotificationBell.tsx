import { useState } from "react";
import { Bell, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Notification } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
export default function NotificationBell() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await apiRequest("PATCH", '/api/notifications/${notificationId}/read');
      if (!response.ok) throw new Error("Failed to mark notification as read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await apiRequest("DELETE", '/api/notifications/${notificationId}');
      if (!response.ok) throw new Error("Failed to delete notification");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    },
  });
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const markAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };
  const deleteNotification = (id: number) => {
    deleteNotificationMutation.mutate(id);
  };
  const formatTime = (date: Date | string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return '${diffInMinutes}m ago';
    } else if (diffInMinutes < 1440) {
      return '${Math.floor(diffInMinutes / 60)}h ago';
    } else {
      return '${Math.floor(diffInMinutes / 1440)}d ago';
    }
  };
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return '⏰';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative text-gray-400 hover:text-gray-600"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No notifications
          </div>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`p-3 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                asChild
              >
                <div className="flex items-start gap-3 w-full">
                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 flex-shrink-0"
                    title="Delete notification"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
            
            {notifications.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
                  View all notifications
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}