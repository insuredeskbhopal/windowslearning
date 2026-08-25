"use client";

import React from "react";
import { Sparkles, DollarSign, Award, HeartHandshake } from "lucide-react";
import styles from "./CareerGrowth.module.css";

const CAREER_PILLARS = [
  {
    icon: <Sparkles size={22} />,
    title: "1. Skill Check & Guidance",
    description:
      "Understand your current level and get a clear, step-by-step roadmap on what to practice next to become really good at your skill.",
  },
  {
    icon: <Award size={22} />,
    title: "2. Build Practical Confidence",
    description:
      "Practice real tasks—stitch your first blouse, cook special dishes, solve tough school questions, or speak in English meetings with total confidence.",
  },
  {
    icon: <DollarSign size={22} />,
    title: "3. Earn Extra Monthly Income",
    description:
      "Turn your learned skill into a side income or home business: take tailoring orders, sell home-baked cakes, or tutor school students.",
  },
  {
    icon: <HeartHandshake size={22} />,
    title: "4. Mentor Support Always",
    description:
      "Your mentor stays with you, reviewing your work, suggesting improvements, and helping you build a solid local reputation.",
  },
];

export default function CareerGrowth() {
  return (
    <section className={styles.careerSection} id="career">
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Growth & Earning</span>
          </div>

          <h2 className={styles.title}>
            Turn Any Skill into <span className={styles.titleHighlight}>Confidence & Income</span>
          </h2>

          <p className={styles.subtitle}>
            Whether you want to learn a skill for yourself, support your family, or start earning from home, our mentors help you every step of the way.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className={styles.grid}>
          {CAREER_PILLARS.map((pillar, idx) => (
            <div key={idx} className={styles.careerCard}>
              <div className={styles.iconBox}>{pillar.icon}</div>
              <h3 className={styles.cardTitle}>{pillar.title}</h3>
              <p className={styles.cardDescription}>{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
