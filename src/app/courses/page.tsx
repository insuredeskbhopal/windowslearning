"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoursesRoutePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/skills");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "#020705", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Opening Skills Catalog...
    </div>
  );
}
