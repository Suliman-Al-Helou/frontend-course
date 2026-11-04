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
      className="relative flex min-h-svh items-center overflow-hidden bg-background py-16 md:py-24"
    >
      {/* Grid Pattern Background - End side subtle overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 end-0 hidden w-1/2 lg:block"
        style={{
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 30%, transparent 80%)",
        }}
      >
        <svg className="size-full text-border/60">
          <defs>
            <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M64 0H0V64" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Primary subtle ambient gradient glow conforming to 10% Indigo Rule */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 end-0 hidden w-1/2 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent lg:block"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Text side */}
          <div className="relative z-10 flex flex-col items-center text-center lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:items-start lg:text-start">
            <h1 className="mb-6 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.2]">
              {t("title")}
            </h1>

            <p className="mb-8 max-w-xl text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
              {t("description")}
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="group h-11 px-6 font-semibold">
                <Link href="/register">
                  {t("ctaPrimary")}
                  <ArrowLeft size={16} aria-hidden="true" className="ms-2 transition-transform duration-200 group-hover:-translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6 font-semibold">
                <Link href="/#courses">{t("ctaSecondary")}</Link>
              </Button>
            </div>

            {/* Trust Markers Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:gap-4 lg:justify-start">
              <div className="inline-flex items-center gap-1.5">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span>{t("freeNote")}</span>
              </div>
              <span className="hidden size-1 rounded-full bg-border sm:inline-block" aria-hidden="true" />
              <div className="inline-flex items-center gap-1.5">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span>{t("AccreditedCertificate")}</span>
              </div>
              <span className="hidden size-1 rounded-full bg-border sm:inline-block" aria-hidden="true" />
              <div className="inline-flex items-center gap-1.5">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span>{t("Apply")}</span>
              </div>
            </div>
          </div>

          {/* Image side: 5 columns (8 to 12) in 12-col grid */}
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
