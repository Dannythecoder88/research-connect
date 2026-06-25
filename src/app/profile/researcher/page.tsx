"use client";

import { useState } from "react";
import {
  Building2,
  Mail,
  Globe,
  MapPin,
  User,
  Save,
  Upload,
  Microscope,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { PageTransition, FadeIn } from "@/components/motion";
import { RESEARCH_CATEGORIES } from "@/lib/constants";

export default function ResearcherProfilePage() {
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(
    new Set()
  );

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
                  <Microscope className="h-6 w-6 text-emerald" />
                  Lab Profile
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your lab&apos;s profile and attract talented students.
                </p>
              </div>
              <Button className="gap-2 bg-emerald hover:bg-emerald-light text-white">
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </FadeIn>

          <div className="space-y-6">
            {/* Lab Information */}
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-emerald" />
                    Lab Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="labName">Lab Name</Label>
                    <Input
                      id="labName"
                      placeholder="Your lab or organization name"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="affiliation">Affiliation</Label>
                      <Input
                        id="affiliation"
                        placeholder="University or institution"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadResearcher">Lead Researcher</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="leadResearcher"
                          placeholder="Lead researcher name"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Contact Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="contact@university.edu"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://lab.university.edu"
                          className="pl-9"
                        />
                      </div>
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

                  <div className="space-y-2">
                    <Label htmlFor="description">Lab Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your lab's research focus and mission..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Research Areas */}
            <FadeIn delay={0.15}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-emerald" />
                    Research Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {RESEARCH_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => toggleArea(cat.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm text-left transition-all ${
                          selectedAreas.has(cat.id)
                            ? "border-emerald bg-emerald/5 text-emerald"
                            : "border-border hover:border-emerald/30"
                        }`}
                      >
                        {selectedAreas.has(cat.id) ? (
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

            {/* Profile Image */}
            <FadeIn delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-emerald" />
                    Lab Photo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-emerald/30 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium mb-1">
                      Upload a lab or team photo
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      PNG, JPG up to 2MB. Recommended 800x400.
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Save */}
            <div className="flex justify-end pb-8">
              <Button size="lg" className="gap-2 bg-emerald hover:bg-emerald-light text-white">
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
