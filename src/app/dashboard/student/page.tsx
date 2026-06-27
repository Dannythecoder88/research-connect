"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { PageTransition, FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  FileText,
  Bookmark,
  ArrowRight,
  User,
  Search,
  Info,
  MessageSquare,
  Loader2,
  Send,
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  RESEARCH_CATEGORIES,
  COMMITMENT_TYPES,
  LOCATION_TYPES,
} from "@/lib/constants";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  interviewing: "Interviewing",
  accepted: "Accepted",
  declined: "Declined",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber/10 text-amber",
  under_review: "bg-blue/10 text-blue",
  interviewing: "bg-purple/10 text-purple",
  accepted: "bg-emerald/10 text-emerald",
  declined: "bg-destructive/10 text-destructive",
};

type Application = {
  id: string;
  status: string;
  applied_at: string;
  cover_message?: string;
  research_listings: {
    id: string;
    title: string;
    researcher_id: string;
    researcher_profiles: {
      lab_name: string;
      lead_researcher?: string;
    } | null;
  } | null;
};

type SavedListing = {
  id: string;
  research_listings: {
    id: string;
    title: string;
    description: string;
    location: string;
    weekly_hours: string;
  } | null;
};

type ListingDetail = {
  id: string;
  title: string;
  organization: string;
  category: string;
  commitment: string;
  hours: string;
  location: string;
  posted: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  researchArea: string;
  payType: "unpaid" | "hourly";
  hourlyPay: number | null;
  professorName: string;
};

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
};

export default function StudentDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedListingForDetail, setSelectedListingForDetail] = useState<ListingDetail | null>(null);
  const [listingDetailOpen, setListingDetailOpen] = useState(false);
  const [listingDetailLoading, setListingDetailLoading] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setLoading(false);
        return;
      }
      setCurrentUserId(authUser.id);

      const { data: studentProfile } = await supabase
        .from("student_profiles")
        .select("id, profile_completion")
        .eq("user_id", authUser.id)
        .single();

      if (!studentProfile) {
        setLoading(false);
        return;
      }

      setProfileCompletion(studentProfile.profile_completion || 0);

      const [{ data: appsData }, { data: savedData }] = await Promise.all([
        supabase
          .from("applications")
          .select("id, status, applied_at, cover_message, research_listings(id, title, researcher_id, researcher_profiles(lab_name, lead_researcher))")
          .eq("student_id", studentProfile.id)
          .order("applied_at", { ascending: false }),
        supabase
          .from("saved_listings")
          .select("id, research_listings(id, title, description, location, weekly_hours)")
          .eq("student_id", studentProfile.id)
          .order("saved_at", { ascending: false }),
      ]);

      setApplications((appsData || []) as unknown as Application[]);
      setSavedListings((savedData || []) as unknown as SavedListing[]);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  async function loadMessages(applicationId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .select("id, content, sender_id, created_at")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  }

  const openListingDetail = async (listingId: string) => {
    setListingDetailOpen(true);
    setListingDetailLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("research_listings")
      .select("*, researcher_profiles(lab_name, lead_researcher)")
      .eq("id", listingId)
      .single();
    if (data) {
      setSelectedListingForDetail({
        id: data.id,
        title: data.title,
        organization: data.researcher_profiles?.lab_name || "Unknown Lab",
        category: data.category,
        commitment: data.commitment,
        hours: data.weekly_hours || "TBD",
        location: data.location,
        posted: new Date(data.posted_at).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
        description: data.description,
        responsibilities: data.responsibilities || [],
        skills: data.required_skills || [],
        researchArea: data.research_area || "",
        payType: data.pay_type || "unpaid",
        hourlyPay: data.hourly_pay || null,
        professorName: data.researcher_profiles?.lead_researcher || "Professor",
      });
    }
    setListingDetailLoading(false);
  };

  async function sendMessage() {
    if (!selectedApplication || !messageText.trim()) return;
    setSendingMessage(true);
    setMessageError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSendingMessage(false);
      setMessageError("You must be signed in to send messages.");
      return;
    }

    const { error } = await supabase.from("messages").insert({
      application_id: selectedApplication.id,
      sender_id: user.id,
      content: messageText.trim(),
    });

    setSendingMessage(false);
    if (error) {
      console.error("Failed to send message:", error);
      setMessageError("Failed to send message. Please make sure the application is accepted.");
      return;
    }

    setMessageText("");
    await loadMessages(selectedApplication.id);
  }

  const openMessages = (application: Application) => {
    setSelectedApplication(application);
    setMessageOpen(true);
    loadMessages(application.id);
  };

  const openDeleteDialog = (application: Application) => {
    setApplicationToDelete(application);
    setDeleteDialogOpen(true);
  };

  async function handleDeleteApplication() {
    if (!applicationToDelete) return;
    setDeleteLoading(applicationToDelete.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", applicationToDelete.id);

    setDeleteLoading(null);
    setDeleteDialogOpen(false);
    if (error) return;

    setApplications((prev) => prev.filter((a) => a.id !== applicationToDelete.id));
    setApplicationToDelete(null);
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeIn>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Dashboard</h1>
                <p className="mt-1 text-muted-foreground">
                  Track your applications, saved opportunities, and profile progress.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/opportunities">
                    Browse Opportunities
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Welcome Info Banner */}
          <FadeIn delay={0.1}>
            <div className="mt-8">
              <Card>
                <CardContent className="flex items-start gap-3 pt-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Welcome to Research Connect!</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Complete your profile and start exploring research opportunities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeIn>

          {/* Main Content Grid */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Left: Tabs */}
            <FadeIn delay={0.2}>
              <Tabs defaultValue="applications">
                <TabsList>
                  <TabsTrigger value="applications">
                    <FileText className="h-4 w-4" />
                    Applications
                  </TabsTrigger>
                  <TabsTrigger value="saved">
                    <Bookmark className="h-4 w-4" />
                    Saved
                  </TabsTrigger>
                </TabsList>

                {/* Applications Tab */}
                <TabsContent value="applications">
                  <div className="mt-4">
                    {applications.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <FileText className="h-7 w-7 text-muted-foreground" />
                          </div>
                          <h3 className="mt-4 text-lg font-semibold">No applications yet</h3>
                          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                            Browse research opportunities and apply to get started.
                          </p>
                          <Button asChild className="mt-6" size="sm">
                            <Link href="/opportunities">
                              <Search className="mr-1.5 h-4 w-4" />
                              Browse Opportunities
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {applications.map((application) => {
                          const listing = application.research_listings;
                          const lab = listing?.researcher_profiles?.lab_name || "Unknown Lab";
                          const professor = listing?.researcher_profiles?.lead_researcher || "Professor";
                          return (
                            <Card key={application.id} className="border border-border/50 shadow-none">
                              <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                  <div>
                                    <button
                                      onClick={() => listing && openListingDetail(listing.id)}
                                      className="font-semibold text-base hover:underline text-left"
                                    >
                                      {listing?.title || "Untitled Position"}
                                    </button>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                      <Building2 className="h-3.5 w-3.5" />
                                      {lab}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                      <User className="h-3 w-3" />
                                      {professor}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Applied {new Date(application.applied_at).toLocaleDateString("en-US", {
                                        month: "short", day: "numeric", year: "numeric",
                                      })}
                                    </p>
                                    {application.status === "accepted" && (
                                      <p className="text-xs text-emerald mt-1 flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        You have been approved! Message the professor to discuss next steps.
                                      </p>
                                    )}
                                    {application.status === "declined" && (
                                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                                        <XCircle className="h-3.5 w-3.5" />
                                        This application was not selected.
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-start sm:items-end gap-2">
                                    <Badge className={statusColors[application.status] || "bg-muted"}>
                                      {statusLabels[application.status] || application.status}
                                    </Badge>
                                    <div className="flex gap-2">
                                      {application.status === "accepted" && (
                                        <Button size="sm" variant="outline" className="gap-1" onClick={() => openMessages(application)}>
                                          <MessageSquare className="h-3.5 w-3.5" />
                                          Message
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                                        onClick={() => openDeleteDialog(application)}
                                        disabled={deleteLoading === application.id}
                                      >
                                        {deleteLoading === application.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Saved Tab */}
                <TabsContent value="saved">
                  <div className="mt-4">
                    {savedListings.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <Bookmark className="h-7 w-7 text-muted-foreground" />
                          </div>
                          <h3 className="mt-4 text-lg font-semibold">No saved opportunities</h3>
                          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                            Save positions you&apos;re interested in to review later.
                          </p>
                          <Button asChild className="mt-6" size="sm">
                            <Link href="/opportunities">
                              <Search className="mr-1.5 h-4 w-4" />
                              Browse Opportunities
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {savedListings.map((saved) => {
                          const listing = saved.research_listings;
                          return (
                            <Card key={saved.id} className="border border-border/50 shadow-none">
                              <CardContent className="p-4">
                                <h3 className="font-semibold text-base">{listing?.title || "Untitled Position"}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{listing?.description}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {listing?.location}</span>
                                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {listing?.weekly_hours || "TBD"} hrs/week</span>
                                </div>
                                <Button variant="outline" size="sm" className="mt-3" onClick={() => listing && openListingDetail(listing.id)}>
                                  View Position
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </FadeIn>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <FadeIn delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-4 w-4 text-primary" />
                      Profile Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{profileCompletion}% complete</span>
                        <span className="font-medium text-primary">{profileCompletion}%</span>
                      </div>
                      <Progress value={profileCompletion} />
                      <p className="text-xs text-muted-foreground">
                        Complete your profile to start applying for research opportunities.
                      </p>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/profile/student">
                          Complete Your Profile
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </main>
      </PageTransition>

      {/* Delete Application Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>
              This will remove your application for{" "}
              <span className="font-medium text-foreground">
                {applicationToDelete?.research_listings?.title || "this position"}
              </span>
              . You can apply again later if you change your mind.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteApplication}
              disabled={deleteLoading === applicationToDelete?.id}
            >
              {deleteLoading === applicationToDelete?.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Messages Dialog */}
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Message {selectedApplication?.research_listings?.researcher_profiles?.lead_researcher || "Professor"}
            </DialogTitle>
            <DialogDescription>
              Position: {selectedApplication?.research_listings?.title || "Untitled Position"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <ScrollArea className="h-64 rounded-lg border p-3">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No messages yet. Start the conversation below.</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    const professorName = selectedApplication?.research_listings?.researcher_profiles?.lead_researcher || "Professor";
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <p className="text-[10px] opacity-80 mb-0.5">{isMe ? "You" : professorName}</p>
                          <p>{msg.content}</p>
                          <p className="text-[10px] opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
            {messageError && (
              <p className="text-xs text-destructive">{messageError}</p>
            )}
            <div className="flex gap-2">
              <Textarea
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={2}
                className="min-h-[60px]"
              />
              <Button onClick={sendMessage} disabled={sendingMessage || !messageText.trim()} className="self-end">
                {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Listing Detail Dialog */}
      <Dialog open={listingDetailOpen} onOpenChange={setListingDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedListingForDetail?.title || "Position Details"}</DialogTitle>
            <DialogDescription>
              {selectedListingForDetail?.organization} — {selectedListingForDetail?.professorName}
            </DialogDescription>
          </DialogHeader>
          {listingDetailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : selectedListingForDetail ? (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {RESEARCH_CATEGORIES.find((c) => c.id === selectedListingForDetail.category)?.name || selectedListingForDetail.category}
                </Badge>
                <Badge variant="secondary">
                  {COMMITMENT_TYPES.find((c) => c.id === selectedListingForDetail.commitment)?.label || selectedListingForDetail.commitment}
                </Badge>
                <Badge variant="secondary">
                  <MapPin className="h-3 w-3 mr-1" />
                  {LOCATION_TYPES.find((l) => l.id === selectedListingForDetail.location)?.label || selectedListingForDetail.location}
                </Badge>
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedListingForDetail.hours} hrs/week
                </Badge>
                <Badge variant="secondary" className={selectedListingForDetail.payType === "hourly" ? "bg-emerald/10 text-emerald" : ""}>
                  {selectedListingForDetail.payType === "hourly" ? `$${selectedListingForDetail.hourlyPay}/hr` : "Unpaid"}
                </Badge>
              </div>
              <div>
                <p className="font-medium mb-1">Description</p>
                <p className="text-muted-foreground leading-relaxed">{selectedListingForDetail.description}</p>
              </div>
              {selectedListingForDetail.responsibilities.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Responsibilities</p>
                  <ul className="space-y-1 text-muted-foreground">
                    {selectedListingForDetail.responsibilities.map((r) => (
                      <li key={r} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedListingForDetail.skills.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Required Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedListingForDetail.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedListingForDetail.researchArea && (
                <div>
                  <p className="font-medium mb-1">Research Area</p>
                  <p className="text-muted-foreground">{selectedListingForDetail.researchArea}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Posted {selectedListingForDetail.posted}</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
