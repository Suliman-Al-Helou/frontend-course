---
target: src/features/admin-courses/components/courses/ManageCoursesTab.tsx
total_score: 30.5
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 1
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/courses/ManageCoursesTab.tsx"
target_fingerprint: "sha256:manage-courses-tab-critique-init"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/courses/ManageCoursesTab.tsx
timestamp: 2026-11-11T14-26-00Z
slug: src-features-admin-courses-components-courses-managecoursestab-tsx
closed: false
---

# Critique: src/features/admin-courses/components/courses/ManageCoursesTab.tsx (Silent Mutation Feedback & Sub-44px Action Targets)

Target: `ManageCoursesTab.tsx` Course Deletion Feedback, Touch Target Ergonomics, and A11y Standards

## Design Health Score (Pre-Intervention)
Total: 30.5/40 (Requires wiring unified `notify` dispatch on course deletion mutations, expanding button touch targets to >= 44px, and applying motion-reduction guards)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2.5 | Silent deletion: `handleDeleteConfirm` executes `deleteMutation.mutateAsync` and closes dialog without dispatching toast feedback. |
| 2 | Match System / Real World | 3.5 | Domain terminology and metadata badges (status, level, instructor, price) are clear and culturally authentic. |
| 3 | User Control and Freedom | 3.5 | Course deletion delegates cleanly to the unified confirmation modal. |
| 4 | Consistency and Standards | 2.5 | Violates ADR 0005 by failing to trigger `notify.success` or `notify.error` after course deletion. |
| 5 | Error Prevention | 3.5 | Confirmation dialog prevents accidental destruction of course content. |
| 6 | Recognition Rather Than Recall | 3.5 | Course cards display instructor, students, level, and duration prominently. |
| 7 | Flexibility and Efficiency | 2.5 | Action buttons (`h-9` = 36px) and header button (`h-10` = 40px) fall short of the WCAG 2.1 minimum 44x44px touch target. |
| 8 | Aesthetic and Minimalist Design | 3.5 | Balanced grid and typography, though card action buttons are slightly cramped. |
| 9 | Error Recovery | 2.0 | Silent `catch (err)` block in `handleDeleteConfirm` logs to console without alerting the administrator of API failure. |
| 10 | Help and Documentation | 3.5 | Helpful empty state with illustrated call-to-action to create the first course. |

---

## Identified Priority Issues:

### [P1] Missing Unified Notifications (`notify.success` / `notify.error`) (Lines 42-50)
- **Problem**: `handleDeleteConfirm` mutates the cache via TanStack Query and resets modal state silently, giving no feedback to the user on completion or failure.
- **Remedy**: Import `notify` from `@/components/ui/sonner`. Trigger `notify.success` with course title on successful deletion, and `notify.error` on failure.

### [P2] Inadequate Touch Targets (< 44px) & A11y Semantics
- **Problem**: Card action buttons (`المحتوى`, `تعديل`, `حذف`) are rendered at `h-9` (36px), and header CTA at `h-10` (40px). Buttons lack descriptive `aria-label` referencing the specific course title.
- **Remedy**: Upgrade all action buttons to `h-10 sm:h-11 min-h-[44px]`, and provide course-specific `aria-label` attributes.

### [P2] Missing Motion-Reduction Safeguards
- **Problem**: Skeleton loading cards and hover transitions lack `motion-reduce` support.
- **Remedy**: Add `motion-reduce:animate-none` to skeleton items and `motion-reduce:transition-none` to cards.
