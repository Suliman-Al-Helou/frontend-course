---
target: src/features/admin-users/components/StudentDetailsModal.tsx
total_score: 33.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 1
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/admin-users/components/StudentDetailsModal.tsx"
target_fingerprint: "sha256:student-details-modal-avatar-and-touch-refactor"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/admin-users/components/StudentDetailsModal.tsx
timestamp: 2026-11-14T10-34-00Z
slug: src-features-admin-users-components-studentdetailsmodal-tsx
closed: false
---

# Critique: src/features/admin-users/components/StudentDetailsModal.tsx (Ad-hoc Student Avatar & Sub-44px Close Target)

Target: Refactoring student visuals and accessibility touch targets in `StudentDetailsModal.tsx` to adopt `@/components/ui` primitives

## Design Health Score (Pre-Intervention)
Total: 33.0/40

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Toast notification confirms revoking course; clean modal transition. |
| 2 | Match System / Real World | 3.5 | Displays naive single-character initials (`name[0]`) rather than smart multi-word Arabic initials. |
| 3 | User Control and Freedom | 3.0 | Close button exists, but touch target is undersized (`p-1.5` ~28px). |
| 4 | Consistency and Standards | 3.0 | Header constructs ad-hoc avatar circle (`w-11 h-11`) instead of standard `Avatar` primitive. |
| 5 | Error Prevention | 4.0 | Revoke concurrency lock (`isRevokingRef`) prevents duplicate status updates. |
| 6 | Recognition Rather Than Recall | 4.0 | Clear stat cards and icon cues for student metadata. |
| 7 | Flexibility and Efficiency | 3.5 | Clean scrollable body and instant modal dismiss. |
| 8 | Aesthetic and Minimalist Design | 3.5 | Clean dark-mode card layout. |
| 9 | Error Recovery | 4.0 | Toast notifications give actionable error context on mutation failures. |
| 10 | Help and Documentation | 3.0 | Conforms to modal conventions. |

---

## Identified Priority Issues:

### [P1] Ad-hoc Student Avatar in Modal Header
- **Problem**: Lines 127-129 hand-roll an ad-hoc avatar circle using `(student.name || student.email || "?")[0].toUpperCase()`.
- **Remedy**: Replace with `<Avatar name={student.name || student.email} size="lg" />`.

### [P1] Close Button Touch Target Violation
- **Problem**: Lines 137-144 style modal close button with `p-1.5 rounded-lg` (~28px), violating WCAG 44px minimum touch targets.
- **Remedy**: Upgrade close button to `w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center`.

### [P2] Secondary Action Touch Targets
- **Problem**: Revoke button (`handleRevoke`) uses `h-8` (32px), which is tight on touch screens.
- **Remedy**: Upgrade button to `h-9 min-h-[38px] px-3.5` for comfortable touch accessibility.
