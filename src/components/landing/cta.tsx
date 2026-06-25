"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <FadeIn>
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 mb-6">
            <FlaskConical className="h-7 w-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Ready to Start Your Research Journey?
          </h2>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Create your account and start exploring research opportunities
            in the Capital Region. Your breakthrough starts with a single click.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base bg-white text-primary hover:bg-white/90"
            >
              <Link href="/auth/signup/student">
                Get Started as a Student
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base bg-transparent border-2 border-white/50 text-white hover:bg-white/10"
            >
              <Link href="/auth/signup/researcher">
                Register Your Lab
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
