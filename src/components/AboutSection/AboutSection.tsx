"use client";

import React from "react";
import { Heart, Users, Sparkles, CheckCircle2, DollarSign, BookOpen } from "lucide-react";
import styles from "./AboutSection.module.css";

const PILLARS = [
  {
    icon: <BookOpen size={26} />,
    title: "Learn by Doing, Not Just Watching",
    description:
      "Watching long videos doesn't teach you how to cook a dish or stitch a blouse. With our mentors, you practice live with real ingredients, cloth, or tools right in front of you.",
    highlights: [
      "Step-by-step live practical guidance",
      "Immediate corrections when you make a mistake",
      "Useful recipes, patterns, and shortcuts",
    ],
  },
  {
    icon: <Users size={26} />,
    title: "1-on-1 Friendly Attention",
    description:
      "No crowded classrooms where you feel shy to ask questions. You get dedicated time with a patient mentor who speaks your language and understands your pace.",
    highlights: [
      "Ask any doubt freely without any fear",
      "Custom lesson plans made just for you",
      "Flexible timings according to your schedule",
    ],
  },
  {
    icon: <DollarSign size={26} />,
    title: "Teach What You Know & Earn",
    description:
      "Are you good at home cooking, dressmaking, maths, biology, spoken English, or repairing gadgets? Turn your passion into respect and extra monthly income.",
    highlights: [
      "Set your own fee per session or hour",
      "Get connected with learners who value your skill",
      "Work from the comfort of your own home",
    ],
  },
  {
    icon: <Heart size={26} />,
    title: "Affordable for Every Family",
    description:
      "Learning should never be out of reach. We offer free community guidance sessions alongside very affordable lesson fees starting from just ₹150 to ₹250.",
    highlights: [
      "Free community classes every week",
      "No expensive long-term contract locks",
      "Pay only for the lessons you take",
    ],
  },
];

export default function AboutSection() {
  return (
    <section className={styles.aboutSection} id="about">
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Why Windows Learning?</span>
          </div>

          <h2 className={styles.title}>
            Real Skills Taught by <span className={styles.titleHighlight}>Real People</span>
          </h2>

          <p className={styles.subtitle}>
            We believe practical skills change lives. Whether you want to improve your daily cooking, stitch designer clothes, master school science, or speak fluent English, our mentors are here to guide you.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className={styles.pillarsGrid}>
          {PILLARS.map((pillar, idx) => (
            <div key={idx} className={styles.pillarCard}>
              <div className={styles.cardGlow} />

              <div className={styles.iconWrapper}>{pillar.icon}</div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDescription}>{pillar.description}</p>

              <ul className={styles.highlightsList}>
                {pillar.highlights.map((h, i) => (
                  <li key={i} className={styles.highlightItem}>
                    <CheckCircle2 size={16} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
