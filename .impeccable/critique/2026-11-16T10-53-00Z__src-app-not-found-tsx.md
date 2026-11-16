# Impeccable Critique: NotFound (`src/app/not-found.tsx`)

**Date:** 2026-11-16T10:53:00Z  
**Target:** `src/app/not-found.tsx`  
**Reviewer:** Antigravity (Impeccable 4-Step Atomic Governance Protocol)  
**Status:** In Progress (Step 1: Critique)

---

## 1. Nielsen 10 Heuristics Score: 34/40

| # | Heuristic | Score (/4) | Notes |
|---|---|:---:|---|
| 1 | Visibility of system status | 4/4 | Immediate 404 recognition. |
| 2 | Match between system and real world | 4/4 | Clear Arabic error messaging and obvious navigation pathways. |
| 3 | User control and freedom | 3/4 | Links to home and courses provided, but hand-rolled instead of canonical button primitives. |
| 4 | Consistency and standards | 3/4 | Hand-rolled `<Link>` buttons violate DESIGN.md tokens and miss 44px min-h guarantee on small viewports. |
| 5 | Error prevention | 4/4 | Prevents user dead-ends by guiding back to main features. |
| 6 | Recognition rather than recall | 4/4 | Clear icons and direct route destinations. |
| 7 | Flexibility and efficiency of use | 3/4 | Action buttons present, but could use standardized `Button` component with keyboard focus rings. |
| 8 | Aesthetic and minimalist design | 2/4 | Harsh 50% opacity top gradient (`from-primary/50`); oversized static `text-[200px]` that overflows small mobile viewports. |
| 9 | Help users recognize, diagnose, and recover from errors | 4/4 | Succinct, courteous explanation of missing resource. |
| 10| Help and documentation | 3/4 | Direct links back to active discovery hubs. |

---

## 2. Issues Categorization

### [P1] Critical / Major
1. **Mobile Viewport Overflow (`text-[200px]`)**:
   - Fixed `text-[200px]` breaches smaller mobile screen widths ($<380\text{px}$) and violates the DESIGN.md typography ramp. Needs responsive scaling (`text-7xl sm:text-9xl md:text-[150px]`).
2. **Design System Primitive Bypass**:
   - Navigation links use raw `<Link>` with hardcoded tailwind strings instead of standard `<Button href="..." variant="...">` from `@/components/ui/button`.
3. **Dead Code (Unused Import)**:
   - `Search` icon imported from `lucide-react` but never used.

### [P2] Improvements
1. **Harsh Visual Gradient**:
   - `from-primary/50` creates a heavy visual banner. Replace with subtle ambient radial glow (`from-primary/10`).
2. **Card Elevation**:
   - Group the 404 message cleanly with subtle backdrop framing for visual polish.

---

## 3. Planned Resolutions (Steps 2 & 3)
1. Replace raw links with `<Button href="/" variant="default">` and `<Button href="/courses" variant="outline">`.
2. Make 404 typography responsive to eliminate mobile overflow.
3. Replace harsh top gradient with elegant ambient glow.
4. Purge dead `Search` import.
5. Validate TypeScript, Vitest test suite, and impeccable detector.
