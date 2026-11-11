---
target: src/features/admin-courses/components/enrollments/EnrollmentRequests.tsx
total_score: 29.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 1
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/enrollments/EnrollmentRequests.tsx"
target_fingerprint: "sha256:enrollment-requests-critique-init"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/enrollments/EnrollmentRequests.tsx
timestamp: 2026-11-11T15-33-00Z
slug: src-features-admin-courses-components-enrollments-enrollmentrequests-tsx
closed: false
---

# Critique: src/features/admin-courses/components/enrollments/EnrollmentRequests.tsx (Silent Status Mutations & Sub-44px Touch Targets)

Target: `EnrollmentRequests.tsx` Status Update Feedback, Action Ergonomics, and A11y Semantics

## Design Health Score (Pre-Intervention)
Total: 29.0/40 (Requires wiring unified `notify` dispatch on enrollment status changes, expanding button touch targets to >= 44px, and adding descriptive aria-labels)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2.5 | Silent mutation: `handleUpdateStatus` mutates status without dispatching toast feedback, leaving admin uncertain if request processed. |
| 2 | Match System / Real World | 3.5 | Arabic status chips (معلق، مقبول، مرفوض) with color coding and Lucide icons represent real-world status accurately. |
| 3 | User Control and Freedom | 3.5 | Admin can easily approve, reject, or re-approve students. |
| 4 | Consistency and Standards | 2.0 | Violates ADR 0005: complete absence of `notify` calls on status changes and error states. |
| 5 | Error Prevention | 3.0 | `updatingIdRef` protects against concurrent clicks on the same row. |
| 6 | Recognition Rather Than Recall | 3.5 | Displays student name, email, course title, and status badges clearly. |
| 7 | Flexibility and Efficiency | 2.5 | Action buttons are `h-8` (32px), severely failing WCAG 2.1 touch target guideline of >= 44x44px. |
| 8 | Aesthetic and Minimalist Design | 3.5 | Clean list layout and status badges adhere to `DESIGN.md`. |
| 9 | Error Recovery | 2.0 | Silent `catch (err)` in `handleUpdateStatus` logs to console without informing the admin of API failure. |
| 10 | Help and Documentation | 3.0 | Filter tabs and search placeholder are present. |

---

## Identified Priority Issues:

### [P1] Missing Unified Notifications (`notify.success` / `notify.error`) (Lines 62-83)
- **Problem**: Approving, rejecting, or re-activating enrollment requests produces zero toast feedback. When network errors happen, they are silently swallowed by `console.error`.
- **Remedy**: Import `notify` from `@/components/ui/sonner`. Dispatch:
  - `notify.success("تم قبول وتفعيل طلب التسجيل بنجاح")` on approval.
  - `notify.warning("تم رفض طلب التسجيل")` on rejection.
  - `notify.error` on API failure with server message.

### [P2] Inadequate Touch Targets (< 44px) & A11y Deficits
- **Problem**: Action buttons (`قبول وتفعيل`, `رفض`, `إلغاء التفعيل`, `إعادة القبول`) are rendered at `h-8` (32px). Search and filter controls are `h-10`. Buttons lack descriptive `aria-label` identifying student and course.
- **Remedy**: Upgrade action buttons to `h-10 sm:h-11 min-h-[44px]`, upgrade search and filter chips to `h-11 min-h-[44px]`, and add descriptive `aria-label` attributes.

### [P2] Motion-Reduction Safeguards
- **Problem**: Skeleton loading pulses and transitions lack `motion-reduce:animate-none`.
- **Remedy**: Add `motion-reduce:animate-none` on loading elements.
