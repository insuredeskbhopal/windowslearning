"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Search,
  Plus,
  Send,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { PLATFORM_CONFIG } from "@/lib/config";
import styles from "./page.module.css";

export default function ExploreGigsPage() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadGigs() {
      try {
        setLoading(true);
        const res = await fetch("/api/gigs?status=OPEN");
        const data = await res.json();
        if (data.success) {
          setGigs(data.gigs || []);
        }
      } catch (err) {
        console.error("Failed to load gigs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGigs();
  }, []);

  const filteredGigs = gigs.filter((g) => {
    return (
      !searchQuery.trim() ||
      g.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.skillSlug?.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.badgePill}>
            <Sparkles size={14} color="#34d399" />
            <span>Learner-Initiated Mentorship Requests</span>
          </div>

          <h1 className={styles.pageTitle}>
            Learning <span>Gigs & Requests</span>
          </h1>

          <p className={styles.pageSubtitle}>
            Learners post what they want to learn with their budget. Mentors discover requests and apply with tailored 1:1 proposals.
          </p>

          <div className={styles.heroActionRow}>
            <Link href="/learner/dashboard" className={styles.primaryPostBtn}>
              <Plus size={16} />
              <span>Post a Learning Gig</span>
            </Link>

            <Link href="/mentor/dashboard" className={styles.secondaryBtn}>
              <Target size={16} />
              <span>Mentor Gig Studio</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className={styles.searchBox}>
          <Search size={18} color="rgba(226, 237, 231, 0.5)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learning gigs by topic, skill, or keywords..."
            className={styles.searchInput}
          />
        </div>

        {/* Gigs Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#34d399" }}>
            Loading Learning Gigs...
          </div>
        ) : filteredGigs.length === 0 ? (
          <div className={styles.emptyState}>
            <Target size={48} color="rgba(52, 211, 153, 0.4)" style={{ margin: "0 auto 1rem auto", display: "block" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem" }}>
              No open learning requests found
            </h3>
            <p style={{ fontSize: "0.88rem", color: "rgba(226, 237, 231, 0.65)", marginBottom: "1.5rem" }}>
              Be the first to post what you need help learning!
            </p>
            <Link href="/learner/dashboard" className={styles.primaryPostBtn}>
              <Plus size={16} />
              <span>Post a Learning Gig</span>
            </Link>
          </div>
        ) : (
          <div className={styles.gigsGrid}>
            {filteredGigs.map((gig) => (
              <div key={gig.id} className={styles.gigCard}>
                <div>
                  <div className={styles.cardTopRow}>
                    <div className={styles.learnerInfo}>
                      <div className={styles.learnerAvatar}>
                        {(gig.learnerName || "S")[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#ffffff" }}>
                          {gig.learnerName || "Learner"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "rgba(226, 237, 231, 0.6)" }}>
                          {new Date(gig.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className={styles.budgetPill}>₹{gig.budget}/hr</div>
                  </div>

                  <h3 className={styles.gigTitle}>{gig.title}</h3>

                  <div className={styles.chipsRow}>
                    <span className={styles.chip}>#{gig.skillSlug}</span>
                    <span className={styles.chip}>{gig.level}</span>
                    <span className={styles.chip}>{gig.preferredTime}</span>
                    <span className={styles.chip}>{gig.durationMinutes} mins</span>
                  </div>

                  <p className={styles.gigDesc}>{gig.description}</p>
                </div>

                <div className={styles.cardFooter}>
                  <Link
                    href="/mentor/dashboard"
                    className={styles.applyBtn}
                  >
                    <Send size={14} />
                    <span>Apply as Mentor</span>
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
