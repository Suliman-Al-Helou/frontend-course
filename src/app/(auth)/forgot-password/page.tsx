'use client';

// src/app/(auth)/forgot-password/page.tsx

// 1. Imports
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, ArrowLeft, Mail } from 'lucide-react';
import api from '@/lib/api';

// 2. Sub Components
function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-mid to-blue-light flex items-center justify-center">
        <Code2 className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-blue-deep">
        future <span className="text-primary">house</span>
      </span>
    </Link>
  );
}

function SuccessState() {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-bold text-blue-deep text-lg">تم الإرسال!</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        إذا كان هذا البريد مسجلاً لدينا، ستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور خلال دقائق.
      </p>
      <p className="text-xs text-muted-foreground">تحقق من مجلد الرسائل غير المرغوب فيها (Spam)</p>
    </div>
  );
}

// 3. Main Component
export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ← TODO: أضف POST /api/auth/forgot-password في Laravel
      // await api.post('/auth/forgot-password', { email });
      await new Promise(res => setTimeout(res, 800)); // مؤقت
    } catch (_) {
      // نُظهر success دائماً — لا نكشف إذا الإيميل مسجل أو لا (أمان)
    } finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-pale via-white to-blue-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-blue-deep">إعادة تعيين كلمة المرور</h1>
          <p className="text-muted-foreground mt-1">أدخل بريدك الإلكتروني وسنرسل لك رابط الإعادة</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/60 border border-blue-100 p-8">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
              >
                {loading ? 'جارٍ الإرسال...' : 'إرسال رابط الإعادة'}
              </button>
            </form>
          ) : (
            <SuccessState />
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/login" className="text-primary font-semibold hover:underline">
              العودة لتسجيل الدخول
            </Link>
          </p>
        </div>

        {/* Back home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  );
}