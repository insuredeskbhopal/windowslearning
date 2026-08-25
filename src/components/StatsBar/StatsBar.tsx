"use client";

import React from "react";
import { BookOpen, Users, HeartHandshake, Sparkles } from "lucide-react";
import styles from "./StatsBar.module.css";

const STATS = [
  {
    icon: <BookOpen size={24} />,
    value: "100+",
    highlight: "Skills",
    label: "Cooking, Tailoring, Maths, Computer & More",
  },
  {
    icon: <Users size={24} />,
    value: "500+",
    highlight: "Mentors",
    label: "Friendly, Verified Real-World Teachers",
  },
  {
    icon: <HeartHandshake size={24} />,
    value: "1-on-1",
    highlight: "Live",
    label: "Personal Attention at Your Own Pace",
  },
  {
    icon: <Sparkles size={24} />,
    value: "₹0 to ₹250",
    highlight: "Affordable",
    label: "Free Community Slots & Easy Hourly Rates",
  },
];

export default function StatsBar() {
  return (
    <section className={styles.statsBar}>
      <div className={styles.container}>
        {STATS.map((stat, idx) => (
          <div key={idx} className={styles.statItem}>
            <div className={styles.iconBox}>{stat.icon}</div>
            <div>
              <div className={styles.numberValue}>
                {stat.value}{" "}
                <span className={styles.numberHighlight}>{stat.highlight}</span>
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
