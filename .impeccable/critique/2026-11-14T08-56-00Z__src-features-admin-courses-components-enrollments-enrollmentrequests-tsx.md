---
target: src/features/admin-courses/components/enrollments/EnrollmentRequests.tsx
total_score: 34.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 1
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/enrollments/EnrollmentRequests.tsx"
target_fingerprint: "sha256:enrollment-requests-search-input-refactor"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/enrollments/EnrollmentRequests.tsx
timestamp: 2026-11-14T08-56-00Z
slug: src-features-admin-courses-components-enrollments-enrollmentrequests-tsx
closed: false
---

# Critique: src/features/admin-courses/components/enrollments/EnrollmentRequests.tsx (Adoption of Unified SearchInput Primitive)

Target: Refactoring search controls in `EnrollmentRequests.tsx` to adopt `@/components/ui/search-input`

## Design Health Score (Pre-Intervention)
Total: 34.0/40

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Loading spinner exists for initial load, but search filtering lacks one-tap clear feedback. |
| 2 | Match System / Real World | 4.0 | Clear Arabic labels and semantic status indicators (معلّق، مقبول، مرفوض). |
| 3 | User Control and Freedom | 2.5 | No one-tap clear button for search input; requires manual backspacing. |
| 4 | Consistency and Standards | 3.0 | Uses ad-hoc relative container with hardcoded `pr-10` instead of standard `SearchInput` primitive. |
| 5 | Error Prevention | 4.0 | Concurrency lock (`updatingIdRef`) prevents duplicate status update clicks. |
| 6 | Recognition Rather Than Recall | 3.5 | Search icon clearly indicated, but manual absolute styling duplicates boilerplate. |
| 7 | Flexibility and Efficiency | 3.0 | Lacks fast query reset (`onClear`). |
| 8 | Aesthetic and Minimalist Design | 3.5 | Clean card layout, but redundant wrapper DOM elements clutter markup. |
| 9 | Error Recovery | 4.0 | Toast notifications give actionable error context on mutation failures. |
| 10 | Help and Documentation | 3.0 | Needs standard component usage aligned with codebase design primitives. |

---

## Identified Priority Issues:

### [P1] Repetitive Ad-hoc Search DOM & Missing One-Tap Clear Action
- **Problem**: Lines 110-118 construct search input using manual absolute positioning (`Search` icon + `Input` + `pr-10`) with zero clear action.
- **Remedy**: Replace with `<SearchInput>` primitive from `@/components/ui/search-input`, wire `onClear={() => setSearch("")}`, eliminate redundant wrapper element and unused icon imports.

### [P2] Unused Search Icon Import
- **Problem**: `Search` is imported directly from `lucide-react` in `EnrollmentRequests.tsx` solely for the manual search container.
- **Remedy**: Clean up unused imports after replacing with `SearchInput`.

### [P2] Visual Balance & Filter Controls Alignment
- **Problem**: Search container and filter tabs should align seamlessly in flex container on both desktop and mobile viewports.
- **Remedy**: Ensure `SearchInput` receives `className="flex-1"` without overriding its internal 44px min-height geometry.
