"use client";

import { useState } from "react";
import { FORMSPREE_URL } from "@/lib/contact";

interface FormState { name: string; email: string; message: string }

export function useContactForm(initial?: Partial<FormState>) {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "", ...initial });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("حدث خطأ أثناء الإرسال، حاول مجدداً."); // TODO: translate
    } finally {
      setLoading(false);
    }
  };

  return { form, sent, loading, error, updateField, handleSubmit };
}