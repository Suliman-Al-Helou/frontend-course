# Impeccable Critique: Shared Components (`ConfirmModal`, `ThemeToggle`, `ProfessionalTerminal`)

**Date:** 2026-11-16T11:04:00Z  
**Target:** `src/components/shared/ConfirmModal.tsx`, `ThemeToggle.tsx`, `ProfessionalTerminal.tsx`  
**Reviewer:** Antigravity (Impeccable 4-Step Atomic Governance Protocol)  
**Status:** In Progress (Step 1: Critique)

---

## 1. Nielsen 10 Heuristics Score: 36/40

| # | Heuristic | Score (/4) | Notes |
|---|---|:---:|---|
| 1 | Visibility of system status | 4/4 | Pending states in `ConfirmModal` disable buttons and show loading spinners. |
| 2 | Match between system and real world | 4/4 | Natural Arabic labels ("تأكيد الحذف", "إلغاء"). |
| 3 | User control and freedom | 4/4 | Escape key and backdrop dismissal supported. |
| 4 | Consistency and standards | 3/4 | `ConfirmModal` uses custom `amber` color tokens instead of standard `warning` tokens; `ThemeToggle` has 40px placeholder causing CLS against 44px button. |
| 5 | Error prevention | 4/4 | Concurrency lock (`isLockedRef`) prevents double confirmations. |
| 6 | Recognition rather than recall | 4/4 | Contextual icons for destructive, warning, and info actions. |
| 7 | Flexibility and efficiency of use | 3/4 | Keyboard accessible, but confirm button icon was rendered with oversized 24px icon inside a 44px button. |
| 8 | Aesthetic and minimalist design | 4/4 | Clean modal surfaces, subtle backdrop blur. |
| 9 | Help users recognize, diagnose, and recover from errors | 4/4 | Explicit confirmation required for high-risk irreversible operations. |
| 10| Help and documentation | 3/4 | Modal descriptions provide clear impact context. |

---

## 2. Issues Categorization

### [P1] Critical / Major
1. **Design System Token Violation (`amber` vs `warning`)**:
   - `ConfirmModal.tsx` hardcodes `amber-500` / `amber-600` instead of canonical `DESIGN.md` tokens (`warning`, `warning-foreground`).
2. **Cumulative Layout Shift (CLS in `ThemeToggle`)**:
   - `ThemeToggle` placeholder renders `h-10 w-10` before mount, but button renders `h-11 w-11 min-h-[44px] min-w-[44px]`, triggering a 4px layout shift upon client hydration.
3. **Button Icon Scaling**:
   - Reusing `w-6 h-6` inside the submit button causes visual distortion. Action button icon should be standard `w-4 h-4`.

### [P2] Improvements
1. **UI Primitive Re-export Bridge**:
   - Provide standard `confirm-dialog.tsx` in `@/components/ui/` bridging to `ConfirmModal` for complete design system discoverability.
2. **Reduced Motion**:
   - Support `motion-reduce:animate-none` on cursor blink in `ProfessionalTerminal`.

---

## 3. Planned Resolutions (Steps 2 & 3)
1. Replace `amber` classes with `warning` tokens in `ConfirmModal.tsx`.
2. Fix `w-4 h-4` icon inside confirm button and use `Button`'s built-in loading state.
3. Update `ThemeToggle` placeholder to `h-11 w-11 min-h-[44px] min-w-[44px]`.
4. Export canonical primitive in `src/components/ui/confirm-dialog.tsx`.
5. Validate TypeScript, Vitest test suite, and impeccable detector.
