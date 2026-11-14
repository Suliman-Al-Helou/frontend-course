"use client";

import { MessageCircle, Mail, Clock } from "lucide-react";
import { WHATSAPP_URL, WHATSAPP_DISPLAY, SUPPORT_EMAIL } from "../constants";

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">تواصل معنا مباشرة</h2>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-2xl p-5 transition-colors group"
      >
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-green-800 dark:text-green-400">واتساب</p>
          <p className="text-green-700 dark:text-green-500 text-sm">ردّ فوري خلال دقائق</p>
          <p className="text-green-600 dark:text-green-500 text-sm font-mono mt-1">
            {WHATSAPP_DISPLAY}
          </p>
        </div>
      </a>

      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        className="flex items-center gap-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-2xl p-5 transition-colors group"
      >
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-foreground">البريد الإلكتروني</p>
          <p className="text-muted-foreground text-sm font-mono">{SUPPORT_EMAIL}</p>
        </div>
      </a>

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
