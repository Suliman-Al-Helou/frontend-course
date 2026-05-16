'use client';

// src/app/(auth)/register/page.tsx

// 1. Imports
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code2, Eye, EyeOff, CheckCircle, Star, Users, Award, ArrowLeft, LucideIcon } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// 2. Types & Data
interface RegisterForm {
  name:     string;
  email:    string;
  password: string;
  confirm:  string;
}

type Step = 'form' | 'otp';

interface Highlight {
  icon: LucideIcon;
  text: string;
}

const HIGHLIGHTS: Highlight[] = [
  { icon: Users, text: '+١٢,٠٠٠ طالب انضموا بالفعل'  },
  { icon: Award, text: 'شهادات معتمدة عند الإتمام'    },
  { icon: Star,  text: 'مدربون خبراء بتقييم ٤.٩'     },
];

// 3. Sub Components
function BrandSide() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-deep via-blue-mid to-blue-light flex-col justify-between p-12">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-16 right-16 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-24 left-10 w-80 h-80 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">
          Future <span className="text-blue-light">House</span>
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <h2 className="text-4xl font-bold text-white leading-tight mb-4">
          ابدأ رحلتك<br />
          <span className="text-blue-light">التقنية اليوم</span>
        </h2>
        <p className="text-white/70 text-lg leading-relaxed mb-10">
          انضم إلى آلاف المتعلمين العرب الذين غيّروا مساراتهم المهنية مع Future House
        </p>
        <div className="space-y-4">
          {HIGHLIGHTS.map((h, i) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90 font-medium">{h.text}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="relative bg-white/10 rounded-2xl p-5 border border-white/20">
        <p className="text-white/80 text-sm leading-relaxed mb-3">
          "future house غيّر مساري المهني كلياً. من صفر إلى مهندس في ٦ أشهر."
        </p>
        <div className="flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
            className="w-8 h-8 rounded-full border-2 border-white/30 object-cover"
            alt="student"
          />
          <div>
            <p className="text-white font-semibold text-sm">محمد أحمد</p>
            <p className="text-white/50 text-xs">مهندس برمجيات</p>
          </div>
          <div className="flex mr-auto">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    { ok: password.length >= 8 },
    { ok: /[A-Z]/.test(password) },
    { ok: /\d/.test(password) },
  ];
  const score  = checks.filter(c => c.ok).length;
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const labels = ['', 'ضعيفة', 'مقبولة', 'قوية'];
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[0,1,2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score] : 'bg-muted'}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{labels[score]}</p>
    </div>
  );
}

// 4. Main Component
export default function RegisterPage() {
  const router  = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const [form,     setForm]     = useState<RegisterForm>({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [step,     setStep]     = useState<Step>('form');
  const [otp,      setOtp]      = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const updateField = (field: keyof RegisterForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('كلمتا المرور غير متطابقتين'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name:                  form.name,
        email:                 form.email,
        password:              form.password,
        password_confirmation: form.confirm,
      });
      setAuth(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // TODO: POST /api/auth/verify-otp
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'الرمز غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-arabic" dir="rtl">
      <BrandSide />

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-mid to-blue-light flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-deep">
                Future <span className="text-primary">House</span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              {step === 'form' ? 'إنشاء حساب جديد' : 'تأكيد بريدك الإلكتروني'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {step === 'form'
                ? 'انضم مجاناً وابدأ التعلم فوراً'
                : `أرسلنا رمزاً إلى ${form.email}`}
            </p>
          </div>

          {step === 'form' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">الاسم الكامل</label>
                <input
                  type="text" placeholder="محمد أحمد"
                  value={form.name} onChange={updateField('name')} required
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
                <input
                  type="email" placeholder="example@email.com"
                  value={form.email} onChange={updateField('email')} required
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={form.password} onChange={updateField('password')} required
                    className="w-full h-11 rounded-xl border border-input bg-background px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">تأكيد كلمة المرور</label>
                <input
                  type="password" placeholder="••••••••"
                  value={form.confirm} onChange={updateField('confirm')} required
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors">
                {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء الحساب مجاناً'}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs text-muted-foreground">
                  <span className="bg-background px-3">أو</span>
                </div>
              </div>

              <button type="button" disabled
                className="w-full h-11 rounded-xl border-2 border-input inline-flex items-center justify-center gap-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                التسجيل بـ Google
              </button>
            </form>

          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                <CheckCircle className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">أدخل الرمز المكوّن من 6 أرقام المُرسَل لبريدك</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">رمز التأكيد</label>
                <input
                  type="text" placeholder="123456"
                  value={otp} onChange={e => setOtp(e.target.value)}
                  maxLength={6} required
                  className="w-full h-12 rounded-xl border border-input bg-background text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">{error}</div>
              )}
              <button type="submit" disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors">
                {loading ? 'جارٍ التحقق...' : 'تأكيد وابدأ التعلم'}
              </button>
              <button type="button"
                className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
                لم تستلم الرمز؟ أعد الإرسال
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            لديك حساب؟{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              سجّل دخولك
            </Link>
          </p>

          <div className="text-center mt-4">
            <Link href="/"
              className="text-xs text-muted-foreground hover:text-primary inline-flex items-center justify-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              العودة للرئيسية
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}