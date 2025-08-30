import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { CalendarDays, Award, ExternalLink, Plus, X, Upload, FileImage } from "lucide-react";
import { useState, useRef } from "react";
import { AbstractBackground } from "./AbstractBackground";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  skills: string[];
  credentialUrl?: string;
  imageUrl?: string;
  fileName?: string;
}

interface CertificatesSectionProps {
  certificates: Certificate[];
  isEditing: boolean;
  onUpdateCertificates: (certificates: Certificate[]) => void;
  onViewAll?: () => void;
}

export function CertificatesSection({ certificates, isEditing, onUpdateCertificates, onViewAll }: CertificatesSectionProps) {
  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, 'id'>>({
    title: '',
    issuer: '',
    date: '',
    description: '',
    skills: [],
    credentialUrl: '',
    imageUrl: '',
    fileName: ''
  });
  
  const [uploadingStates, setUploadingStates] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  const uploadCertificateImage = async (file: File, certificateId: string) => {
    const formData = new FormData();
    formData.append('certificate', file);
    formData.append('certificateId', certificateId);
    
    setUploadingStates(prev => ({ ...prev, [certificateId]: true }));
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-985d7d68/upload-certificate`, {
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
        imageUrl: result.signedUrl,
        fileName: result.fileName
      };
    } catch (error) {
      console.error('Certificate upload error:', error);
      toast.error('Failed to upload certificate image');
      throw error;
    } finally {
      setUploadingStates(prev => ({ ...prev, [certificateId]: false }));
    }
  };
  
  const handleFileUpload = async (certificateId: string, file: File) => {
    try {
      const { imageUrl, fileName } = await uploadCertificateImage(file, certificateId);
      
      const updatedCertificates = certificates.map(cert => 
        cert.id === certificateId ? { ...cert, imageUrl, fileName } : cert
      );
      onUpdateCertificates(updatedCertificates);
      
      toast.success('Certificate image uploaded successfully');
    } catch (error) {
      // Error already handled in uploadCertificateImage
    }
  };
  
  const addCertificate = () => {
    if (newCertificate.title && newCertificate.issuer && newCertificate.date) {
      const certificate: Certificate = {
        ...newCertificate,
        id: Date.now().toString()
      };
      onUpdateCertificates([...certificates, certificate]);
      setNewCertificate({
        title: '',
        issuer: '',
        date: '',
        description: '',
        skills: [],
        credentialUrl: '',
        imageUrl: '',
        fileName: ''
      });
    }
  };
  
  const removeCertificate = (id: string) => {
    onUpdateCertificates(certificates.filter(cert => cert.id !== id));
  };
  
  const updateCertificate = (id: string, field: keyof Certificate, value: string | string[]) => {
    const updatedCertificates = certificates.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    onUpdateCertificates(updatedCertificates);
  };

  return (
    <AbstractBackground 
      imageUrl="https://images.unsplash.com/photo-1664854953181-b12e6dda8b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhdGElMjB2aXN1YWxpemF0aW9uJTIwbmV0d29ya3xlbnwxfHx8fDE3NTU3Njk5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Certifications & Achievements
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and academic achievements in AI, Data Science, and Finance
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.length === 0 && !isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-full"
            >
              <Card className="border-dashed border-2 border-muted-foreground/50 bg-card/50">
                <CardContent className="p-12 text-center">
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl mb-2 text-muted-foreground">Coming soon....</h3>
                  <p className="text-muted-foreground/70">
                    New certifications and achievements will be showcased here
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            certificates.slice(0, 3).map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-card/80 backdrop-blur-sm group">
                  {/* Certificate Image */}
                  {certificate.imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={certificate.imageUrl}
                        alt={`${certificate.title} Certificate`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <Award className="w-8 h-8 text-chart-1 mb-2" />
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*,application/pdf';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  handleFileUpload(certificate.id, file);
                                }
                              };
                              input.click();
                            }}
                            disabled={uploadingStates[certificate.id]}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {uploadingStates[certificate.id] ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCertificate(certificate.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={certificate.title}
                          onChange={(e) => updateCertificate(certificate.id, 'title', e.target.value)}
                          placeholder="Certificate title"
                        />
                        <Input
                          value={certificate.issuer}
                          onChange={(e) => updateCertificate(certificate.id, 'issuer', e.target.value)}
                          placeholder="Issuing organization"
                        />
                        <Input
                          type="date"
                          value={certificate.date}
                          onChange={(e) => updateCertificate(certificate.id, 'date', e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-lg leading-tight">{certificate.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span>{certificate.issuer}</span>
                          <Badge variant="outline" className="ml-auto">
                            <CalendarDays className="w-3 h-3 mr-1" />
                            {new Date(certificate.date).getFullYear()}
                          </Badge>
                        </CardDescription>
                      </>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={certificate.description}
                          onChange={(e) => updateCertificate(certificate.id, 'description', e.target.value)}
                          placeholder="Description"
                          rows={3}
                        />
                        <Input
                          value={certificate.skills.join(', ')}
                          onChange={(e) => updateCertificate(certificate.id, 'skills', e.target.value.split(', ').filter(s => s.trim()))}
                          placeholder="Skills (comma separated)"
                        />
                        <Input
                          value={certificate.credentialUrl || ''}
                          onChange={(e) => updateCertificate(certificate.id, 'credentialUrl', e.target.value)}
                          placeholder="Credential URL (optional)"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {certificate.description}
                        </p>
                        
                        {certificate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {certificate.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          {certificate.credentialUrl && (
                            <Button variant="outline" size="sm" className="flex-1" asChild>
                              <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-2" />
                                View Credential
                              </a>
                            </Button>
                          )}
                          {certificate.imageUrl && (
                            <Button variant="outline" size="sm" className="flex-1" asChild>
                              <a href={certificate.imageUrl} target="_blank" rel="noopener noreferrer">
                                <FileImage className="w-3 h-3 mr-2" />
                                View Certificate
                              </a>
                            </Button>
                          )}
                        </div>
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
                  <h3 className="font-medium">Add New Certificate</h3>
                </div>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Certificate title"
                    value={newCertificate.title}
                    onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                  />
                  <Input
                    placeholder="Issuing organization"
                    value={newCertificate.issuer}
                    onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={newCertificate.date}
                    onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newCertificate.description}
                    onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                    rows={2}
                  />
                  <Input
                    placeholder="Skills (comma separated)"
                    value={newCertificate.skills.join(', ')}
                    onChange={(e) => setNewCertificate({ ...newCertificate, skills: e.target.value.split(', ').filter(s => s.trim()) })}
                  />
                  <Input
                    placeholder="Credential URL (optional)"
                    value={newCertificate.credentialUrl}
                    onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })}
                  />
                  <Button onClick={addCertificate} className="w-full">
                    Add Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* View All Button */}
        {!isEditing && certificates.length > 3 && (
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
              View All Certificates ({certificates.length})
            </Button>
          </motion.div>
        )}
      </div>
    </AbstractBackground>
  );
}