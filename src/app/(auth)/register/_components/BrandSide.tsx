import { motion } from 'framer-motion';
import { Code2, Star } from 'lucide-react';
import { HIGHLIGHTS } from '../_data/highlights';

export function BrandSide() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-deep via-blue-mid to-blue-light flex-col justify-between p-12">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-16 right-16 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-24 left-10 w-80 h-80 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">
          Future <span className="text-blue-light">House</span>
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <h2 className="text-4xl font-bold text-white leading-tight mb-4">
          ابدأ رحلتك<br />
          <span className="text-blue-light">التقنية اليوم</span>
        </h2>
        <p className="text-white/70 text-lg leading-relaxed mb-10">
          انضم إلى آلاف المتعلمين العرب الذين غيّروا مساراتهم المهنية مع Future House
        </p>
        <div className="space-y-4">
          {HIGHLIGHTS.map((h, i) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90 font-medium">{h.text}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="relative bg-white/10 rounded-2xl p-5 border border-white/20">
        <p className="text-white/80 text-sm leading-relaxed mb-3">
          "future house غيّر مساري المهني كلياً. من صفر إلى مهندس في ٦ أشهر."
        </p>
        <div className="flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
            className="w-8 h-8 rounded-full border-2 border-white/30 object-cover"
            alt="student"
          />
          <div>
            <p className="text-white font-semibold text-sm">محمد أحمد</p>
            <p className="text-white/50 text-xs">مهندس برمجيات</p>
          </div>
          <div className="flex mr-auto">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}