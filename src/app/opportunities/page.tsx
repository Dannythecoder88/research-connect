import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import OpportunitiesContent from "./content";

export default async function OpportunitiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: listings } = await supabase
    .from("research_listings")
    .select("*, researcher_profiles(lab_name, lead_researcher)")
    .eq("status", "active")
    .order("posted_at", { ascending: false });

  return (
    <Suspense fallback={null}>
      <OpportunitiesContent initialUser={user} initialListings={listings} />
    </Suspense>
  );
}
