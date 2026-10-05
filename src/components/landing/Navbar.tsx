import Link from 'next/link';
import Logo from '@/components/Logo';
import NavbarClient from './NavbarClient';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Future House">
          <Logo size={36} />
          <span className="text-xl font-bold text-foreground">Future House</span>
        </Link>
        <NavbarClient />
      </div>
    </header>
  );
}