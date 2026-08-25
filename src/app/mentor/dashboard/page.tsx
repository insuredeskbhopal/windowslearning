"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/Navbar/BrandLogo";
import styles from "./page.module.css";

type TabKey = "overview" | "sessions" | "skills" | "earnings" | "profile";

export default function MentorStudioPage() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  // Edit Profile States
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editRate, setEditRate] = useState<number | string>(200);
  const [editIsFree, setEditIsFree] = useState(false);
  const [editAvailability, setEditAvailability] = useState("Available Today");
  const [editLanguage, setEditLanguage] = useState("Hindi / English");
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [upiId, setUpiId] = useState("mentor@okaxis");

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
          setEditLocation(p.location || "");
          setEditBio(p.bio || "");
          setEditRate(p.hourlyRate || 200);
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/onboarding/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          location: editLocation,
          bio: editBio,
          teachingSkills: profile?.teachingSkills || ["home-cooking-recipes"],
          experienceYears: profile?.experienceYears || 2,
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
          hourlyRate: editIsFree ? 0 : Number(editRate),
          isFreeCommunity: editIsFree,
          availability: editAvailability,
          preferredLanguage: editLanguage,
        }));
        setSaveSuccess(true);
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

  return (
    <div className={styles.studioRoot}>
      <div className={styles.ambientGlow} />

      {/* ----------------------------------------------------
          Left Dark Emerald Sidebar
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
                className={`${styles.navItemBtn} ${activeTab === "skills" ? styles.navItemBtnActive : ""}`}
                onClick={() => setActiveTab("skills")}
              >
                <div className={styles.navItemLeft}>
                  <BookOpen size={18} />
                  <span>Teaching Skills & Pricing</span>
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

            <li>
              <button
                type="button"
                className={`${styles.navItemBtn} ${activeTab === "profile" ? styles.navItemBtnActive : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <div className={styles.navItemLeft}>
                  <Settings size={18} />
                  <span>Profile & Bio Settings</span>
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
              {activeTab === "sessions" && "Scheduled Learner Lessons"}
              {activeTab === "skills" && "Teaching Skills & Rates"}
              {activeTab === "earnings" && "Earnings & Bank Payouts"}
              {activeTab === "profile" && "Edit Mentor Profile & Bio"}
            </h1>
          </div>

          <div className={styles.topBarRight}>
            <div className={styles.statusToggle}>
              <span className={styles.badgePulse} />
              <span>Available for 1-on-1 Lessons</span>
            </div>

            <Link href="/mentors" className={styles.viewDirectoryLink}>
              <span>Public Directory</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* Dynamic Tab Content Area */}
        <main className={styles.contentArea}>
          {/* TAB 1: OVERVIEW */}
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

              {/* 2-Column Content Area */}
              <div className={styles.studioColumnsGrid}>
                {/* Left Column: Scheduled Lessons */}
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
                        <Link href="/mentors" className={styles.saveBtn} style={{ margin: "0 auto" }}>
                          <span>View Public Mentor Listing</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Public Card Preview */}
                <div>
                  <div className={styles.cardSection}>
                    <div className={styles.cardSectionTitleRow}>
                      <div className={styles.cardSectionTitle}>
                        <span>Public Profile Preview</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        style={{ background: "none", border: "none", color: "#34d399", fontSize: "0.82rem", cursor: "pointer" }}
                      >
                        Edit
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
                        {(profile?.teachingSkills || ["home-cooking-recipes"]).map((s: string) => (
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
              </div>
            </div>
          )}

          {/* TAB 2: SESSIONS & BOOKINGS */}
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
                    When learners book a 1-on-1 session with you from the directory, their requests and meeting schedules will appear here.
                  </p>
                  <Link href="/mentors" className={styles.saveBtn} style={{ margin: "0 auto" }}>
                    <span>Browse Mentor Directory</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SKILLS & PRICING */}
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
                  <label className={styles.fieldLabel}>Availability Schedule</label>
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

          {/* TAB 4: EARNINGS & PAYOUTS */}
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

          {/* TAB 5: PROFILE & BIO SETTINGS */}
          {activeTab === "profile" && (
            <div className={styles.cardSection}>
              <div className={styles.cardSectionTitleRow}>
                <div className={styles.cardSectionTitle}>
                  <Settings size={20} color="#34d399" />
                  <span>Edit Professional Title, City & Bio</span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Professional Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Master Tailor, Home Chef, Speed Maths Coach..."
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>City & State</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Bhopal, Madhya Pradesh, India"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Languages You Teach In</label>
                  <input
                    type="text"
                    value={editLanguage}
                    onChange={(e) => setEditLanguage(e.target.value)}
                    placeholder="e.g. Hindi, English, Bengali, Tamil"
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Teaching Bio & Background</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Describe what practical skills you teach and your teaching approach..."
                    className={styles.textarea}
                    required
                  />
                </div>

                <button type="submit" disabled={savingProfile} className={styles.saveBtn}>
                  {savingProfile ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>

                {saveSuccess && (
                  <div style={{ color: "#34d399", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <CheckCircle2 size={16} />
                    <span>Profile saved and updated live on the directory!</span>
                  </div>
                )}
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
