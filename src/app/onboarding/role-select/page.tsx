"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Users, CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.css";

function RoleSelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSelectRole = (role: "learner" | "mentor") => {
    if (role === "learner") {
      router.push(`/onboarding/learner?redirect=${encodeURIComponent(redirect)}`);
    } else {
      router.push(`/onboarding/mentor?redirect=${encodeURIComponent(redirect)}`);
    }
  };

  return (
    <div className={styles.rolePage}>
      <div className={styles.ambientGlow} />

      <Navbar
        brandName="windowslearning"
        items={[
          { label: "SKILL", href: "/skills" },
          { label: "MENTOR", href: "/mentors" },
        ]}
        ctaLabel="BROWSE SKILLS"
        ctaHref="/skills"
      />

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Welcome to Windows Learning</span>
          </div>

          <h1 className={styles.title}>
            What do you want to <span className={styles.titleHighlight}>do first?</span>
          </h1>

          <p className={styles.subtitle}>
            Choose your primary path. You can always learn and teach at the same time later!
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {/* Card 1: Learner */}
          <div className={styles.roleCard} onClick={() => handleSelectRole("learner")}>
            <div>
              <div className={styles.iconBox}>🎓</div>
              <h2 className={styles.roleTitle}>I want to Learn</h2>
              <p className={styles.roleDescription}>
                Find friendly mentors, learn cooking, tailoring, maths, biology, English or computers 1-on-1, and build practical life skills.
              </p>

              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <CheckCircle2 size={16} />
                  <span>Book live 1-on-1 personalized lessons</span>
                </div>
                <div className={styles.featureItem}>
                  <CheckCircle2 size={16} />
                  <span>Ask doubts freely in community forums</span>
                </div>
                <div className={styles.featureItem}>
                  <CheckCircle2 size={16} />
                  <span>Learn at your own pace from home</span>
                </div>
              </div>
            </div>

            <button type="button" className={styles.cardActionBtn}>
              <span>Continue as Learner</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: Mentor */}
          <div className={styles.roleCard} onClick={() => handleSelectRole("mentor")}>
            <div>
              <div className={styles.iconBox}>🧑‍🏫</div>
              <h2 className={styles.roleTitle}>I want to Teach & Mentor</h2>
              <p className={styles.roleDescription}>
                Share any skill you know well, teach eager learners from home, set your own hourly fees (or teach free), and earn respect and income.
              </p>

              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <CheckCircle2 size={16} />
                  <span>Set your own price (e.g. ₹200–₹500/hr)</span>
                </div>
                <div className={styles.featureItem}>
                  <CheckCircle2 size={16} />
                  <span>Teach in your free time & schedule</span>
                </div>
                <div className={styles.featureItem}>
                  <CheckCircle2 size={16} />
                  <span>Get verified teacher profile on the directory</span>
                </div>
              </div>
            </div>

            <button type="button" className={styles.cardActionBtn}>
              <span>Continue as Mentor</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoleSelectPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading...
        </div>
      }
    >
      <RoleSelectContent />
    </Suspense>
  );
}
