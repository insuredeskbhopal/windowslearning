"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, Star, ShieldCheck, Clock } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

const SKILL_TOPICS = [
  { id: "home-cooking-recipes", label: "🍳 Home Cooking & Recipes" },
  { id: "cake-baking-pastry", label: "🎂 Cake Baking & Pastries" },
  { id: "tailoring-dress-making", label: "✂️ Tailoring & Dress Making" },
  { id: "vedic-maths-fast-calculation", label: "📐 Vedic Maths & Speed Math" },
  { id: "biology-human-body-basics", label: "🧬 Biology & Medical Basics" },
  { id: "spoken-english-confidence", label: "🗣️ Spoken English & Fluency" },
  { id: "computer-basics-ms-excel", label: "💻 Computer Basics & Excel" },
  { id: "mobile-repairing-electronics", label: "📱 Mobile Repair & Gadgets" },
  { id: "yoga-daily-fitness-diet", label: "🧘 Yoga & Health Guidance" },
  { id: "small-business-accounts-tally", label: "📊 Business Accounts & Tally" },
];

function MentorOnboardingContent() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("Home Chef & Master Baker");
  const [location, setLocation] = useState("Delhi, India");
  const [bio, setBio] = useState(
    "Teaching easy home cooking, authentic traditional recipes, soft rotis, and baking with 8+ years experience."
  );
  const [teachingSkills, setTeachingSkills] = useState<string[]>(["home-cooking-recipes"]);
  const [experienceYears, setExperienceYears] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(250);
  const [isFreeCommunity, setIsFreeCommunity] = useState(false);
  const [availability, setAvailability] = useState("Available Today");
  const [preferredLanguage, setPreferredLanguage] = useState("Hindi / English");
  const [loading, setLoading] = useState(false);

  const toggleSkill = (id: string) => {
    if (teachingSkills.includes(id)) {
      if (teachingSkills.length > 1) {
        setTeachingSkills(teachingSkills.filter((s) => s !== id));
      }
    } else {
      setTeachingSkills([...teachingSkills, id]);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          bio,
          location,
          teachingSkills,
          experienceYears,
          hourlyRate: isFreeCommunity ? 0 : Number(hourlyRate),
          isFreeCommunity,
          availability,
          preferredLanguage,
        }),
      });

      if (res.ok) {
        await refreshUser();
        router.push("/mentor/dashboard");
      } else {
        router.push("/mentor/dashboard");
      }
    } catch {
      router.push("/mentor/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mentorOnboardingPage}>
      <div className={styles.ambientGlow} />

      <Navbar
        brandName="windowslearning"
        items={[
          { label: "SKILL", href: "/skills" },
          { label: "MENTOR", href: "/mentors" },
        ]}
        ctaLabel="BROWSE"
        ctaHref="/skills"
      />

      <div className={styles.card}>
        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={`${styles.progressStep} ${step >= 1 ? styles.progressStepActive : ""}`} />
          <div className={`${styles.progressStep} ${step >= 2 ? styles.progressStepActive : ""}`} />
          <div className={`${styles.progressStep} ${step >= 3 ? styles.progressStepActive : ""}`} />
          <div className={`${styles.progressStep} ${step >= 4 ? styles.progressStepActive : ""}`} />
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div>
            <div className={styles.stepBadge}>Step 1 of 4 • Basic Profile</div>
            <h1 className={styles.title}>Tell us about your teaching profile</h1>
            <p className={styles.subtitle}>
              Learners look for clear titles and friendly introductions.
            </p>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Your Professional Title / Role</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Tailor & Boutique Designer, Vedic Maths Coach"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>City & State</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Jaipur, Rajasthan, India"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Short Bio / What You Help People Learn</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your practical experience and how you teach step-by-step..."
                  className={styles.textarea}
                  required
                />
              </div>
            </div>

            <div className={styles.actionRow}>
              <div />
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setStep(2)}
              >
                <span>Continue to Skills</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Skills & Experience */}
        {step === 2 && (
          <div>
            <div className={styles.stepBadge}>Step 2 of 4 • Skills & Experience</div>
            <h1 className={styles.title}>What skills can you teach?</h1>
            <p className={styles.subtitle}>
              Select the topics you have practical experience in.
            </p>

            <div className={styles.chipsGrid} style={{ marginBottom: "1.5rem" }}>
              {SKILL_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => toggleSkill(topic.id)}
                  className={`${styles.chipBtn} ${
                    teachingSkills.includes(topic.id) ? styles.chipBtnSelected : ""
                  }`}
                >
                  <CheckCircle2
                    size={16}
                    color={teachingSkills.includes(topic.id) ? "#34d399" : "rgba(255,255,255,0.2)"}
                  />
                  <span>{topic.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.fieldGroup} style={{ marginBottom: "1.5rem" }}>
              <label className={styles.label}>Years of Experience in this Skill</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                min={1}
                max={50}
                className={styles.input}
              />
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setStep(3)}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Availability */}
        {step === 3 && (
          <div>
            <div className={styles.stepBadge}>Step 3 of 4 • Fees & Times</div>
            <h1 className={styles.title}>Set your hourly fee & availability</h1>
            <p className={styles.subtitle}>
              You can change your pricing or availability anytime later.
            </p>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Hourly Rate (₹ per hour)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  disabled={isFreeCommunity}
                  min={0}
                  step={50}
                  className={styles.input}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="freeCommunity"
                  checked={isFreeCommunity}
                  onChange={(e) => setIsFreeCommunity(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "#34d399" }}
                />
                <label htmlFor="freeCommunity" style={{ color: "rgba(226, 237, 231, 0.9)", fontSize: "0.88rem", cursor: "pointer" }}>
                  I want to offer Free Community Classes to help people in need
                </label>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>When are you available?</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className={styles.input}
                  style={{ cursor: "pointer" }}
                >
                  <option value="Available Today">Available Today (Daily)</option>
                  <option value="This Week">This Week (Flexible Weekdays)</option>
                  <option value="Weekend Only">Weekends Only (Saturday & Sunday)</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Languages You Teach In</label>
                <input
                  type="text"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  placeholder="e.g. Hindi, English, Tamil, Bengali"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setStep(4)}
              >
                <span>Preview Profile</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preview & Publish */}
        {step === 4 && (
          <div>
            <div className={styles.stepBadge}>Step 4 of 4 • Preview & Publish</div>
            <h1 className={styles.title}>Your Mentor Profile is Ready</h1>
            <p className={styles.subtitle}>
              Here is how learners will see your profile on the mentor directory.
            </p>

            <div className={styles.previewCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff" }}>
                      {user?.name || "Mentor Name"}
                    </span>
                    <ShieldCheck size={18} color="#34d399" />
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#34d399", marginTop: "0.2rem" }}>
                    {title} • {location}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#34d399" }}>
                    {isFreeCommunity ? "Free Class" : `₹${hourlyRate}/hr`}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(226, 237, 231, 0.6)", display: "flex", alignItems: "center", gap: "0.3rem", justifyContent: "flex-end" }}>
                    <Clock size={12} />
                    <span>{availability}</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "0.9rem", color: "rgba(226, 237, 231, 0.8)", lineHeight: "1.6", margin: "0 0 1rem 0" }}>
                {bio}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {teachingSkills.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: "0.75rem",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(52, 211, 153, 0.25)",
                      color: "#34d399",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "9999px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    #{s.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setStep(3)}
              >
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                className={styles.nextBtn}
                onClick={handlePublish}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Publishing Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Publish Profile & Open Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MentorOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading...
        </div>
      }
    >
      <MentorOnboardingContent />
    </Suspense>
  );
}
