// src/app/(public)/contact/_hooks/useContact.ts

import { useState } from 'react';
import api from '@/lib/api';

export interface ContactForm {
  name:    string;
  email:   string;
  message: string;
}

const INITIAL_FORM: ContactForm = { name: '', email: '', message: '' };

export function useContactForm() {
  const [form,    setForm]    = useState<ContactForm>(INITIAL_FORM);
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const updateField = (field: keyof ContactForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // ← TODO: أضف POST /api/contact في Laravel لما تبني Admin API
      // await api.post('/contact', form);
      await new Promise(res => setTimeout(res, 800)); // مؤقت: simulate request
      setSent(true);
    } catch {
      setError('حدث خطأ أثناء الإرسال، حاول مجدداً.');
    } finally {
      setLoading(false);
    }
  };

  return { form, sent, loading, error, updateField, handleSubmit };
}

export interface FAQItem {
  q: string;
  a: string;
}

export function useContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i);
  return { openIndex, toggle };
}