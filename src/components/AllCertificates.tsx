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
import { Calendar, ExternalLink, Plus, Edit, Trash2, Upload, ArrowLeft, Search } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  skills: string[];
  credentialUrl?: string;
  imageUrl?: string;
}

interface AllCertificatesProps {
  certificates: Certificate[];
  isEditing: boolean;
  onUpdateCertificates: (certificates: Certificate[]) => void;
  onBack: () => void;
}

export function AllCertificates({ certificates, isEditing, onUpdateCertificates, onBack }: AllCertificatesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  
  const [newCertificate, setNewCertificate] = useState({
    title: "",
    issuer: "",
    date: "",
    description: "",
    skills: "",
    credentialUrl: "",
    imageUrl: ""
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (isEditing && editingCertificate) {
          setEditingCertificate({ ...editingCertificate, imageUrl });
        } else {
          setNewCertificate({ ...newCertificate, imageUrl });
        }
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCertificate = () => {
    if (!newCertificate.title || !newCertificate.issuer || !newCertificate.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const certificate: Certificate = {
      id: Date.now().toString(),
      title: newCertificate.title,
      issuer: newCertificate.issuer,
      date: newCertificate.date,
      description: newCertificate.description,
      skills: newCertificate.skills.split(",").map(skill => skill.trim()).filter(Boolean),
      credentialUrl: newCertificate.credentialUrl || undefined,
      imageUrl: newCertificate.imageUrl || undefined
    };

    onUpdateCertificates([...certificates, certificate]);
    setNewCertificate({
      title: "",
      issuer: "",
      date: "",
      description: "",
      skills: "",
      credentialUrl: "",
      imageUrl: ""
    });
    setIsAddDialogOpen(false);
    toast.success("Certificate added successfully!");
  };

  const handleEditCertificate = () => {
    if (!editingCertificate || !editingCertificate.title || !editingCertificate.issuer || !editingCertificate.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedCertificates = certificates.map(cert =>
      cert.id === editingCertificate.id ? editingCertificate : cert
    );
    onUpdateCertificates(updatedCertificates);
    setEditingCertificate(null);
    toast.success("Certificate updated successfully!");
  };

  const handleDeleteCertificate = (id: string) => {
    const updatedCertificates = certificates.filter(cert => cert.id !== id);
    onUpdateCertificates(updatedCertificates);
    toast.success("Certificate deleted successfully!");
  };

  // Filter and sort certificates
  const filteredCertificates = certificates.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedCertificates = [...filteredCertificates].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "issuer") {
      return a.issuer.localeCompare(b.issuer);
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
              <h1 className="text-3xl font-bold">All Certificates</h1>
              <p className="text-muted-foreground">
                {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>
          {isEditing && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Certificate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Certificate</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new certificate to your portfolio.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Certificate Title *</Label>
                      <Input
                        id="title"
                        value={newCertificate.title}
                        onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                        placeholder="e.g., Data Science Fundamentals"
                      />
                    </div>
                    <div>
                      <Label htmlFor="issuer">Issuing Organization *</Label>
                      <Input
                        id="issuer"
                        value={newCertificate.issuer}
                        onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                        placeholder="e.g., Coursera - IBM"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Completion Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newCertificate.date}
                        onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="credentialUrl">Credential URL</Label>
                      <Input
                        id="credentialUrl"
                        value={newCertificate.credentialUrl}
                        onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCertificate.description}
                      onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                      placeholder="Describe what you learned and achieved..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={newCertificate.skills}
                      onChange={(e) => setNewCertificate({ ...newCertificate, skills: e.target.value })}
                      placeholder="Python, Data Analysis, Machine Learning"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Certificate Image</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {newCertificate.imageUrl && (
                      <div className="mt-2">
                        <img src={newCertificate.imageUrl} alt="Preview" className="h-20 w-auto rounded border" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCertificate}>
                      Add Certificate
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search certificates by title, issuer, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest First)</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="issuer">Issuer (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCertificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                {certificate.imageUrl && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={certificate.imageUrl}
                      alt={certificate.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{certificate.title}</CardTitle>
                      <CardDescription className="text-sm font-medium text-primary/80">
                        {certificate.issuer}
                      </CardDescription>
                    </div>
                    {isEditing && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCertificate(certificate)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCertificate(certificate.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(certificate.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  {certificate.description && (
                    <p className="text-sm leading-relaxed line-clamp-3">
                      {certificate.description}
                    </p>
                  )}
                  
                  {certificate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {certificate.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {certificate.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{certificate.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {certificate.credentialUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => window.open(certificate.credentialUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Credential
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {sortedCertificates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "No certificates found matching your search." : "No certificates added yet."}
            </p>
          </div>
        )}

        {/* Edit Certificate Dialog */}
        {editingCertificate && (
          <Dialog open={!!editingCertificate} onOpenChange={() => setEditingCertificate(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Certificate</DialogTitle>
                <DialogDescription>
                  Update the certificate details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title">Certificate Title *</Label>
                    <Input
                      id="edit-title"
                      value={editingCertificate.title}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-issuer">Issuing Organization *</Label>
                    <Input
                      id="edit-issuer"
                      value={editingCertificate.issuer}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, issuer: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-date">Completion Date *</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={editingCertificate.date}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-credentialUrl">Credential URL</Label>
                    <Input
                      id="edit-credentialUrl"
                      value={editingCertificate.credentialUrl || ""}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, credentialUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingCertificate.description}
                    onChange={(e) => setEditingCertificate({ ...editingCertificate, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-skills">Skills (comma-separated)</Label>
                  <Input
                    id="edit-skills"
                    value={editingCertificate.skills.join(", ")}
                    onChange={(e) => setEditingCertificate({ 
                      ...editingCertificate, 
                      skills: e.target.value.split(",").map(skill => skill.trim()).filter(Boolean)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-image">Certificate Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {editingCertificate.imageUrl && (
                    <div className="mt-2">
                      <img src={editingCertificate.imageUrl} alt="Preview" className="h-20 w-auto rounded border" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingCertificate(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditCertificate}>
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