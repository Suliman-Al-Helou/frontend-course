---
target: src/components/ui/badge.tsx
total_score: 28.5
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/ui/badge.tsx"
target_fingerprint: "sha256:badge-primitive-critique-init"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/ui/badge.tsx
timestamp: 2026-11-11T16-22-00Z
slug: src-components-ui-badge-tsx
closed: false
---

# Critique: src/components/ui/badge.tsx (Semantic Gap & Harsh Border Radius)

Target: `badge.tsx` Semantic Palette Expansion, Capsule Border Radius, and Size Scale

## Design Health Score (Pre-Intervention)
Total: 28.5/40 (Requires expanding semantic variants to include primary, warning, info, hot, and outline, softening radius to rounded-full/rounded-lg, and introducing size variants)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Displays metadata status with icons and colors. |
| 2 | Match System / Real World | 3.0 | Lacks common domain statuses (pending/warning, info, popular/hot). |
| 3 | User Control and Freedom | 3.5 | Simple presentational primitive. |
| 4 | Consistency and Standards | 2.0 | Harsh `rounded-sm` clashes with platform's rounded aesthetics; missing universal variants forced features to write ad-hoc spans. |
| 5 | Error Prevention | 3.5 | Standard TypeScript interfaces. |
| 6 | Recognition Rather Than Recall | 3.0 | Incomplete variant list forces developers to memorize raw hex codes and color opacities. |
| 7 | Flexibility and Efficiency | 2.5 | Fixed single size causes awkward vertical height in dense tables. |
| 8 | Aesthetic and Minimalist Design | 2.5 | `rounded-sm` creates boxy, unpolished badges compared to modern UI capsule styling. |
| 9 | Error Recovery | 3.5 | Default fallback provided. |
| 10 | Help and Documentation | 3.5 | TypeScript CVA props. |

---

## Identified Priority Issues:

### [P1] Missing Core Semantic Variants (Lines 11-18)
- **Problem**: Component only defines `upcoming`, `attended`, `missed`, `success`, `destructive`, and `secondary`. Crucial statuses like `default` (primary), `warning` (pending), `info` (blue), `hot` (popular), and `outline` are missing, resulting in widespread ad-hoc span tags across pages.
- **Remedy**: Expand `variant` to include `default` (or `primary`), `success`, `warning`, `destructive`, `info`, `hot`, `secondary`, and `outline`.

### [P1] Harsh Border Radius (`rounded-sm` vs `rounded-full` / `rounded-lg`) (Line 8)
- **Problem**: Base class uses `rounded-sm` (2px), producing harsh square badges that contradict the `rounded-full` pill badges seen in `DESIGN.md`.
- **Remedy**: Upgrade default border-radius to `rounded-full` (with an optional `rounded-lg` capsule shape).

### [P2] Lack of Size Scale
- **Problem**: Single fixed padding `px-2 py-1 text-xs` does not scale down well for tight table rows (`EnrollmentRequests`, `StudentsTable`).
- **Remedy**: Add `size: sm` (`text-[11px] px-2 py-0.5`) and `size: default` (`text-xs px-2.5 py-1`).

### [P2] SVG Sizing and Alignment
- **Problem**: Icon sizing is locked to `[&_svg]:size-4`, which looks disproportionately large when paired with small badge text.
- **Remedy**: Adjust SVG size to `[&_svg]:size-3.5` for harmonious proportions.
