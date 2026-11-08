import { useState } from 'react';
import emailjs from '@emailjs/browser';

export interface ContactForm {
  name:    string;
  email:   string;
  message: string;
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
    const res = await fetch('https://formspree.io/f/xlgvepqv', { // ← حط الـ ID
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    form.name,
        email:   form.email,
        message: form.message,
      }),
    });
    if (!res.ok) throw new Error();
    setSent(true);
  } catch {
    setError('حدث خطأ أثناء الإرسال، حاول مجدداً.');
  } finally {
    setLoading(false);
  }
};

  return { form, sent, loading, error, updateField, handleSubmit };
}