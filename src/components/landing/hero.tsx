"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, GraduationCap, Microscope, FlaskConical, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal/3 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              From the Guilderland Research Club
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Bridge the Gap Between{" "}
              <span className="text-primary">High School</span> and{" "}
              <span className="bg-gradient-to-r from-emerald to-teal bg-clip-text text-transparent">
                Breakthrough Research
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              Discover research opportunities, connect with mentors, and gain
              real-world experience before college. Your future in science
              starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link href="/opportunities">
                  <Search className="h-4.5 w-4.5 mr-2" />
                  Find a Lab
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-6 text-base group"
              >
                <Link href="/auth/signup/researcher">
                  Post a Position
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Illustration card showing the platform concept */}
              <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                <div className="text-center space-y-6">
                  <div className="flex justify-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex items-center">
                      <div className="h-px w-12 bg-border" />
                      <div className="h-8 w-8 rounded-full bg-emerald/10 flex items-center justify-center mx-2">
                        <FlaskConical className="h-4 w-4 text-emerald" />
                      </div>
                      <div className="h-px w-12 bg-border" />
                    </div>
                    <div className="h-14 w-14 rounded-xl bg-teal/10 flex items-center justify-center">
                      <Microscope className="h-7 w-7 text-teal" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Students meet Researchers</p>
                    <p className="text-xs text-muted-foreground">
                      Create a profile, discover opportunities, and apply directly
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Search, label: "Discover" },
                      { icon: BookOpen, label: "Learn" },
                      { icon: ArrowRight, label: "Apply" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-3 rounded-lg border border-border/50 bg-muted/30 text-center"
                      >
                        <item.icon className="h-4 w-4 mx-auto mb-1.5 text-muted-foreground" />
                        <p className="text-[11px] font-medium">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
