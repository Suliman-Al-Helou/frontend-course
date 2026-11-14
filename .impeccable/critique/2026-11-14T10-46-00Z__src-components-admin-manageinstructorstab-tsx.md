---
target: src/components/admin/ManageInstructorsTab.tsx
total_score: 33.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 1
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/admin/ManageInstructorsTab.tsx"
target_fingerprint: "sha256:manage-instructors-avatar-primitive-refactor"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/admin/ManageInstructorsTab.tsx
timestamp: 2026-11-14T10-46-00Z
slug: src-components-admin-manageinstructorstab-tsx
closed: false
---

# Critique: src/components/admin/ManageInstructorsTab.tsx (Ad-hoc Instructor Avatar DOM & Fragile Image Error Fallback)

Target: Refactoring instructor visuals in `ManageInstructorsTab.tsx` to adopt `@/components/ui/avatar`

## Design Health Score (Pre-Intervention)
Total: 33.0/40

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Clean loading indicator and toast feedback on mutations. |
| 2 | Match System / Real World | 3.5 | Displays instructor profile cards with bio and specializations. |
| 3 | User Control and Freedom | 4.0 | Actionable edit and delete modals with double-submit guard (`isDeletingRef`). |
| 4 | Consistency and Standards | 3.0 | Uses manual raw `<img>` and conditional icon div instead of centralized `Avatar` primitive. |
| 5 | Error Prevention | 4.0 | Confirmation dialogs protect against accidental instructor deletion. |
| 6 | Recognition Rather Than Recall | 3.5 | Clear icons and labels for edit and delete actions. |
| 7 | Flexibility and Efficiency | 3.5 | Card-based grid with immediate CRUD actions. |
| 8 | Aesthetic and Minimalist Design | 3.0 | Fragile image fallback: broken image icon displays if `avatar_url` returns 404. |
| 9 | Error Recovery | 4.0 | Safe deletion rollback and error alerts. |
| 10 | Help and Documentation | 3.0 | Follows standard admin tabs pattern. |

---

## Identified Priority Issues:

### [P1] Fragile Raw `<img>` Tag & Missing Load Error Fallback
- **Problem**: Lines 98-109 render a raw `<img>` without an `onError` handler; expired or 404 instructor image URLs produce broken image icons.
- **Remedy**: Replace with `<Avatar src={ins.avatar_url} name={ins.name} size="lg" shape="square" />`, providing automatic error catching and initials fallback.

### [P2] Redundant Markup & Code Duplication
- **Problem**: Conditional rendering of fallback icon vs image duplicates styling classes (`w-12 h-12 rounded-xl flex-shrink-0`).
- **Remedy**: Encapsulate visual presentation within the unified `Avatar` primitive.

### [P2] Specialization Tags Token Alignment
- **Problem**: Specialization badges use raw `span` tags with manual styling instead of semantic tokens.
- **Remedy**: Ensure badge styling remains clean and aligned with `DESIGN.md`.
