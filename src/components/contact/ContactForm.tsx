"use client";

import { Check, Send } from "lucide-react";
import { useContactForm } from "./useContactForm";

const FIELD =
  "w-full rounded-md border border-input bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default function ContactForm({
  initial,
}: {
  initial?: { name?: string; email?: string };
}) {
  const { form, sent, loading, error, updateField, handleSubmit } = useContactForm(initial);

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="size-6" />
        </div>
        <h3 className="mb-1 text-lg font-bold text-foreground">تم الإرسال بنجاح</h3> {/* TODO: translate */}
        <p className="text-sm text-muted-foreground">سنرد عليك في أقرب وقت ممكن</p> {/* TODO: translate */}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-bold text-foreground">أرسل رسالة</h3> {/* TODO: translate */}

      <div className="space-y-1.5">
        <label htmlFor="c-name" className="text-sm font-medium text-foreground">الاسم</label>
        <input id="c-name" required value={form.name} onChange={updateField("name")} className={`${FIELD} h-11`} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="c-email" className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
        <input id="c-email" type="email" required value={form.email} onChange={updateField("email")} className={`${FIELD} h-11`} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="c-msg" className="text-sm font-medium text-foreground">رسالتك</label>
        <textarea id="c-msg" rows={4} required value={form.message} onChange={updateField("message")} className={`${FIELD} resize-none py-3`} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
      >
        <Send className="size-4 rtl:-scale-x-100" />
        {loading ? "جارٍ الإرسال..." : "إرسال الرسالة"} {/* TODO: translate */}
      </button>
    </form>
  );
}