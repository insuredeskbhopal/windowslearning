"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: string[];
  activeRole: string;
  learnerOnboardingComplete: boolean;
  mentorOnboardingComplete: boolean;
}

export interface RequireAuthOptions {
  redirect?: string;
  intent?: "learner" | "mentor";
  action?: string;
  extraParams?: Record<string, string>;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    intent?: string
  ) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: (
    intent?: string,
    customEmail?: string
  ) => Promise<{ success: boolean; isNewAccount?: boolean; message?: string }>;
  logout: () => Promise<void>;
  requireAuth: (options?: RequireAuthOptions) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Invalid credentials." };
    } catch {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const signup = async (name: string, email: string, password: string, intent?: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, intent }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Signup failed." };
    } catch {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const loginWithGoogle = async (intent?: string, customEmail?: string) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customEmail || undefined,
          intent,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return {
          success: true,
          isNewAccount: data.isNewAccount,
        };
      }
      return { success: false, message: data.message || "Google auth failed." };
    } catch {
      return { success: false, message: "Google authentication failed." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  // Reusable Protected Action Guard
  const requireAuth = useCallback(
    (options?: RequireAuthOptions) => {
      if (user) return true;

      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);

      const redirectPath = options?.redirect || `${currentPath}?${searchParams.toString()}`;
      const params = new URLSearchParams();
      params.set("redirect", redirectPath);

      if (options?.intent) params.set("intent", options.intent);
      if (options?.action) params.set("action", options.action);

      if (options?.extraParams) {
        Object.entries(options.extraParams).forEach(([k, v]) => params.set(k, v));
      }

      router.push(`/auth/login?${params.toString()}`);
      return false;
    },
    [user, router]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        requireAuth,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
