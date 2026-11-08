---
target: src/features/courses/components/catalog/ (CoursesHero, CourseLevelFilters, CoursesEmptyState, courses/page)
total_score: 30
max_score: 40
audit_score: 13
audit_max: 20
p0_count: 1
p1_count: 3
p2_count: 2
target_path: src/features/courses/components/catalog/
timestamp: 2026-11-08T09-05-00Z
slug: courses-catalog-decomposition
closed: false
---

# Critique: Courses Catalog Decomposition & UI Architecture

Targets under evaluation:
1. `src/features/courses/components/catalog/CoursesHero.tsx` (Extracted component)
2. `src/features/courses/components/catalog/CourseLevelFilters.tsx` (Extracted component)
3. `src/features/courses/components/catalog/CoursesEmptyState.tsx` (Extracted component)
4. `src/app/(public)/courses/page.tsx`

## Design & Usability Health Score (Nielsen Heuristics)
Total: 30/40 (Needs Decomposition & Polish)

| # | Heuristic | Score | Status |
|---|-----------|-------|--------|
| 1 | Visibility of System Status | 3.0/4 | Filter state is visual, but active filter button lacks `aria-pressed` for assistive tech. |
| 2 | Match between System & Real World | 3.5/4 | Arabic terminology is natural, but search bar lacks semantic search role. |
| 3 | User Control & Freedom | 2.5/4 | When zero courses match search, there is no one-click reset/clear button. |
| 4 | Consistency & Standards | 2.5/4 | Hardcoded color classes (`border-blue-50`, `border-blue-100`, `text-gray-800`, `text-gray-400`) violate `DESIGN.md`. |
| 5 | Error Prevention | 3.5/4 | Filter is safe, but search input lacks clear button to quickly fix typos. |
| 6 | Recognition Rather Than Recall | 3.5/4 | Levels are listed, but active selection needs clearer token contrast. |
| 7 | Flexibility & Efficiency | 3.0/4 | Keyboard users need clear focus ring on search input and filter buttons. |
| 8 | Aesthetic & Minimalist Design | 3.0/4 | Hardcoded inline components bloat `courses/page.tsx`. |
| 9 | Help Users Recognize & Recover from Errors | 2.5/4 | Empty state tells user to change search, but provides no reset action button. |
| 10 | Help & Documentation | 3.0/4 | Course count indicator is clear. |

## Prioritized Issues

- [ ] **[P0] Monolithic Catalog Page (`courses/page.tsx`):** Inlined `HeroSection`, `LevelFilters`, and empty state in page component.
- [ ] **[P1] Design System Violations:** Hardcoded colors (`border-blue-50`, `border-blue-100`, `text-gray-800`, `text-gray-400`) instead of semantic tokens.
- [ ] **[P1] Accessibility Deficits in Level Filters:** Missing `role="group"`, `aria-label="تصفية حسب المستوى"`, and `aria-pressed`.
- [ ] **[P1] Search Input Accessibility & Clearing:** Missing `role="search"`, missing `aria-label`, and missing accessible clear button when text is present.
- [ ] **[P2] Empty State Recovery Action:** Add explicit "إعادة ضبط البحث" reset button to recover from zero-results state.
- [ ] **[P2] Motion Accessibility:** Integrate `useReducedMotion()` in `CoursesHero` animations.
