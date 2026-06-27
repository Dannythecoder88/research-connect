import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 27, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account information:</strong> Name, email address, password (encrypted), and role (student or researcher).</li>
              <li><strong>Profile information:</strong> High school, graduation year, location, phone number, skills, research interests, bio, and resume (for students); lab name, affiliation, description, and research areas (for researchers).</li>
              <li><strong>Usage data:</strong> Pages visited, features used, and interactions with the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create and manage your account.</li>
              <li>Display your profile to relevant users (e.g., researchers can see student profiles when reviewing applications).</li>
              <li>Facilitate the application process between students and researchers.</li>
              <li>Send notifications about application updates and platform changes.</li>
              <li>Improve and develop the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase, which provides enterprise-grade security
              including encryption at rest and in transit. Passwords are hashed and never stored in
              plain text. We implement row-level security policies to ensure users can only access
              data they are authorized to see.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Data Sharing</h2>
            <p>
              We do not sell or rent your personal information to third parties. Your profile
              information is shared only with other authenticated users of the Platform as necessary
              to facilitate research connections (e.g., your application is shared with the
              researcher you applied to).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access and download your personal data.</li>
              <li>Update or correct your information at any time via your profile page.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Opt out of non-essential communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Cookies</h2>
            <p>
              We use essential cookies to maintain your authentication session. We do not use
              third-party tracking cookies or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Children&apos;s Privacy</h2>
            <p>
              The Platform is designed for high school students, some of whom may be under 18. We
              collect only the minimum information necessary to operate the Platform. We encourage
              parents and guardians to be aware of their children&apos;s use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify users of
              significant changes via email or platform notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{" "}
              <a href="mailto:contact@researchconnect.org" className="text-primary hover:underline">
                contact@researchconnect.org
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
