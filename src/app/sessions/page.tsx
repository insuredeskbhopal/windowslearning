"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
  Check,
  Video,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";

export default function ExploreSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        const res = await fetch("/api/sessions");
        const data = await res.json();
        if (data.success) {
          setSessions(data.sessions || []);
        }
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      !searchQuery.trim() ||
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mentorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.skillSlug?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      selectedLevel === "all" ||
      s.level?.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesLevel;
  });

  return (
    <div className={styles.pageRoot}>
      <div className={styles.ambientGlow} />

      <Navbar
        brandName="windowslearning"
        items={[
          { label: "EXPLORE SESSIONS", href: "/sessions" },
          { label: "LEARNING GIGS", href: "/gigs" },
          { label: "FIND MENTORS", href: "/mentors" },
        ]}
        ctaLabel="FIND MENTORS"
        ctaHref="/mentors"
      />

      <main className={styles.mainContainer}>
        {/* Header Hero */}
        <div className={styles.heroSection}>
          <div className={styles.badgePill}>
            <Sparkles size={14} color="#34d399" />
            <span>Mentor-Created 1:1 Offerings</span>
          </div>

          <h1 className={styles.pageTitle}>
            Explore Structured <span>1-on-1 Sessions</span>
          </h1>

          <p className={styles.pageSubtitle}>
            Browse concrete teaching offerings created by expert mentors. Book dedicated 1:1 time with step-by-step guidance and hands-on practice.
          </p>

          {/* Search & Filter Bar */}
          <div className={styles.searchFilterRow}>
            <div className={styles.searchBox}>
              <Search size={18} color="rgba(226, 237, 231, 0.5)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, skill, or mentor..."
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <Filter size={16} color="#34d399" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className={styles.selectFilter}
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions Catalog */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#34d399" }}>
            Loading Teaching Sessions...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className={styles.emptyState}>
            <BookOpen size={48} color="rgba(52, 211, 153, 0.4)" style={{ margin: "0 auto 1rem auto", display: "block" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem" }}>
              No matching sessions found
            </h3>
            <p style={{ fontSize: "0.88rem", color: "rgba(226, 237, 231, 0.65)", marginBottom: "1.5rem" }}>
              Try adjusting your search terms, or post a custom Learning Gig request to get mentors to come to you!
            </p>
            <Link href="/gigs" className={styles.primaryCtaBtn}>
              <span>Post a Learning Gig Request</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className={styles.sessionsGrid}>
            {filteredSessions.map((session) => (
              <div key={session.id} className={styles.sessionCard}>
                <div>
                  <div className={styles.cardHeader}>
                    <div>
                      <div className={styles.mentorNameRow}>
                        <span style={{ fontWeight: 700, color: "#ffffff" }}>
                          {session.mentorName || "Verified Mentor"}
                        </span>
                        <ShieldCheck size={14} color="#34d399" />
                      </div>
                      <div className={styles.mentorTitle}>
                        {session.mentorTitle || "Practical Specialist"}
                      </div>
                    </div>

                    <div className={styles.pricePill}>₹{session.price}</div>
                  </div>

                  <h3 className={styles.sessionCardTitle}>{session.title}</h3>

                  <div className={styles.chipsRow}>
                    <span className={styles.chip}>#{session.skillSlug}</span>
                    <span className={styles.chip}>{session.level}</span>
                    <span className={styles.chip}>{session.durationMinutes} mins</span>
                    <span className={styles.chip}>1:1 Live Online</span>
                  </div>

                  <p className={styles.sessionDesc}>{session.description}</p>

                  {session.learningOutcomes && session.learningOutcomes.length > 0 && (
                    <div style={{ marginTop: "1rem" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.4rem" }}>
                        What You Will Master:
                      </div>
                      <ul className={styles.outcomesList}>
                        {session.learningOutcomes.map((item: string, idx: number) => (
                          <li key={idx} className={styles.outcomeItem}>
                            <Check size={12} color="#34d399" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <Link
                    href={`/mentors/${session.mentorSlug || "mentor"}`}
                    className={styles.bookBtn}
                  >
                    <Calendar size={15} />
                    <span>Book 1-on-1 Session</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
