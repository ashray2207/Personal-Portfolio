import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { SkillsSection } from "./components/SkillsSection";
import { CertificatesSection } from "./components/CertificatesSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { ContactSection } from "./components/ContactSection";
import { AdminPanel } from "./components/AdminPanel";
import { AllCertificates } from "./components/AllCertificates";
import { AllProjects } from "./components/AllProjects";

type ViewType = 'home' | 'certificates' | 'projects';

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  
  // Enforce dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
    // Remove any potential light mode class
    document.documentElement.classList.remove('light');
  }, []);
  
  // Portfolio data with default values
  const [portfolioData, setPortfolioData] = useState({
    personal: {
      name: "Ashray Bagde",
      title: "AI & Data Science Student | Aspiring Data/Financial Analyst",
      description: "Passionate second-year student specializing in Artificial Intelligence and Data Science, with a keen interest in transforming complex data into actionable business insights and financial intelligence."
    },
    about: {
      bio: "I'm a dedicated second-year student pursuing Artificial Intelligence and Data Science, driven by curiosity about how data can solve real-world problems. My journey in tech began with a fascination for patterns in data and has evolved into a comprehensive understanding of machine learning algorithms, statistical analysis, and data visualization techniques.",
      education: "Currently pursuing Bachelor's in Artificial Intelligence and Data Science (Second Year). Strong foundation in mathematics, statistics, programming, and data analysis methodologies. Actively engaged in practical projects that bridge theoretical knowledge with real-world applications.",
      goals: "Aspiring to become a skilled Data Analyst or Financial Analyst, leveraging AI and machine learning to drive data-informed decision making. My goal is to contribute to innovative projects that use data science to solve complex business challenges and optimize financial strategies.",
      interests: ["Machine Learning", "Financial Markets", "Data Visualization", "Statistical Analysis", "Python Programming", "Business Intelligence", "Quantitative Finance", "Deep Learning"]
    },
    skills: [
      { name: "Python", level: 85, category: "Programming Languages" },
      { name: "R", level: 75, category: "Programming Languages" },
      { name: "SQL", level: 80, category: "Programming Languages" },
      { name: "JavaScript", level: 70, category: "Programming Languages" },
      { name: "Machine Learning", level: 80, category: "Data Science" },
      { name: "Data Visualization", level: 85, category: "Data Science" },
      { name: "Statistical Analysis", level: 82, category: "Data Science" },
      { name: "Deep Learning", level: 75, category: "Data Science" },
      { name: "Pandas", level: 90, category: "Tools & Libraries" },
      { name: "NumPy", level: 85, category: "Tools & Libraries" },
      { name: "Scikit-learn", level: 80, category: "Tools & Libraries" },
      { name: "TensorFlow", level: 70, category: "Tools & Libraries" },
      { name: "Tableau", level: 75, category: "Tools & Libraries" },
      { name: "Excel", level: 85, category: "Tools & Libraries" },
      { name: "Financial Modeling", level: 70, category: "Finance" },
      { name: "Risk Analysis", level: 65, category: "Finance" },
      { name: "Portfolio Optimization", level: 60, category: "Finance" }
    ],
    certificates: [],
    projects: [],
    contact: {
      email: "bagdeashray@gmail.com",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra, India",
      linkedin: "https://linkedin.com/in/ashraybagde",
      github: "https://github.com/ashray2207",
      instagram: "https://instagram.com/ashray_bagde"
    }
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setPortfolioData(parsedData);
      } catch (error) {
        console.error('Error parsing saved portfolio data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever portfolioData changes
  useEffect(() => {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
  }, [portfolioData]);

  const handlePersonalEdit = (field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const handleAboutEdit = (field: string, value: string | string[]) => {
    setPortfolioData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value
      }
    }));
  };

  const handleSkillsUpdate = (skills: any[]) => {
    setPortfolioData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleCertificatesUpdate = (certificates: any[]) => {
    setPortfolioData(prev => ({
      ...prev,
      certificates
    }));
  };

  const handleProjectsUpdate = (projects: any[]) => {
    setPortfolioData(prev => ({
      ...prev,
      projects
    }));
  };

  const handleContactEdit = (field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  // Handle view changes
  const handleViewAllCertificates = () => {
    setCurrentView('certificates');
  };

  const handleViewAllProjects = () => {
    setCurrentView('projects');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'certificates':
        return (
          <AllCertificates
            certificates={portfolioData.certificates}
            isEditing={isEditing}
            onUpdateCertificates={handleCertificatesUpdate}
            onBack={handleBackToHome}
          />
        );
      case 'projects':
        return (
          <AllProjects
            projects={portfolioData.projects}
            isEditing={isEditing}
            onUpdateProjects={handleProjectsUpdate}
            onBack={handleBackToHome}
          />
        );
      default:
        return (
          <>
            <Navigation />
            
            <main className="pt-16">
              <section id="home">
                <HeroSection
                  name={portfolioData.personal.name}
                  title={portfolioData.personal.title}
                  description={portfolioData.personal.description}
                  isEditing={isEditing}
                  onEdit={handlePersonalEdit}
                />
              </section>

              <section id="about">
                <AboutSection
                  about={portfolioData.about}
                  isEditing={isEditing}
                  onEdit={handleAboutEdit}
                />
              </section>

              <section id="skills">
                <SkillsSection
                  skills={portfolioData.skills}
                  isEditing={isEditing}
                  onUpdateSkills={handleSkillsUpdate}
                />
              </section>

              <section id="certificates">
                <CertificatesSection
                  certificates={portfolioData.certificates}
                  isEditing={isEditing}
                  onUpdateCertificates={handleCertificatesUpdate}
                  onViewAll={handleViewAllCertificates}
                />
              </section>

              <section id="projects">
                <ProjectsSection
                  projects={portfolioData.projects}
                  isEditing={isEditing}
                  onUpdateProjects={handleProjectsUpdate}
                  onViewAll={handleViewAllProjects}
                />
              </section>

              <section id="contact">
                <ContactSection
                  contactInfo={portfolioData.contact}
                  isEditing={isEditing}
                  onEdit={handleContactEdit}
                />
              </section>
            </main>

            <AdminPanel
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(!isEditing)}
            />

            {/* Add padding for mobile navigation */}
            <div className="h-16 md:h-0" />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <Toaster position="top-right" />
    </div>
  );
}