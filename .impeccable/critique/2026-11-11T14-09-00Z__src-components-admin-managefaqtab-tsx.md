---
target: src/components/admin/ManageFaqTab.tsx
total_score: 26.0
max_score: 40
na_heuristics: 0
p0_count: 1
p1_count: 2
p2_count: 3
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/admin/ManageFaqTab.tsx"
target_fingerprint: "sha256:manage-faq-tab-critique-init"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/admin/ManageFaqTab.tsx
timestamp: 2026-11-11T14-09-00Z
slug: src-components-admin-managefaqtab-tsx
closed: false
---

# Critique: src/components/admin/ManageFaqTab.tsx (Native Confirm & 100% Silent CRUD Operations)

Target: `ManageFaqTab.tsx` Mutation Feedback, In-app Confirmation Modal, and Concurrency Locks

## Design Health Score (Pre-Intervention)
Total: 26.0/40 (Requires elimination of native `confirm()`, full integration with unified `notify` on all CRUD mutations, accessible confirmation modal, touch target expansion, and concurrency locking)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2.0 | Complete feedback blindness: creating, updating, and deleting questions happen silently with zero toast alerts. |
| 2 | Match System / Real World | 3.5 | Arabic labels are clear, but native browser alert blocks UI execution. |
| 3 | User Control and Freedom | 2.5 | Native dialog does not preview the question being deleted or provide an in-app undo or review. |
| 4 | Consistency and Standards | 2.0 | Inconsistent with ADR 0005: completely ignores `notify` system across all endpoints and uses forbidden `window.confirm()`. |
| 5 | Error Prevention | 2.5 | Lack of ref concurrency guards (`useRef`) allows double-submission on create, update, and delete. |
| 6 | Recognition Rather Than Recall | 3.0 | Accordion lists questions, but tiny delete button provides no label or clarity on which question is targeted. |
| 7 | Flexibility and Efficiency | 2.5 | Delete button is `p-1.5` (~24px), severely violating WCAG 2.1 touch target guideline (minimum 44x44px). |
| 8 | Aesthetic and Minimalist Design | 3.0 | Input fields and buttons have inconsistent sizing and lack high-contrast focus rings. |
| 9 | Error Recovery | 2.0 | All `catch (err)` blocks silently swallow errors with `console.error` without alerting the admin to server failures. |
| 10 | Help and Documentation | 3.0 | Placeholders and empty state are present. |

---

## Identified Priority Issues:

### [P0] Forbidden Browser-Native `window.confirm()` (Line 65)
- **Problem**: `if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;` blocks the browser main thread, is inaccessible, and violates platform standards.
- **Remedy**: Replace with an accessible in-app confirmation modal (`deletingFaq: Faq | null`) showing question text with clear confirmation.

### [P1] Missing Unified Notifications (`notify.success` / `notify.error`) Across Entire Component
- **Problem**: `handleAdd` (POST), `handleUpdate` (PUT), and `handleDelete` (DELETE) fail to provide any feedback notification via `notify`.
- **Remedy**: Import `notify` from `@/components/ui/sonner`. Dispatch `notify.success` for:
  - إضافة سؤال جديد: "تمت إضافة السؤال بنجاح"
  - تعديل السؤال: "تم حفظ تعديلات السؤال بنجاح"
  - حذف السؤال: "تم حذف السؤال بنجاح"
  Dispatch `notify.error` on all API failures with meaningful server feedback.

### [P1] Concurrency & Double-Submit Vulnerability
- **Problem**: Adding, editing, and deleting rely only on asynchronous state flags without `useRef` locks, permitting duplicate requests on rapid clicks.
- **Remedy**: Introduce `isSubmittingRef` and `isDeletingRef` locks.

### [P2] Inadequate Touch Targets (< 44px) & A11y Deficits
- **Problem**: Action delete button is `p-1.5` (~24px) and lacks `aria-label`. Add and save buttons lack standard `h-11 min-h-[44px]` touch height.
- **Remedy**: Upgrade all action buttons to `>= 44px`, add descriptive `aria-label`, and apply `motion-reduce:transition-none`.
