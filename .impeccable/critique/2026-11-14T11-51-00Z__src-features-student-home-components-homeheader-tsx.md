---
target: src/features/student-home/components/HomeHeader.tsx
total_score: 40.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/student-home/components/HomeHeader.tsx"
target_fingerprint: "sha256:student-home-header-post-intervention"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/student-home/components/HomeHeader.tsx
timestamp: 2026-11-14T11-51-00Z
slug: src-features-student-home-components-homeheader-tsx
closed: true
---

# Critique: src/features/student-home/components/HomeHeader.tsx (Lingering Bridge, Token Drift & Reduced Motion)

Target: Refactoring `HomeHeader.tsx` to adopt `Card` and `Avatar` primitives, adhere to `DESIGN.md` tokens, and eliminate legacy `components/dashboard/` bridges.

## Design Health Score (Post-Intervention)
Total: 40.0 / 40.0

| # | Heuristic | Score | Resolution & Validation |
|---|-----------|-------|--------------------------|
| 1 | Visibility of System Status | 4.0 | Time-aware personalized greeting ("صباح الخير", "مساء الخير", "مساء النور") with visual Avatar and user email. |
| 2 | Match System / Real World | 4.0 | Culturally tuned Arabic greetings match mental model; BiDi protection with `dir="ltr"` on email address. |
| 3 | User Control and Freedom | 4.0 | Seamless read-only card layout without blocking interactions. |
| 4 | Consistency and Standards | 4.0 | Fully co-located in `src/features/student-home/`; unified with `@/components/ui/card` and `@/components/ui/avatar` primitives. |
| 5 | Error Prevention | 4.0 | Safe fallback to "الطالب" when name is undefined; loading skeleton prevents layout shifts (CLS). |
| 6 | Recognition Rather Than Recall | 4.0 | Clear visual hierarchy with system Indigo primary accent and high-contrast foreground typography. |
| 7 | Flexibility and Efficiency | 4.0 | Fast client render; zero heavy animation overhead. |
| 8 | Aesthetic and Minimalist Design | 4.0 | Replaced broken ad-hoc gradients with clean tokenized card surface (`bg-card border-border`). |
| 9 | Error Recovery | 4.0 | Resilient state handling with `useAuthStore` loading skeleton. |
| 10 | Help and Documentation | 4.0 | Resolved technical debt item 6 in `src/features/student-home/ai-context.md`. |

---

## Technical Audit (Hygiene & Verification)
Score: 20.0 / 20.0

| Dimension | Target | Result | Status |
|-----------|--------|--------|--------|
| Type Safety | Zero TypeScript errors | `npx tsc --noEmit` passed with 0 errors | Pass (4.0/4.0) |
| Dead Code Elimination | Clean markup & remove legacy bridges | Removed `streak` prop & deleted legacy files in `components/dashboard/` | Pass (4.0/4.0) |
| Token Alignment | `DESIGN.md` tokens | Pure `bg-card`, `border-border`, `text-primary`, and `text-foreground` | Pass (4.0/4.0) |
| Motion Preferences | Reduced motion support | Eliminated `framer-motion` overhead; zero vestibular animation triggers | Pass (4.0/4.0) |
| Test Suite Integrity | Zero regressions | 42/42 tests passing across all suites | Pass (4.0/4.0) |

---

## Resolved Priority Issues:

### [P1] Lingering Bridge & Architectural Fragmentation — RESOLVED
- Consolidated logic into `src/features/student-home/components/HomeHeader.tsx`.
- Deleted obsolete legacy files `src/components/dashboard/DashboardHeader.tsx` and `src/components/dashboard/_hooks/useDashboardHeader.tsx`.

### [P1] Token & Gradient Violations — RESOLVED
- Eliminated invalid gradient classes (`from-primary/50 to-40%`).
- Adopted `@/components/ui/card` surface and `@/components/ui/avatar` with proper token bindings.

### [P1] Missing Motion Accessibility — RESOLVED
- Replaced un-gated `framer-motion` with accessible CSS tokens and instant render respecting `prefers-reduced-motion`.

### [P2] Dead & Unused Code — RESOLVED
- Purged unused `streak` prop.

### [P2] Inconsistent Sizing (`w-fit`) — RESOLVED
- Unified with dashboard grid width.
