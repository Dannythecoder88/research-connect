"use client";

import { useEffect, useState, useMemo } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/navbar";
import { PageTransition, FadeIn } from "@/components/motion";
import { RESEARCH_CATEGORIES } from "@/lib/constants";

export default function ResearcherProfilePage() {
  const [labName, setLabName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [leadResearcher, setLeadResearcher] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Real-time client-side profile completion calculation
  const completionPercent = useMemo(() => {
    let completion = 0;
    if (labName.trim()) completion += 20;
    if (affiliation.trim()) completion += 15;
    if (leadResearcher.trim()) completion += 10;
    if (email.trim()) completion += 10;
    if (website.trim()) completion += 5;
    if (description.trim()) completion += 20;
    if (location.trim()) completion += 10;
    if (selectedAreas.size > 0) completion += 10;
    return completion;
  }, [labName, affiliation, leadResearcher, email, website, description, location, selectedAreas]);

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) => {
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
    const role = meta.role || "researcher";

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

      // Autofill from auth metadata
      const meta = authUser.user_metadata || {};

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

      const { data: profile, error: profileError } = await supabase
        .from("researcher_profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      if (profile) {
        setLabName(profile.lab_name || meta.lab_name || "");
        setAffiliation(profile.affiliation || meta.affiliation || "");
        setLeadResearcher(profile.lead_researcher || userData.full_name || meta.full_name || "");
        setEmail(profile.email || userData.email || authUser.email || "");
        setWebsite(profile.website || meta.website || "");
        setLocation(profile.location || "");
        setDescription(profile.description || meta.description || "");
        setProfileImageUrl(profile.profile_image_url || "");
        setSelectedAreas(new Set((profile.research_areas || []).map(String)));
      } else {
        // No profile row yet - autofill from signup metadata
        setLabName(meta.lab_name || "");
        setAffiliation(meta.affiliation || "");
        setLeadResearcher(userData.full_name || meta.full_name || "");
        setEmail(userData.email || authUser.email || "");
        setWebsite(meta.website || "");
        setDescription(meta.description || "");

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

    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ full_name: leadResearcher || email })
      .eq("id", authUser.id);

    if (userUpdateError) {
      console.error("users update failed:", userUpdateError);
      setSaving(false);
      setError(`Failed to update your name: ${userUpdateError.message}`);
      return;
    }

    const profileData = {
      user_id: authUser.id,
      lab_name: labName || null,
      affiliation: affiliation || null,
      lead_researcher: leadResearcher || null,
      email: email || null,
      website: website || null,
      description: description || null,
      location: location || null,
      profile_image_url: profileImageUrl || null,
      research_areas: Array.from(selectedAreas),
    };

    const { error: saveError } = await supabase
      .from("researcher_profiles")
      .upsert(profileData, { onConflict: "user_id" })
      .select("id, profile_completion")
      .single();

    setSaving(false);

    if (saveError) {
      console.error("researcher_profiles save failed:", saveError);
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
                  <Microscope className="h-6 w-6 text-emerald" />
                  Lab Profile
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your lab&apos;s profile and attract talented students.
                </p>
              </div>
              <Button className="gap-2 bg-emerald hover:bg-emerald-light text-white" onClick={handleSave} disabled={saving || loading}>
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
                  <span className="text-sm font-bold text-emerald">{completionPercent}%</span>
                </div>
                <Progress value={completionPercent} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {completionPercent === 100
                    ? "Your profile is complete! Students can now discover your lab."
                    : "Complete your profile to help students learn about your lab."}
                </p>
              </CardContent>
            </Card>
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
                      value={labName}
                      onChange={(e) => setLabName(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="affiliation">Affiliation</Label>
                      <Input
                        id="affiliation"
                        placeholder="University or institution"
                        value={affiliation}
                        onChange={(e) => setAffiliation(e.target.value)}
                        disabled={loading}
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
                          value={leadResearcher}
                          onChange={(e) => setLeadResearcher(e.target.value)}
                          disabled={loading}
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
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
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          disabled={loading}
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
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Lab Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your lab's research focus and mission..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={loading}
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
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileImageUrl">Photo URL</Label>
                    <Input
                      id="profileImageUrl"
                      type="url"
                      placeholder="https://..."
                      value={profileImageUrl}
                      onChange={(e) => setProfileImageUrl(e.target.value)}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste a link to a lab or team photo.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Save */}
            <div className="flex justify-end pb-8">
              <Button size="lg" className="gap-2 bg-emerald hover:bg-emerald-light text-white" onClick={handleSave} disabled={saving || loading}>
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
