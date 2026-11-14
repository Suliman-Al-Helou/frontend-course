"use client";

import { Send, CheckCircle2 } from "lucide-react";
import { useContactForm } from "../hooks/useContactForm";
import type { ContactFormState } from "../types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  initial?: Partial<ContactFormState>;
  title?: string;
  className?: string;
}

export function ContactForm({ initial, title = "أرسل رسالة", className = "" }: ContactFormProps) {
  const { form, sent, loading, error, updateField, handleSubmit, resetForm } =
    useContactForm(initial);

  if (sent) {
    return (
      <Card
        className={cn("p-8 text-center py-10", className)}
      >
        <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h3 className="font-bold text-foreground text-xl mb-2">تم الإرسال بنجاح!</h3>
        <p className="text-muted-foreground mb-6">سنرد عليك في أقرب وقت ممكن</p>
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={resetForm}
        >
          إرسال رسالة أخرى
        </Button>
      </Card>
    );
  }

  return (
    <Card className={cn("p-8", className)}>
      <h2 className="text-xl font-bold text-foreground mb-6">{title}</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="contact-name">
            الاسم
          </Label>
          <Input
            id="contact-name"
            type="text"
            placeholder="اسمك الكامل"
            value={form.name}
            onChange={updateField("name")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">
            البريد الإلكتروني
          </Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={updateField("email")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message">
            رسالتك
          </Label>
          <textarea
            id="contact-message"
            placeholder="كيف يمكننا مساعدتك؟"
            value={form.message}
            onChange={updateField("message")}
            rows={5}
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 resize-none transition-colors motion-reduce:transition-none"
          />
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          <Send className="w-4 h-4 rtl:rotate-180" />
          إرسال الرسالة
        </Button>
      </form>
    </Card>
  );
}
