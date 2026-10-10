// 1. Imports
import Link from "next/link";
import {
  Twitter,
  Youtube,
  Linkedin,
  Instagram,
  LucideIcon,
  MessageCircle,
} from "lucide-react";
import LogoIcon from "@/components/Logo";
import { Button } from "../ui/button";
// 2. Types & Data
interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

const FOOTER_LINKS: Record<string, string[]> = {
  الكورسات: [
    "Python",
    "JavaScript",
    "React",
    "الذكاء الاصطناعي",
    "قواعد البيانات",
  ],
  المنصة: ["كيف تعمل؟", "الأسعار", "المدربون", "الشهادات"],
  الدعم: ["مركز المساعدة", "تواصل معنا", "سياسة الخصوصية", "الشروط والأحكام"],
};

const SOCIALS: SocialLink[] = [
  { icon: MessageCircle, href: "#", label: "WhatsApp"  },
  { icon: Instagram, href: "https://www.instagram.com/future.house2?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==", label: "Instagram" },
];

// 3. Sub Components
// أضف الـ import


// عدّل Brand()
function Brand() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <LogoIcon size={36} className="brightness-0 invert"/>
        <span className="text-xl font-bold">
         Future<span className="text-white pl-1">House</span>
        </span>
      </div>
      <p className="text-white/60 text-sm leading-relaxed mb-5">
        منصة تعليمية عربية متكاملة لتعلم البرمجة والتقنية باحترافية.
      </p>
      <div className="flex  gap-3">
        {SOCIALS.map(({ icon: Icon, href, label }) => (
          <Button
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            size={"sm"}
            // className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <Icon className="w-4 h-4 " />
          </Button>
        ))}
      </div>
    </div>
  );
}

interface LinkColumnProps {
  category: string;
  items: string[];
}

function LinkColumn({ category, items }: LinkColumnProps) {
  return (
    <div>
      <h3 className="font-bold text-white mb-4 ">{category}</h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item}>
            <Link
              href="#"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              {item}
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
    <footer className="bg-primary dark:bg-background text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12 ">
          <Brand />
          {Object.entries(FOOTER_LINKS).map(([category, items]) => (
            <LinkColumn key={category} category={category} items={items} />
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm">
            © 2026 Future House. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
