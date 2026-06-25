"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  ArrowRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { PageTransition, FadeIn } from "@/components/motion";

// TODO: Define Listing type from Supabase schema
// TODO: Fetch saved listings from Supabase
// const { data: savedListings } = await supabase
//   .from("saved_listings")
//   .select("*, listing:research_listings(*)")
//   .eq("student_id", user.id)
//   .order("created_at", { ascending: false });

export default function SavedPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Replace with real saved listings from Supabase
  const savedListings: any[] = [];

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Bookmark className="h-6 w-6 text-primary" />
                  Saved Opportunities
                </h1>
                <p className="text-muted-foreground mt-1">
                  {savedListings.length} position{savedListings.length !== 1 && "s"} saved
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/opportunities">
                  Browse More
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </FadeIn>

          {/* Search */}
          <FadeIn delay={0.1} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </FadeIn>

          {/* Empty State */}
          {savedListings.length === 0 && (
            <div className="text-center py-16">
              <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium mb-2">No saved opportunities</p>
              <p className="text-sm text-muted-foreground mb-4">
                Start exploring and save positions you&apos;re interested in.
              </p>
              <Button asChild>
                <Link href="/opportunities">Browse Opportunities</Link>
              </Button>
            </div>
          )}

          {/* TODO: Render saved listing cards here when data exists */}
          {/* savedListings.map((listing) => ( ... )) */}
        </div>
      </PageTransition>
    </>
  );
}
