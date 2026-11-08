import { Mail, MessageCircle } from "lucide-react";
import { SUPPORT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";
import ContactForm from "./ContactForm";

function Channel({
  href, icon: Icon, title, value, tone, external,
}: {
  href: string;
  icon: typeof Mail;
  title: string;
  value: string;
  tone: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
    >
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-md ${tone}`}>
        <Icon className="size-6" />
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-foreground">{title}</span>
        <span dir="ltr" className="block truncate text-start text-sm text-muted-foreground">
          {value}
        </span>
      </span>
    </a>
  );
}

export default function ContactPanel({
  initial,
}: {
  initial?: { name?: string; email?: string };
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <Channel
          href={WHATSAPP_URL}
          icon={MessageCircle}
          title="واتساب" /* TODO: translate */
          value={WHATSAPP_DISPLAY}
          tone="bg-success/15 text-success"
          external
        />
        <Channel
          href={`mailto:${SUPPORT_EMAIL}`}
          icon={Mail}
          title="البريد الإلكتروني" /* TODO: translate */
          value={SUPPORT_EMAIL}
          tone="bg-primary/15 text-primary"
        />
      </div>
      <ContactForm initial={initial} />
    </div>
  );
}