"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Plus,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function LearnerDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetchingBookings, setFetchingBookings] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/learner/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setFetchingBookings(false);
      }
    }
    if (user) {
      loadBookings();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading Learner Hub...
      </div>
    );
  }

  const isMentor = user.roles.includes("MENTOR");

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
        ctaLabel="FIND MENTOR"
        ctaHref="/mentors"
      />

      <main className={styles.container}>
        {/* Welcome Header */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.welcomeTitle}>
              Welcome back, <span>{user.name}</span>!
            </h1>
            <p className={styles.welcomeSubtitle}>
              Here is your personal learning overview, upcoming mentor sessions, and suggested tracks.
            </p>
          </div>

          <div>
            {isMentor ? (
              <Link href="/mentor/dashboard" className={styles.roleSwitcherBtn}>
                <span>Switch to Mentor Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link href="/onboarding/mentor" className={styles.roleSwitcherBtn}>
                <Sparkles size={14} />
                <span>Become a Mentor & Earn</span>
              </Link>
            )}
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className={styles.grid}>
          {/* Left Column: Booked 1-on-1 Lessons */}
          <div>
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Calendar size={20} color="#34d399" />
                  <span>My 1-on-1 Lesson Bookings</span>
                </div>
                <Link href="/mentors" style={{ fontSize: "0.82rem", color: "#34d399", textDecoration: "none" }}>
                  + Book Another Mentor
                </Link>
              </div>

              {fetchingBookings ? (
                <div style={{ color: "rgba(226, 237, 231, 0.6)", padding: "1.5rem 0", fontSize: "0.9rem" }}>
                  Loading your scheduled lessons...
                </div>
              ) : bookings.length > 0 ? (
                <div>
                  {bookings.map((b) => (
                    <div key={b.id} className={styles.bookingItem}>
                      <div className={styles.bookingLeft}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                          <Users size={20} />
                        </div>
                        <div>
                          <div className={styles.bookingInfoTitle}>
                            {b.topic || "Practical Guidance Lesson"}
                          </div>
                          <div className={styles.bookingInfoMeta}>
                            <span>With {b.mentorName || "Mentor"}</span>
                            <span>•</span>
                            <Clock size={12} />
                            <span>{new Date(b.scheduledDate).toLocaleDateString()} at {b.timeSlot}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.statusPill}>{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "2rem 1rem", background: "rgba(4, 13, 9, 0.5)", borderRadius: "14px" }}>
                  <Calendar size={36} color="#34d399" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                  <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem" }}>
                    No Scheduled Lessons Yet
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "rgba(226, 237, 231, 0.65)", marginBottom: "1.25rem" }}>
                    Connect with experienced home chefs, tailors, maths teachers, or doctors for 1-on-1 guidance.
                  </p>
                  <Link href="/mentors" className={styles.actionButton}>
                    <span>Find a Friendly Mentor</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quick Recommended Actions */}
          <div>
            <div className={styles.sectionCard}>
              <div className={styles.sectionTitle}>
                <span>Explore Popular Skills</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { name: "🍳 Home Cooking & Recipes", link: "/skills?track=home-cooking-recipes" },
                  { name: "✂️ Tailoring & Blouse Cutting", link: "/skills?track=tailoring-dress-making" },
                  { name: "📐 Vedic Maths & Speed Math", link: "/skills?track=vedic-maths-fast-calculation" },
                  { name: "🗣️ Spoken English & Fluency", link: "/skills?track=spoken-english-confidence" },
                  { name: "💻 Computer Basics & MS Excel", link: "/skills?track=computer-basics-ms-excel" },
                ].map((s, idx) => (
                  <Link
                    key={idx}
                    href={s.link}
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
                    <span>{s.name}</span>
                    <ArrowRight size={12} color="#34d399" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
