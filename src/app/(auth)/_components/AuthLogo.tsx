import Link from 'next/link';
import { Code2 } from 'lucide-react';

export function AuthLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-mid to-blue-light flex items-center justify-center">
        <Code2 className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-foreground">
        future<span className="text-primary">house</span>
      </span>
    </Link>
  );
}