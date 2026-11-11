---
target: src/components/admin/ManageInstructorsTab.tsx
total_score: 27.0
max_score: 40
na_heuristics: 0
p0_count: 1
p1_count: 2
p2_count: 3
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/admin/ManageInstructorsTab.tsx"
target_fingerprint: "sha256:manage-instructors-tab-critique-init"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/admin/ManageInstructorsTab.tsx
timestamp: 2026-11-11T13-58-00Z
slug: src-components-admin-manageinstructorstab-tsx
closed: false
---

# Critique: src/components/admin/ManageInstructorsTab.tsx (Native Confirm & Missing Feedback Notification)

Target: `ManageInstructorsTab.tsx` Deletion Governance, In-app Confirmation Dialog, and Notification Dispatch

## Design Health Score (Pre-Intervention)
Total: 27.0/40 (Requires elimination of native `confirm()`, wiring unified `notify` feedback, touch target expansion, and deletion concurrency locking)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2.5 | Silent deletion: `handleDelete` deletes and refetches without visual pending state or success confirmation. |
| 2 | Match System / Real World | 3.5 | Arabic labels are clear, but native browser dialog feels disconnected from platform UI. |
| 3 | User Control and Freedom | 2.5 | Native `window.confirm()` provides no contextual preview of which instructor is being deleted. |
| 4 | Consistency and Standards | 2.0 | Violates ADR 0005: omits `notify` calls completely and relies on forbidden browser-native `confirm()`. |
| 5 | Error Prevention | 3.0 | Confirmation exists via `confirm()`, but lacks double-click concurrency protection (`isDeletingRef`). |
| 6 | Recognition Rather Than Recall | 3.0 | Card provides summary, but small icon buttons (`h-8`) reduce recognizability and clarity. |
| 7 | Flexibility and Efficiency | 2.5 | Action touch targets are only `h-8` (32px), failing WCAG 2.1 44px minimum target size requirements. |
| 8 | Aesthetic and Minimalist Design | 3.0 | Card design is acceptable, but button layout is cramped and lacks high-contrast focus rings. |
| 9 | Error Recovery | 2.0 | Silent `catch` block in `handleDelete` logs to console without informing the admin when deletion fails. |
| 10 | Help and Documentation | 3.0 | Empty state and instructor count are present. |

---

## Identified Priority Issues:

### [P0] Forbidden Browser-Native `window.confirm()` (Line 31)
- **Problem**: `if (!confirm('هل أنت متأكد من حذف هذا المدرب؟')) return;` blocks the browser main thread, is inaccessible to assistive tech, breaks custom themes/RTL, and degrades mobile UX.
- **Remedy**: Replace with a dedicated accessible in-app modal (`deletingInstructor: Instructor | null`) with clear confirmation copy and loading state.

### [P1] Missing Unified Notifications (`notify.success` / `notify.error`) (Lines 30-38)
- **Problem**: Deletion succeeds or fails silently with zero toast feedback. Modifying/saving instructors via `onSuccess` also lacks feedback.
- **Remedy**: Integrate `notify` from `@/components/ui/sonner`. Trigger `notify.success("تم حذف المدرب بنجاح")` on delete, `notify.error` on failure, and handle success toasts for create/edit.

### [P1] Concurrency & State Mutation Race Condition
- **Problem**: `handleDelete` lacks concurrency locks (`isDeletingRef`), allowing multiple deletion requests if the user clicks repeatedly while waiting for the network.
- **Remedy**: Implement `isDeletingRef = useRef(false)` guard and disable action buttons during pending operations.

### [P2] Inadequate Touch Targets (< 44px) & Motion Preferences
- **Problem**: Action buttons (`h-8`) and primary button (`h-9`) violate the 44px minimum touch target standard. `motion.div` lacks `prefers-reduced-motion` overrides.
- **Remedy**: Upgrade buttons to `h-11` (or `min-h-[44px]`), and add `motion-reduce:transition-none` safeguards.
