---
target: src/features/admin-courses/components/courses/CourseFormModal.tsx
total_score: 22.5
max_score: 40
na_heuristics: 0
p0_count: 2
p1_count: 2
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/courses/CourseFormModal.tsx"
target_fingerprint: "sha256:course-form-modal-v1"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/courses/CourseFormModal.tsx
timestamp: 2026-11-08T13-31-13Z
slug: src-features-admin-courses-course-form-modal-tsx
closed: false
---
# Critique: src/features/admin-courses/components/courses/CourseFormModal.tsx

Target: `CourseFormModal.tsx` & related course editing experience

## Design Health Score
Total: 22.5/40 (Marginal / Needs Decomposition & Hardening)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2.5 | Form lacks `aria-busy` during mutations; image error disappears silently |
| 2 | Match System / Real World | 2.5 | Cover image URL jumps in RTL layout without `dir="ltr"` |
| 3 | User Control and Freedom | 2.0 | Accidental backdrop click discards all form edits without confirmation |
| 4 | Consistency and Standards | 2.0 | Discrepancy between native `<select>` and Radix `<Select>` triggers |
| 5 | Error Prevention | 2.0 | Negative prices and durations allowed; missing paste batching for lists |
| 6 | Recognition Rather Than Recall | 2.5 | Cover image error states not visually communicated to admin |
| 7 | Flexibility and Efficiency | 2.0 | Monolithic 571 lines; triple-duplicated list editing logic |
| 8 | Aesthetic and Minimalist Design | 2.5 | Cluttered form with redundant vertical spacing and copy-pasted blocks |
| 9 | Error Recovery | 2.0 | Form errors do not auto-focus or scroll to the first invalid field |
| 10 | Help and Documentation | 2.0 | Status badges (draft vs coming_soon) lack explanatory helper labels |

## Priority Issues
- **[P0] Monolithic Component & Code Duplication**: 571-line file containing 3 identical list implementations (`what_you_learn`, `requirements`, `target_audience`). Needs extraction into a reusable `CourseTagListField` and modular fieldsets.
- **[P0] Inconsistent Form Controls & Semantic A11y**: Mixing native `<select>` with Radix UI `<Select>` causes keyboard navigation friction and visual styling inconsistencies.
- **[P1] BiDi Directional Input Defect**: Cover image URL and price fields lack `dir="ltr"` causing inverted slash/colon cursor jumping in Arabic RTL mode.
- **[P1] Touch Target Deficiencies**: List delete buttons and quick action tags measure `< 32px`, failing the `>= 44x44px` touch target standard.
- **[P2] Unsaved Data Loss on Backdrop Click**: Modal closes on backdrop click without checking if the form is dirty.
- **[P2] Token Compliance & Motion Accessibility**: Missing `motion-reduce` support on modal entrance and transitions.

## Proposed Atomic Decomposition:
1. `src/features/admin-courses/components/courses/form/CourseTagListField.tsx`: Reusable, accessible tag and bullet-point list editor.
2. `src/features/admin-courses/components/courses/form/CourseBasicFields.tsx`: Clean fieldset for Title, Instructor, Level, and Status using unified accessible Select.
3. `src/features/admin-courses/components/courses/form/CoursePricingMediaFields.tsx`: Clean fieldset for Price, Duration, Rating, and LTR-secured Cover Image.
4. `src/features/admin-courses/components/courses/CourseFormModal.tsx`: Lightweight orchestrator maintaining state, `useRef` concurrency lock, and dirty-state confirmation.
