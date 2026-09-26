import { CheckCircle } from 'lucide-react';

interface Props {
  email: string;
  otp: string;
  setOtp: (v: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function OtpForm({ otp, setOtp, error, loading, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
      {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">{error}</div>}
      <button type="submit" disabled={loading}
        className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors">
        {loading ? 'جارٍ التحقق...' : 'تأكيد وابدأ التعلم'}
      </button>
      <button type="button" className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
        لم تستلم الرمز؟ أعد الإرسال
      </button>
    </form>
  );
}