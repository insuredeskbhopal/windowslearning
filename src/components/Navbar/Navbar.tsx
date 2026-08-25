"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Search, ShieldCheck, User, LogOut } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useAuth } from "@/context/AuthContext";
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
  { label: "BECOME A MENTOR", href: "/onboarding/mentor" },
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
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(
    pathname === "/skills"
      ? "/skills"
      : pathname === "/mentors"
      ? "/mentors"
      : items[0]?.href || "/skills"
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const dashboardUrl = user?.roles?.includes("MENTOR")
    ? "/mentor/dashboard"
    : "/learner/dashboard";

  return (
    <>
      <header className={styles.navWrapper}>
        <div className={styles.navContainer}>
          {/* Brand Identity (Left) */}
          <Link href={brandHref} className={styles.brandLink} id="navbar-brand-logo">
            <div className={styles.brandIcon}>
              <BrandLogo size={24} />
            </div>
            <span className={styles.brandText}>{brandName}</span>
          </Link>

          {/* Floating Light Capsule Navigation Container (Right) */}
          <nav className={styles.capsuleNav} aria-label="Main Navigation">
            <ul className={styles.navList}>
              {items.map((item) => {
                const isActive = activeItem === item.href || pathname === item.href;
                return (
                  <li key={item.label} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                      onClick={() => setActiveItem(item.href)}
                    >
                      <span>{item.label}</span>
                      {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                    </Link>
                    {isActive && <div className={styles.activeIndicator} />}
                  </li>
                );
              })}
            </ul>

            {/* User Session CTA or Sign In / Start Learning */}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link
                  href={dashboardUrl}
                  className={styles.ctaButton}
                  id="navbar-dashboard-btn"
                  title="Open Dashboard"
                >
                  <User size={14} style={{ display: "inline", marginRight: "4px" }} />
                  <span>{user.name.split(" ")[0].toUpperCase()}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign Out"
                  style={{
                    background: "rgba(0,0,0,0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#0a261a",
                  }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Link
                  href="/auth/login"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#0a261a",
                    textDecoration: "none",
                    padding: "0.4rem 0.6rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  LOGIN
                </Link>
                <Link
                  href={ctaHref}
                  className={styles.ctaButton}
                  onClick={onCtaClick}
                  id="navbar-cta-button"
                >
                  <span>{ctaLabel}</span>
                </Link>
              </div>
            )}
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

          {user ? (
            <>
              <li>
                <Link
                  href={dashboardUrl}
                  className={styles.mobileNavLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>MY DASHBOARD ({user.name})</span>
                  <ArrowRight size={15} opacity={0.6} />
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#f87171",
                    padding: "1rem 0",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <LogOut size={16} />
                  <span>SIGN OUT</span>
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/auth/login"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>LOGIN / SIGN UP</span>
                <ArrowRight size={15} opacity={0.6} />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
