'use client';

// src/app/(auth)/login/page.tsx

// 1. Imports
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
// 2. Types
interface LoginForm {
  email:    string;
  password: string;
}

// 3. Sub Components
function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-mid to-blue-light flex items-center justify-center">
        <Code2 className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-blue-deep">
        future<span className="text-primary">house</span>
      </span>
    </Link>
  );
}

interface PasswordFieldProps {
  value:    string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordField({ value, onChange }: PasswordFieldProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="relative">
      <input
        id="password"
        type={showPass ? 'text' : 'password'}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
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
  );
}

// 4. Main Component
export default function LoginPage() {
  const router   = useRouter();
  const setAuth  = useAuthStore(state => state.setAuth);

  const [form,    setForm]    = useState<LoginForm>({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof LoginForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // POST /api/auth/login → { token, user }
      const { data } = await api.post('/auth/login', form);
      setAuth(data.user, data.token);       // حفظ في Zustand + localStorage
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'بيانات الدخول غير صحيحة');
    } finally {
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
          <h1 className="text-2xl font-bold text-blue-deep">أهلاً بعودتك!</h1>
          <p className="text-muted-foreground mt-1">سجّل دخولك لمتابعة رحلة التعلم</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/60 border border-blue-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={updateField('email')}
                required
                className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  كلمة المرور
                </label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <PasswordField value={form.password} onChange={updateField('password')} />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 border border-red-100">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
            >
              {loading ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs text-muted-foreground bg-white px-3">أو</div>
            </div>

            {/* Google — مؤقت: Google OAuth يحتاج إعداد في Laravel لاحقاً */}
            <button
              type="button"
              disabled
              className="w-full h-11 rounded-xl border-2 border-input inline-flex items-center justify-center gap-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              المتابعة بـ Google
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              سجّل الآن
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