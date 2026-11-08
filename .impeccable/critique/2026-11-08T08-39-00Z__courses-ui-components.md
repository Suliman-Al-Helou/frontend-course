---
target: src/features/courses/components/ (4 core UI components)
total_score: 31
max_score: 40
p0_count: 0
p1_count: 3
p2_count: 3
target_path: src/features/courses/components/
timestamp: 2026-11-08T08-39-00Z
slug: courses-ui-components
closed: false
---

# Critique: Public Courses UI Components (4 Files)

Targets under evaluation:
1. `src/features/courses/components/detail/CourseHero.tsx`
2. `src/features/courses/components/detail/CourseCurriculum.tsx`
3. `src/features/courses/components/detail/CourseOutcomes.tsx`
4. `src/features/courses/components/CourseCard.tsx`

## Design & Usability Health Score (Nielsen Heuristics)
Total: 31/40 (Good / Requires Technical Hardening)

| # | Heuristic | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Visibility of System Status | 3.5/4 | Good status indicators and skeletons; toast requires `role="alert"` and `aria-live`. |
| 2 | Match between System & Real World | 3.5/4 | Arabic labels and RTL alignment correct; back arrow orientation is proper. |
| 3 | User Control & Freedom | 3.0/4 | Accordion toggles work smoothly; toast needs an explicit dismiss touch target >= 44px. |
| 4 | Consistency & Standards | 2.5/4 | Some residual untokenized color classes (`text-blue-deep`, `bg-blue-pale`) in outcomes. |
| 5 | Error Prevention | 3.0/4 | Missing double-submit concurrency lock on `handleEnroll` (needs `useRef` lock). |
| 6 | Recognition Rather Than Recall | 3.5/4 | Clear course badges, level pill, lesson count, and student counts. |
| 7 | Flexibility & Efficiency | 3.0/4 | Keyboard navigation needs `focus-visible:ring` on cards and accordion headers. |
| 8 | Aesthetic & Minimalist Design | 3.5/4 | Zero AI-slop detected by CLI scanner; clean layout and hierarchy. |
| 9 | Help Users Recognize & Recover from Errors | 2.5/4 | Error messages shown in toast; needs persistent error banner if enrollment fails. |
| 10 | Help & Documentation | 3.0/4 | Clear "Free" vs "Requires Enrollment" status indicators. |

## Identified Priority Issues

- **[P1] Concurrency & Double-Submit Risk (`CourseHero.tsx`):**
  `handleEnroll` relies solely on `loading: boolean` state. Rapid multi-click can issue duplicate enrollment requests before React re-renders.
  *Fix:* Guard with a `useRef(false)` lock.

- **[P1] Accessibility & Screen Reader Accordion Semantics (`CourseCurriculum.tsx`):**
  Section header buttons toggle without `aria-expanded` and `aria-controls`. Screen reader users cannot tell which section is currently opened.
  *Fix:* Add `aria-expanded={Boolean(openSections[i])}` and `aria-controls`.

- **[P1] Touch Target Compliance on Toast & Interactive Buttons (`CourseHero.tsx`):**
  The toast close button is only `16x16px` (`w-4 h-4`) without click padding, violating the 44x44px minimum tap target.
  *Fix:* Pad touch zone to >= 44px and add `aria-label="إغلاق التنبيه"`.

- **[P2] Token Regularization (`CourseOutcomes.tsx`):**
  Uses untokenized classes (`text-blue-deep`, `bg-blue-pale`) instead of theme-responsive tokens (`text-foreground`, `bg-muted/50`).
  *Fix:* Replace with semantic tokens.

- **[P2] Keyboard Focus Ring Visibility (`CourseCard.tsx`):**
  Needs accessible `focus-visible:ring-2 focus-visible:ring-primary` for full keyboard accessibility.

- **[P2] Minimum Tap Target on Lesson Links (`CourseCurriculum.tsx`):**
  Ensure lesson items maintain `min-h-[44px]` for mobile tap comfort.
