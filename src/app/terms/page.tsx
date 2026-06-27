import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: June 27, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Research Connect ("the Platform"), you agree to be bound by these
              Terms of Service. If you do not agree, do not use the Platform. Research Connect is
              operated by the Guilderland Research Club.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Eligibility</h2>
            <p>
              The Platform is intended for high school students seeking research opportunities and
              for researchers, labs, and organizations offering such opportunities. Users under 18
              should have parental or guardian consent before creating an account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and
              for all activity under your account. You agree to provide accurate and complete
              information during registration and to keep your profile information up to date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide false or misleading information in your profile or applications.</li>
              <li>Use the Platform for any unlawful purpose.</li>
              <li>Harass, threaten, or discriminate against other users.</li>
              <li>Attempt to gain unauthorized access to the Platform or its systems.</li>
              <li>Scrape, copy, or redistribute content from the Platform without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Researcher Verification</h2>
            <p>
              All researcher and lab accounts are subject to an admin verification process before
              they can post positions. Research Connect reserves the right to reject or revoke
              verification at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Content</h2>
            <p>
              You retain ownership of any content you submit to the Platform (profiles, resumes,
              applications). By submitting content, you grant Research Connect a non-exclusive,
              royalty-free license to use, display, and distribute your content solely for the
              purpose of operating the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Disclaimer</h2>
            <p>
              Research Connect acts as a platform connecting students and researchers. We do not
              guarantee the quality, safety, or legality of any research position, nor the
              qualifications of any user. Use the Platform at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Research Connect and its affiliates shall not
              be liable for any indirect, incidental, or consequential damages arising from the use
              of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Platform after
              changes constitutes acceptance of the updated Terms. We will notify users of
              significant changes via email or platform notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
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
