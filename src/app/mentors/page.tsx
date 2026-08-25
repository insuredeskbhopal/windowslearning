"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  X,
  Star,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Filter,
  ShieldCheck,
  Building,
  GraduationCap,
  BookOpen,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { DbMentor } from "@/lib/db";
import styles from "./page.module.css";

const TRACK_FILTER_PRESETS = [
  { id: "all", label: "All Skills" },
  { id: "home-cooking-recipes", label: "Cooking & Baking" },
  { id: "tailoring-dress-making", label: "Tailoring & Fashion" },
  { id: "vedic-maths-fast-calculation", label: "Maths & Speed Calculation" },
  { id: "biology-human-body-basics", label: "Biology & Science" },
  { id: "spoken-english-confidence", label: "Spoken English & Fluency" },
  { id: "computer-basics-ms-excel", label: "Computer Basics & Excel" },
  { id: "mobile-repairing-electronics", label: "Smartphone & Gadget Repair" },
  { id: "yoga-daily-fitness-diet", label: "Yoga & Daily Fitness" },
  { id: "small-business-accounts-tally", label: "Business Accounts & Tally" },
];

function MentorsSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const skillParam = searchParams.get("skill") || "";
  const skillTitleParam = searchParams.get("skillTitle") || "";

  const [mentors, setMentors] = useState<DbMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>(skillParam);
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all");
  const [freeCommunityOnly, setFreeCommunityOnly] = useState<boolean>(false);
  const [bookingMentor, setBookingMentor] = useState<DbMentor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);

  // Fetch mentors live from PostgreSQL database
  useEffect(() => {
    async function loadMentors() {
      try {
        setLoading(true);
        const res = await fetch("/api/mentors");
        const data = await res.json();
        if (data.success && Array.isArray(data.mentors)) {
          setMentors(data.mentors);
        }
      } catch (err) {
        console.error("Failed to load mentors from database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMentors();
  }, []);

  // Update selected skill filter if URL parameter changes
  useEffect(() => {
    if (skillParam) {
      setSelectedSkillFilter(skillParam);
      setCurrentPage(1);
    }
  }, [skillParam]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSkillFilter, selectedAvailability, freeCommunityOnly, pageSize]);

  // Filter mentors based on criteria
  const filteredMentors = useMemo(() => {
    return mentors.filter((m) => {
      // 1. Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesRole = m.role.toLowerCase().includes(q);
        const matchesCompany = m.company.toLowerCase().includes(q);
        const matchesBio = m.bio.toLowerCase().includes(q);
        const matchesSkills =
          Array.isArray(m.skillsLabels) &&
          m.skillsLabels.some((s: string) => s.toLowerCase().includes(q));

        if (!matchesName && !matchesRole && !matchesCompany && !matchesBio && !matchesSkills) {
          return false;
        }
      }

      // 2. Skill Track filter
      if (selectedSkillFilter && selectedSkillFilter !== "all") {
        const hasSkill =
          (Array.isArray(m.skills) && m.skills.includes(selectedSkillFilter)) ||
          (Array.isArray(m.skillsLabels) &&
            m.skillsLabels.some((s: string) =>
              s.toLowerCase().includes(selectedSkillFilter.toLowerCase())
            ));
        if (!hasSkill) return false;
      }

      // 3. Availability
      if (selectedAvailability !== "all" && m.availability !== selectedAvailability) {
        return false;
      }

      // 4. Free Community Sessions only
      if (freeCommunityOnly && !m.isFreeCommunity) {
        return false;
      }

      return true;
    });
  }, [mentors, searchQuery, selectedSkillFilter, selectedAvailability, freeCommunityOnly]);

  // Paginated chunk
  const totalPages = Math.max(1, Math.ceil(filteredMentors.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMentors = filteredMentors.slice(startIndex, startIndex + pageSize);

  const clearCourseFilter = () => {
    setSelectedSkillFilter("all");
    setCurrentPage(1);
    router.replace("/mentors");
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedSkillFilter("all");
    setSelectedAvailability("all");
    setFreeCommunityOnly(false);
    setCurrentPage(1);
    router.replace("/mentors");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.mentorsPage}>
      <div className={styles.ambientGlow} />

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

      <main className={styles.mainContainer}>
        {/* Breadcrumb Navigation */}
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/skills" className={styles.breadcrumbLink}>
            Skills
          </Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbCurrent}>Find a Mentor</span>
        </div>

        {/* Hero Header */}
        <div className={styles.heroHeader}>
          <div>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              <span>Friendly 1-on-1 Mentors</span>
            </div>

            <h1 className={styles.title}>
              Learn Any Skill with <span className={styles.titleHighlight}>Personal Mentors</span>
            </h1>

            <p className={styles.subtitle}>
              Book live 1-on-1 practical lessons with experienced home chefs, master tailors, speed maths coaches, biology teachers, and computer guides.
            </p>
          </div>

          <div className={styles.headerMetrics}>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{mentors.length}+</div>
              <div className={styles.metricLabel}>Verified Mentors</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>4.96 ★</div>
              <div className={styles.metricLabel}>Avg. Rating</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>100%</div>
              <div className={styles.metricLabel}>Live & Practical</div>
            </div>
          </div>
        </div>

        {/* Pre-applied Course Filter Banner */}
        {selectedSkillFilter && selectedSkillFilter !== "all" && (
          <div className={styles.courseBanner}>
            <div className={styles.bannerLeft}>
              <div className={styles.bannerIcon}>
                <GraduationCap size={20} />
              </div>
              <div>
                <div className={styles.bannerTitle}>
                  Showing Mentors for:{" "}
                  <span style={{ color: "#34d399" }}>
                    {skillTitleParam || selectedSkillFilter.replace(/-/g, " ").toUpperCase()}
                  </span>
                </div>
                <div className={styles.bannerSubtitle}>
                  Showing teachers specialized in this skill. Click clear to browse all mentors.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={clearCourseFilter}
              className={styles.clearFilterBtn}
            >
              <X size={14} />
              <span>Clear Filter & See All</span>
            </button>
          </div>
        )}

        {/* Two-Column Studio Layout */}
        <div className={styles.studioLayout}>
          {/* Left Column: Filter Panel */}
          <aside className={styles.sidebarFilter}>
            <div className={styles.sidebarTitleRow}>
              <div className={styles.sidebarTitle}>
                <Filter size={16} color="#34d399" />
                <span>Find Your Mentor</span>
              </div>
              {(searchQuery || (selectedSkillFilter && selectedSkillFilter !== "all") || selectedAvailability !== "all" || freeCommunityOnly) && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className={styles.sidebarResetBtn}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className={styles.filterBlock}>
              <span className={styles.filterLabel}>Search by Name or Skill</span>
              <div className={styles.searchSidebarInputWrapper}>
                <Search size={15} className={styles.sidebarSearchIcon} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Cooking, Blouse, Maths, Sunita..."
                  className={styles.searchSidebarInput}
                />
              </div>
            </div>

            {/* Free Community Sessions Toggle */}
            <div className={styles.filterBlock}>
              <label className={styles.toggleRow}>
                <div className={styles.toggleLabel}>
                  <Sparkles size={15} color="#34d399" />
                  <span>Free Community Sessions</span>
                </div>
                <div className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={freeCommunityOnly}
                    onChange={(e) => setFreeCommunityOnly(e.target.checked)}
                  />
                  <span className={styles.slider} />
                </div>
              </label>
            </div>

            {/* Availability Filter */}
            <div className={styles.filterBlock}>
              <span className={styles.filterLabel}>When are they free?</span>
              <div className={styles.filterPillsGroup}>
                {[
                  { id: "all", label: "Any Time" },
                  { id: "Available Today", label: "Available Today" },
                  { id: "This Week", label: "This Week" },
                  { id: "Weekend Only", label: "Weekends Only" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.filterPillItem} ${
                      selectedAvailability === item.id ? styles.filterPillItemActive : ""
                    }`}
                    onClick={() => setSelectedAvailability(item.id)}
                  >
                    <span>{item.label}</span>
                    {selectedAvailability === item.id && (
                      <CheckCircle2 size={14} color="#34d399" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specialization Track Presets */}
            <div className={styles.filterBlock}>
              <span className={styles.filterLabel}>Skill Categories</span>
              <div className={styles.filterPillsGroup}>
                {TRACK_FILTER_PRESETS.map((t) => (
                  <div
                    key={t.id}
                    className={`${styles.filterPillItem} ${
                      selectedSkillFilter === t.id ? styles.filterPillItemActive : ""
                    }`}
                    onClick={() => setSelectedSkillFilter(t.id)}
                  >
                    <span>{t.label}</span>
                    {selectedSkillFilter === t.id && (
                      <CheckCircle2 size={14} color="#34d399" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Column: Mentor Profile Cards */}
          <section className={styles.directoryColumn}>
            <div className={styles.resultsHeaderBar}>
              <div className={styles.resultsCount}>
                Showing <strong>{filteredMentors.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + pageSize, filteredMentors.length)}</strong> of{" "}
                <strong>{filteredMentors.length}</strong> verified mentors
              </div>

              {/* Per Page Select */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)" }}>
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  style={{
                    background: "rgba(10, 26, 19, 0.85)",
                    border: "1px solid rgba(52, 211, 153, 0.3)",
                    color: "#ffffff",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "8px",
                    outline: "none",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                  }}
                >
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: "5rem 2rem", textAlign: "center", color: "#34d399", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <Loader2 size={36} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-mono)" }}>Loading Mentors...</div>
              </div>
            ) : paginatedMentors.length > 0 ? (
              <>
                {paginatedMentors.map((mentor) => (
                  <div key={mentor.id} className={styles.mentorCard}>
                    {/* Top Row: Avatar, Identity, and Rate */}
                    <div className={styles.cardTopRow}>
                      <div className={styles.mentorIdentity}>
                        <div className={styles.avatarWrapper}>
                          <Image
                            src={mentor.avatar}
                            alt={mentor.name}
                            width={68}
                            height={68}
                            className={styles.avatarImg}
                            unoptimized
                          />
                          {mentor.availability === "Available Today" && (
                            <div className={styles.onlineStatusDot} title="Online & Available Today" />
                          )}
                        </div>

                        <div className={styles.mentorNameRole}>
                          <div className={styles.mentorName}>
                            <span>{mentor.name}</span>
                            <span className={styles.verifiedBadge} title="Verified Teacher">
                              <ShieldCheck size={18} />
                            </span>
                          </div>
                          <div className={styles.mentorRole}>{mentor.role}</div>
                          <div className={styles.mentorCompany}>
                            <Building size={12} style={{ display: "inline", marginRight: "4px" }} />
                            {mentor.company}
                          </div>
                        </div>
                      </div>

                      <div className={styles.rateAndAvailability}>
                        {mentor.isFreeCommunity ? (
                          <span className={styles.freeTag}>Free Community Class</span>
                        ) : (
                          <div className={styles.rateTag}>₹{mentor.hourlyRate}/hr</div>
                        )}
                        <div className={styles.availTag}>
                          <Clock size={12} color="#34d399" />
                          <span>{mentor.availability}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className={styles.mentorBio}>{mentor.bio}</p>

                    {/* Skills Chips */}
                    <div className={styles.skillsChipsRow}>
                      {Array.isArray(mentor.skillsLabels) &&
                        mentor.skillsLabels.map((skillLabel: string) => (
                          <span key={skillLabel} className={styles.skillChip}>
                            #{skillLabel}
                          </span>
                        ))}
                    </div>

                    {/* Bottom Stats & Book Action */}
                    <div className={styles.cardBottomRow}>
                      <div className={styles.statsCluster}>
                        <div className={styles.statItem}>
                          <Star size={14} fill="#fbbf24" color="#fbbf24" />
                          <span style={{ color: "#ffffff", fontWeight: 700 }}>{mentor.rating}</span>
                          <span>({mentor.reviewsCount} reviews)</span>
                        </div>

                        <div className={styles.statItem}>
                          <Users size={14} />
                          <span>{mentor.studentsMentored} Learners</span>
                        </div>

                        <div className={styles.statItem}>
                          <BookOpen size={14} />
                          <span>{mentor.experienceYears}y Exp</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={styles.bookBtn}
                        onClick={() => {
                          setBookingMentor(mentor);
                          setBookingSuccess(false);
                        }}
                      >
                        <Calendar size={15} />
                        <span>Book 1-on-1 Lesson</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Interactive Pagination Bar */}
                {totalPages > 1 && (
                  <div className={styles.paginationWrapper}>
                    <div className={styles.paginationInfo}>
                      Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredMentors.length} Total Mentors)
                    </div>

                    <div className={styles.paginationControls}>
                      {/* Previous Page Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={styles.pageBtn}
                      >
                        <ChevronLeft size={16} />
                        <span>Previous</span>
                      </button>

                      {/* Numbered Page Buttons */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`${styles.pageNumberBtn} ${
                            currentPage === pageNum ? styles.pageNumberActive : ""
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      {/* Next Page Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={styles.pageBtn}
                      >
                        <span>Next</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>
                <Users size={48} color="#34d399" />
                <h3 className={styles.emptyTitle}>No Mentors Match Your Search</h3>
                <p className={styles.emptySubtitle}>
                  No mentors found for this filter. Try clearing filters to see all available teachers.
                </p>
                <button type="button" onClick={resetAllFilters} className={styles.clearFilterBtn} style={{ margin: "0 auto" }}>
                  Reset All Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Interactive 1-on-1 Lesson Booking Modal */}
      {bookingMentor && (
        <div className={styles.modalBackdrop} onClick={() => setBookingMentor(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeModalBtn}
              onClick={() => setBookingMentor(null)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {!bookingSuccess ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div className={styles.avatarWrapper} style={{ width: "54px", height: "54px" }}>
                    <Image
                      src={bookingMentor.avatar}
                      alt={bookingMentor.name}
                      width={54}
                      height={54}
                      className={styles.avatarImg}
                      unoptimized
                    />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.35rem", color: "#ffffff", margin: 0 }}>
                      Book Lesson with {bookingMentor.name}
                    </h2>
                    <div style={{ fontSize: "0.82rem", color: "#34d399" }}>
                      {bookingMentor.role} • {bookingMentor.timezone}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)", marginBottom: "0.4rem", fontFamily: "var(--font-mono)" }}>
                    What would you like to learn in this session?
                  </label>
                  <input
                    type="text"
                    defaultValue={skillTitleParam ? `Lesson on ${skillTitleParam}` : "Practical 1-on-1 guidance & practice"}
                    placeholder="e.g. Blouse cutting practice, North Indian gravy recipe, Speed maths tricks..."
                    style={{
                      width: "100%",
                      background: "rgba(4, 13, 9, 0.8)",
                      border: "1px solid rgba(52, 211, 153, 0.3)",
                      borderRadius: "12px",
                      padding: "0.75rem 1rem",
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)", marginBottom: "0.4rem", fontFamily: "var(--font-mono)" }}>
                      Select Date
                    </label>
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      style={{
                        width: "100%",
                        background: "rgba(4, 13, 9, 0.8)",
                        border: "1px solid rgba(52, 211, 153, 0.3)",
                        borderRadius: "12px",
                        padding: "0.75rem 1rem",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)", marginBottom: "0.4rem", fontFamily: "var(--font-mono)" }}>
                      Preferred Time
                    </label>
                    <select
                      style={{
                        width: "100%",
                        background: "rgba(4, 13, 9, 0.8)",
                        border: "1px solid rgba(52, 211, 153, 0.3)",
                        borderRadius: "12px",
                        padding: "0.75rem 1rem",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                        outline: "none",
                        boxSizing: "border-box",
                        cursor: "pointer",
                      }}
                    >
                      <option>10:00 AM - 11:00 AM (Morning)</option>
                      <option>02:00 PM - 03:00 PM (Afternoon)</option>
                      <option>06:00 PM - 07:00 PM (Evening)</option>
                      <option>08:30 PM - 09:30 PM (Night)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.bookBtn}
                  style={{ width: "100%", justifyContent: "center", padding: "0.9rem" }}
                  onClick={() => setBookingSuccess(true)}
                >
                  <Sparkles size={16} />
                  <span>Confirm Lesson ({bookingMentor.isFreeCommunity ? "Free Class" : `₹${bookingMentor.hourlyRate}`})</span>
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", border: "2px solid #34d399", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem auto", color: "#34d399" }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: "1.4rem", color: "#ffffff", margin: "0 0 0.5rem 0" }}>
                  Lesson Request Sent!
                </h3>
                <p style={{ fontSize: "0.92rem", color: "rgba(226, 237, 231, 0.75)", margin: "0 0 1.5rem 0", lineHeight: "1.6" }}>
                  Your 1-on-1 session request has been sent to <strong>{bookingMentor.name}</strong>. You will receive a WhatsApp & calendar confirmation shortly.
                </p>
                <button
                  type="button"
                  className={styles.bookBtn}
                  style={{ margin: "0 auto" }}
                  onClick={() => setBookingMentor(null)}
                >
                  Back to Mentors Directory
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MentorsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading Mentors...
        </div>
      }
    >
      <MentorsSearchContent />
    </Suspense>
  );
}
