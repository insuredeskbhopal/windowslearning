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
  Compass,
  Target,
  Send,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/Navbar/BrandLogo";
import { PLATFORM_CONFIG } from "@/lib/config";
import styles from "./page.module.css";
import profileStyles from "@/app/mentors/[slug]/page.module.css";

type TabKey = "overview" | "profile" | "offerings" | "gigs" | "bookings" | "availability" | "earnings";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MentorStudioPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [offerings, setOfferings] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
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

  // Post a Session Modal States
  const [isPostSessionOpen, setIsPostSessionOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionDesc, setNewSessionDesc] = useState("");
  const [newSessionSkill, setNewSessionSkill] = useState("");
  const [newSessionLevel, setNewSessionLevel] = useState("All Levels");
  const [newSessionDuration, setNewSessionDuration] = useState(60);
  const [newSessionPrice, setNewSessionPrice] = useState(500);
  const [newSessionOutcomes, setNewSessionOutcomes] = useState<string[]>([
    "Hands-on live practical project demonstration",
    "Step-by-step guidance and code / technique review",
    "Clear Q&A and personalized takeaway notes",
  ]);
  const [newOutcomeInput, setNewOutcomeInput] = useState("");
  const [postingSession, setPostingSession] = useState(false);

  // Apply to Gig Modal States
  const [isApplyGigOpen, setIsApplyGigOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<any>(null);
  const [applyPrice, setApplyPrice] = useState<number>(400);
  const [applyMessage, setApplyMessage] = useState("");
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/mentor/dashboard");
    }
  }, [user, loading, router]);

  const loadStudioData = async () => {
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
        setEditRate(p.hourlyRate || 200);
        setEditIsFree(Boolean(p.isFreeCommunity));
        setEditAvailability(p.availability || "Available Today");
        setEditLanguage(p.preferredLanguage || "Hindi / English");
        if (!newSessionSkill && p.teachingSkills?.[0]) {
          setNewSessionSkill(p.teachingSkills[0]);
        }
      }

      // 2. Fetch Mentor Bookings
      const bookingsRes = await fetch("/api/bookings");
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) {
        setBookings(bookingsData.bookings || []);
      }

      // 3. Fetch Mentor Teaching Offerings
      const sessionsRes = await fetch("/api/sessions");
      const sessionsData = await sessionsRes.json();
      if (sessionsData.success && user) {
        const mySessions = (sessionsData.sessions || []).filter(
          (s: any) => s.mentorId === user.id
        );
        setOfferings(mySessions);
      }

      // 4. Fetch Open Learner Gigs
      const gigsRes = await fetch("/api/gigs?status=OPEN");
      const gigsData = await gigsRes.json();
      if (gigsData.success) {
        setGigs(gigsData.gigs || []);
      }
    } catch {
      console.error("Failed to load mentor studio data.");
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadStudioData();
    }
  }, [user]);

  // Skill Add / Remove in Profile
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const formatted = newSkillInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!editSkills.includes(formatted)) {
      setEditSkills([...editSkills, formatted]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter((s) => s !== skillToRemove));
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const skillsToSave = editSkills.length > 0 ? editSkills : ["practical-skills"];
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
      const data = await res.json();
      if (data.success) {
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

  // Post a Session Handler
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle || !newSessionDesc || !newSessionPrice) {
      alert("Please fill all required session fields.");
      return;
    }

    setPostingSession(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newSessionTitle,
          description: newSessionDesc,
          learningOutcomes: newSessionOutcomes.filter((o) => o.trim().length > 0),
          skillSlug: newSessionSkill || editSkills[0] || "general",
          durationMinutes: Number(newSessionDuration),
          price: Number(newSessionPrice),
          level: newSessionLevel,
          format: "1:1 Live Online",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOfferings([data.session, ...offerings]);
        setIsPostSessionOpen(false);
        setNewSessionTitle("");
        setNewSessionDesc("");
        alert("🎉 Teaching session offering created and published live!");
      } else {
        alert(data.message || "Failed to post session.");
      }
    } catch {
      alert("Error posting session. Please try again.");
    } finally {
      setPostingSession(false);
    }
  };

  const handleDeleteOffering = async (id: string) => {
    if (!confirm("Are you sure you want to remove this session offering?")) return;
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOfferings(offerings.filter((o) => o.id !== id));
      }
    } catch {
      alert("Failed to delete session.");
    }
  };

  // Apply to Gig Handler
  const handleOpenApplyModal = (gig: any) => {
    setSelectedGig(gig);
    setApplyPrice(gig.budget || 400);
    setApplyMessage(`I would love to mentor you on ${gig.title}. We'll do step-by-step 1:1 hands-on practice.`);
    setIsApplyGigOpen(true);
    setApplySuccess(false);
  };

  const handleApplyToGigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGig) return;

    setSubmittingApply(true);
    try {
      const res = await fetch(`/api/gigs/${selectedGig.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposedPrice: applyPrice,
          message: applyMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setApplySuccess(true);
        setTimeout(() => {
          setIsApplyGigOpen(false);
          setApplySuccess(false);
        }, 2200);
      } else {
        alert(data.message || "Failed to submit gig application.");
      }
    } catch {
      alert("Error submitting proposal.");
    } finally {
      setSubmittingApply(false);
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

            {/* NEW: Post & Manage Teaching Sessions */}
            <li>
              <button
                type="button"
                className={`${styles.navItemBtn} ${activeTab === "offerings" ? styles.navItemBtnActive : ""}`}
                onClick={() => setActiveTab("offerings")}
              >
                <div className={styles.navItemLeft}>
                  <BookOpen size={18} />
                  <span>My Teaching Sessions</span>
                </div>
                {offerings.length > 0 && <span className={styles.navBadge}>{offerings.length}</span>}
              </button>
            </li>

            {/* NEW: Gig Opportunities (Learner Requests) */}
            <li>
              <button
                type="button"
                className={`${styles.navItemBtn} ${activeTab === "gigs" ? styles.navItemBtnActive : ""}`}
                onClick={() => setActiveTab("gigs")}
              >
                <div className={styles.navItemLeft}>
                  <Target size={18} />
                  <span>Gig Opportunities</span>
                </div>
                {gigs.length > 0 && (
                  <span className={styles.navBadge} style={{ background: "#34d399", color: "#030a07" }}>
                    {gigs.length}
                  </span>
                )}
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`${styles.navItemBtn} ${activeTab === "bookings" ? styles.navItemBtnActive : ""}`}
                onClick={() => setActiveTab("bookings")}
              >
                <div className={styles.navItemLeft}>
                  <Calendar size={18} />
                  <span>Learner Bookings</span>
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

        {/* Sidebar Footer User Info */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userProfileRow}>
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={36}
                height={36}
                className={styles.userAvatarImg}
              />
            ) : (
              <div className={styles.userAvatarFallback}>{initials}</div>
            )}
            <div className={styles.userMeta}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userRoleTag}>Verified Mentor</div>
            </div>
            <ShieldCheck size={16} color="#34d399" />
          </div>

          <Link href="/learner/dashboard" className={styles.switchRoleBtn}>
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
          Main Scrollable Content Area
          ---------------------------------------------------- */}
      <div className={styles.mainWrapper}>
        <div className={styles.contentArea}>
          {/* Top Bar Header */}
          <header className={styles.topHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                {activeTab === "overview" && "Studio Overview"}
                {activeTab === "profile" && "Mentor Profile"}
                {activeTab === "offerings" && "My Teaching Sessions"}
                {activeTab === "gigs" && "Learner Gig Opportunities"}
                {activeTab === "bookings" && "Learner 1-on-1 Sessions"}
                {activeTab === "availability" && "Teaching Schedule & Timeslots"}
                {activeTab === "earnings" && "Earnings & Bank Payouts"}
              </h1>
              <p className={styles.pageSubtitle}>
                {activeTab === "overview" && "Live performance overview, incoming sessions, and student updates."}
                {activeTab === "profile" && "Manage your authentic mentor marketplace bio, rates, and skills."}
                {activeTab === "offerings" && "Create structured 1:1 session offerings with curriculum and custom pricing."}
                {activeTab === "gigs" && "Browse what learners want to learn and apply with your proposed price."}
                {activeTab === "bookings" && "Manage upcoming confirmed live video sessions."}
                {activeTab === "availability" && "Set active weekdays and instant booking windows."}
                {activeTab === "earnings" && "Track real-time mentorship income and UPI settlements."}
              </p>
            </div>

            <div className={styles.topHeaderActions}>
              <div className={styles.livePill}>
                <span className={styles.pulseDot} />
                <span>{profile?.availability || "Available for 1-on-1 Lessons"}</span>
              </div>

              {activeTab === "offerings" && (
                <button
                  type="button"
                  onClick={() => setIsPostSessionOpen(true)}
                  className={styles.actionPillBtn}
                  style={{ padding: "0.6rem 1.25rem" }}
                >
                  <Plus size={16} />
                  <span>Post a Session</span>
                </button>
              )}

              <Link
                href={`/mentors/${profileSlug}`}
                target="_blank"
                className={styles.viewPublicLink}
              >
                <span>Public Directory URI</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </header>

          {/* ----------------------------------------------------
              TAB 1: STUDIO OVERVIEW (3-COLUMN WIDE GRID)
              ---------------------------------------------------- */}
          {activeTab === "overview" && (
            <div className={styles.tabContentFade}>
              {/* Top Metrics Row */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>TOTAL SESSIONS</span>
                    <Video size={18} color="#34d399" />
                  </div>
                  <div className={styles.metricValue}>{bookings.length}</div>
                  <div className={styles.metricDelta}>
                    <CheckCircle2 size={13} color="#34d399" />
                    <span>Confirmed bookings</span>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>ACTIVE OFFERINGS</span>
                    <BookOpen size={18} color="#34d399" />
                  </div>
                  <div className={styles.metricValue}>{offerings.length}</div>
                  <div className={styles.metricDelta}>
                    <Sparkles size={13} color="#34d399" />
                    <span>Published sessions</span>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>OPEN GIG REQUESTS</span>
                    <Target size={18} color="#34d399" />
                  </div>
                  <div className={styles.metricValue}>{gigs.length}</div>
                  <div className={styles.metricDelta}>
                    <Zap size={13} color="#34d399" />
                    <span>Ready for proposals</span>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>SESSION RATE</span>
                    <DollarSign size={18} color="#34d399" />
                  </div>
                  <div className={styles.metricValue}>
                    {profile?.isFreeCommunity ? "Free" : `₹${profile?.hourlyRate || 200}`}
                  </div>
                  <div className={styles.metricDelta}>
                    <TrendingUp size={13} color="#34d399" />
                    <span>{profile?.isFreeCommunity ? "Community Tier" : "Per 60 min session"}</span>
                  </div>
                </div>
              </div>

              {/* 3-Column Wide Desktop Overview Grid */}
              <div className={styles.studioColumnsGrid}>
                {/* Column 1: Upcoming 1-on-1 Sessions */}
                <div className={styles.columnCard}>
                  <div className={styles.columnHeader}>
                    <div className={styles.columnTitle}>
                      <Calendar size={18} color="#34d399" />
                      <span>Upcoming 1-on-1 Sessions</span>
                    </div>
                    <span className={styles.counterBadge}>{bookings.length}</span>
                  </div>

                  {bookings.length === 0 ? (
                    <div className={styles.emptyCardState}>
                      <Calendar size={36} color="rgba(52, 211, 153, 0.4)" />
                      <div className={styles.emptyStateTitle}>No sessions booked yet</div>
                      <p className={styles.emptyStateDesc}>
                        When students book a 1-on-1 session or accept your gig proposal, details will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className={styles.sessionsList}>
                      {bookings.map((bk) => (
                        <div key={bk.id} className={styles.sessionItem}>
                          <div className={styles.sessionLeft}>
                            <div className={styles.sessionIconBox}>
                              <Video size={16} color="#34d399" />
                            </div>
                            <div>
                              <div className={styles.sessionTopic}>{bk.topic}</div>
                              <div className={styles.sessionMeta}>
                                <Clock size={12} />
                                <span>{bk.timeSlot} • {new Date(bk.scheduledDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert(`Starting secure video room for session ${bk.id}`)}
                            className={styles.actionPillBtn}
                          >
                            <Video size={13} />
                            <span>Join</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Column 2: Published Teaching Sessions */}
                <div className={styles.columnCard}>
                  <div className={styles.columnHeader}>
                    <div className={styles.columnTitle}>
                      <BookOpen size={18} color="#34d399" />
                      <span>My Teaching Sessions</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("offerings");
                        setIsPostSessionOpen(true);
                      }}
                      className={styles.quickActionBtn}
                    >
                      <Plus size={14} />
                      <span>Create</span>
                    </button>
                  </div>

                  {offerings.length === 0 ? (
                    <div className={styles.emptyCardState}>
                      <Sparkles size={36} color="rgba(52, 211, 153, 0.4)" />
                      <div className={styles.emptyStateTitle}>No session offerings created</div>
                      <p className={styles.emptyStateDesc}>
                        Create specific 1:1 sessions (e.g. &quot;Master Next.js App Router&quot;) for learners to browse and book.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("offerings");
                          setIsPostSessionOpen(true);
                        }}
                        className={styles.actionPillBtn}
                      >
                        <Plus size={14} />
                        <span>Post a Session</span>
                      </button>
                    </div>
                  ) : (
                    <div className={styles.sessionsList}>
                      {offerings.slice(0, 3).map((off) => (
                        <div key={off.id} className={styles.sessionItem}>
                          <div>
                            <div className={styles.sessionTopic}>{off.title}</div>
                            <div className={styles.sessionMeta}>
                              <span>₹{off.price} • {off.durationMinutes} min • {off.level}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {offerings.length > 3 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab("offerings")}
                          className={styles.viewPublicLink}
                          style={{ marginTop: "0.5rem" }}
                        >
                          <span>View all {offerings.length} sessions →</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Column 3: Recent Activity & Live Updates */}
                <div className={styles.columnCard}>
                  <div className={styles.columnHeader}>
                    <div className={styles.columnTitle}>
                      <Activity size={18} color="#34d399" />
                      <span>Recent Activity & Updates</span>
                    </div>
                    <span className={styles.counterBadge} style={{ background: "rgba(52, 211, 153, 0.15)", color: "#34d399" }}>
                      Live
                    </span>
                  </div>

                  <div className={styles.activityFeed}>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIconCircle}>
                        <CheckCheck size={14} color="#34d399" />
                      </div>
                      <div className={styles.activityBody}>
                        <div className={styles.activityTitle}>Mentor Profile Active</div>
                        <div className={styles.activityTime}>Direct marketplace connection verified</div>
                      </div>
                    </div>

                    <div className={styles.activityItem}>
                      <div className={styles.activityIconCircle}>
                        <ShieldCheck size={14} color="#34d399" />
                      </div>
                      <div className={styles.activityBody}>
                        <div className={styles.activityTitle}>Direct 1-on-1 Sessions Ready</div>
                        <div className={styles.activityTime}>Rate set at ₹{profile?.hourlyRate || 200}/hr</div>
                      </div>
                    </div>

                    <div className={styles.activityItem}>
                      <div className={styles.activityIconCircle}>
                        <Zap size={14} color="#34d399" />
                      </div>
                      <div className={styles.activityBody}>
                        <div className={styles.activityTitle}>{gigs.length} Open Learner Gigs</div>
                        <div className={styles.activityTime}>Students waiting for mentors</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 2: MY TEACHING SESSIONS (POST A SESSION)
              ---------------------------------------------------- */}
          {activeTab === "offerings" && (
            <div className={styles.tabContentFade}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    My Teaching Session Offerings
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.7)", margin: "0.25rem 0 0 0" }}>
                    Structured 1:1 sessions you teach. Learners discover these in the session catalog and book directly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPostSessionOpen(true)}
                  className={styles.actionPillBtn}
                  style={{ padding: "0.75rem 1.5rem" }}
                >
                  <Plus size={16} />
                  <span>+ Post a Session</span>
                </button>
              </div>

              {offerings.length === 0 ? (
                <div className={styles.emptyCardState} style={{ padding: "3.5rem 1.5rem" }}>
                  <BookOpen size={48} color="rgba(52, 211, 153, 0.5)" />
                  <div className={styles.emptyStateTitle}>You haven&apos;t created any teaching sessions yet</div>
                  <p className={styles.emptyStateDesc} style={{ maxWidth: "460px" }}>
                    Create concrete session offerings (e.g. &quot;React Performance Optimization&quot;, &quot;Master Blouse Stitching&quot;) so learners know exactly what they will learn and can book instantly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsPostSessionOpen(true)}
                    className={styles.saveBtn}
                    style={{ marginTop: "1rem" }}
                  >
                    <Plus size={16} />
                    <span>Create Your First Session</span>
                  </button>
                </div>
              ) : (
                <div className={styles.offeringsGrid}>
                  {offerings.map((off) => (
                    <div key={off.id} className={styles.offeringCard}>
                      <div>
                        <div className={styles.offeringTop}>
                          <h3 className={styles.offeringTitle}>{off.title}</h3>
                          <button
                            type="button"
                            onClick={() => handleDeleteOffering(off.id)}
                            style={{ background: "transparent", border: "none", color: "rgba(248, 113, 113, 0.7)", cursor: "pointer" }}
                            title="Delete offering"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className={styles.offeringMetaRow}>
                          <span className={styles.metaChip}>#{off.skillSlug}</span>
                          <span className={styles.metaChip}>{off.level}</span>
                          <span className={styles.metaChip}>{off.durationMinutes} mins</span>
                          <span className={styles.metaChip}>1:1 Live</span>
                        </div>

                        <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.75)", lineHeight: "1.5", margin: "0 0 0.75rem 0" }}>
                          {off.description}
                        </p>

                        {off.learningOutcomes && off.learningOutcomes.length > 0 && (
                          <div>
                            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              What Learner Will Master:
                            </div>
                            <ul className={styles.outcomesList}>
                              {off.learningOutcomes.map((item: string, idx: number) => (
                                <li key={idx} className={styles.outcomeItem}>
                                  <Check size={12} color="#34d399" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <div>
                          <div style={{ fontSize: "0.7rem", color: "rgba(226, 237, 231, 0.6)" }}>Session Fee</div>
                          <div className={styles.offeringPricePill}>₹{off.price}</div>
                        </div>

                        <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <CheckCircle2 size={13} />
                          <span>Live in Catalog</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 3: GIG OPPORTUNITIES (LEARNER REQUESTS & BIDDING)
              ---------------------------------------------------- */}
          {activeTab === "gigs" && (
            <div className={styles.tabContentFade}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                  Learner Gig Opportunities
                </h2>
                <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.7)", margin: "0.25rem 0 0 0" }}>
                  Learners post what they want to learn with their budget. Submit your proposal and proposed price to get booked!
                </p>
              </div>

              {gigs.length === 0 ? (
                <div className={styles.emptyCardState} style={{ padding: "3.5rem 1.5rem" }}>
                  <Target size={48} color="rgba(52, 211, 153, 0.5)" />
                  <div className={styles.emptyStateTitle}>No open learner requests right now</div>
                  <p className={styles.emptyStateDesc}>
                    When learners post new learning requirements in your topic areas, you can submit tailored proposals here.
                  </p>
                </div>
              ) : (
                <div className={styles.gigsGrid}>
                  {gigs.map((gig) => (
                    <div key={gig.id} className={styles.gigCard}>
                      <div>
                        <div className={styles.gigHeader}>
                          <div className={styles.gigLearnerAvatar}>
                            {(gig.learnerName || "S")[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ffffff" }}>
                              {gig.learnerName || "Learner"}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "rgba(226, 237, 231, 0.6)" }}>
                              Requested {new Date(gig.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", margin: "0 0 0.4rem 0" }}>
                          {gig.title}
                        </h3>

                        <div className={styles.offeringMetaRow}>
                          <span className={styles.metaChip}>#{gig.skillSlug}</span>
                          <span className={styles.metaChip}>{gig.level}</span>
                          <span className={styles.metaChip}>{gig.durationMinutes} mins</span>
                          <span className={styles.metaChip}>{gig.preferredTime}</span>
                        </div>

                        <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.8)", lineHeight: "1.5", margin: "0 0 1rem 0" }}>
                          {gig.description}
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.85rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <div>
                          <div style={{ fontSize: "0.7rem", color: "rgba(226, 237, 231, 0.6)" }}>Learner Budget</div>
                          <div className={styles.gigBudgetBadge}>₹{gig.budget}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenApplyModal(gig)}
                          className={styles.actionPillBtn}
                          style={{ padding: "0.65rem 1.25rem" }}
                        >
                          <Send size={14} />
                          <span>Apply for this Gig</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 4: PUBLIC PROFILE PAGE (LIVE DYNAMIC VIEW)
              ---------------------------------------------------- */}
          {activeTab === "profile" && (
            <div className={styles.tabContentFade}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    Your Live Marketplace Profile
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.7)", margin: "0.25rem 0 0 0" }}>
                    This is the exact full-page layout learners see when discovering you
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className={styles.actionPillBtn}
                    style={{ background: isEditingProfile ? "rgba(255, 255, 255, 0.1)" : "#34d399", color: isEditingProfile ? "#ffffff" : "#030a07" }}
                  >
                    {isEditingProfile ? <Eye size={15} /> : <Edit3 size={15} />}
                    <span>{isEditingProfile ? "Preview Live Profile" : "Edit Profile Details"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        navigator.clipboard.writeText(`${window.location.origin}/mentors/${profileSlug}`);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }
                    }}
                    className={styles.viewPublicLink}
                  >
                    <Share2 size={14} />
                    <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
                  </button>
                </div>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className={styles.formGrid} style={{ background: "rgba(4, 13, 9, 0.8)", border: "1px solid rgba(52, 211, 153, 0.25)", borderRadius: "20px", padding: "2rem" }}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Professional Title / Speciality</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="e.g. Senior Fullstack Engineer & Next.js Mentor"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Location (City, Country)</label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Teaching Languages</label>
                      <input
                        type="text"
                        value={editLanguage}
                        onChange={(e) => setEditLanguage(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Teaching Skills (Interactive Tags)</label>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        placeholder="Add skill (e.g. next-js, react, tailoring)"
                        className={styles.input}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill(e);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className={styles.actionPillBtn}
                        style={{ padding: "0 1.25rem" }}
                      >
                        <Plus size={16} />
                        <span>Add</span>
                      </button>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {editSkills.map((sk) => (
                        <span key={sk} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", borderRadius: "9999px", background: "rgba(52, 211, 153, 0.12)", border: "1px solid rgba(52, 211, 153, 0.3)", color: "#34d399", fontSize: "0.85rem", fontWeight: 700 }}>
                          <span>#{sk}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(sk)}
                            style={{ background: "transparent", border: "none", color: "rgba(226, 237, 231, 0.6)", cursor: "pointer", padding: 0 }}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>About Me & Teaching Bio</label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className={styles.textarea}
                      placeholder="Share your practical experience, hands-on teaching approach, and what learners will achieve..."
                    />
                  </div>

                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <button type="submit" disabled={savingProfile} className={styles.saveBtn}>
                      {savingProfile ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Saving Profile...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save & Update Profile</span>
                        </>
                      )}
                    </button>

                    {saveSuccess && (
                      <span style={{ color: "#34d399", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <CheckCircle2 size={16} />
                        <span>Profile updated successfully!</span>
                      </span>
                    )}
                  </div>
                </form>
              ) : (
                <div style={{ background: "rgba(4, 13, 9, 0.9)", border: "1px solid rgba(52, 211, 153, 0.25)", borderRadius: "24px", padding: "2rem" }}>
                  <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "rgba(52, 211, 153, 0.15)", border: "2px solid #34d399", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 800, color: "#34d399" }}>
                      {initials}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>{user.name}</h1>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", borderRadius: "9999px", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", fontSize: "0.75rem", fontWeight: 700 }}>
                          <ShieldCheck size={13} />
                          <span>Verified Mentor</span>
                        </span>
                      </div>

                      <div style={{ fontSize: "1.05rem", color: "#34d399", fontWeight: 600, marginBottom: "0.75rem" }}>
                        {profile?.title || editTitle || "Verified Practical Mentor"}
                      </div>

                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.75)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <MapPin size={14} color="#34d399" />
                          <span>{profile?.location || editLocation || "India"}</span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Clock size={14} color="#34d399" />
                          <span>{profile?.experienceYears || editExperienceYears} Years Experience</span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Languages size={14} color="#34d399" />
                          <span>{profile?.preferredLanguage || editLanguage || "Hindi / English"}</span>
                        </span>
                      </div>
                    </div>

                    <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(52, 211, 153, 0.3)", borderRadius: "16px", padding: "1.25rem", minWidth: "220px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.8rem", color: "rgba(226, 237, 231, 0.7)" }}>1-on-1 Rate</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#34d399", fontFamily: "var(--font-mono)", margin: "0.25rem 0" }}>
                        {profile?.isFreeCommunity ? "Free" : `₹${profile?.hourlyRate || editRate}`}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(226, 237, 231, 0.6)" }}>per 60-min practical lesson</div>
                    </div>
                  </div>

                  <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>About the Mentor</h3>
                    <p style={{ fontSize: "0.92rem", color: "rgba(226, 237, 231, 0.8)", lineHeight: "1.6", margin: 0 }}>
                      {profile?.bio || editBio || "Dedicated mentor committed to practical guidance."}
                    </p>
                  </div>

                  <div style={{ marginTop: "1.75rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>Teaching Skills</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {activeSkillsList.map((sk: string) => (
                        <span key={sk} style={{ padding: "0.35rem 0.85rem", borderRadius: "9999px", background: "rgba(52, 211, 153, 0.12)", border: "1px solid rgba(52, 211, 153, 0.3)", color: "#34d399", fontSize: "0.85rem", fontWeight: 700 }}>
                          #{sk.replace(/-/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 5: BOOKED LEARNER SESSIONS
              ---------------------------------------------------- */}
          {activeTab === "bookings" && (
            <div className={styles.tabContentFade}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Calendar size={20} color="#34d399" />
                    <span>Confirmed 1-on-1 Sessions</span>
                  </h2>
                </div>

                {bookings.length === 0 ? (
                  <div className={styles.emptyCardState} style={{ padding: "3rem 1rem" }}>
                    <Calendar size={42} color="rgba(52, 211, 153, 0.4)" />
                    <div className={styles.emptyStateTitle}>No sessions booked yet</div>
                    <p className={styles.emptyStateDesc}>
                      When students book a session from your profile or accept your gig proposals, your scheduled sessions will appear here.
                    </p>
                  </div>
                ) : (
                  <div className={styles.sessionsList}>
                    {bookings.map((bk) => (
                      <div key={bk.id} className={styles.sessionItem}>
                        <div className={styles.sessionLeft}>
                          <div className={styles.sessionIconBox}>
                            <Video size={18} color="#34d399" />
                          </div>
                          <div>
                            <div className={styles.sessionTopic}>{bk.topic}</div>
                            <div className={styles.sessionMeta}>
                              <Clock size={13} />
                              <span>{bk.timeSlot} • {new Date(bk.scheduledDate).toLocaleDateString()}</span>
                            </div>
                            {bk.notes && (
                              <div style={{ fontSize: "0.78rem", color: "#34d399", marginTop: "0.2rem" }}>
                                Note: {bk.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => alert(`Starting private video classroom for session ${bk.id}`)}
                          className={styles.actionPillBtn}
                        >
                          <Video size={14} />
                          <span>Join Live Classroom</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 6: SCHEDULE & AVAILABILITY
              ---------------------------------------------------- */}
          {activeTab === "availability" && (
            <div className={styles.tabContentFade}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Clock size={20} color="#34d399" />
                    <span>Active Teaching Days</span>
                  </h2>
                </div>

                <div className={styles.dayButtonsGrid}>
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedDays(selectedDays.filter((d) => d !== day));
                          } else {
                            setSelectedDays([...selectedDays, day]);
                          }
                        }}
                        className={`${styles.daySelectBtn} ${isSelected ? styles.daySelectBtnActive : ""}`}
                      >
                        <span>{day}</span>
                        {isSelected && <Check size={14} color="#34d399" />}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: "2rem" }}>
                  <button
                    type="button"
                    onClick={() => alert("Teaching availability updated successfully!")}
                    className={styles.saveBtn}
                  >
                    <Save size={16} />
                    <span>Save Teaching Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              TAB 7: EARNINGS & PAYOUTS
              ---------------------------------------------------- */}
          {activeTab === "earnings" && (
            <div className={styles.tabContentFade}>
              <div className={styles.metricsGrid} style={{ marginBottom: "2rem" }}>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>TOTAL EARNINGS</div>
                  <div className={styles.metricValue}>₹{bookings.length * (Number(profile?.hourlyRate) || 200)}</div>
                  <div className={styles.metricDelta}>
                    <TrendingUp size={13} color="#34d399" />
                    <span>Direct UPI Payouts</span>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>PENDING SETTLEMENT</div>
                  <div className={styles.metricValue}>₹0</div>
                  <div className={styles.metricDelta}>
                    <Clock size={13} color="#34d399" />
                    <span>All payouts settled</span>
                  </div>
                </div>
              </div>

              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <DollarSign size={20} color="#34d399" />
                    <span>Payout Bank & UPI Settings</span>
                  </h2>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Your UPI ID for Instant Earnings Payout</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className={styles.input}
                    placeholder="e.g. yourname@okaxis"
                  />
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <button
                    type="button"
                    onClick={() => alert(`Payout method updated to: ${upiId}`)}
                    className={styles.saveBtn}
                  >
                    <Save size={16} />
                    <span>Save Payout Method</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------
          MODAL 1: POST A TEACHING SESSION (MENTOR OFFERING)
          ---------------------------------------------------- */}
      {isPostSessionOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPostSessionOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setIsPostSessionOpen(false)}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.35rem 0" }}>
              Post a Teaching Session Offering
            </h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.7)", margin: "0 0 1.5rem 0" }}>
              Create a structured 1:1 teaching topic that learners can explore and book directly.
            </p>

            <form onSubmit={handleCreateSession} className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Session Title *</label>
                <input
                  type="text"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  placeholder="e.g. React Performance Optimization — 1:1 Session"
                  className={styles.input}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Skill Category *</label>
                  <select
                    value={newSessionSkill}
                    onChange={(e) => setNewSessionSkill(e.target.value)}
                    className={styles.input}
                  >
                    {activeSkillsList.map((sk: string) => (
                      <option key={sk} value={sk}>#{sk}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Target Level</label>
                  <select
                    value={newSessionLevel}
                    onChange={(e) => setNewSessionLevel(e.target.value)}
                    className={styles.input}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Price (₹ / session) *</label>
                  <input
                    type="number"
                    value={newSessionPrice}
                    onChange={(e) => setNewSessionPrice(Number(e.target.value))}
                    min={100}
                    step={50}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Duration (minutes)</label>
                  <select
                    value={newSessionDuration}
                    onChange={(e) => setNewSessionDuration(Number(e.target.value))}
                    className={styles.input}
                  >
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes (1 hour)</option>
                    <option value={90}>90 minutes (1.5 hours)</option>
                    <option value={120}>120 minutes (2 hours)</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Session Description *</label>
                <textarea
                  value={newSessionDesc}
                  onChange={(e) => setNewSessionDesc(e.target.value)}
                  placeholder="Explain what this session covers, who it's for, and what problem it solves..."
                  className={styles.textarea}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>What the Learner Will Master (Curriculum Outcomes)</label>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input
                    type="text"
                    value={newOutcomeInput}
                    onChange={(e) => setNewOutcomeInput(e.target.value)}
                    placeholder="e.g. Server vs Client Component profiling"
                    className={styles.input}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newOutcomeInput.trim()) {
                          setNewSessionOutcomes([...newSessionOutcomes, newOutcomeInput.trim()]);
                          setNewOutcomeInput("");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newOutcomeInput.trim()) {
                        setNewSessionOutcomes([...newSessionOutcomes, newOutcomeInput.trim()]);
                        setNewOutcomeInput("");
                      }
                    }}
                    className={styles.actionPillBtn}
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {newSessionOutcomes.map((out, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.04)", padding: "0.4rem 0.75rem", borderRadius: "8px", fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.85)" }}>
                      <span>• {out}</span>
                      <button
                        type="button"
                        onClick={() => setNewSessionOutcomes(newSessionOutcomes.filter((_, i) => i !== idx))}
                        style={{ background: "transparent", border: "none", color: "rgba(248, 113, 113, 0.7)", cursor: "pointer" }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={postingSession}
                className={styles.saveBtn}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                {postingSession ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Publishing Session...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Publish Teaching Offering</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL 2: APPLY FOR A LEARNER GIG (MENTOR BIDDING)
          ---------------------------------------------------- */}
      {isApplyGigOpen && selectedGig && (
        <div className={styles.modalOverlay} onClick={() => setIsApplyGigOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setIsApplyGigOpen(false)}
            >
              <X size={18} />
            </button>

            {applySuccess ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <CheckCircle2 size={48} color="#34d399" style={{ margin: "0 auto 1rem auto", display: "block" }} />
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
                  Proposal Submitted!
                </h3>
                <p style={{ fontSize: "0.88rem", color: "rgba(226, 237, 231, 0.75)" }}>
                  Your proposed price of <strong>₹{applyPrice}</strong> and pitch message have been delivered to <strong>{selectedGig.learnerName || "the learner"}</strong>.
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.35rem 0" }}>
                  Apply for Gig: {selectedGig.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.7)", margin: "0 0 1.5rem 0" }}>
                  Learner Target Budget: <strong style={{ color: "#34d399" }}>₹{selectedGig.budget}</strong> • {selectedGig.level}
                </p>

                <form onSubmit={handleApplyToGigSubmit} className={styles.formGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Your Proposed Price (₹ / session) *</label>
                    <input
                      type="number"
                      value={applyPrice}
                      onChange={(e) => setApplyPrice(Number(e.target.value))}
                      min={PLATFORM_CONFIG.MINIMUM_GIG_BUDGET}
                      step={50}
                      className={styles.input}
                      required
                    />
                    <span style={{ fontSize: "0.72rem", color: "rgba(226, 237, 231, 0.6)" }}>
                      You can propose matching or higher pricing based on the topic depth.
                    </span>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Pitch Message to Learner *</label>
                    <textarea
                      value={applyMessage}
                      onChange={(e) => setApplyMessage(e.target.value)}
                      placeholder="Explain how you will teach this concept step-by-step and solve their doubt..."
                      className={styles.textarea}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingApply}
                    className={styles.saveBtn}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                  >
                    {submittingApply ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Submitting Proposal...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Proposal to Learner</span>
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
