"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topGrid}>
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLogo}>
              windows<span>learning</span>
            </Link>
            <p className={styles.brandTagline}>
              The open platform where anyone can learn real skills, connect with friendly mentors 1-on-1, teach what they know, and grow together.
            </p>
            <div className={styles.systemStatus}>
              <span className={styles.statusDot} />
              <span>Community & Live Classes Active</span>
            </div>
          </div>

          {/* Popular Skills */}
          <div>
            <h4 className={styles.colTitle}>Popular Skills</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/skills?track=home-cooking-recipes" className={styles.footerLink}>
                  Home Cooking & Recipes
                </Link>
              </li>
              <li>
                <Link href="/skills?track=tailoring-dress-making" className={styles.footerLink}>
                  Tailoring & Dress Stitching
                </Link>
              </li>
              <li>
                <Link href="/skills?track=vedic-maths-fast-calculation" className={styles.footerLink}>
                  Vedic Maths & Fast Calculation
                </Link>
              </li>
              <li>
                <Link href="/skills?track=biology-human-body-basics" className={styles.footerLink}>
                  Human Biology & Medical Basics
                </Link>
              </li>
              <li>
                <Link href="/skills?track=spoken-english-confidence" className={styles.footerLink}>
                  Spoken English & Fluency
                </Link>
              </li>
              <li>
                <Link href="/skills?track=computer-basics-ms-excel" className={styles.footerLink}>
                  Computer Basics & MS Excel
                </Link>
              </li>
            </ul>
          </div>

          {/* Mentorship & Community */}
          <div>
            <h4 className={styles.colTitle}>Mentors & Community</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/mentors" className={styles.footerLink}>
                  Find a Mentor
                </Link>
              </li>
              <li>
                <Link href="/mentors?availability=Available%20Today" className={styles.footerLink}>
                  Mentors Available Today
                </Link>
              </li>
              <li>
                <Link href="/#become-mentor" className={styles.footerLink}>
                  Become a Mentor & Earn
                </Link>
              </li>
              <li>
                <Link href="/#community" className={styles.footerLink}>
                  Q&A Discussion Groups
                </Link>
              </li>
              <li>
                <Link href="/#career" className={styles.footerLink}>
                  Career & Side Income
                </Link>
              </li>
            </ul>
          </div>

          {/* Weekly Tips Newsletter */}
          <div className={styles.newsletterCol}>
            <h4 className={styles.colTitle}>Free Weekly Tips</h4>
            <p className={styles.newsletterText}>
              Get free weekly cooking hacks, sewing patterns, maths calculation tricks, and English practice phrases in your inbox.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className={styles.newsletterInput}
                  required
                />
                <button type="submit" className={styles.newsletterBtn}>
                  Join Free
                </button>
              </form>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#34d399", fontSize: "0.85rem" }}>
                <CheckCircle2 size={16} />
                <span>You&apos;re subscribed! Welcome to our learning family.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div>
            © {new Date().getFullYear()} Windows Learning. Made with ❤️ for passionate learners & teachers everywhere.
          </div>
          <div className={styles.bottomLinks}>
            <Link href="/" className={styles.bottomLink}>
              Privacy
            </Link>
            <Link href="/" className={styles.bottomLink}>
              Terms
            </Link>
            <Link href="/" className={styles.bottomLink}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
