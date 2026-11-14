# 0005. Unified Sonner Notification System, Theme Synchronization, and Design Token Binding

## Context

User feedback and toast notifications across the frontend platform previously suffered from architectural fragmentation:

1. `src/app/layout.tsx` imported raw `sonner` directly without design token enforcement, typography integration, or theme awareness.
2. The Toaster was disconnected from the application's runtime Zustand theme state (`useThemeStore`), causing jarring contrast clashes when toggling between dark and light modes.
3. Domain components (such as `EnrollCard.tsx`) created ad-hoc, isolated toast components using local `useState` timers and inline elements, leading to redundant DOM logic and inconsistent user experiences.
4. Upstream default English close labels (`Close toast`) and lack of native close buttons degraded RTL screen-reader accessibility and mobile ergonomics.

## Decision

We establish a single source of truth for platform notifications based on an encapsulated, design-token-bound Sonner architecture:

1. **Encapsulated Viewport Component (`src/components/ui/sonner.tsx`)**:
   - Replaces external library imports across the application with a single canonical `<Toaster />` component.
   - Bound directly to `useThemeStore` so toast styling instantly responds to user dark/light mode switches.
   - Strictly styled using `DESIGN.md` tokens (`--card`, `--border`, `--foreground`, `--primary`, `--font-arabic`, `--radius-md`).
   - Standardizes iconography using Lucide platform icons (`CheckCircle2`, `AlertCircle`, `AlertTriangle`, `Info`, `Loader2`).

2. **Unified Single-File Export Gateway**:
   - `src/components/ui/sonner.tsx` exports the UI component (`Toaster`), the core dispatcher (`toast`), and the typed domain notification helper (`notify`).
   - `src/components/ui/toaster.tsx` and `src/lib/toast.ts` re-export from this canonical file, guaranteeing 100% backward compatibility with zero breaking changes across existing modules.

3. **Eradication of Ad-hoc Toast Implementations**:
   - All custom inline toast components (such as the one previously in `EnrollCard.tsx`) are retired in favor of the centralized `notify` / `toast` dispatchers.
   - All error codes and success responses continue to be resolved transparently via Arabic domain translation dictionaries (`src/lib/errors/messages.ts`).

4. **Accessibility and Motion Compliance**:
   - Touch targets and close button dimensions are hardened with accessible Arabic labels (`closeButtonAriaLabel="إغلاق التنبيه"`).
   - Enforces `dir="rtl"` with logical container max-width (`max-w-[420px]`).
   - Respects user accessibility preferences via `motion-reduce:transition-none`.
