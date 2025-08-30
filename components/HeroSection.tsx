import { motion } from "motion/react";
import { Mail, Linkedin, Github } from "lucide-react";
import { Button } from "./ui/button";
import { AbstractBackground } from "./AbstractBackground";
import ashrayPhoto from "figma:asset/2851d39444ec96902a5f3bf0e58fa53c449ae85d.png";

interface HeroSectionProps {
  name: string;
  title: string;
  description: string;
  isEditing: boolean;
  onEdit: (field: string, value: string) => void;
}

export function HeroSection({ name, title, description, isEditing, onEdit }: HeroSectionProps) {
  return (
    <AbstractBackground 
      imageUrl="https://images.unsplash.com/photo-1679639539537-0d2e452890f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZGlnaXRhbCUyMGFic3RyYWN0fGVufDF8fHx8MTc1NTg3NTg0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      opacity={0.04}
      className="min-h-screen flex items-center justify-center relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-6"
          >
            <motion.h1 
              className="text-4xl md:text-5xl xl:text-6xl tracking-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onEdit('name', e.target.value)}
                  className="bg-transparent border-b-2 border-primary text-center lg:text-left w-full"
                />
              ) : (
                <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                  {name}
                </span>
              )}
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onEdit('title', e.target.value)}
                  className="bg-transparent border-b border-muted-foreground text-center lg:text-left w-full"
                />
              ) : (
                title
              )}
            </motion.p>
            
            <motion.p 
              className="text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => onEdit('description', e.target.value)}
                  className="bg-transparent border border-muted-foreground rounded p-2 w-full min-h-[100px]"
                />
              ) : (
                description
              )}
            </motion.p>
            
            <motion.div 
              className="flex justify-center lg:justify-start space-x-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Me
              </Button>
              <Button variant="ghost" size="lg" className="rounded-full" asChild>
                <a 
                  href="https://linkedin.com/in/ashraybagde" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit Ashray's LinkedIn profile"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="ghost" size="lg" className="rounded-full" asChild>
                <a 
                  href="https://github.com/ashray2207" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit Ashray's GitHub profile"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Photo - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative"
              >
                <img
                  src={ashrayPhoto}
                  alt="Ashray Bagde - AI & Data Science Student"
                  className="w-80 h-96 md:w-96 md:h-[28rem] object-cover rounded-2xl shadow-2xl"
                />
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-chart-1/20 to-chart-2/20 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-chart-3/20 to-chart-4/20 rounded-full blur-xl" />
                
                {/* Floating badge */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-card/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
                    <p className="text-sm font-medium text-center no-underline font-[Alata] text-[13px] not-italic">
                      AI & Data Science
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AbstractBackground>
  );
}