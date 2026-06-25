"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  Send,
  Award,
  Building2,
  ClipboardList,
  Users,
  Rocket,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";

const studentSteps = [
  {
    icon: UserPlus,
    title: "Create Profile",
    description: "Build your research profile with skills, interests, and academic background.",
  },
  {
    icon: Search,
    title: "Discover Opportunities",
    description: "Browse and filter research positions from verified labs and organizations.",
  },
  {
    icon: Send,
    title: "Apply",
    description: "One-click Easy Apply sends your profile and cover message directly to researchers.",
  },
  {
    icon: Award,
    title: "Gain Experience",
    description: "Work alongside mentors, build skills, and create an impact before college.",
  },
];

const researcherSteps = [
  {
    icon: Building2,
    title: "Create Lab Profile",
    description: "Set up your lab's presence with details about your research and team.",
  },
  {
    icon: ClipboardList,
    title: "Post Positions",
    description: "Describe the role, requirements, and schedule to attract the right students.",
  },
  {
    icon: Users,
    title: "Review Applicants",
    description: "Browse student profiles, read applications, and connect with top candidates.",
  },
  {
    icon: Rocket,
    title: "Build Your Team",
    description: "Accept students and start mentoring the next generation of researchers.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re a student looking for your first research experience or
            a lab seeking motivated young researchers, we make it simple.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* For Students */}
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                For Students
              </div>
            </FadeIn>
            <StaggerContainer staggerDelay={0.15} className="space-y-6">
              {studentSteps.map((step, i) => (
                <StaggerItem key={step.title}>
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* For Researchers */}
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-emerald/10 text-emerald text-sm font-semibold">
                For Researchers
              </div>
            </FadeIn>
            <StaggerContainer staggerDelay={0.15} className="space-y-6">
              {researcherSteps.map((step, i) => (
                <StaggerItem key={step.title}>
                  <div className="flex gap-4 items-start group">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald/10 text-emerald group-hover:bg-emerald group-hover:text-white transition-colors">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
