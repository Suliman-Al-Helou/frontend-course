'use client';

// src/app/(public)/contact/_components/ContactInfo.tsx

import { MessageCircle, Mail, Clock } from 'lucide-react';

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-deep">تواصل معنا مباشرة</h2>

      <a
        href="https://wa.me/966500000000"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl p-5 transition-colors group"
      >
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-green-800">واتساب</p>
          <p className="text-green-700 text-sm">ردّ فوري خلال دقائق</p>
          <p className="text-green-600 text-sm font-mono mt-1">+966 50 000 0000</p>
        </div>
      </a>

      <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-blue-deep">البريد الإلكتروني</p>
          <p className="text-muted-foreground text-sm">support@tiqniar.com</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-muted/50 border border-border rounded-2xl p-5">
        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-bold text-foreground">ساعات الدعم</p>
          <p className="text-muted-foreground text-sm">الأحد — الخميس: ٩ ص – ١١ م</p>
          <p className="text-muted-foreground text-sm">متوسط وقت الرد: أقل من ساعة</p>
        </div>
      </div>
    </div>
  );
}