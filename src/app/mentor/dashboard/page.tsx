"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  DollarSign,
  User,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Users,
  Video,
  LogOut,
  Save,
  Loader2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Languages,
  ToggleLeft,
  ToggleRight,
  Sun,
  Moon,
  Coffee,
  Zap,
  Palmtree,
  Bell,
  Activity,
  CheckCheck,
  Edit3,
  Eye,
  Star,
  Plus,
  X,
  Award,
  Briefcase,
  Share2,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/Navbar/BrandLogo";
import styles from "./page.module.css";
import profileStyles from "@/app/mentors/[slug]/page.module.css";

type TabKey = "overview" | "sessions" | "availability" | "skills" | "earnings" | "profile";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MentorStudioPage() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  // Dynamic Profile Form States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editExperienceYears, setEditExperienceYears] = useState<number>(2);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [editRate, setEditRate] = useState<number | string>(200);
  const [editIsFree, setEditIsFree] = useState(false);
  const [editAvailability, setEditAvailability] = useState("Available Today");
  const [editLanguage, setEditLanguage] = useState("Hindi / English");
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [upiId, setUpiId] = useState("mentor@okaxis");
  const [copiedLink, setCopiedLink] = useState(false);

  // Availability Management States
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [morningSlot, setMorningSlot] = useState(true);
  const [afternoonSlot, setAfternoonSlot] = useState(true);
  const [eveningSlot, setEveningSlot] = useState(true);
  const [nightSlot, setNightSlot] = useState(false);
  const [instantBooking, setInstantBooking] = useState(true);
  const [vacationMode, setVacationMode] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/mentor/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadStudioData() {
      try {
        setFetchingData(true);
        // 1. Fetch Mentor Profile
        const profileRes = await fetch("/api/onboarding/mentor");
        const profileData = await profileRes.json();
        if (profileData.success && profileData.profile) {
          const p = profileData.profile;
          setProfile(p);
          setEditTitle(p.title || "");
          setEditLocation(p.location || "India");
          setEditBio(p.bio || "");
          setEditExperienceYears(p.experienceYears || 2);
          setEditSkills(Array.isArray(p.teachingSkills) ? p.teachingSkills : ["skill-coaching"]);
          setEditRate(p.hourlyRate !== undefined ? p.hourlyRate : 200);
          setEditIsFree(p.isFreeCommunity || false);
          setEditAvailability(p.availability || "Available Today");
          setEditLanguage(p.preferredLanguage || "Hindi / English");
        }

        // 2. Fetch Bookings
        const bookingsRes = await fetch("/api/bookings");
        const bookingsData = await bookingsRes.json();
        if (bookingsData.success && Array.isArray(bookingsData.bookings)) {
          setBookings(bookingsData.bookings);
        }
      } catch (err) {
        console.error("Failed to load studio data:", err);
      } finally {
        setFetchingData(false);
      }
    }
    if (user) {
      loadStudioData();
    }
  }, [user]);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (trimmed && !editSkills.includes(trimmed)) {
      setEditSkills([...editSkills, trimmed]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter((s) => s !== skillToRemove));
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/mentors/${profileSlug}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);

    try {
      const skillsToSave = editSkills.length > 0 ? editSkills : ["practical-guidance"];
      const res = await fetch("/api/onboarding/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          location: editLocation,
          bio: editBio,
          teachingSkills: skillsToSave,
          experienceYears: Number(editExperienceYears) || 1,
          hourlyRate: editIsFree ? 0 : Number(editRate),
          isFreeCommunity: editIsFree,
          availability: editAvailability,
          preferredLanguage: editLanguage,
        }),
      });

      if (res.ok) {
        await refreshUser();
        setProfile((prev: any) => ({
          ...prev,
          title: editTitle,
          location: editLocation,
          bio: editBio,
          teachingSkills: skillsToSave,
          experienceYears: Number(editExperienceYears) || 1,
          hourlyRate: editIsFree ? 0 : Number(editRate),
          isFreeCommunity: editIsFree,
          availability: editAvailability,
          preferredLanguage: editLanguage,
        }));
        setSaveSuccess(true);
        setIsEditingProfile(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      alert("Failed to save profile changes.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading Mentor Studio...
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "M";

  const profileSlug = (user.name || "mentor").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + user.id.substring(0, 5);

  const activeSkillsList = profile?.teachingSkills && profile.teachingSkills.length > 0
    ? profile.teachingSkills
    : editSkills.length > 0
    ? editSkills
    : ["practical-skills"];

  return (
    <div className={styles.studioRoot}>
      <div className={styles.ambientGlow} />

      {/* ----------------------------------------------------
          Left Dark Emerald Sidebar (Locked in Place)
          ---------------------------------------------------- */}
      <aside className={styles.sidebar}>
        <div>
          {/* Header Branding */}
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.brandLink}>
              <BrandLogo size={24} />
              <div className={styles.brandText}>
                windows<span>learning</span>
              </div>
            </Link>
            <div className={styles.studioBadge}>
              <span className={styles.badgePulse} />
              <span>Mentor Studio</span>
            </div>
          </div>

          {/* Navigation Menu List */}
          <ul className={styles.navList}>
            <li>
              <button
                type="button"
                className={`${styles.navItemBtn} ${activeTab === "overview" ? styles.navItemBtnActive : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <div className={styles.navItemLeft}>
                  <LayoutDashboard size={18} />
                  <span>Studio Overview</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`${styles.navItemBtn} ${activeTab === "profile" ? styles.navItemBtnActive : ""}`}
                onClick={() => {
                  setActiveTab("profile");
                  setIsEditingProfile(false);
                }}
              >
                <div className={styles.navItemLeft}>
                  <User size={18} />
                  <span>Public Profile Page</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`${styles.navItemBtn} ${activeTab === "sessions" ? styles.navItemBtnActive : ""}`}
                onClick={() => setActiveTab("sessions")}
              >
                <div className={styles.navItemLeft}>
                  <Calendar size={18} />
                  <span>Learner Sessions</span>
                </div>
                {bookings.length > 0 && <span className={styles.navBadge}>{bookings.length}</span>}
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`${styles.navItemBtn} ${activeTab === "availability" ? styles.navItemBtnActive : ""}`}
                onClick={() => setActiveTab("availability")}
              >
                <div className={styles.navItemLeft}>
                  <Clock size={18} />
                  <span>Schedule & Availability</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`${styles.navItemBtn} ${activeTab === "skills" ? styles.navItemBtnActive : ""}`}
                onClick={() => setActiveTab("skills")}
              >
                <div className={styles.navItemLeft}>
                  <BookOpen size={18} />
                  <span>Skills & Pricing</span>
                </div>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`${styles.navItemBtn} ${activeTab === "earnings" ? styles.navItemBtnActive : ""}`}
                onClick={() => setActiveTab("earnings")}
              >
                <div className={styles.navItemLeft}>
                  <DollarSign size={18} />
                  <span>Earnings & Payouts</span>
                </div>
              </button>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer User Card */}
        <div className={styles.sidebarFooter}>
          <div className={styles.mentorUserCard}>
            <div className={styles.mentorAvatar}>{initials}</div>
            <div className={styles.mentorInfo}>
              <div className={styles.mentorName}>{user.name}</div>
              <div className={styles.mentorRoleTag}>Verified Mentor</div>
            </div>
            <ShieldCheck size={16} color="#34d399" />
          </div>

          <Link href="/learner/dashboard" className={styles.switchModeBtn}>
            <span>Switch to Learner View</span>
            <ArrowRight size={14} />
          </Link>

          <button type="button" onClick={() => logout()} className={styles.logoutBtn}>
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ----------------------------------------------------
          Main Studio Dashboard View
          ---------------------------------------------------- */}
      <div className={styles.mainWrapper}>
        {/* Top Header Bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <h1 className={styles.pageHeaderTitle}>
              {activeTab === "overview" && "Studio Overview"}
              {activeTab === "profile" && (isEditingProfile ? "Edit Mentor Profile Details" : "Public Profile Page")}
              {activeTab === "sessions" && "Scheduled Learner Lessons"}
              {activeTab === "availability" && "Schedule & Availability Settings"}
              {activeTab === "skills" && "Teaching Skills & Rates"}
              {activeTab === "earnings" && "Earnings & Bank Payouts"}
            </h1>
          </div>

          <div className={styles.topBarRight}>
            <div className={styles.statusToggle}>
              <span className={styles.badgePulse} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                {vacationMode ? <Palmtree size={14} color="#34d399" /> : <CheckCircle2 size={14} color="#34d399" />}
                <span>{vacationMode ? "Out of Office" : "Available for 1-on-1 Lessons"}</span>
              </div>
            </div>

            <Link href={`/mentors/${profileSlug}`} target="_blank" className={styles.viewDirectoryLink}>
              <span>Public Directory URL</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* Dynamic Tab Content Area */}
        <main className={styles.contentArea}>
          {/* ----------------------------------------------------
              TAB 1: STUDIO OVERVIEW (3-COLUMN BALANCED VIEW)
              ---------------------------------------------------- */}
          {activeTab === "overview" && (
            <div>
              {/* 4 Metric Cards */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricTop}>
                    <span className={styles.metricLabel}>Profile Status</span>
                    <div className={styles.metricIconWrapper}>
                      <ShieldCheck size={18} />
                    </div>
                  </div>
                  <div className={styles.metricValue}>Active</div>
                  <div className={styles.metricSubtext}>
                    <CheckCircle2 size={13} />
                    <span>Listed on Directory</span>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricTop}>
                    <span className={styles.metricLabel}>Hourly Fee</span>
                    <div className={styles.metricIconWrapper}>
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <div className={styles.metricValue}>
                    {profile?.isFreeCommunity ? "Free" : `₹${profile?.hourlyRate || editRate}`}
                  </div>
                  <div className={styles.metricSubtext}>
                    <span>{profile?.isFreeCommunity ? "Community Tier" : "Per 1-Hour Session"}</span>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricTop}>
                    <span className={styles.metricLabel}>Upcoming Lessons</span>
                    <div className={styles.metricIconWrapper}>
                      <Calendar size={18} />
                    </div>
                  </div>
                  <div className={styles.metricValue}>{bookings.length}</div>
                  <div className={styles.metricSubtext}>
                    <span>Scheduled Sessions</span>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricTop}>
                    <span className={styles.metricLabel}>Mentor Rating</span>
                    <div className={styles.metricIconWrapper}>
                      <Sparkles size={18} />
                    </div>
                  </div>
                  <div className={styles.metricValue} style={{ fontSize: profile?.reviewsCount > 0 ? "1.6rem" : "1.3rem" }}>
                    {profile?.reviewsCount > 0 ? `${profile.rating} ★` : "New Mentor"}
                  </div>
                  <div className={styles.metricSubtext}>
                    <span>
                      {profile?.reviewsCount > 0
                        ? `${profile.reviewsCount} learner reviews`
                        : "Ready for first learner"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3-Column Content Layout */}
              <div className={styles.studioColumnsGrid}>
                {/* Column 1: Scheduled Lessons */}
                <div>
                  <div className={styles.cardSection}>
                    <div className={styles.cardSectionTitleRow}>
                      <div className={styles.cardSectionTitle}>
                        <Calendar size={18} color="#34d399" />
                        <span>Upcoming 1-on-1 Sessions</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("sessions")}
                        style={{ background: "none", border: "none", color: "#34d399", fontSize: "0.82rem", cursor: "pointer" }}
                      >
                        View All →
                      </button>
                    </div>

                    {fetchingData ? (
                      <div style={{ padding: "2rem 0", color: "rgba(226, 237, 231, 0.6)", fontSize: "0.9rem" }}>
                        Loading session schedules...
                      </div>
                    ) : bookings.length > 0 ? (
                      <div>
                        {bookings.map((b) => (
                          <div key={b.id} className={styles.sessionItem}>
                            <div className={styles.sessionLeft}>
                              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                                <Users size={18} />
                              </div>
                              <div>
                                <div className={styles.sessionTopic}>{b.topic}</div>
                                <div className={styles.sessionMeta}>
                                  <Clock size={12} />
                                  <span>{new Date(b.scheduledDate).toLocaleDateString()} • {b.timeSlot}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              className={styles.actionPillBtn}
                              onClick={() => alert(`Starting 1-on-1 video room for session #${b.id}`)}
                            >
                              <Video size={14} />
                              <span>Join Room</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: "2.5rem 1rem", background: "rgba(4, 13, 9, 0.5)", borderRadius: "14px" }}>
                        <CheckCircle2 size={36} color="#34d399" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                        <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem" }}>
                          Profile is Active on the Directory
                        </div>
                        <p style={{ fontSize: "0.88rem", color: "rgba(226, 237, 231, 0.65)", maxWidth: "420px", margin: "0 auto 1.25rem auto", lineHeight: "1.5" }}>
                          Learners can now book lessons with you. When someone books a 1-on-1 slot, you will receive real-time notifications right here.
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab("profile")}
                          className={styles.saveBtn}
                          style={{ margin: "0 auto" }}
                        >
                          <span>View Your Profile Page</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 2: Public Profile Card Preview */}
                <div>
                  <div className={styles.cardSection}>
                    <div className={styles.cardSectionTitleRow}>
                      <div className={styles.cardSectionTitle}>
                        <span>Public Profile Preview</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        style={{ color: "#34d399", background: "none", border: "none", fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
                      >
                        <span>Full Page →</span>
                      </button>
                    </div>

                    <div style={{ background: "rgba(4, 13, 9, 0.7)", border: "1px solid rgba(52, 211, 153, 0.25)", borderRadius: "14px", padding: "1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <div className={styles.mentorAvatar}>{initials}</div>
                        <div>
                          <div style={{ fontWeight: 700, color: "#ffffff" }}>{user.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "#34d399" }}>
                            {profile?.title || editTitle || "Master Mentor"}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: "0.78rem", color: "rgba(226, 237, 231, 0.65)", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                        <MapPin size={12} color="#34d399" />
                        <span>{profile?.location || editLocation || "India"}</span>
                      </div>

                      <p style={{ fontSize: "0.84rem", color: "rgba(226, 237, 231, 0.8)", lineHeight: "1.5", margin: "0 0 1rem 0" }}>
                        {profile?.bio || editBio || "Passionate about mentoring and sharing practical skills."}
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {activeSkillsList.map((s: string) => (
                          <span
                            key={s}
                            style={{
                              fontSize: "0.72rem",
                              background: "rgba(16, 185, 129, 0.12)",
                              border: "1px solid rgba(52, 211, 153, 0.25)",
                              color: "#34d399",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "9999px",
                            }}
                          >
                            #{s.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Recent Activity & Notifications Box */}
                <div>
                  <div className={styles.cardSection}>
                    <div className={styles.cardSectionTitleRow}>
                      <div className={styles.cardSectionTitle}>
                        <Bell size={18} color="#34d399" />
                        <span>Recent Activity & Updates</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: "#34d399", background: "rgba(16, 185, 129, 0.12)", padding: "0.2rem 0.5rem", borderRadius: "9999px" }}>
                        <span className={styles.badgePulse} />
                        <span>Live Feed</span>
                      </div>
                    </div>

                    <div className={styles.activityList}>
                      {/* Booking Notifications */}
                      {bookings.length > 0 ? (
                        bookings.map((b) => (
                          <div key={`act-${b.id}`} className={styles.activityItem}>
                            <div className={styles.activityIconWrap}>
                              <Calendar size={16} />
                            </div>
                            <div className={styles.activityContent}>
                              <div className={styles.activityTitle}>
                                <span>New 1-on-1 Lesson Booked</span>
                                <span className={styles.activityTime}>Just Now</span>
                              </div>
                              <p className={styles.activityDesc}>
                                Student booked <strong>{b.topic}</strong> for {new Date(b.scheduledDate).toLocaleDateString()} at {b.timeSlot}.
                              </p>
                            </div>
                          </div>
                        ))
                      ) : null}

                      {/* Profile Verified & Live */}
                      <div className={styles.activityItem}>
                        <div className={styles.activityIconWrap}>
                          <ShieldCheck size={16} />
                        </div>
                        <div className={styles.activityContent}>
                          <div className={styles.activityTitle}>
                            <span>Mentor Profile Active</span>
                            <span className={styles.activityTime}>Active</span>
                          </div>
                          <p className={styles.activityDesc}>
                            Your profile is verified and visible to learners on the public mentor directory.
                          </p>
                        </div>
                      </div>

                      {/* Instant Confirmation */}
                      <div className={styles.activityItem}>
                        <div className={styles.activityIconWrap}>
                          <Zap size={16} />
                        </div>
                        <div className={styles.activityContent}>
                          <div className={styles.activityTitle}>
                            <span>Instant Booking Enabled</span>
                            <span className={styles.activityTime}>Enabled</span>
                          </div>
                          <p className={styles.activityDesc}>
                            Learners can auto-confirm 1-on-1 lessons directly from your profile page.
                          </p>
                        </div>
                      </div>

                      {/* UPI Payout Ready */}
                      <div className={styles.activityItem}>
                        <div className={styles.activityIconWrap}>
                          <DollarSign size={16} />
                        </div>
                        <div className={styles.activityContent}>
                          <div className={styles.activityTitle}>
                            <span>Payout Method Configured</span>
                            <span className={styles.activityTime}>Ready</span>
                          </div>
                          <p className={styles.activityDesc}>
                            Earnings will be transferred directly to your configured UPI ID.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 2: DYNAMIC 100% REAL PROFILE PAGE (INSIDE DASHBOARD)
              ---------------------------------------------------- */}
          {activeTab === "profile" && (
            <div>
              {/* Profile Top Actions Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", background: "rgba(12, 29, 21, 0.8)", border: "1px solid rgba(52, 211, 153, 0.25)", borderRadius: "16px", padding: "1rem 1.5rem" }}>
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>
                    {isEditingProfile ? "Editing Real Profile Details" : "Your Real Mentor Profile"}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)" }}>
                    {isEditingProfile
                      ? "Update your title, bio, skills, location, rate, and availability below"
                      : "Live dynamic view connected directly to your PostgreSQL database"}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    style={{
                      padding: "0.6rem 1.25rem",
                      borderRadius: "10px",
                      background: isEditingProfile ? "rgba(255,255,255,0.08)" : "#34d399",
                      color: isEditingProfile ? "#ffffff" : "#030a07",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    {isEditingProfile ? (
                      <>
                        <Eye size={16} />
                        <span>Preview Live Profile</span>
                      </>
                    ) : (
                      <>
                        <Edit3 size={16} />
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    style={{
                      padding: "0.6rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: copiedLink ? "#34d399" : "rgba(226, 237, 231, 0.85)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    {copiedLink ? <CheckCircle2 size={15} color="#34d399" /> : <Share2 size={15} />}
                    <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
                  </button>
                </div>
              </div>

              {/* Form Mode if Editing */}
              {isEditingProfile ? (
                <div className={styles.cardSection}>
                  <div className={styles.cardSectionTitleRow}>
                    <div className={styles.cardSectionTitle}>
                      <Edit3 size={20} color="#34d399" />
                      <span>Edit Real Mentor Profile</span>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className={styles.formGrid}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Professional Title / Speciality</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="e.g. Node JS & Backend Specialist, Master Tailor..."
                          className={styles.input}
                          required
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>City, State & Country</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="e.g. Bhopal, Madhya Pradesh, India"
                          className={styles.input}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Languages You Teach In</label>
                        <input
                          type="text"
                          value={editLanguage}
                          onChange={(e) => setEditLanguage(e.target.value)}
                          placeholder="e.g. Hindi, English"
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Years of Experience</label>
                        <input
                          type="number"
                          value={editExperienceYears}
                          onChange={(e) => setEditExperienceYears(Number(e.target.value))}
                          className={styles.input}
                          min={1}
                          max={50}
                        />
                      </div>
                    </div>

                    {/* Dynamic Skills Adder / Remover */}
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Teaching Skills (Add or Remove)</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        {editSkills.map((skill) => (
                          <span
                            key={skill}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              padding: "0.35rem 0.75rem",
                              background: "rgba(16, 185, 129, 0.15)",
                              border: "1px solid rgba(52, 211, 153, 0.3)",
                              borderRadius: "9999px",
                              color: "#34d399",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                            }}
                          >
                            <span>#{skill.replace(/-/g, " ")}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: 0, display: "flex" }}
                            >
                              <X size={13} />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          type="text"
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                          placeholder="Type a skill and press Add (e.g. Node JS, Tailoring, Math, Cooking)..."
                          className={styles.input}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className={styles.saveBtn}
                          style={{ padding: "0.6rem 1.25rem", whiteSpace: "nowrap" }}
                        >
                          <Plus size={16} />
                          <span>Add Skill</span>
                        </button>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>About You & Teaching Approach</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="Write a genuine introduction explaining what skills you teach, your practical background, and how you guide learners..."
                        className={styles.textarea}
                        rows={5}
                        required
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Hourly Rate (₹)</label>
                        <input
                          type="number"
                          value={editRate}
                          onChange={(e) => setEditRate(e.target.value)}
                          disabled={editIsFree}
                          className={styles.input}
                          min={0}
                          step={50}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Availability Tag</label>
                        <select
                          value={editAvailability}
                          onChange={(e) => setEditAvailability(e.target.value)}
                          className={styles.input}
                          style={{ cursor: "pointer" }}
                        >
                          <option value="Available Today">Available Today (Daily Sessions)</option>
                          <option value="This Week">This Week (Flexible Weekdays)</option>
                          <option value="Weekend Only">Weekend Only (Sat & Sun)</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" disabled={savingProfile} className={styles.saveBtn}>
                      {savingProfile ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Saving Profile to Database...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save & Update Profile</span>
                        </>
                      )}
                    </button>

                    {saveSuccess && (
                      <div style={{ color: "#34d399", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <CheckCircle2 size={16} />
                        <span>Profile saved and updated live on the database!</span>
                      </div>
                    )}
                  </form>
                </div>
              ) : (
                /* Dynamic Authentic Profile View (No Generic Filler) */
                <div>
                  {/* Hero Card */}
                  <div className={profileStyles.heroSection}>
                    <div className={profileStyles.heroLeft}>
                      <div className={profileStyles.profileIdentityRow}>
                        <div className={profileStyles.avatarWrapper}>
                          <div className={profileStyles.avatarFallback}>{initials}</div>
                          <div className={profileStyles.verifiedBadge}>
                            <ShieldCheck size={28} color="#34d399" />
                          </div>
                        </div>

                        <div className={profileStyles.identityInfo}>
                          <div className={profileStyles.nameRow}>
                            <h1 className={profileStyles.mentorName}>
                              {user.name}
                              <span className={profileStyles.verifiedPill}>
                                <ShieldCheck size={13} />
                                <span>Verified Mentor</span>
                              </span>
                            </h1>
                          </div>

                          <div className={profileStyles.professionalTitle}>
                            {profile?.title || editTitle || "Master Mentor"}
                          </div>

                          <div className={profileStyles.metadataRow}>
                            <div className={profileStyles.metaBadge}>
                              <MapPin size={15} color="#34d399" />
                              <span>{profile?.location || editLocation || "India"}</span>
                            </div>

                            <div className={profileStyles.metaBadge}>
                              <Clock size={15} color="#34d399" />
                              <span>{profile?.experienceYears || editExperienceYears} Years Experience</span>
                            </div>

                            <div className={profileStyles.metaBadge}>
                              <Languages size={15} color="#34d399" />
                              <span>{profile?.preferredLanguage || editLanguage || "Hindi / English"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className={profileStyles.heroBioSummary}>
                        {profile?.bio || editBio || "Dedicated mentor offering practical 1-on-1 guidance."}
                      </p>

                      <div className={profileStyles.statsRow}>
                        <div className={profileStyles.statItem}>
                          <div className={profileStyles.statValue}>
                            <Star size={16} fill="#fbbf24" color="#fbbf24" />
                            <span>{profile?.reviewsCount > 0 ? `${profile.rating} / 5` : "New Mentor"}</span>
                          </div>
                          <div className={profileStyles.statLabel}>
                            {profile?.reviewsCount > 0 ? `${profile.reviewsCount} Reviews` : "First Session Ready"}
                          </div>
                        </div>

                        <div className={profileStyles.statItem}>
                          <div className={profileStyles.statValue}>
                            <Users size={16} color="#34d399" />
                            <span>1-on-1</span>
                          </div>
                          <div className={profileStyles.statLabel}>Personal Guidance</div>
                        </div>

                        <div className={profileStyles.statItem}>
                          <div className={profileStyles.statValue}>
                            <BookOpen size={16} color="#34d399" />
                            <span>{activeSkillsList.length}</span>
                          </div>
                          <div className={profileStyles.statLabel}>Skills Listed</div>
                        </div>

                        <div className={profileStyles.statItem}>
                          <div className={profileStyles.statValue}>
                            <Award size={16} color="#34d399" />
                            <span>{profile?.experienceYears || editExperienceYears}+ yrs</span>
                          </div>
                          <div className={profileStyles.statLabel}>Experience</div>
                        </div>
                      </div>
                    </div>

                    {/* Right-Side Booking Card */}
                    <aside className={profileStyles.stickyBookingCard}>
                      <div className={profileStyles.bookingStatusTag}>
                        <span className={profileStyles.badgeDot} />
                        <span>Available for 1-on-1 Lessons</span>
                      </div>

                      <div className={profileStyles.pricingBlock}>
                        <div className={profileStyles.priceAmount}>
                          {profile?.isFreeCommunity ? "Free Class" : `₹${profile?.hourlyRate || editRate}`}
                        </div>
                        <div className={profileStyles.priceSubtext}>
                          {profile?.isFreeCommunity ? "Community Tier • 60 min session" : "per 60-minute practical session"}
                        </div>
                      </div>

                      <div className={profileStyles.nextSlotPill}>
                        <Calendar size={16} color="#34d399" />
                        <span>Next Available: <strong>{profile?.availability || editAvailability}</strong></span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(true)}
                        className={profileStyles.primaryBookBtn}
                      >
                        <Edit3 size={18} />
                        <span>Edit Profile & Rates</span>
                      </button>

                      <div className={profileStyles.guaranteeList}>
                        <div className={profileStyles.guaranteeItem}>
                          <Check size={14} color="#34d399" />
                          <span>Private 1-on-1 live video session</span>
                        </div>
                        <div className={profileStyles.guaranteeItem}>
                          <Check size={14} color="#34d399" />
                          <span>Customized hands-on practice & feedback</span>
                        </div>
                        <div className={profileStyles.guaranteeItem}>
                          <Check size={14} color="#34d399" />
                          <span>Session notes & direct doubt resolution</span>
                        </div>
                      </div>
                    </aside>
                  </div>

                  {/* About Section */}
                  <div className={profileStyles.sectionCard}>
                    <div className={profileStyles.sectionHeader}>
                      <h2 className={profileStyles.sectionTitle}>
                        <BookOpen size={20} color="#34d399" />
                        <span>About {user.name}</span>
                      </h2>
                      <p className={profileStyles.sectionSubtitle}>
                        Background, practical journey, and mentoring approach
                      </p>
                    </div>

                    <p className={profileStyles.bodyParagraph}>
                      {profile?.bio || editBio || "Dedicated mentor committed to practical 1-on-1 guidance."}
                    </p>
                  </div>

                  {/* Skills Section */}
                  <div className={profileStyles.sectionCard}>
                    <div className={profileStyles.sectionHeader}>
                      <h2 className={profileStyles.sectionTitle}>
                        <Sparkles size={20} color="#34d399" />
                        <span>Skills Taught in 1-on-1 Lessons</span>
                      </h2>
                      <p className={profileStyles.sectionSubtitle}>
                        Topics and areas available for personalized sessions
                      </p>
                    </div>

                    <div className={profileStyles.skillsGrid}>
                      {activeSkillsList.map((skill: string, idx: number) => (
                        <div key={skill} className={profileStyles.skillCard}>
                          <div className={profileStyles.skillName}>
                            #{skill.replace(/-/g, " ")}
                          </div>
                          <span className={profileStyles.skillProficiencyTag}>
                            {idx === 0 ? "Expert" : idx === 1 ? "Advanced" : "Practical"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Weekly Availability */}
                  <div className={profileStyles.sectionCard}>
                    <div className={profileStyles.sectionHeader}>
                      <h2 className={profileStyles.sectionTitle}>
                        <Clock size={20} color="#34d399" />
                        <span>Active Weekly Availability</span>
                      </h2>
                      <p className={profileStyles.sectionSubtitle}>
                        Standard days and time slots configured for booking
                      </p>
                    </div>

                    <div className={profileStyles.scheduleGrid}>
                      {DAYS_OF_WEEK.map((day) => {
                        const isAvailable = selectedDays.includes(day);
                        return (
                          <div key={day} className={profileStyles.dayCard} style={{ opacity: isAvailable ? 1 : 0.45 }}>
                            <div className={profileStyles.dayName}>{day}</div>
                            <div className={profileStyles.daySlot} style={{ color: isAvailable ? "#34d399" : "rgba(226, 237, 231, 0.4)" }}>
                              {isAvailable ? "Available" : "Off"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 3: SESSIONS & BOOKINGS
              ---------------------------------------------------- */}
          {activeTab === "sessions" && (
            <div className={styles.cardSection}>
              <div className={styles.cardSectionTitleRow}>
                <div className={styles.cardSectionTitle}>
                  <Calendar size={20} color="#34d399" />
                  <span>Learner Session Bookings</span>
                </div>
              </div>

              {bookings.length > 0 ? (
                <div>
                  {bookings.map((b) => (
                    <div key={b.id} className={styles.sessionItem}>
                      <div className={styles.sessionLeft}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                          <Users size={20} />
                        </div>
                        <div>
                          <div className={styles.sessionTopic}>{b.topic}</div>
                          <div className={styles.sessionMeta}>
                            <span>Scheduled for {new Date(b.scheduledDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <Clock size={12} />
                            <span>{b.timeSlot}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "0.75rem", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)", color: "#34d399", padding: "0.25rem 0.65rem", borderRadius: "9999px" }}>
                          CONFIRMED
                        </span>
                        <button
                          type="button"
                          className={styles.actionPillBtn}
                          onClick={() => alert(`Starting session #${b.id} with student`)}
                        >
                          <Video size={14} />
                          <span>Start Meeting</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem 1rem", background: "rgba(4, 13, 9, 0.5)", borderRadius: "14px" }}>
                  <Calendar size={40} color="#34d399" style={{ margin: "0 auto 1rem auto", display: "block" }} />
                  <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem" }}>
                    No Scheduled Sessions Yet
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "rgba(226, 237, 231, 0.65)", maxWidth: "450px", margin: "0 auto 1.5rem auto", lineHeight: "1.6" }}>
                    When learners book a 1-on-1 session with you from your profile or the directory, their requests and meeting schedules will appear here.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className={styles.saveBtn}
                    style={{ margin: "0 auto" }}
                  >
                    <span>View Your Profile Page</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 4: SCHEDULE & AVAILABILITY MANAGER
              ---------------------------------------------------- */}
          {activeTab === "availability" && (
            <div className={styles.cardSection}>
              <div className={styles.cardSectionTitleRow}>
                <div className={styles.cardSectionTitle}>
                  <Clock size={20} color="#34d399" />
                  <span>Teaching Schedule & Time Slot Availability</span>
                </div>
              </div>

              <div className={styles.formGrid}>
                {/* Active Days of the Week */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Days You Are Available to Teach</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.3rem" }}>
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "10px",
                            border: "1px solid",
                            borderColor: isSelected ? "#34d399" : "rgba(255,255,255,0.1)",
                            background: isSelected ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.03)",
                            color: isSelected ? "#ffffff" : "rgba(226, 237, 231, 0.65)",
                            fontSize: "0.85rem",
                            fontWeight: isSelected ? 700 : 500,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Daily Time Slots */}
                <div className={styles.fieldGroup} style={{ marginTop: "1rem" }}>
                  <label className={styles.fieldLabel}>Available Time Slots</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem", marginTop: "0.3rem" }}>
                    <div
                      onClick={() => setMorningSlot(!morningSlot)}
                      style={{
                        padding: "0.9rem 1rem",
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor: morningSlot ? "rgba(52, 211, 153, 0.4)" : "rgba(255,255,255,0.08)",
                        background: morningSlot ? "rgba(16, 185, 129, 0.12)" : "rgba(4, 13, 9, 0.6)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <Sun size={18} color="#34d399" />
                        <div>
                          <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9rem" }}>Morning Slots</div>
                          <div style={{ fontSize: "0.78rem", color: "rgba(226, 237, 231, 0.65)" }}>10:00 AM – 12:00 PM</div>
                        </div>
                      </div>
                      <CheckCircle2 size={18} color={morningSlot ? "#34d399" : "rgba(255,255,255,0.2)"} />
                    </div>

                    <div
                      onClick={() => setAfternoonSlot(!afternoonSlot)}
                      style={{
                        padding: "0.9rem 1rem",
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor: afternoonSlot ? "rgba(52, 211, 153, 0.4)" : "rgba(255,255,255,0.08)",
                        background: afternoonSlot ? "rgba(16, 185, 129, 0.12)" : "rgba(4, 13, 9, 0.6)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <Coffee size={18} color="#34d399" />
                        <div>
                          <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9rem" }}>Afternoon Slots</div>
                          <div style={{ fontSize: "0.78rem", color: "rgba(226, 237, 231, 0.65)" }}>02:00 PM – 05:00 PM</div>
                        </div>
                      </div>
                      <CheckCircle2 size={18} color={afternoonSlot ? "#34d399" : "rgba(255,255,255,0.2)"} />
                    </div>

                    <div
                      onClick={() => setEveningSlot(!eveningSlot)}
                      style={{
                        padding: "0.9rem 1rem",
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor: eveningSlot ? "rgba(52, 211, 153, 0.4)" : "rgba(255,255,255,0.08)",
                        background: eveningSlot ? "rgba(16, 185, 129, 0.12)" : "rgba(4, 13, 9, 0.6)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <Moon size={18} color="#34d399" />
                        <div>
                          <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9rem" }}>Evening Slots</div>
                          <div style={{ fontSize: "0.78rem", color: "rgba(226, 237, 231, 0.65)" }}>06:00 PM – 08:30 PM</div>
                        </div>
                      </div>
                      <CheckCircle2 size={18} color={eveningSlot ? "#34d399" : "rgba(255,255,255,0.2)"} />
                    </div>

                    <div
                      onClick={() => setNightSlot(!nightSlot)}
                      style={{
                        padding: "0.9rem 1rem",
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor: nightSlot ? "rgba(52, 211, 153, 0.4)" : "rgba(255,255,255,0.08)",
                        background: nightSlot ? "rgba(16, 185, 129, 0.12)" : "rgba(4, 13, 9, 0.6)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <Moon size={18} color="#34d399" />
                        <div>
                          <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9rem" }}>Night Slots</div>
                          <div style={{ fontSize: "0.78rem", color: "rgba(226, 237, 231, 0.65)" }}>09:00 PM – 11:00 PM</div>
                        </div>
                      </div>
                      <CheckCircle2 size={18} color={nightSlot ? "#34d399" : "rgba(255,255,255,0.2)"} />
                    </div>
                  </div>
                </div>

                {/* Instant Booking Toggle */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", marginTop: "1rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.92rem", marginBottom: "2px", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <Zap size={16} color="#34d399" />
                      <span>Instant Booking Confirmation</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(226, 237, 231, 0.65)" }}>
                      Automatically accept lessons when a learner books an available slot.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={instantBooking}
                    onChange={(e) => setInstantBooking(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "#34d399", cursor: "pointer" }}
                  />
                </div>

                {/* Vacation Mode Toggle */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.92rem", marginBottom: "2px", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <Palmtree size={16} color="#34d399" />
                      <span>Vacation / Out of Office Mode</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(226, 237, 231, 0.65)" }}>
                      Temporarily pause new booking requests on the directory.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={vacationMode}
                    onChange={(e) => setVacationMode(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "#34d399", cursor: "pointer" }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => alert("Schedule and availability preferences saved successfully!")}
                  className={styles.saveBtn}
                  style={{ marginTop: "1rem" }}
                >
                  <Save size={16} />
                  <span>Save Availability Schedule</span>
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 5: SKILLS & PRICING
              ---------------------------------------------------- */}
          {activeTab === "skills" && (
            <div className={styles.cardSection}>
              <div className={styles.cardSectionTitleRow}>
                <div className={styles.cardSectionTitle}>
                  <BookOpen size={20} color="#34d399" />
                  <span>Teaching Skills & Hourly Pricing</span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Hourly Rate (₹ per hour)</label>
                  <input
                    type="number"
                    value={editRate}
                    onChange={(e) => setEditRate(e.target.value)}
                    disabled={editIsFree}
                    className={styles.input}
                    min={0}
                    step={50}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    id="freeTier"
                    checked={editIsFree}
                    onChange={(e) => setEditIsFree(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#34d399" }}
                  />
                  <label htmlFor="freeTier" style={{ color: "rgba(226, 237, 231, 0.9)", fontSize: "0.9rem", cursor: "pointer" }}>
                    Offer Free Community Classes to help learners in need
                  </label>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Availability Tag</label>
                  <select
                    value={editAvailability}
                    onChange={(e) => setEditAvailability(e.target.value)}
                    className={styles.input}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="Available Today">Available Today (Daily Sessions)</option>
                    <option value="This Week">This Week (Flexible Weekday Slots)</option>
                    <option value="Weekend Only">Weekends Only (Saturday & Sunday)</option>
                  </select>
                </div>

                <button type="submit" disabled={savingProfile} className={styles.saveBtn}>
                  {savingProfile ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Updating Rates...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Pricing & Schedule</span>
                    </>
                  )}
                </button>

                {saveSuccess && (
                  <div style={{ color: "#34d399", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <CheckCircle2 size={16} />
                    <span>Pricing and schedule updated successfully!</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 6: EARNINGS & PAYOUTS
              ---------------------------------------------------- */}
          {activeTab === "earnings" && (
            <div>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricTop}>
                    <span className={styles.metricLabel}>Total Earnings</span>
                    <div className={styles.metricIconWrapper}>
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <div className={styles.metricValue}>₹{bookings.length * (Number(profile?.hourlyRate) || 200)}</div>
                  <div className={styles.metricSubtext}>
                    <TrendingUp size={13} />
                    <span>Direct UPI Payouts</span>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricTop}>
                    <span className={styles.metricLabel}>Pending Settlement</span>
                    <div className={styles.metricIconWrapper}>
                      <Clock size={18} />
                    </div>
                  </div>
                  <div className={styles.metricValue}>₹0</div>
                  <div className={styles.metricSubtext}>
                    <span>All payouts settled</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardSection}>
                <div className={styles.cardSectionTitleRow}>
                  <div className={styles.cardSectionTitle}>
                    <DollarSign size={20} color="#34d399" />
                    <span>Payout Bank & UPI Settings</span>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Your UPI ID for Instant Earnings Payout</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okaxis, mobile@paytm"
                      className={styles.input}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => alert("Payout UPI updated successfully!")}
                    className={styles.saveBtn}
                  >
                    <Save size={16} />
                    <span>Save Payout Method</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
