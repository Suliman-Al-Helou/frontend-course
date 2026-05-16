import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-ibm-plex-sans-arabic",
});

// ❌ احذف هذا السطر: import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "EduPlatform — تعلم بشكل فعّال",
  description: "منصة تعليمية محكومة تضمن تعلمك الفعلي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexSansArabic.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              const t = localStorage.getItem('theme');
              if (t === 'light') {
                document.documentElement.classList.remove('dark');
              } else {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
