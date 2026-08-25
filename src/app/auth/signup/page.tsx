"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import styles from "../login/page.module.css";

declare global {
  interface Window {
    google?: any;
  }
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const intent = searchParams.get("intent") || "";
  const action = searchParams.get("action") || "";
  const mentorId = searchParams.get("mentorId") || "";

  const { signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePostAuthRedirect = (user: any) => {
    if (action === "book" && mentorId) {
      router.push(`/mentors?mentorId=${encodeURIComponent(mentorId)}&action=book`);
      return;
    }

    if (intent === "mentor") {
      router.push(`/onboarding/mentor?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    if (intent === "learner") {
      router.push(`/onboarding/learner?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    router.push(`/onboarding/role-select?redirect=${encodeURIComponent(redirect)}`);
  };

  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response?.credential) return;
    setError("");
    setLoading(true);
    const res = await loginWithGoogle(intent || undefined, undefined, response.credential);
    setLoading(false);

    if (res.success) {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      handlePostAuthRedirect(meData.user || {});
    } else {
      setError(res.message || "Google authentication failed.");
    }
  };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (typeof window !== "undefined" && window.google && clientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
      } catch (err) {
        console.warn("Google GIS init in signup:", err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and retype.");
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password, intent || undefined);
    setLoading(false);

    if (res.success) {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      handlePostAuthRedirect(meData.user || {});
    } else {
      setError(res.message || "Registration failed.");
    }
  };

  const handleGoogleAuth = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (typeof window !== "undefined" && window.google?.accounts?.id && clientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.prompt();
        return;
      } catch (err) {
        console.warn("Google Prompt failed in signup, falling back to prompt:", err);
      }
    }

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
      setError(res.message || "Google registration failed.");
    }
  };

  return (
    <div className={styles.authPage}>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
          if (window.google && clientId) {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleCredentialResponse,
            });
          }
        }}
      />
      <div className={styles.ambientGlow} />

      <Navbar
        brandName="windowslearning"
        items={[
          { label: "SKILL", href: "/skills" },
          { label: "MENTOR", href: "/mentors" },
          { label: "COMMUNITY", href: "/#community" },
        ]}
        ctaLabel="GET STARTED"
        ctaHref="/auth/login"
      />

      <div className={styles.authCard}>
        <div className={styles.cardHeader}>
          <div className={styles.brandTitle}>
            windows<span>learning</span>
          </div>
          <h1 className={styles.title}>Create Real Account</h1>
          <p className={styles.subtitle}>
            Join thousands of learners and mentors sharing practical skills.
          </p>
        </div>

        {intent === "mentor" && (
          <div className={styles.noticeBanner}>
            <Sparkles size={16} />
            <span>Registering as a Mentor (Direct Onboarding)</span>
          </div>
        )}

        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

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
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputWrapper}>
              <User size={16} className={styles.inputIcon} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunita Devi"
                required
                className={styles.input}
              />
            </div>
          </div>

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
            <label className={styles.label}>Password (min 6 chars)</label>
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

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Creating Real Account in DB...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className={styles.cardFooter}>
          Already have an account?{" "}
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(redirect)}&intent=${intent}&action=${action}&mentorId=${mentorId}`}
            className={styles.footerLink}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading Signup...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
