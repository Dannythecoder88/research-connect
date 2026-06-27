"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { CategoriesSection } from "@/components/landing/categories";
import { FAQSection } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsLoggedIn(true);
        setRole(data.user.user_metadata?.role ?? null);
      }
    });
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection role={role} isLoggedIn={isLoggedIn} />
        <HowItWorksSection role={role} isLoggedIn={isLoggedIn} />
        <CategoriesSection role={role} isLoggedIn={isLoggedIn} />
        <FAQSection />
        {!isLoggedIn && <CTASection />}
      </main>
      <Footer />
    </>
  );
}
