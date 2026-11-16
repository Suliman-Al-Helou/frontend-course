import Link from "next/link";
import Logo from "@/components/Logo";

interface AuthLogoProps {
  className?: string;
}

export function AuthLogo({ className = "" }: AuthLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 mb-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-opacity hover:opacity-95 ${className}`}
      aria-label="Future House - الصفحة الرئيسية"
    >
      <Logo
        size={40}
        className="group-hover:scale-105 transition-transform motion-reduce:transition-none"
      />
      <span className="text-xl font-bold tracking-tight text-foreground">
        Future <span className="text-primary">House</span>
      </span>
    </Link>
  );
}
