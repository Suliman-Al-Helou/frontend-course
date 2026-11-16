---
target: src/components/landing/CoursesSection.tsx
total_score: 37.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 3
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/landing/CoursesSection.tsx"
target_fingerprint: "sha256:landing-courses-section-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/landing/CoursesSection.tsx
timestamp: 2026-11-16T09-00-00Z
slug: src-components-landing-coursessection-tsx
closed: false
---

# Critique: src/components/landing/CoursesSection.tsx (Dead Imports, Ad-hoc Link & Empty State Guard)

Target: Diagnosing landing courses preview in `src/components/landing/CoursesSection.tsx`

## Design Health Score (Baseline Diagnostic)
Total: 37.0 / 40.0

| # | Heuristic | Score | Findings & Observations |
|---|-----------|-------|--------------------------|
| 1 | Visibility of System Status | 3.5 | Skeletons render during fetch, but zero-course response results in an empty, quiet void with no feedback. |
| 2 | Match System / Real World | 4.0 | Clear Arabic copy ("كورسات برمجة مجانية بالعربية") and familiar course cards. |
| 3 | User Control and Freedom | 4.0 | Clear exit path to full catalog via CTA button. |
| 4 | Consistency and Standards | 3.2 | CTA button is built with an ad-hoc `<Link>` with inline classes instead of `@/components/ui/button` primitive; imports legacy alias `SkeletonCard`. |
| 5 | Error Prevention | 4.0 | Safely filters enrolled course IDs; no desync between user status and action links. |
| 6 | Recognition Rather Than Recall | 3.8 | Reuses standard `CourseCard` with level badges and rating stars. |
| 7 | Flexibility and Efficiency | 3.8 | Seamless transition from marketing preview to direct enrollment or course player. |
| 8 | Aesthetic and Minimalist Design | 3.4 | Dead imports (`motion` and `BookOpen`) clutter the file; typography scale lacks semantic aria-labelledby anchor. |
| 9 | Error Recovery | 3.5 | Lacks empty state recovery when network returns an empty list. |
| 10 | Help and Documentation | 3.8 | Clean integration with TanStack Query and vertical slice course queries. |

---

## Priority Issues Identified:

### [P1] Ad-hoc CTA Button Implementation & Design Token Inconsistency
- Line 50 uses a raw `<Link>` with hand-written classes (`inline-flex items-center gap-2 rounded-xl border border-primary/30 ...`) instead of the unified `<Button href="/courses" variant="outlinePrimary" size="lg">` primitive.
- **Impact:** Diverges from global design tokens and button hover/focus interaction states.

### [P1] Unused Imports & Dead Dependencies
- Unused `motion` import from `framer-motion` (line 4).
- Unused `BookOpen` icon import from `lucide-react` (line 5).
- **Impact:** Adds dead bundle size and misleading maintenance signals.

### [P2] Missing Zero-State Guard (Empty Courses List)
- If `courses` array is empty after loading, the grid renders completely blank without an informational message or guidance to the user.

### [P2] Legacy Alias Import (`SkeletonCard`)
- Imports `SkeletonCard` instead of the canonical `CourseCardSkeleton` primitive from `@/features/courses`.

### [P2] Section Accessibility & Heading Alignment
- Section lacks `aria-labelledby="courses-section-title"`, and spacing/typography scale is slightly mismatched with adjacent landing sections (`FeaturesSection` and `HeroSection`).
