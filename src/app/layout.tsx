import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import AuthBootstrap from "@/components/shared/AuthBootstrap";
import { Toaster } from "sonner";


const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-ibm-plex-sans-arabic",
});

export const metadata: Metadata = {
  title: "Future House — منصة التعلم التقني الأولى بالعربية",
  description: "منصة تعليمية محكومة لتعلم البرمجة والتقنية باحترافية.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={ibmPlexSansArabic.variable}
      suppressHydrationWarning
    >
      <head>
        {/*
          next/script مع strategy="beforeInteractive" هو الطريقة الصحيحة
          لتشغيل سكريبت قبل hydration في Next.js App Router
        */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme-storage');
                const theme = stored ? JSON.parse(stored)?.state?.theme : 'dark';
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>

        <AuthBootstrap />
          <Toaster position="top-center" dir="rtl" richColors />

        {children}</body>
    </html>
  );
}
