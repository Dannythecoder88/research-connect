import Link from "next/link";
import { FlaskConical, ExternalLink, Mail } from "lucide-react";

const footerLinks = {
  platform: [
    { href: "/opportunities", label: "Explore Opportunities" },
    { href: "/resources", label: "Resources" },
    { href: "/auth/signup/student", label: "Student Sign Up" },
    { href: "/auth/signup/researcher", label: "Researcher Sign Up" },
  ],
  resources: [
    { href: "/resources#cold-email", label: "Cold Email Templates" },
    { href: "/resources#interview-prep", label: "Interview Preparation" },
    { href: "/resources#research-etiquette", label: "Research Etiquette" },
    { href: "/resources#finding-interests", label: "Finding Your Interests" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "mailto:daniel.joseph@guilderlandschools.net", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FlaskConical className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight tracking-tight">
                  CoLab
                </span>
                <span className="text-[10px] leading-none text-muted-foreground">
                  Guilderland Research Club
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Bridging the gap between high school students and breakthrough
              research opportunities. Originated from the Guilderland Research
              Club Research Expo.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border py-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CoLab. Built by the
            Guilderland Research Club.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="mailto:daniel.joseph@guilderlandschools.net"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
