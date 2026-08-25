"use client";

import React from "react";
import { GraduationCap, Compass, Users, MessageSquare, CheckCircle2 } from "lucide-react";
import styles from "./EcosystemLoop.module.css";

const ECOSYSTEM_NODES = [
  {
    role: "Learn What You Want",
    title: "1. For Learners",
    icon: <GraduationCap size={24} />,
    description:
      "Want to learn cooking, tailoring, maths, biology, spoken English, or computer skills? Learn at your own pace with a patient mentor.",
    features: [
      "1-on-1 live practical lessons",
      "Ask any question without hesitation",
      "Learn step-by-step from your home",
    ],
  },
  {
    role: "Every Everyday Skill",
    title: "2. Real Practical Skills",
    icon: <Compass size={24} />,
    description:
      "Not just boring theory. Learn useful, real-world skills that help you in daily life, school, college, jobs, or starting a small home business.",
    features: [
      "Cooking, Baking & Sweet making",
      "Tailoring, Blouse cutting & Boutique",
      "Maths, Biology, Spoken English & Computers",
    ],
  },
  {
    role: "Teach & Earn from Home",
    title: "3. For Mentors",
    icon: <Users size={24} />,
    description:
      "If you know any skill well, you can become a mentor! Share your knowledge, help eager learners, set your own fees, and earn respect and income.",
    features: [
      "Set your own hourly fees or teach free",
      "Choose your own free time slots",
      "Teach from your phone or laptop",
    ],
  },
  {
    role: "Learn & Grow Together",
    title: "4. Friendly Community",
    icon: <MessageSquare size={24} />,
    description:
      "A warm and supportive space where learners and teachers talk, share tips, solve daily doubts, and encourage each other.",
    features: [
      "Helpful discussion groups",
      "Daily practice circles",
      "Direct guidance from mentors",
    ],
  },
];

export default function EcosystemLoop() {
  return (
    <section className={styles.ecosystemSection} id="ecosystem">
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Everyone Can Learn • Everyone Can Teach</span>
          </div>

          <h2 className={styles.title}>
            A Community Where <span className={styles.titleHighlight}>Skills Connect People</span>
          </h2>

          <p className={styles.subtitle}>
            In life, everyone knows something valuable—whether it&apos;s cooking delicious food, stitching perfect clothes, solving maths easily, or teaching biology. Windows Learning connects people who know a skill with people who genuinely want to learn.
          </p>
        </div>

        {/* 4 Loop Nodes */}
        <div className={styles.loopGrid}>
          {ECOSYSTEM_NODES.map((node, idx) => (
            <div key={idx} className={styles.loopCard}>
              <div className={styles.iconWrapper}>{node.icon}</div>
              <div className={styles.cardRole}>{node.role}</div>
              <h3 className={styles.cardTitle}>{node.title}</h3>
              <p className={styles.cardDescription}>{node.description}</p>

              <div className={styles.pillList}>
                {node.features.map((f, i) => (
                  <div key={i} className={styles.pillItem}>
                    <CheckCircle2 size={14} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
