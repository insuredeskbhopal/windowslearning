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
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import { DbMentor } from "@/lib/db";
import styles from "./page.module.css";

export default function MentorProfilePage({
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

  // Booking Form State
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
          setBookingTopic(`1-on-1 Lesson on ${firstSkill}`);
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

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentor) return;

    const isAuthed = requireAuth({
      redirect: `/mentors/${mentor.slug}?action=book`,
      action: "book",
      extraParams: { mentorId: mentor.id },
    });

    if (!isAuthed) return;

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
        <h1 style={{ color: "#f87171", marginBottom: "1rem" }}>Mentor Not Found</h1>
        <p style={{ color: "rgba(226, 237, 231, 0.7)", marginBottom: "2rem" }}>
          We could not locate this mentor profile.
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

  return (
    <div className={styles.profilePage}>
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

      <main className={styles.container}>
        {/* Back Link & Share Action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <Link href="/mentors" className={styles.backLink} style={{ margin: 0 }}>
            <ArrowLeft size={16} />
            <span>Back to All Mentors</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: copiedLink ? "#34d399" : "rgba(226, 237, 231, 0.8)",
              padding: "0.45rem 0.9rem",
              borderRadius: "10px",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            {copiedLink ? <CheckCircle2 size={14} color="#34d399" /> : <Share2 size={14} />}
            <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
          </button>
        </div>

        {/* Hero Card */}
        <div className={styles.heroCard}>
          <div className={styles.heroLeft}>
            <div className={styles.avatarWrapper}>
              {mentor.avatar && !mentor.avatar.includes("default") ? (
                <Image
                  src={mentor.avatar}
                  alt={mentor.name}
                  width={110}
                  height={110}
                  className={styles.avatarImg}
                  unoptimized
                />
              ) : (
                <div className={styles.avatarFallback}>{initials}</div>
              )}
              <div className={styles.verifiedBadge}>
                <ShieldCheck size={26} color="#34d399" />
              </div>
            </div>

            <div>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{mentor.name}</h1>
              </div>
              <div className={styles.roleTitle}>{mentor.role}</div>

              <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                  <MapPin size={15} color="#34d399" />
                  <span>{mentor.company}</span>
                </div>

                <div className={styles.metaItem}>
                  <Clock size={15} color="#34d399" />
                  <span>{mentor.experienceYears} Years Experience</span>
                </div>

                <div className={styles.metaItem}>
                  <Languages size={15} color="#34d399" />
                  <span>{mentor.timezone || "Hindi / English"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.priceTag}>
              {mentor.isFreeCommunity ? "Free Class" : `₹${mentor.hourlyRate}/hr`}
            </div>
            <div className={styles.availabilityPill}>
              <CheckCircle2 size={14} />
              <span>{mentor.availability}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className={styles.detailsGrid}>
          {/* Left Column: Bio, Skills & Schedule Details */}
          <div>
            {/* About Section */}
            <div className={styles.sectionBox}>
              <h2 className={styles.sectionTitle}>
                <BookOpen size={18} color="#34d399" />
                <span>About & Teaching Approach</span>
              </h2>
              <p className={styles.bioText}>
                {mentor.bio || "Passionate about mentoring and sharing practical, real-world skills step-by-step with eager learners."}
              </p>
            </div>

            {/* Skills & Topics */}
            <div className={styles.sectionBox}>
              <h2 className={styles.sectionTitle}>
                <Sparkles size={18} color="#34d399" />
                <span>Skills & Subjects Taught</span>
              </h2>
              <div className={styles.skillsList}>
                {(mentor.skills || []).map((skill) => (
                  <div key={skill} className={styles.skillPill}>
                    <CheckCircle2 size={14} />
                    <span>#{skill.replace(/-/g, " ")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How Lessons Work */}
            <div className={styles.sectionBox}>
              <h2 className={styles.sectionTitle}>
                <Video size={18} color="#34d399" />
                <span>How 1-on-1 Lessons Work</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.92rem", marginBottom: "2px" }}>
                      Pick a Date & Time Slot
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)" }}>
                      Choose your preferred lesson date and convenient time.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.92rem", marginBottom: "2px" }}>
                      Instant Video Meeting Link
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)" }}>
                      Receive direct session access in your Learner Dashboard.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.92rem", marginBottom: "2px" }}>
                      Learn Hands-on & Clear Doubts
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)" }}>
                      Personalized 1-on-1 practical feedback tailored to your goals.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div>
            <div className={styles.stickyBookingWidget}>
              <h3 className={styles.widgetTitle}>Book 1-on-1 Session</h3>
              <p className={styles.widgetSubtitle}>
                {mentor.isFreeCommunity ? "Free Community Class" : `₹${mentor.hourlyRate} for 1 hour live lesson`}
              </p>

              {bookingSuccess ? (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <CheckCircle2 size={42} color="#34d399" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.3rem" }}>
                    Session Booked Successfully!
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.7)", marginBottom: "1.25rem" }}>
                    Your session with {mentor.name} is confirmed. View details in your Learner Dashboard.
                  </p>
                  <Link
                    href="/learner/dashboard"
                    style={{
                      display: "block",
                      padding: "0.75rem",
                      background: "#34d399",
                      color: "#030a07",
                      borderRadius: "10px",
                      fontWeight: 700,
                      textDecoration: "none",
                      fontSize: "0.9rem",
                    }}
                  >
                    Go to Learner Dashboard →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className={styles.bookingForm}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>What would you like to learn?</label>
                    <input
                      type="text"
                      value={bookingTopic}
                      onChange={(e) => setBookingTopic(e.target.value)}
                      placeholder="e.g. Blouse cutting basics, Vedic math tricks..."
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
                    className={styles.bookNowBtn}
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <>
                        <Calendar size={16} />
                        <span>Confirm 1-on-1 Lesson</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
