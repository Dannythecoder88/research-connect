"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Microscope,
  Plus,
  FileText,
  Users,
  ClipboardList,
  ArrowRight,
  Loader2,
  AlertCircle,
  MessageSquare,
  Check,
  X,
  ExternalLink,
  Mail,
  School,
  Calendar,
  MapPin,
  Phone,
  FileText as FileTextIcon,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { PageTransition, FadeIn } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const statusLabels: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  closed: "Closed",
  pending_review: "Pending Review",
};

const statusBadgeColors: Record<string, string> = {
  active: "bg-emerald/10 text-emerald hover:bg-emerald/20",
  paused: "bg-amber/10 text-amber hover:bg-amber/20",
  closed: "bg-muted text-muted-foreground hover:bg-muted/80",
  pending_review: "bg-blue/10 text-blue hover:bg-blue/20",
};

const applicationStatusLabels: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  interviewing: "Interviewing",
  accepted: "Accepted",
  declined: "Declined",
};

const applicationStatusColors: Record<string, string> = {
  pending: "bg-amber/10 text-amber",
  under_review: "bg-blue/10 text-blue",
  interviewing: "bg-purple/10 text-purple",
  accepted: "bg-emerald/10 text-emerald",
  declined: "bg-destructive/10 text-destructive",
};

type Listing = {
  id: string;
  title: string;
  description: string;
  status: string;
  posted_at: string;
  required_skills: string[];
};

type Application = {
  id: string;
  status: string;
  applied_at: string;
  cover_message?: string;
  student_profiles: {
    id: string;
    user_id?: string;
    high_school?: string;
    graduation_year?: number;
    phone?: string;
    location?: string;
    bio?: string;
    why_research?: string;
    resume_url?: string;
    skills?: string[];
    research_interests?: string[];
    users?: { full_name: string; email: string } | null;
  } | null;
  research_listings: {
    id: string;
    title: string;
  } | null;
};

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
};

export default function ResearcherDashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  async function loadDashboard() {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      setLoading(false);
      setError("You must be signed in to view your dashboard.");
      return;
    }
    setCurrentUserId(authUser.id);

    const { data: profile, error: profileError } = await supabase
      .from("researcher_profiles")
      .select("id")
      .eq("user_id", authUser.id)
      .single();

    if (profileError || !profile) {
      setLoading(false);
      setError("Please complete your lab profile before using the dashboard.");
      return;
    }

    const [{ data: listingsData }, { data: applicationsData }] = await Promise.all([
      supabase
        .from("research_listings")
        .select("id, title, description, status, posted_at, required_skills")
        .eq("researcher_id", profile.id)
        .order("posted_at", { ascending: false }),
      supabase
        .from("applications")
        .select("id, status, applied_at, cover_message, student_profiles(*, users(full_name, email)), research_listings(id, title)")
        .eq("research_listings.researcher_id", profile.id)
        .order("applied_at", { ascending: false })
        .limit(10),
    ]);

    setListings(listingsData || []);
    setApplications((applicationsData || []) as unknown as Application[]);
    setLoading(false);
  }

  useEffect(() => {
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

  async function updateStatus(applicationId: string, status: "accepted" | "declined") {
    setActionLoading(applicationId);
    const supabase = createClient();
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);

    setActionLoading(null);
    if (error) {
      setError(error.message);
      return;
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status } : a))
    );
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication({ ...selectedApplication, status });
    }
  }

  async function sendMessage() {
    if (!selectedApplication || !messageText.trim()) return;
    setSendingMessage(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSendingMessage(false);
      return;
    }

    const { error } = await supabase.from("messages").insert({
      application_id: selectedApplication.id,
      sender_id: user.id,
      content: messageText.trim(),
    });

    setSendingMessage(false);
    if (error) {
      setError(error.message);
      return;
    }

    setMessageText("");
    await loadMessages(selectedApplication.id);
  }

  const openDetail = (application: Application) => {
    setSelectedApplication(application);
    setDetailOpen(true);
    setError(null);
  };

  const openMessages = (application: Application) => {
    setSelectedApplication(application);
    setMessageOpen(true);
    setError(null);
    loadMessages(application.id);
  };

  const applicantCountByListing = (listingId: string) =>
    applications.filter((a) => a.research_listings?.id === listingId).length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const selectedStudent = selectedApplication?.student_profiles;
  const selectedName = selectedStudent?.users?.full_name || "Student";
  const selectedEmail = selectedStudent?.users?.email || "";
  const selectedListingTitle = selectedApplication?.research_listings?.title || "Untitled Position";

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Lab Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your research positions and applications
                </p>
              </div>
              <Button asChild className="gap-2 self-start">
                <Link href="/dashboard/researcher/post">
                  <Plus className="h-4 w-4" />
                  Post New Position
                </Link>
              </Button>
            </div>
          </FadeIn>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
            </div>
          ) : error && !detailOpen && !messageOpen ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-4" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : (
            <>
              {/* Welcome / Getting Started Card */}
              {listings.length === 0 && applications.length === 0 && (
                <FadeIn delay={0.1}>
                  <Card className="border border-border/50 shadow-none mb-8">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Microscope className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg font-semibold">
                          Welcome to your lab dashboard
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get started by completing these steps:
                      </p>
                      <ol className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            1
                          </span>
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Complete your lab profile
                            </span>{" "}
                            &mdash; Add your lab name, department, and research focus
                            so students can learn about your work.
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            2
                          </span>
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Post your first research position
                            </span>{" "}
                            &mdash; Describe the role, required skills, and
                            expectations for student researchers.
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            3
                          </span>
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Review applications as students apply
                            </span>{" "}
                            &mdash; You&apos;ll be notified when students submit
                            applications to your positions.
                          </span>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </FadeIn>
              )}

              {/* Your Listings */}
              <FadeIn delay={0.2}>
                <Card className="border border-border/50 shadow-none mb-8">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      Your Listings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {listings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                          <ClipboardList className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1">
                          No positions posted yet
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-4">
                          Post a research position to start receiving applications
                          from motivated students.
                        </p>
                        <Button asChild className="gap-2">
                          <Link href="/dashboard/researcher/post">
                            <Plus className="h-4 w-4" />
                            Post a Position
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="pl-6">Position</TableHead>
                              <TableHead className="text-center">Applicants</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                              <TableHead className="hidden sm:table-cell">Date Posted</TableHead>
                              <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {listings.map((listing) => (
                              <TableRow key={listing.id}>
                                <TableCell className="pl-6">
                                  <div>
                                    <p className="font-medium">{listing.title}</p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                                      {listing.description}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="secondary">{applicantCountByListing(listing.id)}</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge className={statusBadgeColors[listing.status] || "bg-muted"}>
                                    {statusLabels[listing.status] || listing.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                                  {new Date(listing.posted_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                  <Button variant="ghost" size="sm" asChild className="gap-1">
                                    <Link href={`/dashboard/researcher/post?edit=${listing.id}`}>
                                      Manage
                                      <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Recent Applications */}
              <FadeIn delay={0.3}>
                <Card className="border border-border/50 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      Recent Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {applications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1">No applications yet</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          Applications will appear here when students apply to your positions.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {applications.map((application) => {
                          const studentProfile = application.student_profiles;
                          const studentName = studentProfile?.users?.full_name || "Student";
                          const listingTitle = application.research_listings?.title || "Untitled Position";

                          return (
                            <Card
                              key={application.id}
                              className="border border-border/50 shadow-none hover:border-primary/30 transition-colors cursor-pointer"
                              onClick={() => openDetail(application)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>{getInitials(studentName)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="font-medium text-sm truncate">{studentName}</p>
                                      <Badge className={applicationStatusColors[application.status] || "bg-muted"}>
                                        {applicationStatusLabels[application.status] || application.status}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      Applied to <span className="font-medium text-foreground">{listingTitle}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(application.applied_at).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </p>
                                    {application.cover_message && (
                                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                        &ldquo;{application.cover_message}&rdquo;
                                      </p>
                                    )}

                                    {/* Quick actions */}
                                    <div className="flex gap-2 mt-3">
                                      {application.status === "pending" && (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs gap-1 text-emerald border-emerald/30 hover:bg-emerald/10"
                                            onClick={(e) => { e.stopPropagation(); updateStatus(application.id, "accepted"); }}
                                            disabled={actionLoading === application.id}
                                          >
                                            {actionLoading === application.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                                            Approve
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                                            onClick={(e) => { e.stopPropagation(); updateStatus(application.id, "declined"); }}
                                            disabled={actionLoading === application.id}
                                          >
                                            {actionLoading === application.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                      {application.status === "accepted" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-7 text-xs gap-1"
                                          onClick={(e) => { e.stopPropagation(); openMessages(application); }}
                                        >
                                          <MessageSquare className="h-3 w-3" />
                                          Message
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            </>
          )}
        </div>
      </PageTransition>

      {/* Application Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Applicant Profile</DialogTitle>
            <DialogDescription>
              Review the applicant and decide on their application.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{getInitials(selectedName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedName}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {selectedEmail}
                  </div>
                  <Badge className={`mt-2 ${applicationStatusColors[selectedApplication.status] || "bg-muted"}`}>
                    {applicationStatusLabels[selectedApplication.status] || selectedApplication.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <School className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">High School</p>
                    <p className="text-muted-foreground">{selectedStudent?.high_school || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Graduation Year</p>
                    <p className="text-muted-foreground">{selectedStudent?.graduation_year || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{selectedStudent?.location || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{selectedStudent?.phone || "Not provided"}</p>
                  </div>
                </div>
                {selectedStudent?.bio && (
                  <div className="flex items-start gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">About</p>
                      <p className="text-muted-foreground">{selectedStudent.bio}</p>
                    </div>
                  </div>
                )}
                {selectedStudent?.why_research && (
                  <div className="flex items-start gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Why Research</p>
                      <p className="text-muted-foreground">{selectedStudent.why_research}</p>
                    </div>
                  </div>
                )}
                {selectedStudent?.skills && selectedStudent.skills.length > 0 && (
                  <div>
                    <p className="font-medium mb-1">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedStudent?.resume_url && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild className="gap-1">
                      <a href={selectedStudent.resume_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Resume
                      </a>
                    </Button>
                  </div>
                )}
                {selectedApplication.cover_message && (
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="font-medium mb-1">Cover Message</p>
                    <p className="text-muted-foreground">{selectedApplication.cover_message}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Applied to <span className="font-medium text-foreground">{selectedListingTitle}</span>
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedApplication?.status === "pending" && (
              <div className="flex w-full gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => selectedApplication && updateStatus(selectedApplication.id, "declined")}
                  disabled={actionLoading === selectedApplication?.id}
                >
                  {actionLoading === selectedApplication?.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  Reject
                </Button>
                <Button
                  className="gap-1"
                  onClick={() => selectedApplication && updateStatus(selectedApplication.id, "accepted")}
                  disabled={actionLoading === selectedApplication?.id}
                >
                  {actionLoading === selectedApplication?.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Approve
                </Button>
              </div>
            )}
            {selectedApplication?.status === "accepted" && (
              <Button onClick={() => { setDetailOpen(false); selectedApplication && openMessages(selectedApplication); }}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Student
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Messages Dialog */}
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message {selectedName}</DialogTitle>
            <DialogDescription>
              About position: {selectedListingTitle}
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
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <p className="text-[10px] opacity-80 mb-0.5">{isMe ? "You" : selectedName}</p>
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
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
