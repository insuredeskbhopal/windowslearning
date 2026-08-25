"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  Utensils,
  Scissors,
  Calculator,
  Languages,
  Laptop,
  Heart,
  Store,
  BookOpen,
  Users,
  Star,
  ArrowRight,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { DbSkill } from "@/lib/db";
import styles from "./page.module.css";

function SkillsSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track") || "";
  const queryParam = searchParams.get("q") || "";

  const [skills, setSkills] = useState<DbSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [selectedSkillForModal, setSelectedSkillForModal] = useState<DbSkill | null>(null);

  // Fetch all live skills from PostgreSQL database
  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true);
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
    fetchSkills();
  }, []);

  // Sync with URL query parameter
  useEffect(() => {
    if (trackParam && skills.length > 0) {
      const match = skills.find((s) => s.slug === trackParam || s.id === trackParam);
      if (match) {
        setSelectedSkillForModal(match);
      }
    }
  }, [trackParam, skills]);

  // Handle keyboard shortcut for search input focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.target as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        document.getElementById("skills-search-input")?.focus();
      }
      if (e.key === "Escape") {
        setSelectedSkillForModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Category Options with dynamic real-time counts from live database records
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: skills.length };
    skills.forEach((skill) => {
      counts[skill.category] = (counts[skill.category] || 0) + 1;
    });
    return counts;
  }, [skills]);

  const CATEGORIES = [
    { id: "all", label: "All Skills", count: categoryCounts.all || 0 },
    { id: "cooking", label: "Cooking & Baking", count: categoryCounts.cooking || 0 },
    { id: "tailoring", label: "Tailoring & Fashion", count: categoryCounts.tailoring || 0 },
    { id: "academics", label: "Maths & Science", count: categoryCounts.academics || 0 },
    { id: "languages", label: "Languages & English", count: categoryCounts.languages || 0 },
    { id: "computers", label: "Computers & Mobile", count: (categoryCounts.computers || 0) + (categoryCounts.practical || 0) },
    { id: "fitness", label: "Health & Yoga", count: categoryCounts.fitness || 0 },
    { id: "business", label: "Business & Accounts", count: categoryCounts.business || 0 },
  ];

  // Filter and Sort Logic over live database data
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      // 1. Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = skill.title.toLowerCase().includes(q);
        const matchesDesc = skill.description.toLowerCase().includes(q);
        const matchesTags = Array.isArray(skill.tags) && skill.tags.some((t: string) => t.toLowerCase().includes(q));
        const matchesCat = skill.categoryLabel.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesCat) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "computers" && (skill.category === "computers" || skill.category === "practical")) {
          // match both
        } else if (skill.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Difficulty filter
      if (selectedDifficulty !== "all" && skill.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "popular") return b.studentsEnrolled - a.studentsEnrolled;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "mentors") return b.mentorsCount - a.mentorsCount;
      if (sortBy === "modules") return b.modulesCount - a.modulesCount;
      return 0;
    });
  }, [skills, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

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

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSortBy("popular");
  };

  const handleEnrollAction = (skill: DbSkill) => {
    router.push(`/mentors?skill=${skill.slug}&skillTitle=${encodeURIComponent(skill.title)}`);
  };

  return (
    <div className={styles.skillsPage}>
      {/* Background Ambient Accents */}
      <div className={styles.ambientGlowTop} />

      {/* Floating Capsule Navbar */}
      <Navbar
        brandName="windowslearning"
        items={[
          { label: "SKILL", href: "/skills" },
          { label: "MENTOR", href: "/mentors" },
          { label: "COMMUNITY", href: "/#community" },
          { label: "CAREER", href: "/#career" },
          { label: "BECOME A MENTOR", href: "/#become-mentor" },
        ]}
        ctaLabel="START LEARNING"
        ctaHref="/skills"
      />

      <main className={styles.mainContent}>
        {/* Breadcrumb Navigation */}
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbCurrent}>Discover Skills</span>
        </div>

        {/* Page Header */}
        <div className={styles.headerSection}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Learn Any Skill with Real Mentors</span>
          </div>

          <h1 className={styles.pageTitle}>
            Discover Skills for <span className={styles.pageTitleHighlight}>Life, Work & Passion</span>
          </h1>

          <p className={styles.pageSubtitle}>
            From home cooking and dress tailoring to speed maths, human biology, spoken English, and computer basics—learn 1-on-1 with patient teachers.
          </p>
        </div>

        {/* Search & Filter Controls Panel */}
        <div className={styles.controlsWrapper}>
          {/* Main Search Input */}
          <div className={styles.searchBarRow}>
            <div className={styles.searchInputWrapper}>
              <Search size={20} className={styles.searchIcon} />
              <input
                id="skills-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any skill (e.g. Cooking, Tailoring, Vedic Maths, Spoken English, Biology, Excel)..."
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={styles.clearSearchBtn}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <span className={styles.kbdHint}>Press / to search</span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className={styles.categoriesRow}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`${styles.catBtn} ${
                  selectedCategory === cat.id ? styles.catBtnActive : ""
                }`}
              >
                <span>{cat.label}</span>
                <span className={styles.catBadge}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Secondary Controls: Difficulty, Sort, and Stats */}
          <div className={styles.secondaryFilterRow}>
            <div className={styles.filterGroup}>
              {/* Difficulty Dropdown */}
              <div className={styles.selectWrapper}>
                <Filter size={14} color="#34d399" />
                <span>Level:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner Friendly</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className={styles.selectWrapper}>
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="mentors">Most Mentors</option>
                  <option value="modules">Lesson Count</option>
                </select>
              </div>
            </div>

            {/* Results Count and Reset */}
            <div className={styles.statsBar}>
              Showing <span className={styles.highlightCount}>{filteredSkills.length}</span> of{" "}
              {skills.length} Skills
              {(searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#34d399",
                    marginLeft: "0.75rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "0.82rem",
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ padding: "5rem 2rem", textAlign: "center", color: "#34d399", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <Loader2 size={36} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>Loading Skills Catalog...</div>
          </div>
        ) : filteredSkills.length > 0 ? (
          <div className={styles.skillsGrid}>
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className={styles.skillCard}
                onClick={() => setSelectedSkillForModal(skill)}
              >
                <div className={styles.cardGlow} />

                <div>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconBox}>{getCategoryIcon(skill.category)}</div>
                    <div className={styles.headerBadges}>
                      <span
                        className={`${styles.difficultyPill} ${getDifficultyClass(
                          skill.difficulty
                        )}`}
                      >
                        {skill.difficulty}
                      </span>
                    </div>
                  </div>

                  <h2 className={styles.cardTitle}>{skill.title}</h2>
                  <p className={styles.cardDescription}>{skill.description}</p>

                  {/* Tags */}
                  <div className={styles.tagsRow}>
                    {Array.isArray(skill.tags) &&
                      skill.tags.slice(0, 4).map((tag: string) => (
                        <span key={tag} className={styles.tagPill}>
                          #{tag}
                        </span>
                      ))}
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                      <BookOpen size={14} />
                      <span>{skill.modulesCount} Lessons</span>
                    </div>

                    <div className={styles.statItem}>
                      <Users size={14} />
                      <span>{skill.mentorsCount} Mentors</span>
                    </div>

                    <div className={styles.statItem}>
                      <Star size={14} fill="#fbbf24" color="#fbbf24" />
                      <span>{skill.rating}</span>
                    </div>
                  </div>

                  <div className={styles.actionBtnRow}>
                    <button
                      type="button"
                      className={styles.syllabusBtn}
                      style={{ width: "100%" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSkillForModal(skill);
                      }}
                    >
                      <span>View Lessons & Curriculum</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BookOpen size={48} color="#34d399" />
            <h3 className={styles.emptyTitle}>No Matching Skills Found</h3>
            <p className={styles.emptySubtitle}>
              We couldn&apos;t find any skill matching &ldquo;{searchQuery}&rdquo;. Try another search term or reset your filters.
            </p>
            <button type="button" onClick={resetFilters} className={styles.resetBtn}>
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Interactive Details Modal */}
      {selectedSkillForModal && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedSkillForModal(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeModalBtn}
              onClick={() => setSelectedSkillForModal(null)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div className={styles.iconBox}>
                {getCategoryIcon(selectedSkillForModal.category)}
              </div>
              <div>
                <span
                  className={`${styles.difficultyPill} ${getDifficultyClass(
                    selectedSkillForModal.difficulty
                  )}`}
                >
                  {selectedSkillForModal.difficulty}
                </span>
                <h2 style={{ fontSize: "1.6rem", color: "#ffffff", margin: "0.4rem 0 0 0" }}>
                  {selectedSkillForModal.title}
                </h2>
              </div>
            </div>

            <p style={{ fontSize: "1rem", lineHeight: "1.65", color: "rgba(226, 237, 231, 0.8)", marginBottom: "1.75rem" }}>
              {selectedSkillForModal.detailedOverview}
            </p>

            {/* Quick Metrics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                padding: "1.25rem",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(52, 211, 153, 0.2)",
                borderRadius: "16px",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#34d399" }}>
                  {selectedSkillForModal.modulesCount}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(226, 237, 231, 0.6)" }}>Lessons</div>
              </div>
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#34d399" }}>
                  {selectedSkillForModal.labsCount}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(226, 237, 231, 0.6)" }}>Practicals</div>
              </div>
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#34d399" }}>
                  {selectedSkillForModal.durationHours}h
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(226, 237, 231, 0.6)" }}>Total Hours</div>
              </div>
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fbbf24" }}>
                  ★ {selectedSkillForModal.rating}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(226, 237, 231, 0.6)" }}>
                  {selectedSkillForModal.mentorsCount} Mentors
                </div>
              </div>
            </div>

            {/* What you need to start */}
            {Array.isArray(selectedSkillForModal.prerequisites) && selectedSkillForModal.prerequisites.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.05rem", color: "#ffffff", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} color="#34d399" />
                  <span>What You Need to Start</span>
                </h3>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "rgba(226, 237, 231, 0.75)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                  {selectedSkillForModal.prerequisites.map((p: string, idx: number) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Single Clean Primary Action */}
            <div style={{ display: "flex", width: "100%" }}>
              <button
                type="button"
                className={styles.syllabusBtn}
                style={{
                  width: "100%",
                  padding: "0.95rem 1.75rem",
                  fontSize: "1rem",
                  background: "#34d399",
                  color: "#030a07",
                  fontWeight: 700,
                  boxShadow: "0 10px 25px rgba(52, 211, 153, 0.35)",
                }}
                onClick={() => handleEnrollAction(selectedSkillForModal)}
              >
                <Sparkles size={18} />
                <span>Start Learning & Find a Mentor</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SkillsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#030a07", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading Skills...
        </div>
      }
    >
      <SkillsSearchContent />
    </Suspense>
  );
}
