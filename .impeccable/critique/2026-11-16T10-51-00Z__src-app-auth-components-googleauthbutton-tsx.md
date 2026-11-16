# Impeccable Critique: GoogleAuthButton (`src/app/(auth)/_components/GoogleAuthButton.tsx`)

**Date:** 2026-11-16T10:51:00Z  
**Target:** `src/app/(auth)/_components/GoogleAuthButton.tsx`  
**Reviewer:** Antigravity (Impeccable 4-Step Atomic Governance Protocol)  
**Status:** In Progress (Step 1: Critique)

---

## 1. Nielsen 10 Heuristics Score: 36/40

| # | Heuristic | Score (/4) | Notes |
|---|---|:---:|---|
| 1 | Visibility of system status | 4/4 | `isLoading` state displays spinner and clear textual indication. |
| 2 | Match between system and real world | 4/4 | Official 4-color Google SVG with authentic brand typography and Arabic copy. |
| 3 | User control and freedom | 3/4 | Cancel on tap outside enabled in GIS configuration. |
| 4 | Consistency and standards | 3/4 | Corner radius is `rounded-lg` instead of the project-wide `rounded-xl` token used by `Button` and `Input`. |
| 5 | Error prevention | 4/4 | Concurrency lock (`isSubmittingRef`) guards against multiple rapid taps. |
| 6 | Recognition rather than recall | 4/4 | Instantly recognized Google SSO branding. |
| 7 | Flexibility and efficiency of use | 3/4 | Fast 1-click SSO, but underlying button lacks direct keyboard fallback activation. |
| 8 | Aesthetic and minimalist design | 4/4 | Clean divider and card-matching background tokens. |
| 9 | Help users recognize, diagnose, and recover from errors | 3/4 | Error toast notification on credential exchange failure. |
| 10| Help and documentation | 4/4 | Clear mode-specific copy ("تسجيل الدخول بواسطة Google" vs "إنشاء حساب بواسطة Google"). |

---

## 2. Issues Categorization

### [P1] Critical / Major
1. **Design System Token Harmony (`rounded-xl`)**:
   - Button uses `rounded-lg` while sibling inputs and buttons (`SubmitButton`, `Input`) use `rounded-xl`.
2. **Keyboard Fallback Activation & Overlay Harmonization**:
   - When the custom visual button is focused via keyboard (or if clicked outside the iframe bounds), adding an explicit `onClick` fallback to trigger `window.google?.accounts.id.prompt()` ensures keyboard users who activate the button directly receive the Google authentication prompt.

### [P2] Improvements
1. **Reduced Motion**:
   - Add `motion-reduce:transition-none` and `motion-reduce:active:scale-100` on the button, and `motion-reduce:animate-none` on `Loader2`.
2. **Separator Visual Contrast**:
   - Divider line has `border-border`, label has `bg-card px-3`. Ensure crisp rendering on both dark and light themes.

---

## 3. Planned Resolutions (Steps 2 & 3)
1. Unify corner radius to `rounded-xl` (matching `Button` and `Input`).
2. Add `onClick` fallback handler to trigger `window.google?.accounts.id.prompt()` on keyboard or direct click.
3. Add `motion-reduce:transition-none`, `motion-reduce:active:scale-100`, and `motion-reduce:animate-none`.
4. Validate TypeScript, Vitest test suite, and impeccable detector.
