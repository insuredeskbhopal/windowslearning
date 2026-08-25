"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Utensils,
  Scissors,
  Calculator,
  Languages,
  Laptop,
  Heart,
  Store,
  ArrowRight,
  BookOpen,
  Users,
  Compass,
} from "lucide-react";
import { DbSkill } from "@/lib/db";
import styles from "./SkillSection.module.css";

const CATEGORIES = [
  { id: "all", label: "All Skills" },
  { id: "cooking", label: "Cooking & Baking" },
  { id: "tailoring", label: "Tailoring & Fashion" },
  { id: "academics", label: "Maths & Science" },
  { id: "languages", label: "Languages & English" },
  { id: "computers", label: "Computers & Mobile" },
  { id: "fitness", label: "Health & Yoga" },
  { id: "business", label: "Business & Accounts" },
];

export default function SkillSection() {
  const [skills, setSkills] = useState<DbSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetch("/api/skills");
        const data = await res.json();
        if (data.success && Array.isArray(data.skills)) {
          setSkills(data.skills);
        }
      } catch (err) {
        console.error("Failed to load skills from database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  const filteredSkills =
    selectedCategory === "all"
      ? skills.slice(0, 6)
      : skills.filter((skill) => skill.category === selectedCategory).slice(0, 6);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cooking":
        return <Utensils size={22} />;
      case "tailoring":
        return <Scissors size={22} />;
      case "academics":
        return <Calculator size={22} />;
      case "languages":
        return <Languages size={22} />;
      case "computers":
      case "practical":
        return <Laptop size={22} />;
      case "fitness":
        return <Heart size={22} />;
      case "business":
        return <Store size={22} />;
      default:
        return <BookOpen size={22} />;
    }
  };

  const getDifficultyClass = (diff: DbSkill["difficulty"]) => {
    switch (diff) {
      case "Beginner":
        return styles.diffBeginner;
      case "Intermediate":
        return styles.diffIntermediate;
      case "Advanced":
        return styles.diffAdvanced;
      default:
        return styles.diffBeginner;
    }
  };

  return (
    <section className={styles.skillSection} id="skill">
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Discover Skills</span>
          </div>

          <h2 className={styles.title}>
            Learn Useful Skills for <span className={styles.titleHighlight}>Daily Life & Work</span>
          </h2>

          <p className={styles.subtitle}>
            From home cooking and dress tailoring to fast maths, biology, spoken English, and computer basics—pick any skill you want to learn with a friendly mentor.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className={styles.tabsContainer}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`${styles.tabBtn} ${
                selectedCategory === cat.id ? styles.activeTab : ""
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skill Cards Grid */}
        {loading ? (
          <div style={{ padding: "3rem", color: "#34d399", fontFamily: "var(--font-mono)" }}>
            Loading skills...
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredSkills.map((skill) => (
              <div key={skill.id} className={styles.card}>
                <div className={styles.cardGlow} />

                <div>
                  <div className={styles.cardTop}>
                    <div className={styles.iconWrapper}>
                      {getCategoryIcon(skill.category)}
                    </div>
                    <span
                      className={`${styles.difficultyPill} ${getDifficultyClass(
                        skill.difficulty
                      )}`}
                    >
                      {skill.difficulty}
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{skill.title}</h3>
                  <p className={styles.cardDescription}>{skill.description}</p>
                </div>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <BookOpen size={14} />
                    <span>{skill.modulesCount} Lessons</span>
                  </div>

                  <div className={styles.metaItem}>
                    <Users size={14} />
                    <span>{skill.mentorsCount} Mentors</span>
                  </div>

                  <Link
                    href={`/skills?track=${skill.slug}`}
                    className={styles.cardAction}
                  >
                    <span>Explore</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Explore More Skills Action Button */}
        <div className={styles.exploreMoreRow}>
          <Link href="/skills" className={styles.exploreMoreBtn}>
            <Compass size={18} />
            <span>Explore All Skills & Lessons</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
