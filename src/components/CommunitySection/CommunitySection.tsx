"use client";

import React from "react";
import { MessageSquare, Users, HelpCircle, HeartHandshake } from "lucide-react";
import styles from "./CommunitySection.module.css";

const COMMUNITY_HUBS = [
  {
    icon: <HelpCircle size={22} />,
    category: "Ask Any Question",
    title: "Daily Q&A & Doubt Solving",
    description:
      "Having trouble in round roti making, blouse armhole cutting, or maths formula? Post your question and get friendly answers from teachers and fellow learners.",
    activity: "250+ Questions Answered this week",
    members: "12,000+ Learners",
  },
  {
    icon: <Users size={22} />,
    category: "Practice Circles",
    title: "Share Your Work & Progress",
    description:
      "Share photos of dishes you cooked, clothes you stitched, or practice spoken English in voice groups with fellow learners who encourage you.",
    activity: "45 Active Practice Groups",
    members: "Daily Active",
  },
  {
    icon: <HeartHandshake size={22} />,
    category: "Free Live Sessions",
    title: "Weekend Teacher Talks & Tips",
    description:
      "Join free live sessions every weekend where top mentors demonstrate cooking tricks, sewing hacks, maths shortcuts, and health tips.",
    activity: "Next Live Session: Sunday 11 AM",
    members: "Free for Everyone",
  },
];

export default function CommunitySection() {
  return (
    <section className={styles.communitySection} id="community">
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Supportive Community</span>
          </div>

          <h2 className={styles.title}>
            Learn Together, <span className={styles.titleHighlight}>Grow Together</span>
          </h2>

          <p className={styles.subtitle}>
            You are never alone in your learning journey. Ask questions freely, share your progress, get feedback from mentors, and make friends who share your passion.
          </p>
        </div>

        {/* 3 Hub Cards */}
        <div className={styles.grid}>
          {COMMUNITY_HUBS.map((hub, idx) => (
            <div key={idx} className={styles.communityCard}>
              <div>
                <div className={styles.cardTop}>
                  <div className={styles.iconBox}>{hub.icon}</div>
                  <span className={styles.cardCategory}>{hub.category}</span>
                </div>

                <h3 className={styles.cardTitle}>{hub.title}</h3>
                <p className={styles.cardDescription}>{hub.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.activeIndicator}>
                  <span className={styles.dotPulse} />
                  <span>{hub.activity}</span>
                </div>
                <span>{hub.members}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
