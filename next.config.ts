import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

// 1. إعداد الـ PWA
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development", // معطل في بيئة التطوير لمنع التجميع التلقائي وتكرار الطلبات
});

// For Security
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];
const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  compress: true,
  // 2. تفعيل مراقبة الـ Cache وجلب البيانات في الـ Terminal
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // For Upload the project Automatecly
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  //For Optimiz the performance
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
    ],
  },
  compiler: {
    //for Clean the code form console
    removeConsole: process.env.NODE_ENV === "production",
  },
  transpilePackages: [],
};
// For Support multi language
const withNextIntl = createNextIntlPlugin();

export default withPWA(withNextIntl(nextConfig));

