"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const intent = searchParams.get("intent") || "";
  const action = searchParams.get("action") || "";

  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePostAuthRedirect = (user: any) => {
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

    // Existing user -> Return to intended action/page
    router.push(redirect);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      // Fetch fresh session state and redirect
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      handlePostAuthRedirect(meData.user || {});
    } else {
      setError(res.message || "Invalid credentials.");
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);

    const res = await loginWithGoogle(intent || undefined);
    setLoading(false);

    if (res.success) {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      handlePostAuthRedirect(meData.user || {});
    } else {
      setError(res.message || "Google authentication failed.");
    }
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
        ctaLabel="BROWSE SKILLS"
        ctaHref="/skills"
      />

      <div className={styles.authCard}>
        <div className={styles.cardHeader}>
          <div className={styles.brandTitle}>
            windows<span>learning</span>
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Sign in to continue learning, connect with mentors, or manage your classes.
          </p>
        </div>

        {intent === "mentor" && (
          <div className={styles.noticeBanner}>
            <Sparkles size={16} />
            <span>Sign in to complete your Mentor Registration</span>
          </div>
        )}

        {action === "book" && (
          <div className={styles.noticeBanner}>
            <Sparkles size={16} />
            <span>Sign in to complete your 1-on-1 Lesson Booking</span>
          </div>
        )}

        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Google Authentication */}
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

        <div className={styles.divider}>or with email</div>

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
            <label className={styles.label}>Password</label>
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
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className={styles.cardFooter}>
          Don&apos;t have an account?{" "}
          <Link
            href={`/auth/signup?redirect=${encodeURIComponent(redirect)}&intent=${intent}&action=${action}`}
            className={styles.footerLink}
          >
            Create Account
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
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
