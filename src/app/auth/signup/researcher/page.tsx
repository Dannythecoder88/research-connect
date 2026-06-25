"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Building2,
  Globe,
  Microscope,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageTransition } from "@/components/motion";
import { createClient } from "@/lib/supabase/client";

export default function ResearcherSignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Step 1 fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 fields
  const [labName, setLabName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/researcher`,
        data: {
          role: "researcher",
          full_name: name,
          lab_name: labName,
          affiliation,
          website,
          description,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10 mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-muted-foreground mb-4">
            We sent a verification link to <span className="font-medium text-foreground">{email}</span>.
            Click the link to activate your account.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            After verifying, your lab account will be reviewed by an admin before you can post positions.
          </p>
          <p className="text-sm text-muted-foreground">
            Already verified?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <PageTransition className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FlaskConical className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Research Connect</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-emerald/10 text-emerald text-xs font-medium">
            <Microscope className="h-3.5 w-3.5" />
            Researcher / Lab Account
          </div>

          <h1 className="text-2xl font-bold mb-2">Register your lab</h1>
          <p className="text-muted-foreground mb-8">
            Create an account to post research positions and find talented students.
          </p>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-colors ${
                    s <= step ? "bg-emerald" : "bg-muted"
                  }`}
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Dr. Jane Smith"
                      className="pl-9"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Institutional Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="jsmith@university.edu"
                      className="pl-9"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-9 pr-10"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-emerald hover:bg-emerald-light text-white">
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="labName">Lab / Organization Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="labName"
                      placeholder="e.g., RPI Artificial Intelligence Lab"
                      className="pl-9"
                      required
                      value={labName}
                      onChange={(e) => setLabName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation">Affiliation</Label>
                  <Input
                    id="affiliation"
                    placeholder="e.g., Rensselaer Polytechnic Institute"
                    required
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://lab.university.edu"
                      className="pl-9"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Lab Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe your lab's research focus and mission..."
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-11"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-emerald hover:bg-emerald-light text-white"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register Lab"}
                    {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-2">
                  Your account will be reviewed by an admin before you can post positions.
                </p>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </PageTransition>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-emerald/5 to-teal/5 border-l border-border">
        <div className="max-w-md p-8 space-y-6">
          <h2 className="text-2xl font-bold">Find your next research assistant</h2>
          <p className="text-muted-foreground leading-relaxed">
            Connect with ambitious high school students in the Capital Region who are eager to
            contribute to real research. Our platform handles the matching so you can focus on
            mentoring.
          </p>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-2">VERIFICATION PROCESS</p>
            <div className="space-y-2">
              {["Submit registration", "Verify your email", "Admin reviews credentials", "Start posting positions"].map((item, i) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald/10 text-emerald flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
