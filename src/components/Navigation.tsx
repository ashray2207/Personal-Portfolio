import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Home, User, Award, Briefcase, Mail, FolderOpen } from "lucide-react";

export function Navigation() {
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Briefcase },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Ashray Bagde
            </h1>
          </motion.div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Button
                  variant={activeSection === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className="relative"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border/50 p-2">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToSection(item.id)}
              className="flex-col h-12 px-2"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}