'use client';

// src/app/(public)/contact/_components/ContactForm.tsx

import { Send } from 'lucide-react';
import { useContactForm } from '../_hooks/useContact';

export function ContactForm() {
  const { form, sent, loading, error, updateField, handleSubmit } = useContactForm();

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-8">
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="font-bold text-blue-deep text-xl mb-2">تم الإرسال بنجاح!</h3>
          <p className="text-muted-foreground">سنرد عليك في أقرب وقت ممكن</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-8">
      <h2 className="text-xl font-bold text-blue-deep mb-6">أرسل رسالة</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">الاسم</label>
          <input
            type="text"
            placeholder="اسمك الكامل"
            value={form.name}
            onChange={updateField('name')}
            required
            className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={updateField('email')}
            required
            className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">رسالتك</label>
          <textarea
            placeholder="كيف يمكننا مساعدتك؟"
            value={form.message}
            onChange={updateField('message')}
            rows={5}
            required
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
        >
          {loading
            ? 'جارٍ الإرسال...'
            : <><Send className="w-4 h-4" />إرسال الرسالة</>
          }
        </button>
      </form>
    </div>
  );
}