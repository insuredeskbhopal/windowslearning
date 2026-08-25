"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Search } from "lucide-react";
import BrandLogo from "./BrandLogo";
import styles from "./Navbar.module.css";

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface NavbarProps {
  brandName?: string;
  brandHref?: string;
  items?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  showSearch?: boolean;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "SKILL", href: "/skills" },
  { label: "MENTOR", href: "/mentors" },
  { label: "COMMUNITY", href: "/#community" },
  { label: "CAREER", href: "/#career" },
  { label: "BECOME A MENTOR", href: "/#become-mentor" },
];

export default function Navbar({
  brandName = "windowslearning",
  brandHref = "/",
  items = DEFAULT_NAV_ITEMS,
  ctaLabel = "START LEARNING",
  ctaHref = "/skills",
  onCtaClick,
  showSearch = false,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(
    pathname === "/skills"
      ? "/skills"
      : pathname === "/mentors"
      ? "/mentors"
      : items[0]?.href || "/skills"
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener to activate sticky floating glass background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`${styles.navWrapper} ${
          isScrolled ? styles.navWrapperScrolled : ""
        }`}
      >
        <div className={styles.navContainer}>
          {/* Brand Identity (Left) */}
          <Link href={brandHref} className={styles.brandLink} id="navbar-brand-logo">
            <span className={styles.brandIcon}>
              <BrandLogo size={28} />
            </span>
            <span className={styles.brandText}>{brandName}</span>
          </Link>

          {/* Desktop Capsule Menu (Right) */}
          <nav className={styles.capsuleNav} aria-label="Main Navigation">
            <ul className={styles.navList}>
              {items.map((item) => {
                const isActive = activeItem === item.href;
                return (
                  <li key={item.label} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                      onClick={() => setActiveItem(item.href)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {showSearch && (
              <button
                type="button"
                className={styles.searchTrigger}
                onClick={() => setSearchOpen(true)}
                title="Search (Ctrl + K)"
              >
                <Search size={13} />
                <span>Search</span>
                <kbd className={styles.kbdKey}>⌘K</kbd>
              </button>
            )}

            {/* Primary Action Button inside Capsule */}
            <Link
              href={ctaHref}
              className={styles.ctaButton}
              onClick={onCtaClick}
              id="navbar-cta-button"
            >
              <span>{ctaLabel}</span>
            </Link>
          </nav>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            id="navbar-mobile-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`${styles.mobileDrawerOverlay} ${mobileMenuOpen ? styles.open : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Slide-down Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.open : ""}`}>
        <div className={styles.mobileDrawerHeader}>
          <div className={styles.brandLink}>
            <BrandLogo size={22} />
            <span className={styles.brandText}>{brandName}</span>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <ul className={styles.mobileNavList}>
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => {
                  setActiveItem(item.href);
                  setMobileMenuOpen(false);
                }}
              >
                <span>{item.label}</span>
                <ArrowRight size={15} opacity={0.6} />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={ctaHref}
          className={`${styles.ctaButton} ${styles.mobileCta}`}
          onClick={() => {
            onCtaClick?.();
            setMobileMenuOpen(false);
          }}
        >
          <span>{ctaLabel}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </>
  );
}
