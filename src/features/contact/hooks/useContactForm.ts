"use client";

import { useState, useRef } from "react";
import { sendContactMessage } from "../api";
import type { ContactFormState } from "../types";

export function useContactForm(initial?: Partial<ContactFormState>) {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
    ...initial,
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const updateField =
    (field: keyof ContactFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setSent(true);
    } catch {
      setError("حدث خطأ أثناء الإرسال، حاول مجدداً.");
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", message: "", ...initial });
    setSent(false);
    setError(null);
  };

  return { form, sent, loading, error, updateField, handleSubmit, resetForm };
}
