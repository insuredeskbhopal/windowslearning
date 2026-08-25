"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./BecomeMentorBanner.module.css";

export default function BecomeMentorBanner() {
  const router = useRouter();
  const { user, requireAuth } = useAuth();

  const handleStartTeaching = () => {
    if (user?.roles?.includes("MENTOR") && user?.mentorOnboardingComplete) {
      router.push("/mentor/dashboard");
      return;
    }

    const isAuthed = requireAuth({
      redirect: "/onboarding/mentor",
      intent: "mentor",
    });

    if (isAuthed) {
      router.push("/onboarding/mentor");
    }
  };

  return (
    <section className={styles.becomeMentorSection} id="become-mentor">
      <div className={styles.bannerCard}>
        <div>
          <div className={styles.badge}>
            <Sparkles size={14} />
            <span>Teach & Earn</span>
          </div>

          <h2 className={styles.title}>
            Know Cooking, Tailoring, Maths or <span className={styles.titleHighlight}>Any Special Skill?</span>
          </h2>

          <p className={styles.description}>
            Everyone has a skill they know well. Become a mentor on Windows Learning, teach eager learners from your home, set your own fees per hour, and earn respect and extra income.
          </p>

          <div className={styles.perksGrid}>
            <div className={styles.perkItem}>
              <CheckCircle2 size={18} />
              <span>Set your own price (e.g. ₹150, ₹250, ₹500/hr) or offer free classes</span>
            </div>
            <div className={styles.perkItem}>
              <CheckCircle2 size={18} />
              <span>Teach in your free time (morning, evening, or weekends)</span>
            </div>
            <div className={styles.perkItem}>
              <CheckCircle2 size={18} />
              <span>Direct connection with learners who genuinely want to learn from you</span>
            </div>
          </div>
        </div>

        <div className={styles.actionBox}>
          <h3 className={styles.actionBoxTitle}>Register as a Mentor in 2 Minutes</h3>
          <p className={styles.actionBoxSubtitle}>
            Tell us what skill you teach (cooking, sewing, maths, biology, computer, English, etc.). Complete your profile to start receiving bookings.
          </p>

          <button
            type="button"
            className={styles.applyBtn}
            onClick={handleStartTeaching}
          >
            <span>Become a Mentor & Start Teaching</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
