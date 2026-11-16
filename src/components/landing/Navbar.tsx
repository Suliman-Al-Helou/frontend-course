import Link from "next/link";
import Logo from "@/components/Logo";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          aria-label="Future House - الصفحة الرئيسية"
        >
          <Logo size={36} />
          <span className="text-xl font-bold tracking-tight text-foreground">Future House</span>
        </Link>
        <NavbarClient />
      </div>
    </header>
  );
}
