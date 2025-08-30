import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { AbstractBackground } from "./AbstractBackground";

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  isEditing: boolean;
  onUpdateSkills: (skills: Skill[]) => void;
}

export function SkillsSection({ skills, isEditing, onUpdateSkills }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState({ name: '', level: 0, category: '' });
  
  const categories = [...new Set(skills.map(skill => skill.category))];
  
  const addSkill = () => {
    if (newSkill.name && newSkill.category && newSkill.level > 0) {
      onUpdateSkills([...skills, newSkill]);
      setNewSkill({ name: '', level: 0, category: '' });
    }
  };
  
  const removeSkill = (index: number) => {
    onUpdateSkills(skills.filter((_, i) => i !== index));
  };
  
  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const updatedSkills = skills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    );
    onUpdateSkills(updatedSkills);
  };

  return (
    <AbstractBackground 
      imageUrl="https://images.unsplash.com/photo-1647515032361-83323449b85e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXVyYWwlMjBuZXR3b3JrJTIwYWJzdHJhY3QlMjBhcnR8ZW58MXx8fHwxNzU1ODc1ODQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      opacity={0.02}
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
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive expertise in data science, machine learning, and financial analysis
          </p>
        </motion.div>

        <div className="grid gap-8">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
            >
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {skills
                      .filter(skill => skill.category === category)
                      .map((skill, index) => (
                        <motion.div
                          key={`${skill.name}-${index}`}
                          className="space-y-2"
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                          <div className="flex justify-between items-center">
                            {isEditing ? (
                              <div className="flex gap-2 items-center w-full">
                                <Input
                                  value={skill.name}
                                  onChange={(e) => updateSkill(skills.indexOf(skill), 'name', e.target.value)}
                                  className="flex-1"
                                />
                                <Input
                                  type="number"
                                  value={skill.level}
                                  onChange={(e) => updateSkill(skills.indexOf(skill), 'level', parseInt(e.target.value))}
                                  className="w-20"
                                  min="0"
                                  max="100"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSkill(skills.indexOf(skill))}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span className="font-medium">{skill.name}</span>
                                <Badge variant="secondary">{skill.level}%</Badge>
                              </>
                            )}
                          </div>
                          {!isEditing && (
                            <Progress 
                              value={skill.level} 
                              className="h-2"
                            />
                          )}
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {isEditing && (
            <Card className="border-dashed border-2 border-muted-foreground">
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <Input
                    placeholder="Skill name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  />
                  <Input
                    placeholder="Category"
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Level (0-100)"
                    value={newSkill.level || ''}
                    onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="100"
                  />
                  <Button onClick={addSkill}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AbstractBackground>
  );
}