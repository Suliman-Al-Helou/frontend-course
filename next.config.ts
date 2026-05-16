import type { NextConfig } from "next";
module.exports = {
  output: 'standalone', // مهم للـ deployment
}
const nextConfig: NextConfig = {
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // ✅ أضف هذا فقط
  transpilePackages: [],
};

export default nextConfig;