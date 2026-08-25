"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, ArrowRight, Users, Sparkles } from "lucide-react";
import { DbMentor } from "@/lib/db";
import styles from "./MentorSection.module.css";

export default function MentorSection() {
  const [mentors, setMentors] = useState<DbMentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMentors() {
      try {
        const res = await fetch("/api/mentors");
        const data = await res.json();
        if (data.success && Array.isArray(data.mentors)) {
          setMentors(data.mentors.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load mentors:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMentors();
  }, []);

  return (
    <section className={styles.mentorSection} id="mentor">
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>1-on-1 Friendly Mentors</span>
          </div>

          <h2 className={styles.title}>
            Learn Directly from <span className={styles.titleHighlight}>Passionate Teachers</span>
          </h2>

          <p className={styles.subtitle}>
            Connect with experienced home chefs, master tailors, school teachers, biology mentors, and computer guides ready to teach you 1-on-1 with patience.
          </p>
        </div>

        {/* Mentors Grid */}
        {loading ? (
          <div style={{ color: "#34d399", padding: "2rem", fontFamily: "var(--font-mono)" }}>
            Loading friendly mentors...
          </div>
        ) : (
          <div className={styles.grid}>
            {mentors.map((mentor) => (
              <div key={mentor.id} className={styles.mentorCard}>
                <div className={styles.cardGlow} />

                <div>
                  <div className={styles.cardTop}>
                    <div className={styles.avatarWrapper}>
                      <Image
                        src={mentor.avatar}
                        alt={mentor.name}
                        width={62}
                        height={62}
                        className={styles.avatarImg}
                        unoptimized
                      />
                      {mentor.availability === "Available Today" && (
                        <div className={styles.onlineDot} title="Online Today" />
                      )}
                    </div>

                    <div className={styles.mentorInfo}>
                      <div className={styles.mentorName}>
                        <span>{mentor.name}</span>
                        <ShieldCheck size={16} color="#34d399" />
                      </div>
                      <div className={styles.mentorRole}>{mentor.role}</div>
                      <div className={styles.mentorCompany}>{mentor.company}</div>
                    </div>
                  </div>

                  <p className={styles.bio}>{mentor.bio}</p>

                  <div className={styles.chipsRow}>
                    {Array.isArray(mentor.skillsLabels) &&
                      mentor.skillsLabels.slice(0, 3).map((skill: string) => (
                        <span key={skill} className={styles.chip}>
                          #{skill}
                        </span>
                      ))}
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.ratingRow}>
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span style={{ color: "#ffffff", fontWeight: 700 }}>{mentor.rating}</span>
                    <span>({mentor.studentsMentored} Learners)</span>
                  </div>

                  <Link
                    href={`/mentors?skill=${mentor.skills[0] || "all"}`}
                    className={styles.bookBtn}
                  >
                    <span>{mentor.isFreeCommunity ? "Free Session" : `Book (₹${mentor.hourlyRate}/hr)`}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Explore All Mentors CTA */}
        <div className={styles.exploreRow}>
          <Link href="/mentors" className={styles.exploreBtn}>
            <Users size={18} />
            <span>Browse All Mentors & Teachers</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
