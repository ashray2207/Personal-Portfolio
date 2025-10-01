import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, Clock, Trash2, Eye, EyeOff, RotateCcw } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MessagesModal({ isOpen, onClose }: MessagesModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-985d7d68/messages`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch messages');
      }

      setMessages(result.messages || []);
    } catch (error) {
      console.error('Fetch messages error:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-985d7d68/messages/${messageId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to mark message as read');
      }

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error('Mark as read error:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-985d7d68/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete message');
      }

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Delete message error:', error);
      toast.error('Failed to delete message');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            View and manage messages received from your portfolio contact form.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[60vh]">
          {/* Messages List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Inbox</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchMessages}
                disabled={loading}
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages yet
                  </div>
                ) : (
                  messages.map((message) => (
                    <Card
                      key={message.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedMessage?.id === message.id 
                          ? 'ring-2 ring-primary' 
                          : ''
                      } ${
                        !message.read 
                          ? 'border-l-4 border-l-primary bg-muted/20' 
                          : 'border-l-4 border-l-transparent'
                      }`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-sm leading-none">
                              {message.name}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {message.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!message.read && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMessage(message.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm font-medium truncate mb-1">
                          {message.subject || 'No Subject'}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {message.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(message.timestamp)}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Message Details */}
          <div className="border-l pl-4">
            {selectedMessage ? (
              <div className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium">{selectedMessage.subject || 'No Subject'}</h3>
                    <p className="text-sm text-muted-foreground">
                      From: {selectedMessage.name} ({selectedMessage.email})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(selectedMessage.timestamp)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(selectedMessage.id)}
                      disabled={selectedMessage.read}
                    >
                      {selectedMessage.read ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMessage(selectedMessage.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <ScrollArea className="flex-1">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </ScrollArea>
                
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your Message'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}