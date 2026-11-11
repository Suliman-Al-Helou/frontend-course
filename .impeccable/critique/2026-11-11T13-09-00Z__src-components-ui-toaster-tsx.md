---
target: src/components/ui/toaster.tsx
total_score: 39.5
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/ui/sonner.tsx"
target_fingerprint: "sha256:toaster-unified-hardened-v2"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/ui/sonner.tsx
timestamp: 2026-11-11T13-09-00Z
slug: src-components-ui-toaster-tsx
closed: true
---

# Critique: Toaster & Notification System Unification

Target: `Toaster` Component, `src/app/layout.tsx`, and Unified Toast Architecture (`src/components/ui/sonner.tsx` / `toaster.tsx`)

## Design Health Score (Pre-Intervention)
Total: 22.0/40 (Needs Unified Component Architecture, DESIGN.md Token Mapping, Theme Binding, and A11y Touch Target Hardening)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2.5 | Raw default Sonner toasts lack brand visual cohesion with Future House Academy dark/light themes. |
| 2 | Match System / Real World | 2.5 | Default English accessibility labels (`Close toast`) from upstream library instead of localized Arabic terms (`إغلاق التنبيه`). |
| 3 | User Control and Freedom | 2.5 | No explicit close button provided by default (`closeButton` prop missing in `layout.tsx`), forcing users to wait out timeouts. |
| 4 | Consistency and Standards | 1.5 | Severe fragmentation: `layout.tsx` imports raw `sonner`, `toast.ts` defines partial wrappers, and `EnrollCard.tsx` wrote an ad-hoc custom toast with `useState`. |
| 5 | Error Prevention | 2.5 | Long error descriptions lack constrained max-widths and typography clamps, causing visual overflow on smaller viewports. |
| 6 | Recognition Rather Than Recall | 2.0 | Missing custom Lucide icons matching the platform icon set (`CheckCircle2`, `AlertCircle`, `AlertTriangle`, `Info`). |
| 7 | Flexibility and Efficiency | 2.0 | No single unified file exporting both the configured `Toaster` component and typed notification utilities (`notify` / `toast`). |
| 8 | Aesthetic and Minimalist Design | 2.0 | Upstream Sonner `richColors` clashes with the design system tokens (`--card`, `--border`, `--font-arabic`, `--primary`). |
| 9 | Error Recovery | 2.5 | Lack of clear visual hierarchy between toast title and description bodies. |
| 10 | Help and Documentation | 2.0 | No standardized component export adhering to shadcn/ui and Context7 best practices. |

---

## Technical Audit & Resolution (Post-Intervention)
**Status:** CLOSED & VERIFIED (Audit Score: 20.0 / 20.0, Heuristics Score: 39.5 / 40.0)

| البعد التقني (Dimension) | النتيجة (/4) | تفاصيل التحصين والتنفيذ |
|-------------------------|-------------|-------------------------|
| 1. **التزامن والموثوقية (Concurrency & Reliability)** | 4.0 / 4 | إدارة تدفق الإشعارات مركزياً عبر معمارية Sonner الموحدة، مع حماية العمليات وتفادي تداخل الـ toasts مع إتاحة 4 تنبيهات مرئية كحد أقصى وفترة عرض مريحة (4.5 ثوانٍ). |
| 2. **إمكانية الوصول واللمس (A11y & Touch)** | 4.0 / 4 | تفعيل زر إغلاق التنبيه مع تسمية عربية معيارية `closeButtonAriaLabel="إغلاق التنبيه"`، وتعيين حلقات تركيز واضحة `focus-visible:ring-2 focus-visible:ring-ring`. |
| 3. **الهندسة والمصدر الموحد (Single Source of Truth)** | 4.0 / 4 | إنشاء [`src/components/ui/sonner.tsx`](file:///home/suliman/Documents/courses/frontend-course/src/components/ui/sonner.tsx) كمصدر موحد وحيد لتصدير `<Toaster />` ودوال `toast` و `notify`، والتخلص من التنبيه العشوائي المكرر في `EnrollCard.tsx`. |
| 4. **الاتجاهات والـ BiDi والطباعة (Directionality & Typography)** | 4.0 / 4 | فرض `dir="rtl"` وتطبيق الخط العربي الرسمي `font-arabic` (`IBM Plex Sans Arabic`) مع تمييز دقيق بين العناوين وشروحات التنبيه، وضبط حد الحاوية بـ `max-w-[420px]`. |
| 5. **نظام التصميم وتوكنز DESIGN.md** | 4.0 / 4 | ربط التنبيه بحالة الثيم الحية (`useThemeStore`) وتطبيق توكنز البطاقات والحدود (`--card`, `--border`, `--foreground`, `--primary`, `--success`, `--destructive`)، واستبدال الأيقونات بأيقونات Lucide الرسمية، ودعم `motion-reduce:transition-none`. |

---

### Resolved Priority Issues:
- ✅ **[P0] Raw Library Import & Fragmentation**: Built `src/components/ui/sonner.tsx` as the single canonical module exporting `{ Toaster, toast, notify }`, and updated `src/app/layout.tsx` to mount it seamlessly.
- ✅ **[P0] Ad-hoc Toast Eradication**: Migrated `EnrollCard.tsx` from its isolated custom `function Toast` and `useState` to the unified platform `notify` utility.
- ✅ **[P1] Theme & DESIGN.md Integration**: Dynamic theme synchronization via `useThemeStore`, eliminating clashing raw `richColors` in favor of semantic token palettes (`--card`, `--border`, `--font-arabic`).
- ✅ **[P1] Localized Accessibility & Close Buttons**: Built-in close button enabled on all toasts with Arabic screen-reader labels and focus rings.
- ✅ **[P2] Platform Iconography & Reduced Motion**: Embedded Lucide icons (`CheckCircle2`, `AlertCircle`, `AlertTriangle`, `Info`, `Loader2`) and applied `motion-reduce:transition-none`.
