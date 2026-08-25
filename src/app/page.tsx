import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import ParticleText from "@/components/ParticleText/ParticleText";
import StatsBar from "@/components/StatsBar/StatsBar";
import EcosystemLoop from "@/components/EcosystemLoop/EcosystemLoop";
import SkillSection from "@/components/SkillSection/SkillSection";
import AboutSection from "@/components/AboutSection/AboutSection";
import MentorSection from "@/components/MentorSection/MentorSection";
import CommunitySection from "@/components/CommunitySection/CommunitySection";
import CareerGrowth from "@/components/CareerGrowth/CareerGrowth";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import BecomeMentorBanner from "@/components/BecomeMentorBanner/BecomeMentorBanner";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

export default function Home() {
  const navItems = [
    { label: "SKILL", href: "/skills" },
    { label: "MENTOR", href: "/mentors" },
    { label: "COMMUNITY", href: "/#community" },
    { label: "CAREER", href: "/#career" },
    { label: "BECOME A MENTOR", href: "/#become-mentor" },
  ];

  return (
    <main className={styles.mainContainer}>
      {/* Full-Screen Continuous Hero Image covering Navbar & Hero Section */}
      <div className={styles.fullScreenImageBackdrop}>
        <Image
          src="/Hero.png"
          alt="Windows Learning - Learn Any Skill with Mentors"
          fill
          priority
          sizes="100vw"
          className={styles.fullScreenImage}
        />
        <div className={styles.fullScreenImageOverlay} />
      </div>

      {/* Background ambient lighting accents */}
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowAmber} />

      {/* Full-width Capsule Navbar sitting seamlessly on top */}
      <Navbar
        brandName="windowslearning"
        items={navItems}
        ctaLabel="START LEARNING"
        ctaHref="/skills"
      />

      {/* Middle Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlowBackdrop} />

        {/* Interactive Dust Particle Text rendering Title & Tagline */}
        <ParticleText
          text="WINDOWS LEARNING"
          tagline="LEARN ANY SKILL  •  CONNECT WITH MENTORS  •  GROW TOGETHER"
        />

        {/* Hero Call to Action Buttons */}
        <div className={styles.heroButtonRow}>
          <Link
            href="/#become-mentor"
            className={styles.primaryHeroBtn}
            id="hero-become-mentor-btn"
          >
            <Sparkles size={16} />
            <span>Become a Mentor & Earn</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/mentors"
            className={styles.secondaryHeroBtn}
            id="hero-find-mentor-btn"
          >
            <Users size={16} />
            <span>Find a Mentor to Learn</span>
          </Link>
        </div>
      </section>

      {/* 1. Key Metrics & Trust Bar */}
      <StatsBar />

      {/* 2. The Core Two-Sided Ecosystem Loop: Learner ↔ Skill ↔ Mentor ↔ Community */}
      <EcosystemLoop />

      {/* 3. Discover Skills (Cooking, Tailoring, Maths, Biology, English, Computers & More) */}
      <SkillSection />

      {/* 4. Why Windows Learning? Real Skills Taught by Real People */}
      <AboutSection />

      {/* 5. 1-on-1 Mentorship Spotlight (Friendly Home Chefs, Master Tailors, Teachers & Guides) */}
      <MentorSection />

      {/* 6. Community & Peer Learning (Q&A, Discussion Groups, Practice Circles) */}
      <CommunitySection />

      {/* 7. Career & Growth (Turn Any Skill into Confidence & Income) */}
      <CareerGrowth />

      {/* 8. Simple 4-Step How It Works Progression */}
      <HowItWorks />

      {/* 9. Teach: Become a Mentor Onboarding Banner & Registration Form */}
      <BecomeMentorBanner />

      {/* 10. Complete Site Footer */}
      <Footer />
    </main>
  );
}
