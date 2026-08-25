"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

const SKILL_OPTIONS = [
  { id: "cooking", label: "🍳 Home Cooking & Baking" },
  { id: "tailoring", label: "✂️ Tailoring & Blouse Cutting" },
  { id: "maths", label: "📐 Vedic Maths & Speed Calculation" },
  { id: "biology", label: "🧬 Biology & Medical Basics" },
  { id: "english", label: "🗣️ Spoken English & Fluency" },
  { id: "computers", label: "💻 Computer Basics & Excel" },
  { id: "repair", label: "📱 Mobile & Electronics Repair" },
  { id: "yoga", label: "🧘 Yoga & Daily Fitness" },
];

const GOAL_OPTIONS = [
  { id: "career", label: "💼 Job & Career Growth" },
  { id: "daily", label: "🏡 Use in Daily Home Life" },
  { id: "exam", label: "📚 School / College Exam Prep" },
  { id: "business", label: "💰 Start Home Business / Earn" },
  { id: "hobby", label: "🎨 Passion & Creative Hobby" },
];

const LEVEL_OPTIONS = [
  { id: "Beginner", label: "🌱 Absolute Beginner (Zero Experience)" },
  { id: "Intermediate", label: "🌿 Some Basic Knowledge" },
  { id: "Advanced", label: "🌳 Want Advanced & Pro Techniques" },
];

const TIME_OPTIONS = [
  { id: "1-2 hours/week", label: "⏱️ 1–2 hours / week (Casual)" },
  { id: "3-5 hours/week", label: "🔥 3–5 hours / week (Recommended)" },
  { id: "5+ hours/week", label: "🚀 5+ hours / week (Fast-track)" },
];

function LearnerOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSkill = (id: string) => {
    if (selectedSkills.includes(id)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== id));
    } else {
      setSelectedSkills([...selectedSkills, id]);
    }
  };

  const handleStep1Next = () => {
    setError("");
    if (selectedSkills.length === 0) {
      setError("Please select at least one skill you want to learn.");
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    setError("");
    if (!primaryGoal) {
      setError("Please choose your primary learning goal.");
      return;
    }
    setStep(3);
  };

  const handleStep3Next = () => {
    setError("");
    if (!experienceLevel) {
      setError("Please select your current experience level.");
      return;
    }
    setStep(4);
  };

  const handleFinish = async () => {
    setError("");
    if (!timeCommitment) {
      setError("Please choose your weekly learning time.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/learner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interestedSkills: selectedSkills,
          primaryGoal,
          experienceLevel,
          lookingFor: "mentor",
          timeCommitment,
        }),
      });

      if (res.ok) {
        await refreshUser();
        if (redirect && redirect !== "/" && !redirect.startsWith("/auth") && !redirect.startsWith("/onboarding")) {
          router.push(redirect);
        } else {
          router.push("/learner/dashboard");
        }
      } else {
        router.push("/learner/dashboard");
      }
    } catch {
      router.push("/learner/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.onboardingPage}>
      <div className={styles.ambientGlow} />

      <Navbar
        brandName="windowslearning"
        items={[
          { label: "SKILL", href: "/skills" },
          { label: "MENTOR", href: "/mentors" },
        ]}
        ctaLabel="GET STARTED"
        ctaHref="/auth/login"
      />

      <div className={styles.card}>
        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={`${styles.progressStep} ${step >= 1 ? styles.progressStepActive : ""}`} />
          <div className={`${styles.progressStep} ${step >= 2 ? styles.progressStepActive : ""}`} />
          <div className={`${styles.progressStep} ${step >= 3 ? styles.progressStepActive : ""}`} />
          <div className={`${styles.progressStep} ${step >= 4 ? styles.progressStepActive : ""}`} />
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "0.75rem 1rem", color: "#f87171", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Skills */}
        {step === 1 && (
          <div>
            <div className={styles.stepBadge}>Step 1 of 4 • Target Skills</div>
            <h1 className={styles.title}>What do you want to learn?</h1>
            <p className={styles.subtitle}>
              Pick one or more practical skills you want to master with a mentor.
            </p>

            <div className={styles.optionsGrid}>
              {SKILL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleSkill(opt.id)}
                  className={`${styles.optionBtn} ${
                    selectedSkills.includes(opt.id) ? styles.optionBtnSelected : ""
                  }`}
                >
                  <CheckCircle2
                    size={16}
                    color={selectedSkills.includes(opt.id) ? "#34d399" : "rgba(255,255,255,0.2)"}
                  />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.actionRow}>
              <div />
              <button
                type="button"
                className={styles.nextBtn}
                onClick={handleStep1Next}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div>
            <div className={styles.stepBadge}>Step 2 of 4 • Primary Goal</div>
            <h1 className={styles.title}>Why do you want to learn this?</h1>
            <p className={styles.subtitle}>
              This helps your mentors tailor lessons specifically to your purpose.
            </p>

            <div className={styles.optionsGrid} style={{ gridTemplateColumns: "1fr" }}>
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrimaryGoal(opt.id)}
                  className={`${styles.optionBtn} ${
                    primaryGoal === opt.id ? styles.optionBtnSelected : ""
                  }`}
                >
                  <CheckCircle2
                    size={16}
                    color={primaryGoal === opt.id ? "#34d399" : "rgba(255,255,255,0.2)"}
                  />
                  <span>{opt.label}</span>
                </button>
              ))}
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
                onClick={handleStep2Next}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Experience Level */}
        {step === 3 && (
          <div>
            <div className={styles.stepBadge}>Step 3 of 4 • Current Level</div>
            <h1 className={styles.title}>What is your current experience?</h1>
            <p className={styles.subtitle}>
              Mentors welcome learners at every level, from beginners to pros.
            </p>

            <div className={styles.optionsGrid} style={{ gridTemplateColumns: "1fr" }}>
              {LEVEL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExperienceLevel(opt.id)}
                  className={`${styles.optionBtn} ${
                    experienceLevel === opt.id ? styles.optionBtnSelected : ""
                  }`}
                >
                  <CheckCircle2
                    size={16}
                    color={experienceLevel === opt.id ? "#34d399" : "rgba(255,255,255,0.2)"}
                  />
                  <span>{opt.label}</span>
                </button>
              ))}
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
                onClick={handleStep3Next}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Time Commitment */}
        {step === 4 && (
          <div>
            <div className={styles.stepBadge}>Step 4 of 4 • Learning Schedule</div>
            <h1 className={styles.title}>How much time can you spend?</h1>
            <p className={styles.subtitle}>
              Consistent weekly practice produces the fastest results.
            </p>

            <div className={styles.optionsGrid} style={{ gridTemplateColumns: "1fr" }}>
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTimeCommitment(opt.id)}
                  className={`${styles.optionBtn} ${
                    timeCommitment === opt.id ? styles.optionBtnSelected : ""
                  }`}
                >
                  <CheckCircle2
                    size={16}
                    color={timeCommitment === opt.id ? "#34d399" : "rgba(255,255,255,0.2)"}
                  />
                  <span>{opt.label}</span>
                </button>
              ))}
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
                onClick={handleFinish}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Complete & Start Learning</span>
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

export default function LearnerOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading...
        </div>
      }
    >
      <LearnerOnboardingContent />
    </Suspense>
  );
}
