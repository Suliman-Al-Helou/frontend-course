"use client";

import Link from "next/link";
import { Instagram, LucideIcon, MessageCircle } from "lucide-react";
import LogoIcon from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "@/features/courses";
import { WHATSAPP_URL } from "@/features/contact";

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

interface LinkItem {
  label: string;
  href: string;
}

const SOCIALS: SocialLink[] = [
  { icon: MessageCircle, href: WHATSAPP_URL, label: "تواصل عبر واتساب" },
  {
    icon: Instagram,
    href: "https://www.instagram.com/future.house2?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
    label: "متابعتنا على إنستغرام",
  },
];

const PLATFORM_LINKS: LinkItem[] = [
  { label: "الكورسات والمسارات", href: "/courses" },
  { label: "المدربون المعتمدون", href: "/instructors" },
  { label: "لوحة تحكم الطالب", href: "/dashboard" },
];

const SUPPORT_LINKS: LinkItem[] = [
  { label: "تواصل معنا", href: "/contact" },
  { label: "الأسئلة الشائعة", href: "/#faq" },
  { label: "الدعم المباشر (واتساب)", href: WHATSAPP_URL },
];

function Brand() {
  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
        aria-label="Future House - الصفحة الرئيسية"
      >
        <LogoIcon size={36} />
        <span className="text-xl font-bold tracking-tight text-foreground">
          Future<span className="text-primary ps-0.5">House</span>
        </span>
      </Link>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
        منصة تعليمية عربية متخصصة في هندسة البرمجيات والتقنيات الحديثة بأسلوب تطبيقي رصين.
      </p>
      <div className="flex items-center gap-2.5 pt-1">
        {SOCIALS.map(({ icon: Icon, href, label }) => (
          <Button
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            size="icon"
            variant="outline"
            className="rounded-xl border-border/80 hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Icon className="size-5" aria-hidden="true" />
          </Button>
        ))}
      </div>
    </div>
  );
}

function CoursesColumn() {
  const { data: topCourses = [], isPending } = useQuery({
    ...courseQueries.list(),
    select: (allCourses) =>
      allCourses.slice(0, 5).map((course) => ({
        id: Number(course.id),
        title: String(course.title ?? ""),
      })),
  });

  return (
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-4">أبرز الكورسات</h3>
      {isPending ? (
        <div className="space-y-3" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-32 bg-muted/60 rounded-md animate-pulse motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : topCourses.length > 0 ? (
        <ul className="space-y-2.5 text-sm">
          {topCourses.map((course) => (
            <li key={course.id}>
              <Link
                href={`/courses/${course.id}`}
                className="text-muted-foreground hover:text-foreground transition-colors block truncate py-1"
                title={course.title}
              >
                {course.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">لا توجد كورسات متاحة حالياً</p>
      )}
    </div>
  );
}

interface LinkColumnProps {
  title: string;
  items: LinkItem[];
}

function LinkColumn({ title, items }: LinkColumnProps) {
  return (
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-4">{title}</h3>
      <ul className="space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors block py-1"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-foreground py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <Brand />
          <CoursesColumn />
          <LinkColumn title="المنصة" items={PLATFORM_LINKS} />
          <LinkColumn title="الدعم والمساعدة" items={SUPPORT_LINKS} />
        </div>

        <div className="border-t border-border/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 Future House Academy. جميع الحقوق محفوظة.</p>
          <p>منصة تعليمية عربية معتمدة لهندسة البرمجيات والتقنية الحديثة.</p>
        </div>
      </div>
    </footer>
  );
}
