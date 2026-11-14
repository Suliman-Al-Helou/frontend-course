"use client";

import FAQSection from "@/components/landing/FAQSection";
import { useCurrentUser } from "@/features/auth";

export default function StudentContactPage() {
  const { user } = useCurrentUser();

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
