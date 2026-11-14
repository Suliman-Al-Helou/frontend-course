"use client";

import FAQSection from "@/components/landing/FAQSection";
import { useAuthStore } from "@/store/authStore";

export default function StudentContactPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <FAQSection
        isDashboard
        key={user?.email}
        initial={{ name: user?.name, email: user?.email }}
      />
    </div>
  );
}
