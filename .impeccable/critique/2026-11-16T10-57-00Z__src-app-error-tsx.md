# Impeccable Critique: Error Screens (`src/app/error.tsx` & `global-error.tsx`)

**Date:** 2026-11-16T10:57:00Z  
**Target:** `src/app/error.tsx` & `src/app/global-error.tsx` (and `ErrorState.tsx`)  
**Reviewer:** Antigravity (Impeccable 4-Step Atomic Governance Protocol)  
**Status:** In Progress (Step 1: Critique)

---

## 1. Nielsen 10 Heuristics Score: 36/40

| # | Heuristic | Score (/4) | Notes |
|---|---|:---:|---|
| 1 | Visibility of system status | 4/4 | Transition pending state communicates retry operation clearly. |
| 2 | Match between system and real world | 4/4 | Standard Arabic error explanation and clear actions. |
| 3 | User control and freedom | 4/4 | Both "إعادة المحاولة" and "الصفحة الرئيسية" pathways available. |
| 4 | Consistency and standards | 3/4 | `global-error.tsx` <body> lacks theme tokens and font class, causing unstyled fallback during root failures. |
| 5 | Error prevention | 4/4 | Wrapped in `useTransition` to prevent unhandled rejection loops. |
| 6 | Recognition rather than recall | 4/4 | Distinct warning icon and direct action labels. |
| 7 | Flexibility and efficiency of use | 3/4 | Responsive action buttons (`flex-col sm:flex-row`). |
| 8 | Aesthetic and minimalist design | 3/4 | Icon container uses `rounded-md` instead of canonical `rounded-xl` token from DESIGN.md. |
| 9 | Help users recognize, diagnose, and recover from errors | 4/4 | `role="alert"` announces error to screen readers; log captures digest for debugging. |
| 10| Help and documentation | 3/4 | Contextual error recovery guidance. |

---

## 2. Issues Categorization

### [P1] Critical / Major
1. **Global Error Unstyled Fallback**:
   - `src/app/global-error.tsx` renders raw `<body>` without `bg-background text-foreground font-arabic`, leading to unstyled dark-mode glitches if root layout fails.
2. **Dead Code (Unused Import)**:
   - `useState` imported in `src/app/error.tsx` but never used.

### [P2] Improvements
1. **Design System Token Harmony**:
   - Icon badge container in `Statemessage.tsx` uses `rounded-md` instead of canonical `rounded-xl`.
2. **Button Link Simplification**:
   - Simplify `<Button asChild><Link href="/">` to direct `<Button href="/" variant="secondary">`.

---

## 3. Planned Resolutions (Steps 2 & 3)
1. Add `bg-background text-foreground font-arabic` to `global-error.tsx` `<body>`.
2. Remove unused `useState` from `error.tsx`.
3. Standardize icon pill to `rounded-xl`.
4. Validate TypeScript, Vitest test suite, and impeccable detector.
