import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FlaskConical, Users, GraduationCap, Microscope } from "lucide-react";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">About CoLab</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Bridging the gap between high school students and breakthrough research opportunities.
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Our Mission</h2>
            <p>
              CoLab was created by the Guilderland Research Club to solve a simple but
              important problem: high school students who are passionate about science often have no
              clear path to real research experience. At the same time, researchers and labs
              frequently struggle to find motivated young people to join their teams.
            </p>
            <p className="mt-3">
              Our platform connects these two groups, making it easy for students to discover
              opportunities and for researchers to find talented, eager learners &mdash; all for free.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">How It Works</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="flex gap-3 items-start p-4 rounded-lg border border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">For Students</h3>
                  <p className="text-xs mt-1">
                    Create a profile, browse research positions from verified labs, and apply with
                    one click. Track your applications and build your research experience.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-4 rounded-lg border border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald/10 flex-shrink-0">
                  <Microscope className="h-5 w-5 text-emerald" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">For Researchers</h3>
                  <p className="text-xs mt-1">
                    Set up your lab profile, post open positions, and review applications from
                    motivated high school students in the Capital Region.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">The Guilderland Research Club</h2>
            <p>
              CoLab originated from the Guilderland Research Club Research Expo. The club
              is dedicated to fostering a culture of scientific inquiry and research among high
              school students, providing mentorship, resources, and now a digital platform to
              connect with real-world research opportunities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Contact Us</h2>
            <p>
              Have questions, feedback, or want to get involved? Reach out to us at{" "}
              <a href="mailto:daniel.joseph@guilderlandschools.net" className="text-primary hover:underline">
                daniel.joseph@guilderlandschools.net
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
