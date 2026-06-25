"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Microscope,
  Plus,
  FileText,
  Users,
  ClipboardList,
  ArrowRight,
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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// TODO: Import Supabase client and fetch researcher's listings
// import { createClient } from "@/lib/supabase/client";

// TODO: Fetch listings from Supabase
// const { data: listings } = await supabase
//   .from("listings")
//   .select("*")
//   .eq("researcher_id", user.id)
//   .order("created_at", { ascending: false });

// TODO: Fetch applications from Supabase
// const { data: applications } = await supabase
//   .from("applications")
//   .select("*, student:profiles(*), listing:listings(*)")
//   .eq("listings.researcher_id", user.id)
//   .order("created_at", { ascending: false })
//   .limit(10);

export default function ResearcherDashboardPage() {
  // TODO: Replace with real data from Supabase queries
  const listings: any[] = [];
  const applications: any[] = [];

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
                <Link href="#">
                  <Plus className="h-4 w-4" />
                  Post New Position
                </Link>
              </Button>
            </div>
          </FadeIn>

          {/* Welcome / Getting Started Card */}
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

          {/* Your Listings - Empty State */}
          <FadeIn delay={0.2}>
            <Card className="border border-border/50 shadow-none mb-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Your Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* TODO: When listings exist, render a Table here instead of the empty state */}
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
                      <Link href="#">
                        <Plus className="h-4 w-4" />
                        Post a Position
                      </Link>
                    </Button>
                  </div>
                ) : (
                  /* TODO: Replace with real listings table */
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-6">Position</TableHead>
                          <TableHead className="text-center">
                            Applicants
                          </TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Date Posted
                          </TableHead>
                          <TableHead className="text-right pr-6">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* TODO: Map over real listings from Supabase */}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Recent Applications - Empty State */}
          <FadeIn delay={0.3}>
            <Card className="border border-border/50 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* TODO: When applications exist, render application cards here instead of the empty state */}
                {applications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">
                      No applications yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Applications will appear here when students apply to your
                      positions.
                    </p>
                  </div>
                ) : (
                  /* TODO: Render real application cards from Supabase data */
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Application cards will go here */}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </PageTransition>
    </>
  );
}
