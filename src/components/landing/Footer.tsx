"use client";

// 1. Imports
import Link from "next/link";
import { Instagram, LucideIcon, MessageCircle } from "lucide-react";
import LogoIcon from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/hooks/useCourses";
import { WHATSAPP_URL } from "@/lib/contact";

// 2. Types & Data
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
  { icon: MessageCircle, href: WHATSAPP_URL, label: "واتساب" },
  {
    icon: Instagram,
    href: "https://www.instagram.com/future.house2?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
    label: "إنستغرام",
  },
];

const PLATFORM_LINKS: LinkItem[] = [
  { label: "المدربون", href: "/instructors" },
  { label: "الكورسات", href: "/courses" },
];

const SUPPORT_LINKS: LinkItem[] = [{ label: "تواصل معنا", href: "/#contact" }];

// 3. Sub Components
function Brand() {
  return (
    <div className="space-y-4">
      <Link href="/" className="inline-flex items-center gap-2" aria-label="Future House">
        <LogoIcon size={34} />
        <span className="text-xl font-bold text-foreground">
          Future<span className="text-primary ps-1">House</span>
        </span>
      </Link>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
        منصة تعليمية عربية متكاملة لتعلم البرمجة والتقنية الحديثة بأسلوب هندسي رصين.
      </p>
      <div className="flex items-center gap-2.5 pt-1">
        {SOCIALS.map(({ icon: Icon, href, label }) => (
          <Button
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            variant="outline"
            className="size-9 p-0 rounded-lg hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Icon className="size-4" />
          </Button>
        ))}
      </div>
    </div>
  );
}

function CoursesColumn() {
  const { data: courses = [], isPending } = useCourses();
  const topCourses = courses.slice(0, 5);

  return (
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-4">الكورسات</h3>
      {isPending ? (
        <div className="space-y-3" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-28 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : topCourses.length > 0 ? (
        <ul className="space-y-2.5 text-sm">
          {topCourses.map((course) => (
            <li key={course.id}>
              <Link
                href={`/courses/${course.id}`}
                className="text-muted-foreground hover:text-foreground transition-colors block truncate"
                title={course.title}
              >
                {course.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground/70 text-sm">لا توجد كورسات حالياً</p>
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
              className="text-muted-foreground hover:text-foreground transition-colors block"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 4. Main Component
export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-foreground py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <Brand />
          <CoursesColumn />
          <LinkColumn title="المنصة" items={PLATFORM_LINKS} />
          <LinkColumn title="الدعم" items={SUPPORT_LINKS} />
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 Future House Academy. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
