---
target: src/features/courses/ (CourseCardSkeleton, StarRating, utils migration)
total_score: 32
max_score: 40
audit_score: 15
audit_max: 20
p0_count: 0
p1_count: 2
p2_count: 2
target_path: src/features/courses/
timestamp: 2026-11-08T09-10-00Z
slug: courses-shared-and-utils
closed: false
---

# Critique: Courses Shared Components & Utils Architecture

Targets under evaluation:
1. `src/features/courses/components/CourseCardSkeleton.tsx`
2. `src/features/courses/components/StarRating.tsx`
3. Migration of `courseLevel.ts` and `courseLinks.ts` from `components/` to `utils/`

## Design & Usability Health Score (Nielsen Heuristics)
Total: 32/40 (Needs Polish & Hardening)

| # | Heuristic | Score | Status |
|---|-----------|-------|--------|
| 1 | Visibility of System Status | 3.0/4 | Skeleton pulses continually without respecting prefers-reduced-motion. |
| 2 | Match between System & Real World | 3.5/4 | Star rating displays visually, but lacks accessible audio/SR representation. |
| 3 | User Control & Freedom | 3.5/4 | Clean UI. |
| 4 | Consistency & Standards | 3.0/4 | Non-component utility files placed in `components/` violates architectural clean layering. |
| 5 | Error Prevention | 3.5/4 | Clean types. |
| 6 | Recognition Rather Than Recall | 3.5/4 | Visual rating stars and level labels are clear. |
| 7 | Flexibility & Efficiency | 3.0/4 | Skeleton missing `aria-hidden="true"`, causing screen readers to announce empty divs. |
| 8 | Aesthetic & Minimalist Design | 3.5/4 | Clean layout. |
| 9 | Help Users Recognize & Recover from Errors | 3.5/4 | Fallback styling for unknown levels. |
| 10 | Help & Documentation | 3.5/4 | Level badges are self-explanatory. |

## Prioritized Issues

- [ ] **[P1] Domain Cleanliness:** Non-component code (`courseLevel.ts`, `courseLinks.ts`) sitting in `components/`. Must move to `src/features/courses/utils/`.
- [ ] **[P1] Screen Reader Accessibility on Ratings (`StarRating.tsx`):** Stars lack `role="img"` and `aria-label` describing rating to assistive tech.
- [ ] **[P2] Reduced Motion on Skeleton (`CourseCardSkeleton.tsx`):** Missing `motion-reduce:animate-none` class on pulsing skeleton.
- [ ] **[P2] Skeleton A11y (`CourseCardSkeleton.tsx`):** Missing `aria-hidden="true"` to prevent noisy screen reader readouts.
