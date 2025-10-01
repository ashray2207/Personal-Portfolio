import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Settings, Lock, Unlock, Eye, EyeOff, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { MessagesModal } from "./MessagesModal";

interface AdminPanelProps {
  isEditing: boolean;
  onToggleEdit: () => void;
}

export function AdminPanel({ isEditing, onToggleEdit }: AdminPanelProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  
  // Simple password for demo - in production, this would be more secure
  const ADMIN_PASSWORD = "ashray2025";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onToggleEdit();
      setIsDialogOpen(false);
      setPassword("");
      toast.success(isEditing ? "Edit mode disabled" : "Edit mode enabled");
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleLogout = () => {
    onToggleEdit();
    toast.success("Edit mode disabled");
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 space-y-2"
            >
              <Card className="bg-primary text-primary-foreground shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit Mode Active</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleLogout}
                      className="ml-2"
                    >
                      Exit
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-medium">Messages</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsMessagesModalOpen(true)}
                      className="ml-2"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!isEditing && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Admin
                </Button>
              </motion.div>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Admin Access
                </DialogTitle>
                <DialogDescription>
                  Enter the admin password to enable edit mode for this portfolio.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleLogin} className="flex-1">
                    <Unlock className="w-4 h-4 mr-2" />
                    Enable Edit Mode
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <MessagesModal 
        isOpen={isMessagesModalOpen} 
        onClose={() => setIsMessagesModalOpen(false)} 
      />
    </>
  );
}