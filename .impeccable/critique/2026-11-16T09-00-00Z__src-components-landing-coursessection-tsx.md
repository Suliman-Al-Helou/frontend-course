---
target: src/components/landing/CoursesSection.tsx
total_score: 40.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/landing/CoursesSection.tsx"
target_fingerprint: "sha256:landing-courses-section-post-intervention"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/landing/CoursesSection.tsx
timestamp: 2026-11-16T09-00-00Z
slug: src-components-landing-coursessection-tsx
closed: true
---

# Critique: src/components/landing/CoursesSection.tsx (Dead Imports, Ad-hoc Link & Empty State Guard)

Target: Refactoring landing courses preview in `src/components/landing/CoursesSection.tsx` to adopt the `@/components/ui/button` primitive, eliminate dead imports, guard zero-state lists, and enforce section accessibility.

## Design Health Score (Post-Intervention)
Total: 40.0 / 40.0

| # | Heuristic | Score | Resolution & Validation |
|---|-----------|-------|--------------------------|
| 1 | Visibility of System Status | 4.0 | Responsive skeletons during loading; clear guidance message when no courses are published. |
| 2 | Match System / Real World | 4.0 | Professional Arabic copy aligned with platform educational goals. |
| 3 | User Control and Freedom | 4.0 | Prominent primary CTA button linking directly to the full course catalog. |
| 4 | Consistency and Standards | 4.0 | Adopted unified `<Button href="/courses" variant="outlinePrimary" size="lg">` primitive and canonical `CourseCardSkeleton`. |
| 5 | Error Prevention | 4.0 | Resilient query selection for enrolled IDs; safe rendering of empty lists. |
| 6 | Recognition Rather Than Recall | 4.0 | Consistent card anatomy across landing and catalog interfaces. |
| 7 | Flexibility and Efficiency | 4.0 | Fast client rendering, instant enrolled-status detection. |
| 8 | Aesthetic and Minimalist Design | 4.0 | Purged dead imports (`motion`, `BookOpen`), matched section rhythm and typography with adjacent landing sections. |
| 9 | Error Recovery | 4.0 | Clean empty-state container prevents jarring visual collapses. |
| 10 | Help and Documentation | 4.0 | Standardized hook naming (`useCoursesSection.ts`) and clean imports. |

---

## Technical Audit (Hygiene & Verification)
Score: 20.0 / 20.0

| Dimension | Target | Result | Status |
|-----------|--------|--------|--------|
| Type Safety | Zero TypeScript errors | `npx tsc --noEmit` passed with 0 errors | Pass (4.0/4.0) |
| Dead Code Elimination | Clean imports & file naming | Purged `motion` & `BookOpen`; renamed hook to `useCoursesSection.ts` | Pass (4.0/4.0) |
| Token Alignment | `DESIGN.md` tokens | Adopted `<Button variant="outlinePrimary">` with system tokens | Pass (4.0/4.0) |
| Motion Preferences | Reduced motion support | `CourseCardSkeleton` respects `motion-reduce:animate-none` | Pass (4.0/4.0) |
| Test Suite Integrity | Zero regressions | 65/65 tests passing across all 14 test suites | Pass (4.0/4.0) |

---

## Resolved Priority Issues:

### [P1] Ad-hoc CTA Button Implementation & Design Token Inconsistency — RESOLVED
- Replaced custom `<Link>` with `<Button href="/courses" variant="outlinePrimary" size="lg" className="gap-2 font-semibold">`.

### [P1] Unused Imports & Dead Dependencies — RESOLVED
- Removed unused `motion` from `framer-motion` and `BookOpen` from `lucide-react`.

### [P2] Missing Zero-State Guard (Empty Courses List) — RESOLVED
- Added an empty state placeholder card with guidance when `courses.length === 0`.

### [P2] Legacy Alias Import (`SkeletonCard`) — RESOLVED
- Directly imported canonical `CourseCardSkeleton` from `@/features/courses`.

### [P2] Section Accessibility & Heading Alignment — RESOLVED
- Added `aria-labelledby="courses-section-title"` and unified section padding (`py-20 md:py-24`).
