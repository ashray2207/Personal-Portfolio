import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, ExternalLink, Github, Plus, Edit, Trash2, Upload, ArrowLeft, Search } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  date: string;
  githubUrl?: string;
  liveUrl?: string;
  media: string[];
}

interface AllProjectsProps {
  projects: Project[];
  isEditing: boolean;
  onUpdateProjects: (projects: Project[]) => void;
  onBack: () => void;
}

export function AllProjects({ projects, isEditing, onUpdateProjects, onBack }: AllProjectsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "",
    technologies: "",
    date: "",
    githubUrl: "",
    liveUrl: "",
    media: [] as string[]
  });

  const categories = ["all", ...Array.from(new Set(projects.map(p => p.category)))];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (isEditing && editingProject) {
          setEditingProject({ 
            ...editingProject, 
            media: [...editingProject.media, imageUrl]
          });
        } else {
          setNewProject({ 
            ...newProject, 
            media: [...newProject.media, imageUrl]
          });
        }
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number, isEditing = false) => {
    if (isEditing && editingProject) {
      const updatedMedia = editingProject.media.filter((_, i) => i !== index);
      setEditingProject({ ...editingProject, media: updatedMedia });
    } else {
      const updatedMedia = newProject.media.filter((_, i) => i !== index);
      setNewProject({ ...newProject, media: updatedMedia });
    }
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description || !newProject.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      category: newProject.category,
      technologies: newProject.technologies.split(",").map(tech => tech.trim()).filter(Boolean),
      date: newProject.date,
      githubUrl: newProject.githubUrl || undefined,
      liveUrl: newProject.liveUrl || undefined,
      media: newProject.media
    };

    onUpdateProjects([...projects, project]);
    setNewProject({
      title: "",
      description: "",
      category: "",
      technologies: "",
      date: "",
      githubUrl: "",
      liveUrl: "",
      media: []
    });
    setIsAddDialogOpen(false);
    toast.success("Project added successfully!");
  };

  const handleEditProject = () => {
    if (!editingProject || !editingProject.title || !editingProject.description || !editingProject.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedProjects = projects.map(proj =>
      proj.id === editingProject.id ? editingProject : proj
    );
    onUpdateProjects(updatedProjects);
    setEditingProject(null);
    toast.success("Project updated successfully!");
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(proj => proj.id !== id);
    onUpdateProjects(updatedProjects);
    toast.success("Project deleted successfully!");
  };

  // Filter and sort projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Button>
            <div>
              <h1 className="text-3xl font-bold">All Projects</h1>
              <p className="text-muted-foreground">
                {projects.length} project{projects.length !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>
          {isEditing && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new project to your portfolio.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Project Title *</Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="e.g., Stock Price Predictor"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                        placeholder="e.g., Machine Learning"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Project Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newProject.date}
                        onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                      <Input
                        id="technologies"
                        value={newProject.technologies}
                        onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                        placeholder="Python, TensorFlow, Pandas"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Describe your project..."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="githubUrl">GitHub URL</Label>
                      <Input
                        id="githubUrl"
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="liveUrl">Live Demo URL</Label>
                      <Input
                        id="liveUrl"
                        value={newProject.liveUrl}
                        onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="media">Project Images</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="media"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {newProject.media.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newProject.media.map((image, index) => (
                          <div key={index} className="relative">
                            <img src={image} alt={`Preview ${index + 1}`} className="h-20 w-20 object-cover rounded border" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddProject}>
                      Add Project
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search, Filter and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by title, description, or technology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest First)</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="category">Category (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                {project.media.length > 0 && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={project.media[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {project.media.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        +{project.media.length - 1} more
                      </div>
                    )}
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                      <CardDescription className="text-sm font-medium">
                        {project.category}
                      </CardDescription>
                    </div>
                    {isEditing && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProject(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                  
                  <p className="text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(project.githubUrl, '_blank')}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(project.liveUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {sortedProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || categoryFilter !== "all" ? "No projects found matching your criteria." : "No projects added yet."}
            </p>
          </div>
        )}

        {/* Edit Project Dialog */}
        {editingProject && (
          <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>
                  Update the project details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title">Project Title *</Label>
                    <Input
                      id="edit-title"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category *</Label>
                    <Input
                      id="edit-category"
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-date">Project Date</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={editingProject.date}
                      onChange={(e) => setEditingProject({ ...editingProject, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-technologies">Technologies (comma-separated)</Label>
                    <Input
                      id="edit-technologies"
                      value={editingProject.technologies.join(", ")}
                      onChange={(e) => setEditingProject({ 
                        ...editingProject, 
                        technologies: e.target.value.split(",").map(tech => tech.trim()).filter(Boolean)
                      })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-githubUrl">GitHub URL</Label>
                    <Input
                      id="edit-githubUrl"
                      value={editingProject.githubUrl || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-liveUrl">Live Demo URL</Label>
                    <Input
                      id="edit-liveUrl"
                      value={editingProject.liveUrl || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-media">Project Images</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="edit-media"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, true)}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {editingProject.media.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingProject.media.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={image} alt={`Preview ${index + 1}`} className="h-20 w-20 object-cover rounded border" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => removeImage(index, true)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingProject(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditProject}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}