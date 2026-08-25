"use client";

import React from "react";
import { Compass, Users, Sparkles, Award } from "lucide-react";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    number: "01",
    icon: <Compass size={22} />,
    title: "Pick Your Skill",
    description:
      "Choose what you want to learn: cooking, tailoring, maths, biology, spoken English, yoga, computer basics, or phone repair.",
  },
  {
    number: "02",
    icon: <Users size={22} />,
    title: "Choose Your Mentor",
    description:
      "Browse friendly teachers, read their reviews, see their hourly fees (or pick free slots), and book a time that suits you.",
  },
  {
    number: "03",
    icon: <Sparkles size={22} />,
    title: "Learn 1-on-1 Live",
    description:
      "Join a live, friendly session from your phone or laptop. Practice step-by-step and ask every question with complete freedom.",
  },
  {
    number: "04",
    icon: <Award size={22} />,
    title: "Apply & Start Earning",
    description:
      "Use your new capability in daily life, pass school/college exams with ease, or start your own home business and earn.",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.howItWorksSection} id="how-it-works">
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Simple 4-Step Process</span>
          </div>

          <h2 className={styles.title}>
            How Learning on Windows Learning <span className={styles.titleHighlight}>Works</span>
          </h2>

          <p className={styles.subtitle}>
            Easy, friendly, and designed for everyone. Here is how you can start learning or teaching in just 4 simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className={styles.stepsGrid}>
          {STEPS.map((step) => (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepIconWrapper}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
