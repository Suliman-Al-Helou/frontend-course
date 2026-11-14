---
target: src/components/ui/card.tsx
total_score: 25.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/ui/card.tsx"
target_fingerprint: "sha256:card-primitive-critique-init"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/ui/card.tsx
timestamp: 2026-11-14T09-38-00Z
slug: src-components-ui-card-tsx
closed: false
---

# Critique: src/components/ui/card.tsx (Outdated Tokens, Sharp Radii & Missing Compound Subcomponents)

Target: Design and Architecture of `card.tsx` Surface & Container Primitive

## Design Health Score (Pre-Intervention)
Total: 25.0/40 (Currently diverges from `DESIGN.md` with sharp 6px radii (`rounded-md`), wrong surface token (`bg-background` instead of `bg-card`), and missing semantic subcomponents)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Passive container; lacks built-in interactive states or loading skeleton affordance. |
| 2 | Match System / Real World | 3.5 | Familiar container metaphor. |
| 3 | User Control and Freedom | 3.0 | Lacks compound subcomponents (`CardTitle`, `CardDescription`, `CardFooter`), forcing manual typography overrides. |
| 4 | Consistency and Standards | 2.0 | Severe token divergence: uses `rounded-md` (6px) and `bg-background` instead of `rounded-2xl` (16px) and `bg-card`. |
| 5 | Error Prevention | 3.5 | Standard container element. |
| 6 | Recognition Rather Than Recall | 2.5 | Missing standard `CardTitle` and `CardDescription` components leads to fragmented heading hierarchies across screens. |
| 7 | Flexibility and Efficiency | 2.5 | Developers avoid the primitive and hand-roll `rounded-2xl bg-card border` across features. |
| 8 | Aesthetic and Minimalist Design | 2.0 | Flat `bg-background` blends cards into page background, destroying visual depth. |
| 9 | Error Recovery | 3.5 | Passive display component. |
| 10 | Help and Documentation | 2.0 | Missing exports for standard compound card slots. |

---

## Identified Priority Issues:

### [P1] Radius & Surface Token Divergence from `DESIGN.md`
- **Problem**: `Card` currently renders with `rounded-md border border-border bg-background`. `DESIGN.md` explicitly specifies:
  - Surface: `bg-card text-card-foreground`
  - Border: `border border-border`
  - Radius: `rounded-2xl` (16px) for cards and modals.
- **Remedy**: Update `Card` defaults to `rounded-2xl border border-border bg-card text-card-foreground shadow-xs`.

### [P1] Missing Compound Card Subcomponents (`CardTitle`, `CardDescription`, `CardFooter`)
- **Problem**: Only `Card`, `CardHeader`, and `CardContent` exist. Screens have no standard way to format card titles or footers.
- **Remedy**: Export `CardTitle` (`h3`), `CardDescription` (`p`), and `CardFooter` (`div`), supporting standard typographic scale.

### [P2] Inadequate Padding Scale (`p-4` vs `p-6`)
- **Problem**: `CardHeader` and `CardContent` currently use `p-4`, which is cramped for primary desktop and dashboard cards (`DESIGN.md` specifies `p-6` or `p-8`).
- **Remedy**: Upgrade standard padding to `p-5 sm:p-6` with optional compact variant.

### [P2] Interactive Card State (`interactive` / Hover Elevation)
- **Problem**: Cards used as interactive links or clickable tiles lack standardized hover elevation tokens.
- **Remedy**: Add an optional `interactive` prop or variant supporting `hover:border-primary/40 hover:shadow-md transition-all duration-200 motion-reduce:transition-none`.
