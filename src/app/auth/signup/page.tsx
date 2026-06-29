"use client";

import Link from "next/link";
import { GraduationCap, Microscope, FlaskConical, ArrowRight } from "lucide-react";
import { PageTransition } from "@/components/motion";

export default function SignUpSelectionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-background to-muted/30">
      <PageTransition className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FlaskConical className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">CoLab</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground">
            Choose your role to get started.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Student Card */}
          <Link
            href="/auth/signup/student"
            className="group relative flex flex-col rounded-xl border border-border bg-card p-6 sm:p-8 transition-all hover:border-primary/40 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-5">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">I&apos;m a Student</h2>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              Access your applications, browse local research openings, and track
              your lab connections.
            </p>
            <div className="flex items-center text-sm font-medium text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              Continue as Student
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Researcher Card */}
          <Link
            href="/auth/signup/researcher"
            className="group relative flex flex-col rounded-xl border border-border bg-card p-6 sm:p-8 transition-all hover:border-emerald/40 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald/10 mb-5">
              <Microscope className="h-7 w-7 text-emerald" />
            </div>
            <h2 className="text-xl font-bold mb-2">I&apos;m a Researcher</h2>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              Manage your lab profile, review high school applicants, and post new
              open positions.
            </p>
            <div className="flex items-center text-sm font-medium text-emerald mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              Continue as Researcher
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </PageTransition>
    </div>
  );
}
