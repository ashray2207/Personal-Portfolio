import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { FolderOpen, Plus, X, Upload, Image, Video, ExternalLink, Calendar, Tag, Eye } from "lucide-react";
import { useState, useRef } from "react";
import { AbstractBackground } from "./AbstractBackground";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ProjectMedia {
  url: string;
  type: 'image' | 'video';
  fileName: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  date: string;
  githubUrl?: string;
  liveUrl?: string;
  media: ProjectMedia[];
}

interface ProjectsSectionProps {
  projects: Project[];
  isEditing: boolean;
  onUpdateProjects: (projects: Project[]) => void;
  onViewAll?: () => void;
}

export function ProjectsSection({ projects, isEditing, onUpdateProjects, onViewAll }: ProjectsSectionProps) {
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    category: '',
    technologies: [],
    date: '',
    githubUrl: '',
    liveUrl: '',
    media: []
  });
  
  const [uploadingStates, setUploadingStates] = useState<Record<string, boolean>>({});
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const uploadProjectMedia = async (file: File, projectId: string) => {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('projectId', projectId);
    
    setUploadingStates(prev => ({ ...prev, [projectId]: true }));
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-985d7d68/upload-project-media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      return {
        url: result.signedUrl,
        type: result.mediaType,
        fileName: result.fileName
      };
    } catch (error) {
      console.error('Project media upload error:', error);
      toast.error('Failed to upload project media');
      throw error;
    } finally {
      setUploadingStates(prev => ({ ...prev, [projectId]: false }));
    }
  };
  
  const handleMediaUpload = async (projectId: string, file: File) => {
    try {
      const mediaData = await uploadProjectMedia(file, projectId);
      
      const updatedProjects = projects.map(project => 
        project.id === projectId 
          ? { ...project, media: [...project.media, mediaData] }
          : project
      );
      onUpdateProjects(updatedProjects);
      
      toast.success('Project media uploaded successfully');
    } catch (error) {
      // Error already handled in uploadProjectMedia
    }
  };
  
  const addProject = () => {
    if (newProject.title && newProject.description && newProject.category && newProject.date) {
      const project: Project = {
        ...newProject,
        id: Date.now().toString()
      };
      onUpdateProjects([...projects, project]);
      setNewProject({
        title: '',
        description: '',
        category: '',
        technologies: [],
        date: '',
        githubUrl: '',
        liveUrl: '',
        media: []
      });
      toast.success('Project added successfully');
    } else {
      toast.error('Please fill in all required fields');
    }
  };
  
  const removeProject = (id: string) => {
    onUpdateProjects(projects.filter(project => project.id !== id));
    toast.success('Project removed successfully');
  };
  
  const updateProject = (id: string, field: keyof Project, value: string | string[] | ProjectMedia[]) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    );
    onUpdateProjects(updatedProjects);
  };

  const removeMedia = (projectId: string, mediaIndex: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const updatedMedia = project.media.filter((_, index) => index !== mediaIndex);
      updateProject(projectId, 'media', updatedMedia);
      toast.success('Media removed successfully');
    }
  };

  const categories = ['Web Development', 'Data Science', 'Machine Learning', 'Mobile App', 'Desktop App', 'API', 'Other'];

  return (
    <AbstractBackground 
      imageUrl="https://images.unsplash.com/photo-1611224923853-80b023f02d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHByb2plY3RzfGVufDF8fHx8MTc1NTg3NTg0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      opacity={0.03}
      className="py-20"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
            Projects & Portfolio
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Showcasing practical applications of AI, Data Science, and development skills through real-world projects
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 && !isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-full"
            >
              <Card className="border-dashed border-2 border-muted-foreground/50 bg-card/50">
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl mb-2 text-muted-foreground">Coming soon....</h3>
                  <p className="text-muted-foreground/70">
                    Exciting new projects and portfolio pieces will be showcased here
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-card/80 backdrop-blur-sm group cursor-pointer"
                      onClick={() => {
                        setSelectedProject(project);
                        setIsProjectModalOpen(true);
                      }}>
                  
                  {/* Project Media Preview */}
                  {project.media.length > 0 && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      {project.media[0].type === 'video' ? (
                        <video
                          src={project.media[0].url}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          muted
                          loop
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                      ) : (
                        <img
                          src={project.media[0].url}
                          alt={`${project.title} Preview`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/20 text-white border-0">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <FolderOpen className="w-8 h-8 text-chart-3 mb-2" />
                      {isEditing && (
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*,video/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  handleMediaUpload(project.id, file);
                                }
                              };
                              input.click();
                            }}
                            disabled={uploadingStates[project.id]}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {uploadingStates[project.id] ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProject(project.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          placeholder="Project title"
                        />
                        <Select
                          value={project.category}
                          onValueChange={(value) => updateProject(project.id, 'category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="date"
                          value={project.date}
                          onChange={(e) => updateProject(project.id, 'date', e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                        <CardDescription className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {project.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(project.date).getFullYear()}
                          </Badge>
                        </CardDescription>
                      </>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <Textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          placeholder="Project description"
                          rows={3}
                        />
                        <Input
                          value={project.technologies.join(', ')}
                          onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(', ').filter(t => t.trim()))}
                          placeholder="Technologies (comma separated)"
                        />
                        <Input
                          value={project.githubUrl || ''}
                          onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                          placeholder="GitHub URL (optional)"
                        />
                        <Input
                          value={project.liveUrl || ''}
                          onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                          placeholder="Live Demo URL (optional)"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                        
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="text-xs">
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
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
          
          {isEditing && (
            <Card className="border-dashed border-2 border-muted-foreground">
              <CardContent className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">Add New Project</h3>
                </div>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Project title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                  <Select
                    value={newProject.category}
                    onValueChange={(value) => setNewProject({ ...newProject, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={newProject.date}
                    onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                  />
                  <Textarea
                    placeholder="Project description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={2}
                  />
                  <Input
                    placeholder="Technologies (comma separated)"
                    value={newProject.technologies.join(', ')}
                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value.split(', ').filter(t => t.trim()) })}
                  />
                  <Input
                    placeholder="GitHub URL (optional)"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  />
                  <Input
                    placeholder="Live Demo URL (optional)"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                  />
                  <Button onClick={addProject} className="w-full">
                    Add Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* View All Button */}
        {!isEditing && projects.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={onViewAll}
              className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              View All Projects ({projects.length})
            </Button>
          </motion.div>
        )}
      </div>

      {/* Project Detail Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                <DialogDescription>
                  Detailed view of {selectedProject.title} project with media gallery, description, and links.
                </DialogDescription>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">
                    <Tag className="w-3 h-3 mr-1" />
                    {selectedProject.category}
                  </Badge>
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(selectedProject.date).toLocaleDateString()}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Media Gallery */}
                {selectedProject.media.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Project Media</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {selectedProject.media.map((media, index) => (
                        <div key={index} className="relative group">
                          {media.type === 'video' ? (
                            <video
                              src={media.url}
                              controls
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ) : (
                            <img
                              src={media.url}
                              alt={`${selectedProject.title} - ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          )}
                          {isEditing && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeMedia(selectedProject.id, index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies */}
                {selectedProject.technologies.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-2 pt-4">
                  {selectedProject.githubUrl && (
                    <Button variant="outline" asChild>
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                  {selectedProject.liveUrl && (
                    <Button asChild>
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AbstractBackground>
  );
}