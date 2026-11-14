import Link from "next/link";
import { Code2, Sparkles, CheckCircle2 } from "lucide-react";
import { AuthTerminal } from "@/components/shared/ProfessionalTerminal";

export function BrandSide() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-login-signup-background border-e border-white/5">
      {/* Decorative ambient gradients */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-16 right-16 w-72 h-72 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-24 left-10 w-80 h-80 rounded-full bg-blue-mid blur-3xl" />
      </div>

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-mid to-blue-light flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Future <span className="text-primary">House</span>
          </span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>انضم لأكثر من 5,000 مطوّر عربي</span>
        </div>
      </div>

      {/* Interactive Code Terminal */}
      <div className="relative z-10 my-auto py-6">
        <AuthTerminal />
      </div>

      {/* Trust & Community Signals */}
      <div className="relative z-10 grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-white/70">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
          <span>تطبيق عملي من اليوم الأول</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
          <span>لقاءات مباشرة مع المدربين</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
          <span>مجتمع برمجي تفاعلي</span>
        </div>
      </div>
    </div>
  );
}
