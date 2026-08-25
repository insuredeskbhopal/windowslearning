"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Plus,
  Target,
  Send,
  Video,
  DollarSign,
  Loader2,
  X,
  ShieldCheck,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import { PLATFORM_CONFIG } from "@/lib/config";
import styles from "./page.module.css";

export default function LearnerDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<"gigs" | "bookings" | "explore">("gigs");
  const [bookings, setBookings] = useState<any[]>([]);
  const [myGigs, setMyGigs] = useState<any[]>([]);
  const [exploreSessions, setExploreSessions] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  // Post a Learning Gig Modal
  const [isPostGigOpen, setIsPostGigOpen] = useState(false);
  const [gigTitle, setGigTitle] = useState("");
  const [gigDesc, setGigDesc] = useState("");
  const [gigSkill, setGigSkill] = useState("web-development");
  const [gigLevel, setGigLevel] = useState("Beginner");
  const [gigBudget, setGigBudget] = useState(PLATFORM_CONFIG.MINIMUM_GIG_BUDGET);
  const [gigPreferredTime, setGigPreferredTime] = useState("Evening (6:00 PM – 9:00 PM)");
  const [submittingGig, setSubmittingGig] = useState(false);

  // Expanded Gig for Applications
  const [expandedGigId, setExpandedGigId] = useState<string | null>(null);
  const [selectedGigDetails, setSelectedGigDetails] = useState<any>(null);
  const [loadingGigDetails, setLoadingGigDetails] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/learner/dashboard");
    }
  }, [user, loading, router]);

  const loadLearnerData = async () => {
    try {
      setFetchingData(true);
      // 1. Fetch bookings
      const bkRes = await fetch("/api/bookings");
      const bkData = await bkRes.json();
      if (bkData.success) {
        setBookings(bkData.bookings || []);
      }

      // 2. Fetch my posted gigs
      const gigsRes = await fetch(`/api/gigs?learnerId=${user?.id}`);
      const gigsData = await gigsRes.json();
      if (gigsData.success) {
        setMyGigs(gigsData.gigs || []);
      }

      // 3. Fetch explore sessions
      const sessRes = await fetch("/api/sessions");
      const sessData = await sessRes.json();
      if (sessData.success) {
        setExploreSessions(sessData.sessions || []);
      }
    } catch (err) {
      console.error("Failed to load learner data:", err);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadLearnerData();
    }
  }, [user]);

  // Load single gig with applications
  const handleToggleGigApplications = async (gigId: string) => {
    if (expandedGigId === gigId) {
      setExpandedGigId(null);
      setSelectedGigDetails(null);
      return;
    }

    setExpandedGigId(gigId);
    setLoadingGigDetails(true);
    try {
      const res = await fetch(`/api/gigs/${gigId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedGigDetails(data.gig);
      }
    } catch {
      alert("Failed to load gig applications.");
    } finally {
      setLoadingGigDetails(false);
    }
  };

  // Accept Mentor Application
  const handleAcceptMentor = async (gigId: string, applicationId: string) => {
    if (!confirm("Confirm hiring this mentor for the session?")) return;
    try {
      const res = await fetch(`/api/gigs/${gigId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("🎉 Mentor hired! Your session booking is confirmed. View details in Booked Lessons.");
        loadLearnerData();
        setActiveTab("bookings");
      } else {
        alert(data.message || "Failed to accept application.");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  // Submit Post a Learning Gig
  const handleCreateGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle.trim() || !gigDesc.trim()) {
      alert("Please fill in what you want to learn.");
      return;
    }

    if (Number(gigBudget) < PLATFORM_CONFIG.MINIMUM_GIG_BUDGET) {
      alert(`Minimum budget is ₹${PLATFORM_CONFIG.MINIMUM_GIG_BUDGET}/hour.`);
      return;
    }

    setSubmittingGig(true);
    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: gigTitle,
          description: gigDesc,
          skillSlug: gigSkill,
          level: gigLevel,
          budget: Number(gigBudget),
          preferredTime: gigPreferredTime,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMyGigs([data.gig, ...myGigs]);
        setIsPostGigOpen(false);
        setGigTitle("");
        setGigDesc("");
        alert("🎉 Learning Gig posted! Mentors will now review and submit proposals.");
      } else {
        alert(data.message || "Failed to post gig.");
      }
    } catch {
      alert("Failed to post gig. Please try again.");
    } finally {
      setSubmittingGig(false);
    }
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading Learner Hub...
      </div>
    );
  }

  const isMentor = user.roles.includes("MENTOR");

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.ambientGlow} />

      <Navbar
        brandName="windowslearning"
        items={[
          { label: "EXPLORE SESSIONS", href: "/sessions" },
          { label: "LEARNING GIGS", href: "/gigs" },
          { label: "FIND MENTOR", href: "/mentors" },
        ]}
        ctaLabel="EXPLORE SESSIONS"
        ctaHref="/sessions"
      />

      <main className={styles.container}>
        {/* Welcome Header & Action Buttons */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.welcomeTitle}>
              Welcome back, <span>{user.name}</span>!
            </h1>
            <p className={styles.welcomeSubtitle}>
              Request custom 1-on-1 mentorship, track incoming mentor proposals, and join live learning sessions.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => setIsPostGigOpen(true)}
              className={styles.postGigBtn}
            >
              <Plus size={16} />
              <span>Post a Learning Gig</span>
            </button>

            {isMentor ? (
              <Link href="/mentor/dashboard" className={styles.roleSwitcherBtn}>
                <span>Switch to Mentor Studio</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link href="/onboarding/mentor" className={styles.roleSwitcherBtn}>
                <Sparkles size={14} />
                <span>Become a Mentor</span>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabsRow}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "gigs" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("gigs")}
          >
            <Target size={16} />
            <span>My Learning Gigs & Proposals</span>
            {myGigs.length > 0 && <span className={styles.badgeCount}>{myGigs.length}</span>}
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "bookings" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            <Calendar size={16} />
            <span>Booked 1-on-1 Lessons</span>
            {bookings.length > 0 && <span className={styles.badgeCount}>{bookings.length}</span>}
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "explore" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("explore")}
          >
            <BookOpen size={16} />
            <span>Explore Mentor Sessions</span>
          </button>
        </div>

        {/* ----------------------------------------------------
            TAB 1: MY LEARNING GIGS & MENTOR PROPOSALS
            ---------------------------------------------------- */}
        {activeTab === "gigs" && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>
              <span>My Learning Requests (Gigs)</span>
              <button
                type="button"
                onClick={() => setIsPostGigOpen(true)}
                className={styles.postGigBtn}
                style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}
              >
                <Plus size={14} />
                <span>New Request</span>
              </button>
            </div>

            {myGigs.length === 0 ? (
              <div className={styles.emptyState}>
                <Target size={44} color="rgba(52, 211, 153, 0.5)" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                <div className={styles.emptyStateTitle}>You haven&apos;t posted any learning requests yet</div>
                <p className={styles.emptyStateDesc}>
                  Post what you want to learn (e.g. &quot;Next.js App Router&quot;, &quot;Blouse Cutting&quot;) + your budget. Verified mentors will apply to teach you!
                </p>
                <button
                  type="button"
                  onClick={() => setIsPostGigOpen(true)}
                  className={styles.postGigBtn}
                  style={{ marginTop: "1.25rem" }}
                >
                  <Plus size={16} />
                  <span>Post Your First Learning Gig</span>
                </button>
              </div>
            ) : (
              <div className={styles.gigsGrid}>
                {myGigs.map((gig) => (
                  <div key={gig.id} className={styles.gigCard}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                          {gig.title}
                        </h3>
                        <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", padding: "0.2rem 0.6rem", borderRadius: "9999px", background: gig.status === "MATCHED" ? "rgba(52, 211, 153, 0.2)" : "rgba(251, 191, 36, 0.15)", color: gig.status === "MATCHED" ? "#34d399" : "#fbbf24" }}>
                          {gig.status}
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "6px", color: "rgba(226, 237, 231, 0.7)" }}>
                          #{gig.skillSlug}
                        </span>
                        <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "6px", color: "rgba(226, 237, 231, 0.7)" }}>
                          {gig.level}
                        </span>
                        <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "6px", color: "rgba(226, 237, 231, 0.7)" }}>
                          Target: ₹{gig.budget}/hr
                        </span>
                      </div>

                      <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.8)", lineHeight: "1.5", margin: "0 0 1rem 0" }}>
                        {gig.description}
                      </p>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => handleToggleGigApplications(gig.id)}
                        className={styles.postGigBtn}
                        style={{ width: "100%", justifyContent: "center", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)", color: "#34d399" }}
                      >
                        <Users size={14} />
                        <span>
                          {expandedGigId === gig.id ? "Hide Applications" : `View Applications (${gig.applicationsCount || 0})`}
                        </span>
                      </button>

                      {/* Applications Drawer */}
                      {expandedGigId === gig.id && (
                        <div className={styles.applicationsContainer}>
                          {loadingGigDetails ? (
                            <div style={{ textAlign: "center", padding: "1rem", color: "#34d399", fontSize: "0.85rem" }}>
                              <Loader2 size={16} className="animate-spin" style={{ display: "inline-block", marginRight: "0.5rem" }} />
                              Loading mentor proposals...
                            </div>
                          ) : !selectedGigDetails?.applications || selectedGigDetails.applications.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "1rem", color: "rgba(226, 237, 231, 0.6)", fontSize: "0.82rem" }}>
                              No mentors have applied yet. Your request is live for mentors to review.
                            </div>
                          ) : (
                            selectedGigDetails.applications.map((app: any) => (
                              <div key={app.id} className={styles.applicationItem}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                                  <div>
                                    <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#ffffff" }}>
                                      {app.mentorName || "Verified Mentor"}
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "#34d399" }}>
                                      {app.mentorTitle || "Practical Specialist"}
                                    </div>
                                  </div>

                                  <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#34d399", fontFamily: "var(--font-mono)" }}>
                                      ₹{app.proposedPrice}
                                    </div>
                                    <span style={{ fontSize: "0.7rem", color: "rgba(226, 237, 231, 0.6)" }}>proposed rate</span>
                                  </div>
                                </div>

                                <p style={{ fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.8)", margin: "0.5rem 0 0.75rem 0", lineHeight: "1.4" }}>
                                  &ldquo;{app.message}&rdquo;
                                </p>

                                {app.status === "ACCEPTED" ? (
                                  <div style={{ color: "#34d399", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                    <CheckCircle2 size={14} />
                                    <span>Hired & Booked</span>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleAcceptMentor(gig.id, app.id)}
                                    className={styles.acceptBtn}
                                  >
                                    <Check size={14} />
                                    <span>Accept & Book This Mentor</span>
                                  </button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: BOOKED 1-ON-1 LESSONS
            ---------------------------------------------------- */}
        {activeTab === "bookings" && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>
              <span>Upcoming Confirmed Sessions</span>
            </div>

            {bookings.length === 0 ? (
              <div className={styles.emptyState}>
                <Calendar size={44} color="rgba(52, 211, 153, 0.5)" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                <div className={styles.emptyStateTitle}>No scheduled sessions yet</div>
                <p className={styles.emptyStateDesc}>
                  Book a session from the Mentor directory or accept a mentor proposal to start your 1-on-1 learning!
                </p>
                <Link
                  href="/sessions"
                  className={styles.postGigBtn}
                  style={{ textDecoration: "none", marginTop: "1.25rem", display: "inline-flex" }}
                >
                  <BookOpen size={16} />
                  <span>Browse Mentor Sessions</span>
                </Link>
              </div>
            ) : (
              bookings.map((bk) => (
                <div key={bk.id} className={styles.bookingItem}>
                  <div className={styles.bookingLeft}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(52, 211, 153, 0.15)", border: "1px solid #34d399", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                      <Video size={20} />
                    </div>
                    <div>
                      <div className={styles.bookingInfoTitle}>{bk.topic}</div>
                      <div className={styles.bookingInfoMeta}>
                        <Clock size={13} />
                        <span>{bk.timeSlot} • {new Date(bk.scheduledDate).toLocaleDateString()}</span>
                      </div>
                      {bk.notes && (
                        <div style={{ fontSize: "0.75rem", color: "#34d399", marginTop: "0.2rem" }}>
                          Note: {bk.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Entering private classroom for ${bk.topic}`)}
                    className={styles.postGigBtn}
                    style={{ padding: "0.6rem 1.25rem" }}
                  >
                    <Video size={15} />
                    <span>Join 1:1 Classroom</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: EXPLORE MENTOR SESSIONS
            ---------------------------------------------------- */}
        {activeTab === "explore" && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>
              <span>Mentor-Initiated Teaching Offerings</span>
              <Link href="/sessions" style={{ fontSize: "0.85rem", color: "#34d399", textDecoration: "none", fontWeight: 700 }}>
                View Full Catalog →
              </Link>
            </div>

            {exploreSessions.length === 0 ? (
              <div className={styles.emptyState}>
                <BookOpen size={44} color="rgba(52, 211, 153, 0.5)" style={{ margin: "0 auto 0.75rem auto", display: "block" }} />
                <div className={styles.emptyStateTitle}>No sessions created by mentors yet</div>
                <p className={styles.emptyStateDesc}>
                  Mentors will post structured teaching offerings here soon. You can also post a learning gig above!
                </p>
              </div>
            ) : (
              <div className={styles.gigsGrid}>
                {exploreSessions.map((sess) => (
                  <div key={sess.id} className={styles.gigCard}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                          {sess.title}
                        </h3>
                        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#34d399", fontFamily: "var(--font-mono)" }}>
                          ₹{sess.price}
                        </div>
                      </div>

                      <div style={{ fontSize: "0.82rem", color: "#34d399", marginBottom: "0.6rem" }}>
                        By {sess.mentorName || "Verified Mentor"} ({sess.mentorTitle || "Specialist"})
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "6px", color: "rgba(226, 237, 231, 0.7)" }}>
                          #{sess.skillSlug}
                        </span>
                        <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "6px", color: "rgba(226, 237, 231, 0.7)" }}>
                          {sess.level}
                        </span>
                        <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "6px", color: "rgba(226, 237, 231, 0.7)" }}>
                          {sess.durationMinutes} mins
                        </span>
                      </div>

                      <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.8)", lineHeight: "1.5", margin: "0 0 1rem 0" }}>
                        {sess.description}
                      </p>
                    </div>

                    <Link
                      href={`/mentors/${sess.mentorSlug || "mentor"}`}
                      className={styles.postGigBtn}
                      style={{ textDecoration: "none", justifyContent: "center" }}
                    >
                      <Calendar size={15} />
                      <span>Book Session (₹{sess.price})</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ----------------------------------------------------
          MODAL: POST A LEARNING GIG (LEARNER REQUEST)
          ---------------------------------------------------- */}
      {isPostGigOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPostGigOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setIsPostGigOpen(false)}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.35rem 0" }}>
              Post a Learning Gig Request
            </h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(226, 237, 231, 0.7)", margin: "0 0 1.5rem 0" }}>
              Tell mentors what you want to learn. Mentors will review and apply with tailored proposals.
            </p>

            <form onSubmit={handleCreateGig}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>What do you want to learn? *</label>
                <input
                  type="text"
                  value={gigTitle}
                  onChange={(e) => setGigTitle(e.target.value)}
                  placeholder="e.g. Next.js App Router & Auth integration"
                  className={styles.input}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Skill / Category *</label>
                  <input
                    type="text"
                    value={gigSkill}
                    onChange={(e) => setGigSkill(e.target.value)}
                    placeholder="e.g. next-js, tailoring, maths"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Your Current Level</label>
                  <select
                    value={gigLevel}
                    onChange={(e) => setGigLevel(e.target.value)}
                    className={styles.input}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    Your Target Budget (Min: ₹{PLATFORM_CONFIG.MINIMUM_GIG_BUDGET}/hr) *
                  </label>
                  <input
                    type="number"
                    value={gigBudget}
                    onChange={(e) => setGigBudget(Number(e.target.value))}
                    min={PLATFORM_CONFIG.MINIMUM_GIG_BUDGET}
                    step={50}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Preferred Timing</label>
                  <input
                    type="text"
                    value={gigPreferredTime}
                    onChange={(e) => setGigPreferredTime(e.target.value)}
                    placeholder="e.g. Evenings / Weekends"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Describe What Help You Need *</label>
                <textarea
                  value={gigDesc}
                  onChange={(e) => setGigDesc(e.target.value)}
                  placeholder="I am building a project and need 1-on-1 help understanding routing, API routes, database queries..."
                  className={styles.textarea}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingGig}
                className={styles.submitBtn}
                style={{ marginTop: "0.5rem" }}
              >
                {submittingGig ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Posting Gig Request...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Post Learning Gig for Mentors</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
