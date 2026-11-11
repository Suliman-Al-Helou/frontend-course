---
target: src/features/admin-courses/components/courses/CourseFormModal.tsx
total_score: 30.5
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 1
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/courses/CourseFormModal.tsx"
target_fingerprint: "sha256:course-form-modal-critique-init"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/courses/CourseFormModal.tsx
timestamp: 2026-11-11T15-14-00Z
slug: src-features-admin-courses-components-courses-courseformmodal-tsx
closed: false
---

# Critique: src/features/admin-courses/components/courses/CourseFormModal.tsx (Silent Mutation Feedback & Escape Key Handling)

Target: `CourseFormModal.tsx` Creation/Update Feedback, Keyboard Dismissal, and Motion Safeguards

## Design Health Score (Pre-Intervention)
Total: 30.5/40 (Requires wiring unified `notify` dispatch on course create/update, adding Escape key dismissal, and enforcing motion-reduction guards)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2.5 | Silent mutation: `handleSubmit` executes mutations and calls `onClose()` without dispatching toast feedback. |
| 2 | Match System / Real World | 3.5 | Domain copy, tab layout, and curriculum metadata are clear and natural. |
| 3 | User Control and Freedom | 3.0 | Close button is present, but modal lacks `Escape` key listener and backdrop click-to-dismiss. |
| 4 | Consistency and Standards | 2.5 | Violates ADR 0005: ignores unified `notify` upon course creation and update. |
| 5 | Error Prevention | 3.5 | Local pre-validation (title, instructor) and server 422 field error mappings are implemented. |
| 6 | Recognition Rather Than Recall | 3.5 | Tabs (Basic, Pricing, Content) segment complex form fields effectively. |
| 7 | Flexibility and Efficiency | 3.0 | Multi-line tag pasting is supported, but missing Escape key hinders power-user keyboard ergonomics. |
| 8 | Aesthetic and Minimalist Design | 3.5 | Professional modal layout adhering to `DESIGN.md`. |
| 9 | Error Recovery | 2.5 | General server errors are rendered only inline without alert toast for immediate perception. |
| 10 | Help and Documentation | 3.5 | Descriptive field placeholders and helper text provide adequate guidance. |

---

## Identified Priority Issues:

### [P1] Missing Unified Notifications (`notify.success` / `notify.error`) (Lines 115-136)
- **Problem**: When a course is created or updated, the modal closes silently without notifying the admin via `notify.success`. Unhandled API errors render only an inline text message.
- **Remedy**: Import `notify` from `@/components/ui/sonner`. Trigger `notify.success` with the course title on save/update, and `notify.error` for general server failures.

### [P2] Keyboard Dismissal (Escape Key) & Backdrop Interaction
- **Problem**: Pressing the `Escape` key does not dismiss the modal, violating standard modal accessibility patterns.
- **Remedy**: Add a keyboard event listener for `Escape` key when not submitting, and support backdrop click dismissal.

### [P2] Motion-Reduction Safeguards
- **Problem**: Tab transitions use `animate-in fade-in-0 duration-150` without `motion-reduce:animate-none`.
- **Remedy**: Add `motion-reduce:animate-none` on tab content containers.
