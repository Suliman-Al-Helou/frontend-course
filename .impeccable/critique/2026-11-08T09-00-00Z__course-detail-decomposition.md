---
target: src/features/courses/components/detail/ (EnrollCard, CourseHero, CourseBottomCta, [courseId]/page)
total_score: 31
max_score: 40
audit_score: 14
audit_max: 20
p0_count: 2
p1_count: 2
p2_count: 1
target_path: src/features/courses/components/detail/
timestamp: 2026-11-08T09-00-00Z
slug: course-detail-decomposition
closed: false
---

# Critique: Course Detail Decomposition & UI Architecture

Targets under evaluation:
1. `src/features/courses/components/detail/CourseHero.tsx`
2. `src/features/courses/components/detail/EnrollCard.tsx` (Extracted component)
3. `src/features/courses/components/detail/CourseBottomCta.tsx` (Extracted component)
4. `src/app/(public)/courses/[courseId]/page.tsx`

## Design & Usability Health Score (Nielsen Heuristics)
Total: 31/40 (Needs Decomposition & Polish)

| # | Heuristic | Score | Status |
|---|-----------|-------|--------|
| 1 | Visibility of System Status | 3.0/4 | Enrollment status has loading state, but duplicated and uncoordinated between page and hero card. |
| 2 | Match between System & Real World | 3.5/4 | Arabic phrasing is good, but breadcrumbs and action buttons have raw non-tokenized styling. |
| 3 | User Control & Freedom | 3.0/4 | Toast can be dismissed, but bottom CTA has hardcoded scroll-to-top button without keyboard accessible target. |
| 4 | Consistency & Standards | 2.5/4 | Raw arbitrary colors (`text-green-500`, `text-green-700`, gradient blends) break `DESIGN.md` tokens. |
| 5 | Error Prevention | 3.5/4 | Submit lock exists in `CourseHero`, but logic is embedded in a 335-line monolith. |
| 6 | Recognition Rather Than Recall | 3.5/4 | Course details, stats, pricing, and enroll status are visible. |
| 7 | Flexibility & Efficiency | 3.0/4 | Hardcoded components in page prevent modular reuse and unit testing. |
| 8 | Aesthetic & Minimalist Design | 3.0/4 | `CourseHero.tsx` is overloaded with UI, network calls, and toast logic. |
| 9 | Help Users Recognize & Recover from Errors | 3.0/4 | Error messages shown via raw toast; rejection state needs tokenized callout. |
| 10 | Help & Documentation | 3.0/4 | Money-back guarantee text is present but uses raw green colors instead of `text-success`. |

## Prioritized Issues

- [ ] **[P0] Monolithic Structure (`CourseHero.tsx`):** 335-line monolith packing Hero presentation, 200-line `EnrollCard`, and inlined `Toast`. Must be decomposed.
- [ ] **[P0] Duplicate / Uncoordinated State:** `EnrollCard` fetches `/courses/:id/enrollment` via `useEffect` independently of `[courseId]/page.tsx`. Needs clean single-source prop feeding.
- [ ] **[P1] Inlined Bottom CTA (`[courseId]/page.tsx`):** Lines 83-110 in `[courseId]/page.tsx` contain an inlined CTA block with hardcoded styles. Must be extracted into `CourseBottomCta.tsx`.
- [ ] **[P1] Design System Violations in `EnrollCard`:** Hardcoded Tailwind classes (`text-green-500`, `text-green-700`, `from-blue-mid/30`) instead of `text-success`, `bg-success/10`, `border-success/20`.
- [ ] **[P2] Touch Target & Motion Accessibility:** Buttons in `CourseBottomCta` need explicit `min-h-[44px]` and focus visible styling.
