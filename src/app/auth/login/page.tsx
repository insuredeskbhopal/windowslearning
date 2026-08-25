"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const intent = searchParams.get("intent") || "";
  const action = searchParams.get("action") || "";
  const mentorId = searchParams.get("mentorId") || "";

  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePostAuthRedirect = (user: any) => {
    // If returning from booking a mentor, redirect back to mentor page with action=book preserved
    if (action === "book" && mentorId) {
      router.push(`/mentors?mentorId=${encodeURIComponent(mentorId)}&action=book`);
      return;
    }

    // If the user arrived with 'intent=mentor' and hasn't completed mentor onboarding
    if (intent === "mentor" && !user.mentorOnboardingComplete) {
      router.push(`/onboarding/mentor?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    // If user is brand new and has not completed any onboarding
    if (!user.learnerOnboardingComplete && !user.mentorOnboardingComplete) {
      if (intent === "learner") {
        router.push(`/onboarding/learner?redirect=${encodeURIComponent(redirect)}`);
      } else {
        router.push(`/onboarding/role-select?redirect=${encodeURIComponent(redirect)}`);
      }
      return;
    }

    // Existing user -> Return to intended action/page or dashboard
    if (redirect && redirect !== "/" && !redirect.startsWith("/auth")) {
      router.push(redirect);
    } else {
      router.push(user.roles?.includes("MENTOR") ? "/mentor/dashboard" : "/learner/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      handlePostAuthRedirect(meData.user || {});
    } else {
      setError(res.message || "Invalid email or password. Please check and try again.");
    }
  };

  const handleGoogleAuth = async () => {
    const enteredEmail = window.prompt("Enter your Google Account Email:", email || "user@gmail.com");
    if (!enteredEmail) return;

    setError("");
    setLoading(true);

    const res = await loginWithGoogle(intent || undefined, enteredEmail);
    setLoading(false);

    if (res.success) {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      handlePostAuthRedirect(meData.user || {});
    } else {
      setError(res.message || "Google authentication failed.");
    }
  };

  const autofillDemoAccount = () => {
    setEmail("learner@windowslearning.com");
    setPassword("password123");
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.ambientGlow} />

      <Navbar
        brandName="windowslearning"
        items={[
          { label: "SKILL", href: "/skills" },
          { label: "MENTOR", href: "/mentors" },
          { label: "COMMUNITY", href: "/#community" },
        ]}
        ctaLabel="GET STARTED"
        ctaHref="/auth/signup"
      />

      <div className={styles.authCard}>
        <div className={styles.cardHeader}>
          <div className={styles.brandTitle}>
            windows<span>learning</span>
          </div>
          <h1 className={styles.title}>Sign In with Real Account</h1>
          <p className={styles.subtitle}>
            Connected directly to PostgreSQL database. Enter your credentials to access your account.
          </p>
        </div>

        {intent === "mentor" && (
          <div className={styles.noticeBanner}>
            <Sparkles size={16} />
            <span>Mentor Portal • Sign In to Manage Your Profile</span>
          </div>
        )}

        {action === "book" && (
          <div className={styles.noticeBanner}>
            <Sparkles size={16} />
            <span>Sign in to confirm your 1-on-1 mentor booking</span>
          </div>
        )}

        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Real Seed Account Quick Helper */}
        <div
          onClick={autofillDemoAccount}
          style={{
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px dashed rgba(52, 211, 153, 0.35)",
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          title="Click to autofill real seeded database user"
        >
          <div style={{ fontSize: "0.8rem", color: "rgba(226, 237, 231, 0.85)" }}>
            <div style={{ fontWeight: 700, color: "#34d399", marginBottom: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
              <ShieldCheck size={14} /> Real DB Test Account (Click to Autofill):
            </div>
            <div>learner@windowslearning.com • password123</div>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
            AUTOFILL
          </span>
        </div>

        {/* Google Authentication with Real DB sync */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className={styles.googleBtn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className={styles.divider}>or with email & password</div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className={styles.label}>Password</label>
            </div>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying with Database...</span>
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className={styles.cardFooter}>
          Don&apos;t have an account yet?{" "}
          <Link
            href={`/auth/signup?redirect=${encodeURIComponent(redirect)}&intent=${intent}&action=${action}&mentorId=${mentorId}`}
            className={styles.footerLink}
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading Login...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
