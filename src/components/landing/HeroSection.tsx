import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh items-center overflow-hidden bg-background py-16 md:py-24"
    >
      {/* 
        خلفية مربعات هندسية مستوحاة من بيئة المطورين:
        1. تبقى ظاهرة على الموبايل بكامل العرض بنعومة (Mobile Grid Preserved)
        2. على الشاشات الكبيرة: منطقة مزدوجة (فاتحة خلف النص وغامقة خلف الصورة)
        3. تلاشٍ دائري/بيضاوي ناعم كلما ابتعدت عن المركز نحو الحواف والأطراف
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full overflow-hidden"
        style={{
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 50%, black 20%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 50%, black 20%, transparent 85%)",
        }}
      >
        {/* شاشات الجوال والتابلت: شبكة مربعة خفيفة متجانسة تحافظ على تباين النص */}
        <div className="block size-full lg:hidden">
          <svg className="size-full text-border/40">
            <defs>
              <pattern id="hero-grid-mobile" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid-mobile)" />
          </svg>
        </div>

        {/* الشاشات الكبيرة: توزيع مزدوج (فاتح خلف النص / غامق خلف الصورة) */}
        <div className="hidden size-full lg:grid lg:grid-cols-12">
          {/* جهة النص (الأعمدة 1-7): شبكة فاتحة مع توهج نيلي ناعم يطابق قاعدة الـ 10% */}
          <div className="relative h-full lg:col-span-7">
            <svg className="size-full text-border/80">
              <defs>
                <pattern id="hero-grid-light" width="64" height="64" patternUnits="userSpaceOnUse">
                  <path d="M64 0H0V64" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid-light)" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent" />
          </div>

          {/* جهة الصورة (الأعمدة 8-12): شبكة داكنة خافتة تندمج مع سكون السطح */}
          <div className="relative h-full lg:col-span-5">
            <svg className="size-full text-border/25">
              <defs>
                <pattern id="hero-grid-dark" width="64" height="64" patternUnits="userSpaceOnUse">
                  <path d="M64 0H0V64" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid-dark)" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Text side */}
          <div className="relative z-10 flex flex-col items-center text-center lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:items-start lg:text-start">
            <h1
              id="hero-title"
              className="mb-6 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.2]"
            >
              {t("title")}
            </h1>

            <p className="mb-8 max-w-xl text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
              {t("description")}
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-11 px-6 font-semibold motion-safe:transition-all motion-reduce:transition-none"
              >
                <Link href="/register">
                  <span>{t("ctaPrimary")}</span>
                  <ArrowLeft
                    size={16}
                    aria-hidden="true"
                    className="ms-2 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-x-1 motion-reduce:transform-none"
                  />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 px-6 font-semibold motion-safe:transition-all motion-reduce:transition-none"
              >
                <Link href="/#courses">{t("ctaSecondary")}</Link>
              </Button>
            </div>

            {/* Trust Markers List */}
            <div
              role="list"
              aria-label={t("freeNote")}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:gap-4 lg:justify-start"
            >
              <div role="listitem" className="inline-flex items-center gap-1.5">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span>{t("freeNote")}</span>
              </div>
              <span className="hidden size-1 rounded-full bg-border sm:inline-block" aria-hidden="true" />
              <div role="listitem" className="inline-flex items-center gap-1.5">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span>{t("AccreditedCertificate")}</span>
              </div>
              <span className="hidden size-1 rounded-full bg-border sm:inline-block" aria-hidden="true" />
              <div role="listitem" className="inline-flex items-center gap-1.5">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span>{t("Apply")}</span>
              </div>
            </div>
          </div>

          {/* Image side: 5 columns (8 to 12) in 12-col grid with CLS defense */}
          <div className="hidden md:block md:mx-auto md:max-w-md lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:max-w-none">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
              <Image
                src="/images/landing-hero1.jpg"
                alt={t("imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 45vw, 500px"
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
