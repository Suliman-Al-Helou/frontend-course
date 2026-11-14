---
target: src/features/student-home/components/StatsCards.tsx
total_score: 36.8
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 3
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/student-home/components/StatsCards.tsx"
target_fingerprint: "sha256:student-home-stats-cards-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/student-home/components/StatsCards.tsx
timestamp: 2026-11-14T11-54-00Z
slug: src-features-student-home-components-statscards-tsx
closed: false
---

# Critique: src/features/student-home/components/StatsCards.tsx (Skeleton CLS Mismatch, Semantic HTML & Visual Distinction)

Target: Diagnosing student dashboard metric cards in `src/features/student-home/components/StatsCards.tsx`

## Design Health Score (Baseline Diagnostic)
Total: 36.8 / 40.0

| # | Heuristic | Score | Findings & Observations |
|---|-----------|-------|--------------------------|
| 1 | Visibility of System Status | 3.5 | Metric values display accurately, but skeleton height and radius mismatch triggers Cumulative Layout Shift (CLS). |
| 2 | Match System / Real World | 4.0 | Arabic numeral formatting via `Intl.NumberFormat("ar")` and clear concise labels ("الكورسات المسجلة", "الدروس المكتملة", إلخ). |
| 3 | User Control and Freedom | 4.0 | Clean metric presentation; QueryState handles retry gracefully. |
| 4 | Consistency and Standards | 3.2 | Skeleton uses `rounded-md` while actual cards use `rounded-2xl` (`Card`); lacks W3C semantic metric structure (`<dl>`, `<dt>`, `<dd>`). |
| 5 | Error Prevention | 4.0 | Encapsulated in `QueryState` with automated fallback on query failure. |
| 6 | Recognition Rather Than Recall | 3.2 | All four cards render identical monochromatic grey icons (`text-muted-foreground`), increasing visual scanning fatigue. |
| 7 | Flexibility and Efficiency | 3.8 | Responsive 2-column mobile grid expanding to 4-column on desktop (`grid-cols-2 lg:grid-cols-4`). |
| 8 | Aesthetic and Minimalist Design | 3.3 | Unnecessary horizontal border divider (`border-b border-border`) cramps content vertical rhythm in compact stat cards. |
| 9 | Error Recovery | 4.0 | Native retry button provided via parent `QueryState`. |
| 10 | Help and Documentation | 3.8 | Pure vertical slice component cleanly consuming `useStatCards`. |

---

## Priority Issues Identified:

### [P1] Skeleton CLS & Border Radius Mismatch
- `StatsCardsSkeleton` renders `rounded-md` (6px) with an arbitrary `h-24` height, whereas the real component renders `Card` with `rounded-2xl` (24px) and internal padding (`p-5 sm:p-6`).
- **Impact:** Noticeable layout jump and border-radius deformation when transitioning from loading to resolved state.

### [P1] Icon Visual Differentiation & Card Rhythm
- Icons are rendered as flat `size-4 text-muted-foreground` without container contrast or thematic differentiation.
- An icon container (`size-9 rounded-xl bg-primary/10 text-primary` or semantic accents) significantly improves scanability and visual hierarchy without violating the minimalist token rules.

### [P2] Semantic Accessibility (`<dl>`, `<dt>`, `<dd>`)
- Metrics are rendered using generic `<p>` tags inside `CardHeader` and `CardContent`.
- Accessible semantic best practice for dashboard metrics is using description list elements (`<dl>`, `<dt>`, `<dd>`) for screen reader clarity.

### [P2] Cramped Divider Layout (`border-b border-border`)
- Slicing a small 100px stat card with an internal border creates visual clutter. Removing the divider and using cohesive padding gives a more modern, breathable card surface.

### [P2] Reduced Motion on Skeleton Pulse
- `animate-pulse` in `StatsCardsSkeleton` runs indefinitely without `motion-reduce:animate-none`.

