"use client";

import {
  Mail,
  MessageSquare,
  BookOpen,
  PenTool,
  Compass,
  Building,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { RESOURCE_SECTIONS } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  MessageSquare,
  BookOpen,
  PenTool,
  Compass,
  Building,
};

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <FadeIn className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Resource Center
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know as a first-time research student.
              From cold emails to lab etiquette, we&apos;ve got you covered.
            </p>
          </FadeIn>

          {/* Resource Sections */}
          <StaggerContainer staggerDelay={0.1}>
            <Accordion defaultValue={[0]} className="space-y-4">
              {RESOURCE_SECTIONS.map((section) => {
                const Icon = iconMap[section.icon] || BookOpen;
                return (
                  <StaggerItem key={section.id}>
                    <AccordionItem
                      id={section.id}
                      className="border border-border rounded-xl px-6 data-[panel-open]:bg-card"
                    >
                      <AccordionTrigger className="hover:no-underline py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-base font-semibold text-left">
                            {section.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="prose prose-sm dark:prose-invert max-w-none pl-12">
                          {section.content.split("\n\n").map((paragraph, i) => {
                            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                              return (
                                <h4 key={i} className="font-semibold text-foreground mt-4 mb-2">
                                  {paragraph.replace(/\*\*/g, "")}
                                </h4>
                              );
                            }
                            if (paragraph.startsWith("**")) {
                              const parts = paragraph.split("**");
                              return (
                                <p key={i} className="text-muted-foreground leading-relaxed mb-3">
                                  {parts.map((part, j) =>
                                    j % 2 === 1 ? (
                                      <strong key={j} className="text-foreground font-semibold">
                                        {part}
                                      </strong>
                                    ) : (
                                      <span key={j}>{part}</span>
                                    )
                                  )}
                                </p>
                              );
                            }
                            if (paragraph.startsWith("- ")) {
                              return (
                                <ul key={i} className="list-disc list-inside space-y-1 text-muted-foreground mb-3">
                                  {paragraph.split("\n").map((line, j) => (
                                    <li key={j}>{line.replace("- ", "")}</li>
                                  ))}
                                </ul>
                              );
                            }
                            if (
                              paragraph.match(/^\d\./) ||
                              paragraph.startsWith("1.")
                            ) {
                              return (
                                <ol key={i} className="list-decimal list-inside space-y-1 text-muted-foreground mb-3">
                                  {paragraph.split("\n").map((line, j) => (
                                    <li key={j}>
                                      {line.replace(/^\d+\.\s*/, "").replace(/^"/, "").replace(/"$/, "")}
                                    </li>
                                  ))}
                                </ol>
                              );
                            }
                            return (
                              <p key={i} className="text-muted-foreground leading-relaxed mb-3 whitespace-pre-line">
                                {paragraph}
                              </p>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </StaggerItem>
                );
              })}
            </Accordion>
          </StaggerContainer>
        </div>
      </PageTransition>
      <Footer />
    </>
  );
}
