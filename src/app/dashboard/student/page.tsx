"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { PageTransition, FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  FileText,
  Bookmark,
  ArrowRight,
  User,
  Search,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function StudentDashboardPage() {
  // TODO: Fetch real applications from Supabase
  const applications: never[] = [];

  // TODO: Fetch saved listings from Supabase
  const savedListings: never[] = [];

  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    async function loadProfileCompletion() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase
        .from("student_profiles")
        .select("profile_completion")
        .eq("user_id", authUser.id)
        .single();

      if (profile) {
        setProfileCompletion(profile.profile_completion || 0);
      }
    }

    loadProfileCompletion();
  }, []);

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeIn>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  My Dashboard
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Track your applications, saved opportunities, and profile
                  progress.
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
                    <p className="text-sm font-medium">
                      Welcome to Research Connect!
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Complete your profile and start exploring research
                      opportunities.
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

                {/* Applications Tab - Empty State */}
                <TabsContent value="applications">
                  <div className="mt-4">
                    {applications.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <FileText className="h-7 w-7 text-muted-foreground" />
                          </div>
                          <h3 className="mt-4 text-lg font-semibold">
                            No applications yet
                          </h3>
                          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                            Browse research opportunities and apply to get
                            started.
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
                      // TODO: Render real applications here
                      // applications.map((app) => ( ... ))
                      <div className="space-y-4" />
                    )}
                  </div>
                </TabsContent>

                {/* Saved Tab - Empty State */}
                <TabsContent value="saved">
                  <div className="mt-4">
                    {savedListings.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <Bookmark className="h-7 w-7 text-muted-foreground" />
                          </div>
                          <h3 className="mt-4 text-lg font-semibold">
                            No saved opportunities
                          </h3>
                          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                            Save positions you&apos;re interested in to review
                            later.
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
                      // TODO: Render real saved listings here
                      // savedListings.map((listing) => ( ... ))
                      <div className="space-y-4" />
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
                        <span className="text-muted-foreground">
                          {profileCompletion}% complete
                        </span>
                        <span className="font-medium text-primary">
                          {profileCompletion}%
                        </span>
                      </div>
                      <Progress value={profileCompletion} />
                      <p className="text-xs text-muted-foreground">
                        Complete your profile to start applying for research
                        opportunities.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
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
    </>
  );
}
