"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Menu,
  Sun,
  Moon,
  FlaskConical,
  LogIn,
  LogOut,
  GraduationCap,
  Microscope,
  LayoutDashboard,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const publicLinks = [
  { href: "/opportunities", label: "Explore" },
  { href: "/resources", label: "Resources" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const role = user?.user_metadata?.role;
  const dashboardHref =
    role === "researcher" ? "/dashboard/researcher" :
    role === "admin" ? "/dashboard/admin" :
    "/dashboard/student";
  const profileHref =
    role === "researcher" ? "/profile/researcher" : "/profile/student";

  const authedLinks = [
    ...publicLinks,
    { href: dashboardHref, label: "Dashboard" },
    { href: profileHref, label: "Profile" },
  ];

  const navLinks = user ? authedLinks : publicLinks;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 glass"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight">
              Research Connect
            </span>
            <span className="text-[10px] leading-none text-muted-foreground hidden sm:block">
              Guilderland Research Club
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-primary/5 rounded-md -z-10"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {!loading && !user && (
            <>
              <div className="flex items-center gap-1.5">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/signup/student" className="gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    Student
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/signup/researcher" className="gap-1.5">
                    <Microscope className="h-4 w-4" />
                    Researcher
                  </Link>
                </Button>
              </div>

              <Button asChild size="sm">
                <Link href="/auth/login" className="gap-1.5">
                  <LogIn className="h-4 w-4" />
                  Log In
                </Link>
              </Button>
            </>
          )}

          {!loading && user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-lg h-9 w-9 text-sm font-medium transition-all hover:bg-muted hover:text-foreground">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <Separator className="my-3" />

                {!loading && !user && (
                  <>
                    <Link
                      href="/auth/signup/student"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Sign Up as Student
                    </Link>
                    <Link
                      href="/auth/signup/researcher"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Microscope className="h-4 w-4" />
                      Sign Up as Researcher
                    </Link>

                    <div className="px-4 pt-3">
                      <Button asChild className="w-full" size="sm">
                        <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                          <LogIn className="h-4 w-4 mr-2" />
                          Log In
                        </Link>
                      </Button>
                    </div>
                  </>
                )}

                {!loading && user && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
