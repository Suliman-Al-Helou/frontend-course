---
target: src/features/student-home/components/HomeHeader.tsx
total_score: 34.6
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 3
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/student-home/components/HomeHeader.tsx"
target_fingerprint: "sha256:student-home-header-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/student-home/components/HomeHeader.tsx
timestamp: 2026-11-14T11-51-00Z
slug: src-features-student-home-components-homeheader-tsx
closed: false
---

# Critique: src/features/student-home/components/HomeHeader.tsx (Lingering Bridge, Token Drift & Reduced Motion)

Target: Diagnosing `src/features/student-home/components/HomeHeader.tsx` and its underlying bridge `@/components/dashboard/DashboardHeader.tsx`

## Design Health Score (Baseline Diagnostic)
Total: 34.6 / 40.0

| # | Heuristic | Score | Findings & Observations |
|---|-----------|-------|--------------------------|
| 1 | Visibility of System Status | 3.5 | Personalized greeting by time of day, but lacks clear user profile link or visual avatar context. |
| 2 | Match System / Real World | 3.8 | Arabic time-aware greetings ("صباح الخير", "مساء الخير", "مساء النور") conform to cultural mental model. |
| 3 | User Control and Freedom | 4.0 | Read-only header banner; no state traps. |
| 4 | Consistency and Standards | 2.2 | **Major violation**: Imports legacy component from `src/components/dashboard/` violating Vertical Slice; uses ad-hoc gradient classes (`from-primary/50 to-40%`) violating `DESIGN.md` tokens. |
| 5 | Error Prevention | 3.8 | Fallback to "الطالب" when `user?.name` is missing; safe optional chaining on email. |
| 6 | Recognition Rather Than Recall | 3.5 | Shows greeting and user name clearly, but lacks clear visual hierarchy matching the rest of the student dashboard. |
| 7 | Flexibility and Efficiency | 3.8 | Lightweight greeting banner; responsive flex layout. |
| 8 | Aesthetic and Minimalist Design | 2.5 | Broken gradient syntax (`to-40%`), contradictory classes (`text-white` overridden by `text-foreground`), and orphaned gradient pill on greeting text. |
| 9 | Error Recovery | 4.0 | Pure render without crashing risk if user is unauthenticated or loading. |
| 10 | Help and Documentation | 3.5 | Explicitly called out as technical debt in `src/features/student-home/ai-context.md` (item 6). |

---

## Priority Issues Identified:

### [P1] Lingering Bridge & Architectural Fragmentation
- `HomeHeader.tsx` in `src/features/student-home/` is an empty pass-through wrapper delegating to `src/components/dashboard/DashboardHeader.tsx` and `_hooks/useDashboardHeader.tsx`.
- **Violation:** Violates "قاعدة الحذف الفوري للجسور والمخلفات (No Lingering Bridges)" in `AGENTS.md`. The logic and presentation must be co-located directly inside the feature slice.

### [P1] Token & Gradient Violations (`DESIGN.md` and `ai-context.md`)
- Uses arbitrary gradients: `bg-gradient-to-tr from-primary/50 to-40%` and `bg-gradient-to-t from-primary/40 to-100%`.
- Inconsistent color tokens: `text-white` on container with `text-foreground` on children.
- Contradicts strict rule in `ai-context.md`: *"Tokens only (background, foreground, muted, border, primary, success, destructive). No dark:, gradients, shadows, framer-motion"*.

### [P1] Missing Motion Accessibility (`prefers-reduced-motion`)
- Uses `<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>` without checking user motion preferences, causing jarring entry for users with vestibular disorders.

### [P2] Dead & Unused Code
- `DashboardHeaderProps` declares `streak?: number` with default `= 0`, which is never rendered or used in JSX.

### [P2] Inconsistent Sizing (`w-fit`)
- Container is styled with `w-fit`, causing awkward layout width compared to full-width card structures in `StudentHome.tsx` and `StatsCards.tsx`.
