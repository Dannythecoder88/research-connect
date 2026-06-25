"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  Building2,
  FileText,
  FlaskConical,
  Download,
  CheckCircle2,
  XCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Stats Configuration                                               */
/* ------------------------------------------------------------------ */

const STATS = [
  {
    label: "Total Students",
    value: 0, // TODO: Replace with Supabase real-time count from profiles where role = 'student'
    icon: Users,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/40",
  },
  {
    label: "Total Labs",
    value: 0, // TODO: Replace with Supabase real-time count from labs/organizations table
    icon: FlaskConical,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-900/40",
  },
  {
    label: "Total Applications",
    value: 0, // TODO: Replace with Supabase real-time count from applications table
    icon: FileText,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40",
  },
  {
    label: "Active Listings",
    value: 0, // TODO: Replace with Supabase real-time count from listings where status = 'active'
    icon: Building2,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function AdminDashboardPage() {
  // TODO: Fetch pending approvals from Supabase (e.g., profiles where verified = false and role = 'researcher')
  // TODO: Fetch all listings from Supabase
  // TODO: Fetch all users from Supabase

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* ---- Header ---- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage platform accounts and content
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-fit">
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>

          {/* ---- Stats Row ---- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.05}>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          stat.color
                        )}
                      >
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          {/* ---- Tabs ---- */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="pending" className="gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Pending Approvals
              </TabsTrigger>
              <TabsTrigger value="listings" className="gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                All Listings
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-1.5">
                <Users className="h-3.5 w-3.5" />
                All Users
              </TabsTrigger>
            </TabsList>

            {/* ---- Pending Approvals ---- */}
            <TabsContent value="pending" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Pending Approvals</h2>
              </div>
              <Separator />

              {/* TODO: Replace with real pending approvals from Supabase query */}
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3" />
                <p className="font-medium">No pending approvals</p>
                <p className="text-sm text-muted-foreground mt-1">
                  New researcher accounts will appear here for verification.
                </p>
              </div>
            </TabsContent>

            {/* ---- All Listings ---- */}
            <TabsContent value="listings" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Listings</h2>
              </div>
              <Separator />

              {/* TODO: Replace with real listings from Supabase query */}
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Building2 className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="font-medium">No listings yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Research listings will appear here as researchers post
                  positions.
                </p>
              </div>
            </TabsContent>

            {/* ---- All Users ---- */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Users</h2>
              </div>
              <Separator />

              {/* TODO: Replace with real users from Supabase query */}
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="font-medium">No users yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Registered users will appear here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </>
  );
}
