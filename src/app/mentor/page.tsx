"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function MentorRoutePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth/login?redirect=/mentor/dashboard");
      } else {
        router.replace("/mentor/dashboard");
      }
    }
  }, [user, loading, router]);

  return (
    <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Loading Mentor Studio...
    </div>
  );
}
