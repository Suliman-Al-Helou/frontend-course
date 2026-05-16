'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code2, Eye, EyeOff } from 'lucide-react';

interface ResetForm {
  password: string;
  confirm:  string;
}

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
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-3xl text-green-600">✓</span>
      </div>
      <h3 className="font-bold text-blue-deep text-lg">تم التحديث بنجاح!</h3>
      <Link
        href="/login"
        className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold inline-flex items-center justify-center transition-colors"
      >
        تسجيل الدخول الآن
      </Link>
    </div>
  );
}

// ✅ component منفصل يستخدم useSearchParams
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token        = searchParams.get('token');

  const [form,     setForm]     = useState<ResetForm>({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  const updateField = (field: keyof ResetForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 800));
      setDone(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ، تأكد من صلاحية الرابط';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (done) return <SuccessState />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">كلمة المرور الجديدة</label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={updateField('password')}
            required
            className="w-full h-11 rounded-xl border border-input bg-background px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={() => setShowPass(prev => !prev)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">تأكيد كلمة المرور</label>
        <input
          type="password"
          placeholder="••••••••"
          value={form.confirm}
          onChange={updateField('confirm')}
          required
          className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 border border-red-100">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
      >
        {loading ? 'جارٍ التحديث...' : 'تحديث كلمة المرور'}
      </button>
    </form>
  );
}

// ✅ الـ page الرئيسية تلف بـ Suspense
export default function ResetPasswordPage() {
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
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-blue-deep">كلمة مرور جديدة</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/60 border border-blue-100 p-8">
          {/* ✅ Suspense يحل مشكلة useSearchParams */}
          <Suspense fallback={<div className="h-40 bg-muted animate-pulse rounded-xl" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}