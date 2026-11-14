---
target: src/features/courses/ (CourseCardSkeleton, StarRating, utils migration)
total_score: 40
max_score: 40
audit_score: 20
audit_max: 20
p0_count: 0
p1_count: 0
p2_count: 0
target_path: src/features/courses/
timestamp: 2026-11-08T09-10-00Z
slug: courses-shared-and-utils
closed: true
---

# Critique & Audit: Courses Shared Components & Utils Architecture

Targets under evaluation:

1. `src/features/courses/components/CourseCardSkeleton.tsx`
2. `src/features/courses/components/StarRating.tsx`
3. Migration of `courseLevel.ts` and `courseLinks.ts` from `components/` to `utils/`

## Design & Usability Health Score (Nielsen Heuristics)

Total: 40/40 (Production Ready / Hardened)

| #   | Heuristic                                  | Score | Status                                                                                                         |
| --- | ------------------------------------------ | ----- | -------------------------------------------------------------------------------------------------------------- |
| 1   | Visibility of System Status                | 4.0/4 | Skeleton animated pulse halts cleanly when user enables prefers-reduced-motion (`motion-reduce:animate-none`). |
| 2   | Match between System & Real World          | 4.0/4 | Rating stars have comprehensive `role="img"` and Arabic `aria-label` for screen reader users.                  |
| 3   | User Control & Freedom                     | 4.0/4 | Clean UI.                                                                                                      |
| 4   | Consistency & Standards                    | 4.0/4 | Complete architectural separation: non-component functions live in `utils/`, components in `components/`.      |
| 5   | Error Prevention                           | 4.0/4 | Type-safe constants with fallback label handling.                                                              |
| 6   | Recognition Rather Than Recall             | 4.0/4 | Distinct visual stars and level badges.                                                                        |
| 7   | Flexibility & Efficiency                   | 4.0/4 | Screen readers ignore skeleton layout via `aria-hidden="true"`.                                                |
| 8   | Aesthetic & Minimalist Design              | 4.0/4 | Modular structure without clutter.                                                                             |
| 9   | Help Users Recognize & Recover from Errors | 4.0/4 | Safe defaults for missing ratings or unrecognized levels.                                                      |
| 10  | Help & Documentation                       | 4.0/4 | Documented in `ai-context.md`.                                                                                 |

## Resolved Issues

- [x] **[P1] Domain Cleanliness:** Migrated `courseLevel.ts` and `courseLinks.ts` from `components/` to `src/features/courses/utils/` and eliminated old files.
- [x] **[P1] Screen Reader Accessibility on Ratings (`StarRating.tsx`):** Added `role="img"` and `aria-label={`التقييم: ${formattedRating} من 5 نجوم`}` with `aria-hidden` on internal star SVGs.
- [x] **[P2] Reduced Motion on Skeleton (`CourseCardSkeleton.tsx`):** Added `motion-reduce:animate-none` to suppress pulse for motion-sensitive users.
- [x] **[P2] Skeleton A11y (`CourseCardSkeleton.tsx`):** Added `aria-hidden="true"` so screen readers bypass placeholder blocks.

## Final Technical Audit Score (20/20)

| Dimension                     | Score | Evidence                                                                 |
| ----------------------------- | ----- | ------------------------------------------------------------------------ |
| **Accessibility (A11y)**      | 4/4   | `role="img"`, `aria-label`, `aria-hidden="true"` on skeletons and stars. |
| **Performance & Motion**      | 4/4   | `motion-reduce:animate-none` prevents CLS and sensory discomfort.        |
| **Theming & Tokens**          | 4/4   | Semantic tokens only (`bg-card`, `border-border`, `bg-muted`).           |
| **Responsive (Mobile 375px)** | 4/4   | Skeletons match exact responsive dimensions of cards.                    |
| **Implementation Integrity**  | 4/4   | `impeccable detect` exit code 0 (`[]`); `npm run typecheck` zero errors. |
