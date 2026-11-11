---
target: src/components/ui/toaster.tsx
total_score: 22.0
max_score: 40
na_heuristics: 0
p0_count: 2
p1_count: 3
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/ui/sonner.tsx"
target_fingerprint: "sha256:toaster-unified-critique-v1"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/ui/sonner.tsx
timestamp: 2026-11-11T13-09-00Z
slug: src-components-ui-toaster-tsx
closed: false
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

## Detailed Priority Deficiencies:

### 🔴 [P0] Fragmentation & Raw Library Exposure:
1. **Raw Library Direct Import**: `src/app/layout.tsx` imports `{ Toaster } from "sonner"` directly without encapsulation, token styling, or theme integration.
2. **Ad-hoc Duplicate Implementations**: Features (such as `EnrollCard.tsx`) create their own inline toast components because no unified, easily accessible toast exists in `src/components/ui/`.
3. **No Unified Single-File Export**: Lacks a single module (e.g. `src/components/ui/sonner.tsx` or `toaster.tsx`) exporting the customized `<Toaster />` component, the `toast` dispatcher, and the `notify` helper for uniform project-wide imports.

### 🟡 [P1] Design System & Theme Alignment (DESIGN.md):
1. **Missing Theme Synchronization**: Does not synchronize with the project's Zustand `useThemeStore` (`theme: 'light' | 'dark'`), leading to theme mismatches when users toggle light/dark modes.
2. **Token Non-Conformance**: Default Sonner styles bypass `--card`, `--border`, `--foreground`, `--font-arabic`, and `--radius-md` tokens.
3. **Sub-44px Touch Targets**: Close button lacks minimum 44x44px touch bounds and Arabic `aria-label="إغلاق التنبيه"`.

### 🔵 [P2] A11y & Motion Usability:
1. **Missing Native Close Controls**: Toasts appear without a visible close button (`closeButton={true}` not enabled in layout).
2. **Motion Reduction Support**: Toaster animations do not respect `prefers-reduced-motion` settings.
