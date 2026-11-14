"use client";

import { MessageCircle, Mail, Clock } from "lucide-react";
import { WHATSAPP_URL, WHATSAPP_DISPLAY, SUPPORT_EMAIL } from "../constants";
import { Card } from "@/components/ui/card";

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">تواصل معنا مباشرة</h2>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
      >
        <Card interactive className="flex items-center gap-4 bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 p-5">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform motion-reduce:transform-none">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-foreground">واتساب</p>
            <p className="text-emerald-600 dark:text-emerald-400 text-sm">ردّ فوري خلال دقائق</p>
            <p className="text-muted-foreground text-sm font-mono mt-1 text-right" dir="ltr">
              {WHATSAPP_DISPLAY}
            </p>
          </div>
        </Card>
      </a>

      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
      >
        <Card interactive className="flex items-center gap-4 bg-primary/5 hover:bg-primary/10 border-primary/20 p-5">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform motion-reduce:transform-none">
            <Mail className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-foreground">البريد الإلكتروني</p>
            <p className="text-muted-foreground text-sm font-mono text-right" dir="ltr">{SUPPORT_EMAIL}</p>
          </div>
        </Card>
      </a>

      <Card className="flex items-center gap-4 bg-muted/40 p-5">
        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-bold text-foreground">ساعات الدعم</p>
          <p className="text-muted-foreground text-sm">الأحد — الخميس: ٩ ص – ١١ م</p>
          <p className="text-muted-foreground text-sm">متوسط وقت الرد: أقل من ساعة</p>
        </div>
      </Card>
    </div>
  );
}
