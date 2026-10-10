// components/landing/hero-section.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section id="hero" className="relative flex min-h-svh items-center overflow-hidden bg-background py-16 md:py-24">
      {/* خلفية تدرج خفيفة على جهة الصورة فقط (end)، تغطي النصف الأسفل من صورة القسم */}
       <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 end-0 w-full   w-1/2 lg:block"
          style={{
    maskImage: 'linear-gradient(to top, transparent, black 20%, black 80%, transparent), linear-gradient(to left, transparent, black 20%, black 80%, transparent)',
    WebkitMaskImage: 'linear-gradient(to top, transparent, black 20%, black 80%, transparent), linear-gradient(to left, transparent, black 20%, black 80%, transparent)',
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in'
  }}
      >
        <svg className="size-full text-border">
          <defs>
            <pattern
              id="hero-grid"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M64 0H0V64"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 end-0 w-full lg:w-1/2 block"
        style={
          {
            background: `linear-gradient(to top, var(--primary) / 10, transparent)`
          } as React.CSSProperties
        }
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center lg:grid-cols-12 gap-8">
          {/* Text side */}
          <div className="relative z-10 flex flex-col items-center text-center lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:items-start lg:text-start">
            <h1 className="mb-6 max-w-lg text-4xl lg:text-5xl font-bold text-foreground">
              {t("title")}
            </h1>

            <p className="mb-8 max-w-xl text-lg text-muted-foreground">
              {t("description")}
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" >
                <Link href="/register">
                  {t("ctaPrimary")}
                  <ArrowLeft size={16} aria-hidden="true" className="mr-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#courses">{t("ctaSecondary")}</Link>
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4   text-primary rounded-sm " aria-hidden="true" />
              <span className="">{t("freeNote")} </span>
              <span className="text-[20px] text-primary">•</span>
              <span className="">{t("AccreditedCertificate")}</span>
              <span className="text-[20px] text-primary">•</span>
              <span className="">{t("Apply")}</span>
            </div>
          </div>

          {/* Image side: مخفية على الجوال */}
          <div className="hidden lg:col-span-6 lg:col-start-8 lg:row-start-1 md:block">
            <div className="relative aspect-square overflow-hidden rounded-se-[3rem] rounded-es-[3rem] rounded-tr-[5px] rounded-bl-[5px]  border border-border bg-muted md:m-auto md:mt-5">
              <Image
                src="/images/landing-hero1.jpg"
                alt={t("imageAlt")}
                fill
                sizes="(max-w-1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}