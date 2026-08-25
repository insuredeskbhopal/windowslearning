"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  Users,
  CheckCircle2,
  Share2,
  Video,
  Languages,
  BookOpen,
  ArrowRight,
  Loader2,
  Star,
  Zap,
  Check,
  X,
  MessageSquare,
  Award,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import { DbMentor } from "@/lib/db";
import styles from "./page.module.css";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DedicatedMentorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, requireAuth } = useAuth();

  const [mentor, setMentor] = useState<DbMentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingTopic, setBookingTopic] = useState("");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [bookingTime, setBookingTime] = useState("10:00 AM - 11:00 AM (Morning)");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadMentor() {
      try {
        setLoading(true);
        const res = await fetch(`/api/mentors/${resolvedParams.slug}`);
        const data = await res.json();
        if (data.success && data.mentor) {
          setMentor(data.mentor);
          const firstSkill = data.mentor.skills?.[0] || data.mentor.role;
          setBookingTopic(`1-on-1 Mentorship on ${firstSkill}`);
        } else {
          setError(data.message || "Mentor profile not found");
        }
      } catch {
        setError("Failed to load mentor profile");
      } finally {
        setLoading(false);
      }
    }
    loadMentor();
  }, [resolvedParams.slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const openBookingModal = () => {
    const isAuthed = requireAuth({
      redirect: `/mentors/${mentor?.slug || resolvedParams.slug}?action=book`,
      action: "book",
      extraParams: { mentorId: mentor?.id },
    });

    if (isAuthed) {
      setIsBookingModalOpen(true);
      setBookingSuccess(false);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentor) return;

    setBookingLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: mentor.id,
          skillSlug: mentor.skills?.[0] || "general",
          topic: bookingTopic || `Lesson with ${mentor.name}`,
          scheduledDate: bookingDate,
          timeSlot: bookingTime,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingSuccess(true);
      } else {
        alert(data.message || "Booking failed. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading Mentor Profile...
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div style={{ minHeight: "100vh", background: "#020705", color: "#ffffff", padding: "4rem 2rem", textAlign: "center" }}>
        <h1 style={{ color: "#f87171", marginBottom: "1rem" }}>Mentor Profile Not Found</h1>
        <p style={{ color: "rgba(226, 237, 231, 0.7)", marginBottom: "2rem" }}>
          We could not locate this mentor profile in the directory.
        </p>
        <Link href="/mentors" style={{ color: "#34d399", textDecoration: "none", fontWeight: 700 }}>
          ← Back to Mentor Directory
        </Link>
      </div>
    );
  }

  const initials = mentor.name
    ? mentor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "M";

  const isReviewsEmpty = !mentor.reviewsCount || mentor.reviewsCount === 0;

  return (
    <div className={styles.profileRoot}>
      <div className={styles.ambientGlow} />

      <Navbar
        brandName="windowslearning"
        items={[
          { label: "SKILL", href: "/skills" },
          { label: "MENTOR", href: "/mentors" },
          { label: "COMMUNITY", href: "/#community" },
        ]}
        ctaLabel="FIND MENTORS"
        ctaHref="/mentors"
      />

      <main className={styles.mainContainer}>
        {/* Top Breadcrumb & Share Profile */}
        <div className={styles.topNavRow}>
          <Link href="/mentors" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Mentors Directory</span>
          </Link>

          <button type="button" onClick={handleShare} className={styles.shareBtn}>
            {copiedLink ? <CheckCircle2 size={15} color="#34d399" /> : <Share2 size={15} />}
            <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
          </button>
        </div>

        {/* ----------------------------------------------------
            Hero Section
            ---------------------------------------------------- */}
        <section className={styles.heroSection}>
          {/* Left Hero Card */}
          <div className={styles.heroLeft}>
            <div className={styles.profileIdentityRow}>
              <div className={styles.avatarWrapper}>
                {mentor.avatar && !mentor.avatar.includes("default") ? (
                  <Image
                    src={mentor.avatar}
                    alt={mentor.name}
                    width={120}
                    height={120}
                    className={styles.avatarImg}
                    unoptimized
                  />
                ) : (
                  <div className={styles.avatarFallback}>{initials}</div>
                )}
                <div className={styles.verifiedBadge}>
                  <ShieldCheck size={28} color="#34d399" />
                </div>
              </div>

              <div className={styles.identityInfo}>
                <div className={styles.nameRow}>
                  <h1 className={styles.mentorName}>
                    {mentor.name}
                    <span className={styles.verifiedPill}>
                      <ShieldCheck size={13} />
                      <span>Verified Mentor</span>
                    </span>
                  </h1>
                </div>

                <div className={styles.professionalTitle}>{mentor.role}</div>

                <div className={styles.metadataRow}>
                  <div className={styles.metaBadge}>
                    <MapPin size={15} color="#34d399" />
                    <span>{mentor.company || "India"}</span>
                  </div>

                  <div className={styles.metaBadge}>
                    <Clock size={15} color="#34d399" />
                    <span>{mentor.experienceYears} Years Experience</span>
                  </div>

                  <div className={styles.metaBadge}>
                    <Languages size={15} color="#34d399" />
                    <span>{mentor.timezone || "Hindi / English"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Short Bio summary */}
            <p className={styles.heroBioSummary}>
              {mentor.bio || "Dedicated mentor committed to practical guidance."}
            </p>

            {/* Compact Stats Row */}
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  <Star size={16} fill="#fbbf24" color="#fbbf24" />
                  <span>{mentor.reviewsCount > 0 ? `${mentor.rating} / 5` : "New Mentor"}</span>
                </div>
                <div className={styles.statLabel}>
                  {mentor.reviewsCount > 0 ? `${mentor.reviewsCount} Reviews` : "First Session Ready"}
                </div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  <Users size={16} color="#34d399" />
                  <span>1-on-1</span>
                </div>
                <div className={styles.statLabel}>Personal Guidance</div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  <BookOpen size={16} color="#34d399" />
                  <span>{(mentor.skills || []).length}</span>
                </div>
                <div className={styles.statLabel}>Teaching Skills</div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  <Award size={16} color="#34d399" />
                  <span>{mentor.experienceYears}+ yrs</span>
                </div>
                <div className={styles.statLabel}>Experience</div>
              </div>
            </div>
          </div>

          {/* Right Sticky Booking Card */}
          <aside className={styles.stickyBookingCard}>
            <div className={styles.bookingStatusTag}>
              <span className={styles.badgeDot} />
              <span>Available for 1-on-1 Lessons</span>
            </div>

            <div className={styles.pricingBlock}>
              <div className={styles.priceAmount}>
                {mentor.isFreeCommunity ? "Free Class" : `₹${mentor.hourlyRate}`}
              </div>
              <div className={styles.priceSubtext}>
                {mentor.isFreeCommunity ? "Community Tier • 60 min session" : "per 60-minute practical session"}
              </div>
            </div>

            <div className={styles.nextSlotPill}>
              <Calendar size={16} color="#34d399" />
              <span>Next Available: <strong>{mentor.availability}</strong></span>
            </div>

            <button
              type="button"
              onClick={openBookingModal}
              className={styles.primaryBookBtn}
            >
              <Calendar size={18} />
              <span>Book a Session</span>
            </button>

            <button
              type="button"
              onClick={() => {
                alert(`Starting quick message with mentor ${mentor.name}. You can also book directly!`);
              }}
              className={styles.secondaryMessageBtn}
            >
              <MessageSquare size={16} />
              <span>Message Mentor</span>
            </button>

            <div className={styles.guaranteeList}>
              <div className={styles.guaranteeItem}>
                <Check size={14} color="#34d399" />
                <span>Private 1-on-1 live video session</span>
              </div>
              <div className={styles.guaranteeItem}>
                <Check size={14} color="#34d399" />
                <span>Customized hands-on practice & feedback</span>
              </div>
              <div className={styles.guaranteeItem}>
                <Check size={14} color="#34d399" />
                <span>Session notes & recorded takeaways</span>
              </div>
            </div>
          </aside>
        </section>

        {/* ----------------------------------------------------
            Section 1: About the Mentor
            ---------------------------------------------------- */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <BookOpen size={20} color="#34d399" />
              <span>About {mentor.name}</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Background, practical journey, and mentoring approach
            </p>
          </div>

          <p className={styles.bodyParagraph}>
            {mentor.bio || "Dedicated mentor committed to practical, step-by-step guidance."}
          </p>
        </section>

        {/* ----------------------------------------------------
            Section 2: Skills & Expertise
            ---------------------------------------------------- */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Sparkles size={20} color="#34d399" />
              <span>Skills Taught in 1-on-1 Lessons</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Topics and practical domains covered in sessions
            </p>
          </div>

          <div className={styles.skillsGrid}>
            {(mentor.skills || [mentor.role]).map((skill, idx) => (
              <div key={skill} className={styles.skillCard}>
                <div className={styles.skillName}>
                  #{skill.replace(/-/g, " ")}
                </div>
                <span className={styles.skillProficiencyTag}>
                  {idx === 0 ? "Expert" : idx === 1 ? "Advanced" : "Practical"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------
            Section 3: Weekly Availability Schedule
            ---------------------------------------------------- */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Clock size={20} color="#34d399" />
              <span>Weekly Teaching Schedule</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Active availability slots for 1-on-1 bookings
            </p>
          </div>

          <div className={styles.scheduleGrid}>
            {DAYS_OF_WEEK.map((day) => {
              const isWeekendOnly = mentor.availability === "Weekend Only";
              const isWeekend = day === "Saturday" || day === "Sunday";
              const isAvailable = isWeekendOnly ? isWeekend : true;

              return (
                <div key={day} className={styles.dayCard} style={{ opacity: isAvailable ? 1 : 0.45 }}>
                  <div className={styles.dayName}>{day}</div>
                  <div className={styles.daySlot} style={{ color: isAvailable ? "#34d399" : "rgba(226, 237, 231, 0.4)" }}>
                    {isAvailable ? "Available" : "Off"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ----------------------------------------------------
            Section 4: Learner Reviews
            ---------------------------------------------------- */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Star size={20} color="#fbbf24" />
              <span>Learner Reviews & Ratings</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Authentic feedback from students
            </p>
          </div>

          {!isReviewsEmpty ? (
            <div className={styles.reviewsGrid}>
              <div className={styles.reviewCard}>
                <div className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p className={styles.reviewQuote}>
                  &ldquo;Extremely patient and approachable teacher! Solved all my doubts step-by-step. Highly recommend to anyone wanting real practical skills.&rdquo;
                </p>
                <div className={styles.reviewerRow}>
                  <div className={styles.reviewerAvatar}>PK</div>
                  <div>
                    <div className={styles.reviewerName}>Learner Feedback</div>
                    <div className={styles.reviewTopic}>1-on-1 Mentorship</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem 1rem", background: "rgba(4, 13, 9, 0.5)", borderRadius: "14px" }}>
              <ShieldCheck size={36} color="#34d399" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
              <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "1.05rem", marginBottom: "0.3rem" }}>
                New Verified Mentor Profile
              </div>
              <p style={{ fontSize: "0.88rem", color: "rgba(226, 237, 231, 0.7)", maxWidth: "440px", margin: "0 auto 1.25rem auto" }}>
                {mentor.name} is verified and ready to accept their first learners. Book a 1-on-1 session to get dedicated guidance!
              </p>
              <button
                type="button"
                onClick={openBookingModal}
                className={styles.primaryBookBtn}
                style={{ width: "auto", padding: "0.75rem 1.5rem", margin: "0 auto" }}
              >
                <span>Book First Session</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </section>

        {/* ----------------------------------------------------
            Section 5: Final High-Conversion CTA Banner
            ---------------------------------------------------- */}
        <div className={styles.conversionBanner}>
          <h2 className={styles.bannerTitle}>
            Ready to Learn with {mentor.name}?
          </h2>
          <p className={styles.bannerSubtitle}>
            Reserve your 1-on-1 session today and start mastering practical skills with personalized feedback.
          </p>

          <div className={styles.bannerBtnRow}>
            <button
              type="button"
              onClick={openBookingModal}
              className={styles.primaryBookBtn}
              style={{ width: "auto", padding: "1rem 2.25rem", margin: 0 }}
            >
              <Calendar size={18} />
              <span>Book a 1-on-1 Session</span>
            </button>
          </div>
        </div>
      </main>

      {/* ----------------------------------------------------
          Mobile Sticky Booking Bottom Bar
          ---------------------------------------------------- */}
      <div className={styles.mobileStickyBar}>
        <div>
          <div className={styles.mobilePrice}>
            {mentor.isFreeCommunity ? "Free" : `₹${mentor.hourlyRate}`}
          </div>
          <div className={styles.mobileSubtext}>60 min 1-on-1 session</div>
        </div>

        <button
          type="button"
          onClick={openBookingModal}
          className={styles.mobileBookBtn}
        >
          <Calendar size={16} />
          <span>Book Session</span>
        </button>
      </div>

      {/* ----------------------------------------------------
          Interactive Booking Modal Overlay
          ---------------------------------------------------- */}
      {isBookingModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsBookingModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setIsBookingModalOpen(false)}
            >
              <X size={18} />
            </button>

            {bookingSuccess ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <CheckCircle2 size={48} color="#34d399" style={{ margin: "0 auto 1rem auto", display: "block" }} />
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
                  Session Booked Successfully!
                </h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(226, 237, 231, 0.75)", marginBottom: "1.75rem", lineHeight: "1.6" }}>
                  Your 1-on-1 session with <strong>{mentor.name}</strong> is confirmed. You can view meeting links in your Learner Dashboard.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <Link
                    href="/learner/dashboard"
                    className={styles.primaryBookBtn}
                    style={{ textDecoration: "none", width: "auto", padding: "0.8rem 1.5rem", margin: 0 }}
                  >
                    <span>Go to Learner Dashboard</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.35rem 0" }}>
                  Book 1-on-1 Session with {mentor.name}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.7)", margin: 0 }}>
                  {mentor.isFreeCommunity ? "Free Community Class" : `₹${mentor.hourlyRate} • 60 min session`}
                </p>

                <form onSubmit={handleConfirmBooking} className={styles.modalForm}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>What would you like to learn / ask?</label>
                    <input
                      type="text"
                      value={bookingTopic}
                      onChange={(e) => setBookingTopic(e.target.value)}
                      placeholder="e.g. Master blouse cutting, debug Node.js backend..."
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Select Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className={styles.input}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Select Time Slot</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className={styles.input}
                      style={{ cursor: "pointer" }}
                    >
                      <option value="10:00 AM - 11:00 AM (Morning)">10:00 AM – 11:00 AM (Morning)</option>
                      <option value="02:00 PM - 03:00 PM (Afternoon)">02:00 PM – 03:00 PM (Afternoon)</option>
                      <option value="06:00 PM - 07:00 PM (Evening)">06:00 PM – 07:00 PM (Evening)</option>
                      <option value="08:30 PM - 09:30 PM (Night)">08:30 PM – 09:30 PM (Night)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className={styles.primaryBookBtn}
                    style={{ marginTop: "0.5rem" }}
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Confirming Booking...</span>
                      </>
                    ) : (
                      <>
                        <Calendar size={18} />
                        <span>Confirm 1-on-1 Lesson</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
