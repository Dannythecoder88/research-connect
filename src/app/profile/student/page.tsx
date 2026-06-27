"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  User,
  School,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  CheckCircle2,
  Plus,
  X,
  Save,
  GraduationCap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [highSchool, setHighSchool] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [whyResearch, setWhyResearch] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [customSkill, setCustomSkill] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();
  const gradYears = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Real-time client-side profile completion calculation
  const completionPercent = useMemo(() => {
    let completion = 0;
    if (highSchool.trim()) completion += 10;
    if (gradYear) completion += 10;
    if (phone.trim()) completion += 5;
    if (location.trim()) completion += 10;
    if (bio.trim()) completion += 15;
    if (whyResearch.trim()) completion += 15;
    if (resumeUrl.trim()) completion += 15;
    if (selectedSkills.size > 0) completion += 10;
    if (selectedInterests.size > 0) completion += 10;
    return completion;
  }, [highSchool, gradYear, phone, location, bio, whyResearch, resumeUrl, selectedSkills, selectedInterests]);

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

  // Ensure the public.users row exists (fixes accounts created before the trigger existed)
  const ensureUserRecord = async (
    supabase: ReturnType<typeof createClient>,
    authUser: any
  ): Promise<{ id: string; email: string; full_name: string } | null> => {
    const meta = authUser.user_metadata || {};
    const fullName =
      meta.full_name ||
      `${meta.first_name || ""} ${meta.last_name || ""}`.trim() ||
      authUser.email;
    const role = meta.role || "student";

    const { data: existing } = await supabase
      .from("users")
      .select("id, email, full_name")
      .eq("id", authUser.id)
      .single<{ id: string; email: string; full_name: string }>();

    if (existing) return existing;

    const { data, error } = await supabase
      .from("users")
      .insert({
        id: authUser.id,
        email: authUser.email,
        full_name: fullName,
        role,
      })
      .select("id, email, full_name")
      .single();

    if (error) throw error;
    return data;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5 MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file must be under 5 MB.");
      return;
    }

    setUploading(true);
    setError("");

    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      setUploading(false);
      setError("You must be signed in to upload a resume.");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${authUser.id}/resume.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      setError("Failed to upload resume. Please try again.");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(filePath);

    setResumeUrl(urlData.publicUrl);
    setResumeFileName(file.name);
    setUploading(false);
  };

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        setLoading(false);
        setError("You must be signed in to view your profile.");
        return;
      }

      // Autofill from auth metadata first
      const meta = authUser.user_metadata || {};
      const metaFirstName = meta.first_name || "";
      const metaLastName = meta.last_name || "";
      const metaFullName = meta.full_name || "";

      let userData;
      try {
        userData = await ensureUserRecord(supabase, authUser);
      } catch (err: any) {
        console.error("ensureUserRecord failed:", err);
        setLoading(false);
        setError(`Failed to load your account information: ${err?.message || "Unknown error"}`);
        return;
      }

      if (!userData) {
        setLoading(false);
        setError("Unable to load your account information.");
        return;
      }

      // Use profile data first, then fall back to signup metadata
      const nameParts = ((userData.full_name || metaFullName) || "").split(" ");
      setFirstName(metaFirstName || nameParts[0] || "");
      setLastName(metaLastName || nameParts.slice(1).join(" ") || "");
      setEmail(userData.email || authUser.email || "");

      const { data: profile, error: profileError } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      if (profile) {
        setHighSchool(profile.high_school || meta.high_school || "");
        setGradYear(profile.graduation_year ? String(profile.graduation_year) : (meta.grad_year || ""));
        setLocation(profile.location || meta.location || "");
        setPhone(profile.phone || meta.phone || "");
        setBio(profile.bio || "");
        setWhyResearch(profile.why_research || "");
        setResumeUrl(profile.resume_url || "");
        setSelectedSkills(new Set(profile.skills || []));
        setSelectedInterests(new Set((profile.research_interests || []).map(String)));
      } else {
        // No profile row yet - autofill from signup metadata
        setHighSchool(meta.high_school || "");
        setGradYear(meta.grad_year || "");
        setLocation(meta.location || "");
        setPhone(meta.phone || "");

        if (profileError && profileError.code !== "PGRST116") {
          setError("Failed to load your profile.");
        }
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setSaving(false);
      setError("You must be signed in to save your profile.");
      return;
    }

    let userData;
    try {
      userData = await ensureUserRecord(supabase, authUser);
    } catch (err: any) {
      console.error("ensureUserRecord failed on save:", err);
      setSaving(false);
      setError(`Failed to prepare your account: ${err?.message || "Unknown error"}`);
      return;
    }

    if (!userData) {
      setSaving(false);
      setError("Unable to prepare your account for saving.");
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();

    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ full_name: fullName || email })
      .eq("id", authUser.id);

    if (userUpdateError) {
      console.error("users update failed:", userUpdateError);
      setSaving(false);
      setError(`Failed to update your name: ${userUpdateError.message}`);
      return;
    }

    const profileData = {
      user_id: authUser.id,
      high_school: highSchool || null,
      graduation_year: gradYear ? parseInt(gradYear, 10) : null,
      location: location || null,
      phone: phone || null,
      bio: bio || null,
      why_research: whyResearch || null,
      resume_url: resumeUrl || null,
      skills: Array.from(selectedSkills),
      research_interests: Array.from(selectedInterests),
    };

    const { error: saveError } = await supabase
      .from("student_profiles")
      .upsert(profileData, { onConflict: "user_id" })
      .select("id, profile_completion")
      .single();

    setSaving(false);

    if (saveError) {
      console.error("student_profiles save failed:", saveError);
      setError(`Failed to save your profile: ${saveError.message}`);
      return;
    }

    setSuccess("Profile saved successfully.");
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
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Student Profile
                </h1>
                <p className="text-muted-foreground mt-1">
                  Complete your profile to stand out to researchers.
                </p>
              </div>
              <Button className="gap-2" onClick={handleSave} disabled={saving || loading}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile
              </Button>
            </div>
          </FadeIn>

          {error && (
            <FadeIn className="mb-6">
              <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>{error}</div>
              </div>
            </FadeIn>
          )}

          {success && (
            <FadeIn className="mb-6">
              <div className="flex items-start gap-3 rounded-lg border border-emerald/20 bg-emerald/10 p-4 text-sm text-emerald">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <div>{success}</div>
              </div>
            </FadeIn>
          )}

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
                  {completionPercent === 100
                    ? "Your profile is complete! You're ready to apply."
                    : "Complete your profile to increase your chances of getting accepted."}
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
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={loading}
                      />
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
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
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={loading}
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
                          value={highSchool}
                          onChange={(e) => setHighSchool(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradYear">Graduation Year</Label>
                      <Select value={gradYear} onValueChange={(v) => setGradYear(v ?? "")} disabled={loading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
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
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={loading}
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
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={loading}
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
                      value={whyResearch}
                      onChange={(e) => setWhyResearch(e.target.value)}
                      disabled={loading}
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

            {/* Resume */}
            <FadeIn delay={0.35}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload your resume</Label>
                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || loading}
                        className="gap-2"
                      >
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {uploading ? "Uploading..." : "Choose File"}
                      </Button>
                      {resumeFileName && (
                        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {resumeFileName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, or DOCX. Max 5 MB.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="resumeUrl">Or paste a link</Label>
                    <Input
                      id="resumeUrl"
                      type="url"
                      placeholder="https://drive.google.com/... or https://..."
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Google Drive, Dropbox, or any public URL.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Save button */}
            <div className="flex justify-end pb-8">
              <Button size="lg" className="gap-2" onClick={handleSave} disabled={saving || loading}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}
