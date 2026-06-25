"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  School,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Upload,
  CheckCircle2,
  Plus,
  X,
  Save,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { PageTransition, FadeIn } from "@/components/motion";
import { SKILLS_LIST, RESEARCH_CATEGORIES } from "@/lib/constants";

export default function StudentProfilePage() {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    new Set()
  );
  const [customSkill, setCustomSkill] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set()
  );

  const currentYear = new Date().getFullYear();
  const gradYears = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.has(customSkill.trim())) {
      setSelectedSkills((prev) => new Set(prev).add(customSkill.trim()));
      setCustomSkill("");
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // TODO: Calculate profile completion from Supabase profile data
  const completionPercent = 0;

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <FadeIn className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Student Profile
                </h1>
                <p className="text-muted-foreground mt-1">
                  Complete your profile to stand out to researchers.
                </p>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </FadeIn>

          {/* Completion bar */}
          <FadeIn delay={0.1} className="mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm font-bold text-primary">{completionPercent}%</span>
                </div>
                <Progress value={completionPercent} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Complete your profile to increase your chances of getting accepted.
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="space-y-6">
            {/* Personal Information */}
            <FadeIn delay={0.15}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="First name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Last name" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="highSchool">High School</Label>
                      <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="highSchool"
                          placeholder="Your high school"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradYear">Graduation Year</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gradYears.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="City, State"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Research Interests */}
            <FadeIn delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Research Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {RESEARCH_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => toggleInterest(cat.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm text-left transition-all ${
                          selectedInterests.has(cat.id)
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        {selectedInterests.has(cat.id) ? (
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-border flex-shrink-0" />
                        )}
                        <span className="font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Mini Bio & Why Research */}
            <FadeIn delay={0.25}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    About You
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Mini Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell researchers about yourself in 2-3 sentences..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      This appears on your application submissions.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whyResearch">Why I Want to Do Research</Label>
                    <Textarea
                      id="whyResearch"
                      placeholder="What drives your interest in research?"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Skills Checklist */}
            <FadeIn delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {SKILLS_LIST.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          selectedSkills.has(skill)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {selectedSkills.has(skill) && (
                          <CheckCircle2 className="h-3 w-3 inline mr-1" />
                        )}
                        {skill}
                      </button>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a custom skill..."
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                    />
                    <Button variant="outline" onClick={addCustomSkill} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedSkills.size > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        Selected skills ({selectedSkills.size})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(selectedSkills).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="gap-1 cursor-pointer hover:bg-destructive/10"
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill}
                            <X className="h-3 w-3" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            {/* Resume Upload */}
            <FadeIn delay={0.35}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium mb-1">
                      Upload your resume
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      PDF, DOC, or DOCX up to 5MB
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Save button */}
            <div className="flex justify-end pb-8">
              <Button size="lg" className="gap-2">
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}
