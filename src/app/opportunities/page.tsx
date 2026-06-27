import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import OpportunitiesContent from "./content";

export default async function OpportunitiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <Suspense fallback={null}>
      <OpportunitiesContent initialUser={user} />
    </Suspense>
  );
}
