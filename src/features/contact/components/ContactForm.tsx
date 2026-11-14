"use client";

import { Send, CheckCircle2 } from "lucide-react";
import { useContactForm } from "../hooks/useContactForm";
import type { ContactFormState } from "../types";

interface ContactFormProps {
  initial?: Partial<ContactFormState>;
  title?: string;
  className?: string;
}

export function ContactForm({
  initial,
  title = "أرسل رسالة",
  className = "",
}: ContactFormProps) {
  const { form, sent, loading, error, updateField, handleSubmit, resetForm } =
    useContactForm(initial);

  if (sent) {
    return (
      <div
        className={`bg-card rounded-2xl border border-border shadow-sm p-8 text-center py-10 ${className}`}
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="font-bold text-foreground text-xl mb-2">تم الإرسال بنجاح!</h3>
        <p className="text-muted-foreground mb-6">سنرد عليك في أقرب وقت ممكن</p>
        <button
          type="button"
          onClick={resetForm}
          className="text-sm font-semibold text-primary hover:underline"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-2xl border border-border shadow-sm p-8 ${className}`}>
      <h2 className="text-xl font-bold text-foreground mb-6">{title}</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
            الاسم
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="اسمك الكامل"
            value={form.name}
            onChange={updateField("name")}
            required
            className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
            البريد الإلكتروني
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={updateField("email")}
            required
            className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
            رسالتك
          </label>
          <textarea
            id="contact-message"
            placeholder="كيف يمكننا مساعدتك؟"
            value={form.message}
            onChange={updateField("message")}
            rows={5}
            required
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground rounded-xl font-semibold transition-colors"
        >
          {loading ? (
            "جارٍ الإرسال..."
          ) : (
            <>
              <Send className="w-4 h-4 rtl:rotate-180" />
              إرسال الرسالة
            </>
          )}
        </button>
      </form>
    </div>
  );
}

