"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, ArrowRight, X, HeartHandshake } from "lucide-react";
import styles from "./BecomeMentorBanner.module.css";

export default function BecomeMentorBanner() {
  const [modalOpen, setModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <section className={styles.becomeMentorSection} id="become-mentor">
      <div className={styles.bannerCard}>
        <div>
          <div className={styles.badge}>
            <Sparkles size={14} />
            <span>Teach & Earn</span>
          </div>

          <h2 className={styles.title}>
            Know Cooking, Tailoring, Maths or <span className={styles.titleHighlight}>Any Special Skill?</span>
          </h2>

          <p className={styles.description}>
            Everyone has a skill they know well. Become a mentor on Windows Learning, teach eager learners from your home, set your own fees per hour, and earn respect and extra income.
          </p>

          <div className={styles.perksGrid}>
            <div className={styles.perkItem}>
              <CheckCircle2 size={18} />
              <span>Set your own price (e.g. ₹150, ₹250, ₹500/hr) or offer free classes</span>
            </div>
            <div className={styles.perkItem}>
              <CheckCircle2 size={18} />
              <span>Teach in your free time (morning, evening, or weekends)</span>
            </div>
            <div className={styles.perkItem}>
              <CheckCircle2 size={18} />
              <span>Direct connection with learners who genuinely want to learn from you</span>
            </div>
          </div>
        </div>

        <div className={styles.actionBox}>
          <h3 className={styles.actionBoxTitle}>Register as a Mentor in 2 Minutes</h3>
          <p className={styles.actionBoxSubtitle}>
            Tell us what skill you teach (cooking, sewing, maths, biology, computer, English, etc.). We will verify your profile and help you get your first learners.
          </p>

          <button
            type="button"
            className={styles.applyBtn}
            onClick={() => {
              setModalOpen(true);
              setApplied(false);
            }}
          >
            <span>Become a Mentor & Start Teaching</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {modalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeModalBtn}
              onClick={() => setModalOpen(false)}
            >
              <X size={18} />
            </button>

            {!applied ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <HeartHandshake size={28} color="#34d399" />
                  <h2 style={{ fontSize: "1.4rem", color: "#ffffff", margin: 0 }}>
                    Mentor Registration
                  </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)", marginBottom: "0.4rem", fontFamily: "var(--font-mono)" }}>
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sunita Sharma"
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

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)", marginBottom: "0.4rem", fontFamily: "var(--font-mono)" }}>
                      What Skill Do You Teach?
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
                      <option>Home Cooking & Indian Recipes</option>
                      <option>Cake Baking & Pastries</option>
                      <option>Tailoring, Blouse Cutting & Suit Stitching</option>
                      <option>Maths & Speed Calculation</option>
                      <option>Biology & Medical Basics</option>
                      <option>Spoken English & Communication</option>
                      <option>Computer Basics & MS Excel</option>
                      <option>Smartphone & Electronics Repair</option>
                      <option>Yoga & Daily Fitness</option>
                      <option>Small Business Bookkeeping & Accounts</option>
                      <option>Other Unique Skill</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)", marginBottom: "0.4rem", fontFamily: "var(--font-mono)" }}>
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        defaultValue={3}
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

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)", marginBottom: "0.4rem", fontFamily: "var(--font-mono)" }}>
                        Your Hourly Fee (₹)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹200 or Free"
                        defaultValue="₹200"
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
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "rgba(226, 237, 231, 0.7)", marginBottom: "0.4rem", fontFamily: "var(--font-mono)" }}>
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
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
                </div>

                <button
                  type="button"
                  className={styles.applyBtn}
                  style={{ width: "100%" }}
                  onClick={() => setApplied(true)}
                >
                  <span>Submit & Start Teaching</span>
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", border: "2px solid #34d399", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto", color: "#34d399" }}>
                  <CheckCircle2 size={30} />
                </div>
                <h3 style={{ fontSize: "1.3rem", color: "#ffffff", margin: "0 0 0.5rem 0" }}>
                  Registration Received!
                </h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(226, 237, 231, 0.75)", margin: "0 0 1.5rem 0", lineHeight: "1.6" }}>
                  Welcome to the Windows Learning mentor community! We will verify your profile and message you on WhatsApp within 24 hours.
                </p>
                <button
                  type="button"
                  className={styles.applyBtn}
                  onClick={() => setModalOpen(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
