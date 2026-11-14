---
target: src/app/(public)/instructors/page.tsx
total_score: 32.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 1
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/app/(public)/instructors/page.tsx"
target_fingerprint: "sha256:instructors-catalog-avatar-primitive-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/app/(public)/instructors/page.tsx
timestamp: 2026-11-14T11-04-00Z
slug: src-app-public-instructors-page-tsx
closed: false
---

# Critique: src/app/(public)/instructors/page.tsx (Ad-hoc Instructor Avatar Cards & Missing Error Recovery)

Target: Refactoring instructor card avatars in `src/app/(public)/instructors/page.tsx` to adopt `@/components/ui/avatar`

## Design Health Score (Pre-Intervention)
Total: 32.0/40

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Clean skeleton loading grid; lacks image loading/error detection. |
| 2 | Match System / Real World | 3.5 | Clear instructor credentials, ratings, and course counts. |
| 3 | User Control and Freedom | 4.0 | Seamless link routing to `/instructors/[id]`. |
| 4 | Consistency and Standards | 3.0 | Uses manual `<img>` and conditional icon div instead of centralized `@/components/ui/avatar`. |
| 5 | Error Prevention | 4.0 | Clean error message display on fetch failure. |
| 6 | Recognition Rather Than Recall | 3.5 | Canonical instructor cards with badge details. |
| 7 | Flexibility and Efficiency | 3.5 | Responsive grid with interactive card hovers. |
| 8 | Aesthetic and Minimalist Design | 3.0 | Raw `<img>` without `onError` shows broken image icon on network failure or expired URLs. |
| 9 | Error Recovery | 2.5 | No automated fallback to initials when instructor image fails to load. |
| 10 | Help and Documentation | 3.5 | Standard public catalog experience. |

---

## Identified Priority Issues:

### [P1] Fragile Raw `<img>` Tag & Missing Load Error Fallback
- **Problem**: Lines 71-81 render a raw `<img>` without an `onError` listener. If an instructor's image URL fails, the browser displays a broken image icon.
- **Remedy**: Replace with `<Avatar src={ins.avatar_url} name={ins.name} size="2xl" shape="card" />`.

### [P2] Redundant Markup & Code Duplication
- **Problem**: Conditional fallback icon vs image duplicates layout and sizing classes (`w-20 h-20 rounded-2xl mx-auto mb-3 border-4 border-background`).
- **Remedy**: Encapsulate presentation cleanly inside the unified `Avatar` primitive.

### [P2] Hover Zoom Transition Without Motion-Reduction Guard
- **Problem**: `group-hover:scale-105 transition-transform` on the image does not guard against `prefers-reduced-motion`.
- **Remedy**: Add `motion-reduce:transition-none motion-reduce:transform-none`.
