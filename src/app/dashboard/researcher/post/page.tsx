"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { PageTransition, FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import {
  RESEARCH_CATEGORIES,
  COMMITMENT_TYPES,
  LOCATION_TYPES,
} from "@/lib/constants";

export default function PostPositionPage() {
  return (
    <Suspense>
      <PostPositionContent />
    </Suspense>
  );
}

function PostPositionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("edit");
  const isEdit = Boolean(listingId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [category, setCategory] = useState("");
  const [commitment, setCommitment] = useState("");
  const [locationType, setLocationType] = useState("");
  const [weeklyHours, setWeeklyHours] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [payType, setPayType] = useState<"unpaid" | "hourly">("unpaid");
  const [hourlyPay, setHourlyPay] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Pre-fill category from URL params (from smart category boxes)
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams]);

  // Load existing listing when editing
  useEffect(() => {
    if (!listingId) return;
    async function loadListing() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("research_listings")
        .select("*")
        .eq("id", listingId)
        .single();

      if (error || !data) {
        setError("Failed to load listing. It may have been deleted or you do not have access.");
        setPageLoading(false);
        return;
      }

      setTitle(data.title);
      setDescription(data.description);
      setResponsibilities((data.responsibilities || []).join("\n"));
      setRequiredSkills((data.required_skills || []).join(", "));
      setCategory(data.category);
      setCommitment(data.commitment);
      setLocationType(data.location);
      setWeeklyHours(data.weekly_hours || "");
      setResearchArea(data.research_area || "");
      setPayType(data.pay_type || "unpaid");
      setHourlyPay(data.hourly_pay ? String(data.hourly_pay) : "");
      setPageLoading(false);
    }
    loadListing();
  }, [listingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to post a position.");
      setLoading(false);
      return;
    }

    // Get researcher profile ID
    const { data: profile } = await supabase
      .from("researcher_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      setError("Please complete your lab profile before posting a position.");
      setLoading(false);
      return;
    }

    const payload = {
      title,
      description,
      responsibilities: responsibilities
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      required_skills: requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      category,
      commitment,
      location: locationType,
      weekly_hours: weeklyHours || null,
      research_area: researchArea || null,
      pay_type: payType,
      hourly_pay: payType === "hourly" && hourlyPay ? parseFloat(hourlyPay) : null,
    };

    const { error: saveError } = isEdit
      ? await supabase
          .from("research_listings")
          .update(payload)
          .eq("id", listingId)
      : await supabase
          .from("research_listings")
          .insert({
            researcher_id: profile.id,
            ...payload,
          });

    setLoading(false);

    if (saveError) {
      setError(saveError.message || `Failed to ${isEdit ? "update" : "post"} position. Please try again.`);
      return;
    }

    setSuccess(true);
  };

  const handleDelete = async () => {
    if (!listingId) return;
    setDeleting(true);
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("research_listings")
      .delete()
      .eq("id", listingId);

    setDeleting(false);
    setDeleteDialogOpen(false);

    if (deleteError) {
      setError(deleteError.message || "Failed to delete position. Please try again.");
      return;
    }

    router.push("/dashboard/researcher");
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10 mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-emerald" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {isEdit ? "Position Updated!" : "Position Posted!"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isEdit
                ? "Your research position has been updated."
                : "Your research position has been published. Students can now discover and apply to it."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/dashboard/researcher">Back to Dashboard</Link>
              </Button>
              {!isEdit && (
                <Button onClick={() => { setSuccess(false); setTitle(""); setDescription(""); setResponsibilities(""); setRequiredSkills(""); setCategory(""); setCommitment(""); setLocationType(""); setWeeklyHours(""); setResearchArea(""); }}>
                  Post Another
                </Button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
          <FadeIn className="mb-8">
            <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
              <Link href="/dashboard/researcher">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">
              {isEdit ? "Edit Research Position" : "Post a Research Position"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit
                ? "Update the details of your posted position."
                : "Describe the role to attract the right students."}
            </p>
          </FadeIn>

          {pageLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">Loading position...</p>
            </div>
          )}

          {!pageLoading && error && (
            <FadeIn className="mb-6">
              <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>{error}</div>
              </div>
            </FadeIn>
          )}

          {!pageLoading && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Position Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Position Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Research Assistant - Machine Learning Lab"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the position, what the student will be doing, and what they'll learn..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsibilities">
                      Responsibilities (one per line)
                    </Label>
                    <Textarea
                      id="responsibilities"
                      placeholder={"Assist with data collection\nRun experiments under supervision\nHelp write research reports"}
                      rows={3}
                      value={responsibilities}
                      onChange={(e) => setResponsibilities(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requiredSkills">
                      Required Skills (comma-separated)
                    </Label>
                    <Input
                      id="requiredSkills"
                      placeholder="e.g., Python, Statistics, Lab Safety"
                      value={requiredSkills}
                      onChange={(e) => setRequiredSkills(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={(v) => setCategory(v ?? "")} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {RESEARCH_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Commitment</Label>
                      <Select value={commitment} onValueChange={(v) => setCommitment(v ?? "")} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select commitment" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMITMENT_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Select value={locationType} onValueChange={(v) => setLocationType(v ?? "")} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATION_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weeklyHours">Weekly Hours</Label>
                      <Input
                        id="weeklyHours"
                        placeholder="e.g., 5-10"
                        value={weeklyHours}
                        onChange={(e) => setWeeklyHours(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="researchArea">Research Area (optional)</Label>
                    <Input
                      id="researchArea"
                      placeholder="e.g., Natural Language Processing"
                      value={researchArea}
                      onChange={(e) => setResearchArea(e.target.value)}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Compensation</Label>
                      <Select value={payType} onValueChange={(v) => setPayType(v as "unpaid" | "hourly")} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select compensation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="hourly">Hourly Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {payType === "hourly" && (
                      <div className="space-y-2">
                        <Label htmlFor="hourlyPay">Hourly Pay ($)</Label>
                        <Input
                          id="hourlyPay"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g., 15.00"
                          value={hourlyPay}
                          onChange={(e) => setHourlyPay(e.target.value)}
                          required={payType === "hourly"}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <div className="flex justify-between items-center">
              {isEdit ? (
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger
                    render={
                      <Button type="button" variant="destructive" size="lg" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Position
                      </Button>
                    }
                  />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete this position?</DialogTitle>
                      <DialogDescription>
                        This will permanently remove the position and all associated applications.
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
                        {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {deleting ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <div />
              )}
              <Button type="submit" size="lg" className="gap-2" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {loading ? (isEdit ? "Saving..." : "Publishing...") : (isEdit ? "Save Changes" : "Publish Position")}
              </Button>
            </div>
          </form>
          )}
        </div>
      </PageTransition>
    </>
  );
}
