"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  DollarSign,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import styles from "@/app/learner/dashboard/page.module.css";

export default function MentorDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/mentor/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading Mentor Studio...
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.ambientGlow} />

      <Navbar
        brandName="windowslearning"
        items={[
          { label: "SKILL", href: "/skills" },
          { label: "MENTOR", href: "/mentors" },
          { label: "COMMUNITY", href: "/#community" },
        ]}
        ctaLabel="BROWSE MENTORS"
        ctaHref="/mentors"
      />

      <main className={styles.container}>
        {/* Welcome Header */}
        <div className={styles.headerRow}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1 className={styles.welcomeTitle}>
                Mentor Studio: <span>{user.name}</span>
              </h1>
              <ShieldCheck size={24} color="#34d399" />
            </div>
            <p className={styles.welcomeSubtitle}>
              Manage your teaching schedule, incoming learner requests, and hourly rate.
            </p>
          </div>

          <div>
            <Link href="/learner/dashboard" className={styles.roleSwitcherBtn}>
              <span>Switch to Learner Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
          <div style={{ background: "rgba(12, 29, 21, 0.8)", border: "1px solid rgba(52, 211, 153, 0.25)", borderRadius: "16px", padding: "1.5rem" }}>
            <div style={{ fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.65)", fontFamily: "var(--font-mono)", marginBottom: "0.4rem" }}>
              PROFILE STATUS
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#34d399", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CheckCircle2 size={20} />
              <span>Verified & Active</span>
            </div>
          </div>

          <div style={{ background: "rgba(12, 29, 21, 0.8)", border: "1px solid rgba(52, 211, 153, 0.25)", borderRadius: "16px", padding: "1.5rem" }}>
            <div style={{ fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.65)", fontFamily: "var(--font-mono)", marginBottom: "0.4rem" }}>
              TEACHING FEE
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff" }}>
              ₹250 / hour
            </div>
          </div>

          <div style={{ background: "rgba(12, 29, 21, 0.8)", border: "1px solid rgba(52, 211, 153, 0.25)", borderRadius: "16px", padding: "1.5rem" }}>
            <div style={{ fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.65)", fontFamily: "var(--font-mono)", marginBottom: "0.4rem" }}>
              TOTAL LEARNERS
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fbbf24" }}>
              12 Taught (5.0 ★)
            </div>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className={styles.grid}>
          <div>
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Calendar size={20} color="#34d399" />
                  <span>Incoming Learner Session Requests</span>
                </div>
              </div>

              <div style={{ textAlign: "center", padding: "2.5rem 1rem", background: "rgba(4, 13, 9, 0.5)", borderRadius: "14px" }}>
                <CheckCircle2 size={36} color="#34d399" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem" }}>
                  Your Profile is Live on the Mentor Directory
                </div>
                <p style={{ fontSize: "0.88rem", color: "rgba(226, 237, 231, 0.65)", marginBottom: "1.25rem", maxWidth: "420px", margin: "0 auto 1.25rem auto" }}>
                  Learners browsing the directory can now book 1-on-1 sessions with you. You will receive WhatsApp and email alerts when someone books.
                </p>
                <Link href="/mentors" className={styles.actionButton}>
                  <span>View Your Public Profile in Directory</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitle}>
                <span>Mentor Quick Actions</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link
                  href="/onboarding/mentor"
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    color: "rgba(226, 237, 231, 0.9)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>✏️ Edit Profile & Rates</span>
                  <ArrowRight size={12} color="#34d399" />
                </Link>

                <Link
                  href="/#community"
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    color: "rgba(226, 237, 231, 0.9)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>💬 Answer Questions in Q&A</span>
                  <ArrowRight size={12} color="#34d399" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
