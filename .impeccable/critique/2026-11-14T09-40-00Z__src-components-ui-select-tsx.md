---
target: src/components/ui/select.tsx
total_score: 27.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/ui/select.tsx"
target_fingerprint: "sha256:select-primitive-critique-init"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/ui/select.tsx
timestamp: 2026-11-14T09-40-00Z
slug: src-components-ui-select-tsx
closed: false
---

# Critique: src/components/ui/select.tsx (Sub-44px Touch Targets, Legacy Radii & Animation Gaps)

Target: Design and Architecture of `select.tsx` Dropdown Form Primitive

## Design Health Score (Pre-Intervention)
Total: 27.0/40 (Currently relies on outdated Shadcn defaults: `h-10` 40px height violating minimum touch target, `rounded-md` sharp corners, and lack of motion-reduction tokens)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Radix provides basic open/close state, but lacks smooth enter/exit animations. |
| 2 | Match System / Real World | 4.0 | Familiar dropdown picker metaphor with Chevron indicator. |
| 3 | User Control and Freedom | 3.5 | Keyboard navigation and escape handling provided by Radix primitives. |
| 4 | Consistency and Standards | 2.0 | Diverges from `Button` and `Input`: uses `h-10` (40px) and `rounded-md` instead of `h-11 min-h-[44px]` and `rounded-xl`. |
| 5 | Error Prevention | 3.5 | Controlled and uncontrolled state support via Radix. |
| 6 | Recognition Rather Than Recall | 3.0 | Checkmark indicator present, but item targets are small (`rounded-sm py-2`). |
| 7 | Flexibility and Efficiency | 2.5 | Developers forced to manually append `className="h-11 rounded-xl"` across admin course forms. |
| 8 | Aesthetic and Minimalist Design | 2.5 | Sharp corners (`rounded-md`, `rounded-sm`) clash with rounded design tokens; flat `bg-background` lacks depth. |
| 9 | Error Recovery | 3.5 | Clean select reset handling. |
| 10 | Help and Documentation | 3.0 | Standard Radix exports, but missing `SelectLabel` and `SelectSeparator`. |

---

## Identified Priority Issues:

### [P1] Touch Target Violation (`h-10` / 40px vs 44px Minimum)
- **Problem**: `SelectTrigger` defaults to `h-10` (40px). In screens where developers did not manually pass `h-11 min-h-[44px]` (e.g. `VideoAssetModal`, `ZoomMeetingModal`), the touch target violates accessibility guidelines.
- **Remedy**: Upgrade default height to `h-11 min-h-[44px]` with `px-4`.

### [P1] Design System Token Alignment (`rounded-xl` & `bg-popover`)
- **Problem**: `SelectTrigger` and `SelectContent` use `rounded-md`, and `SelectItem` uses `rounded-sm`.
- **Remedy**: Update `SelectTrigger` and `SelectContent` to `rounded-xl`, and `SelectItem` to `rounded-lg` with `min-h-[40px]`. Use `bg-popover text-popover-foreground shadow-xl border-border`.

### [P2] Missing Reduced Motion Guards
- **Problem**: Animations on dropdown menu expansion lack `motion-reduce:transition-none` and `motion-reduce:animate-none`.
- **Remedy**: Add strict motion-reduction classes to `SelectTrigger`, `SelectContent`, and `SelectItem`.

### [P2] Missing Compound Exports (`SelectLabel`, `SelectSeparator`)
- **Problem**: Only 5 components are exported (`Select`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectItem`). Grouped options lack standard dividers and headers.
- **Remedy**: Export `SelectGroup`, `SelectLabel`, and `SelectSeparator`.
