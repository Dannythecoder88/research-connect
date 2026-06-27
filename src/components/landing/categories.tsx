"use client";

import Link from "next/link";
import { Cpu, Dna, FlaskConical, Atom, Leaf, Users, ArrowRight, Plus } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/motion";
import { RESEARCH_CATEGORIES } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Dna,
  FlaskConical,
  Atom,
  Leaf,
  Users,
};

interface CategoriesSectionProps {
  role?: string | null;
  isLoggedIn?: boolean;
}

export function CategoriesSection({ role, isLoggedIn }: CategoriesSectionProps) {
  const isResearcher = isLoggedIn && role === "researcher";

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Explore Research Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isResearcher
              ? "Post a position in any of these research areas to reach motivated students."
              : "From artificial intelligence to environmental science, find opportunities across every discipline."}
          </p>
        </FadeIn>

        <StaggerContainer staggerDelay={0.1} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {RESEARCH_CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon] || FlaskConical;
            const href = isResearcher
              ? `/dashboard/researcher?post=true&category=${category.id}`
              : `/opportunities?category=${category.id}`;

            return (
              <StaggerItem key={category.id}>
                <HoverCard>
                  <Link href={href}>
                    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 h-full transition-colors hover:border-primary/30">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-base mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {isResearcher ? (
                          <>
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Post a Position
                          </>
                        ) : (
                          <>
                            Browse Opportunities
                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
