import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  User,
  GraduationCap,
  Target,
  BookOpen,
} from "lucide-react";
import { AbstractBackground } from "./AbstractBackground";

interface AboutSectionProps {
  about: {
    bio: string;
    education: string;
    goals: string;
    interests: string[];
  };
  isEditing: boolean;
  onEdit: (field: string, value: string | string[]) => void;
}

export function AboutSection({
  about,
  isEditing,
  onEdit,
}: AboutSectionProps) {
  return (
    <AbstractBackground
      imageUrl="https://images.unsplash.com/photo-1684610529682-553625a1ffed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHZpc3VhbGl6YXRpb24lMjBhYnN0cmFjdHxlbnwxfHx8fDE3NTU4NzU4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      opacity={0.025}
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
            About Me
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Passionate about transforming data into actionable
            insights
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="h-full border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-chart-1" />
                    <h3 className="text-xl font-semibold text-[24px]">
                      Background
                    </h3>
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={about.bio}
                      onChange={(e) =>
                        onEdit("bio", e.target.value)
                      }
                      placeholder="Tell us about yourself..."
                      rows={6}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed text-[16px] italic">
                      {about.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Education Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="w-6 h-6 text-chart-2" />
                    <h3 className="text-xl font-semibold text-[24px]">
                      Education
                    </h3>
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={about.education}
                      onChange={(e) =>
                        onEdit("education", e.target.value)
                      }
                      placeholder="Your educational background..."
                      rows={6}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed text-[16px] font-bold italic font-normal">
                      {about.education}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Goals Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="h-full border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-chart-3" />
                    <h3 className="text-xl font-semibold text-[24px]">
                      Career Goals
                    </h3>
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={about.goals}
                      onChange={(e) =>
                        onEdit("goals", e.target.value)
                      }
                      placeholder="Your career aspirations..."
                      rows={6}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed text-[16px] italic">
                      {about.goals}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Interests Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="h-full border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-6 h-6 text-chart-4" />
                    <h3 className="text-xl font-semibold text-[24px]">
                      Interests
                    </h3>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={about.interests.join(", ")}
                        onChange={(e) =>
                          onEdit(
                            "interests",
                            e.target.value
                              .split(", ")
                              .filter((i) => i.trim()),
                          )
                        }
                        placeholder="Your interests (comma separated)"
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate interests with commas
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {about.interests.map(
                        (interest, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{
                              opacity: 1,
                              scale: 1,
                            }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              delay: index * 0.1,
                            }}
                          >
                            <Badge
                              variant="outline"
                              className="bg-background/50 text-[13px] not-italic font-bold"
                            >
                              {interest}
                            </Badge>
                          </motion.div>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AbstractBackground>
  );
}