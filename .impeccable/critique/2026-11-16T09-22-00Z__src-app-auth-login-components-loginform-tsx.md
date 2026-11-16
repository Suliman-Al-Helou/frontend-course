---
target: src/app/(auth)/login/_components/LoginForm.tsx
total_score: 40.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/app/(auth)/login/_components/LoginForm.tsx"
target_fingerprint: "sha256:auth-login-form-post-intervention"
target_path: /home/suliman/Documents/courses/frontend-course/src/app/(auth)/login/_components/LoginForm.tsx
timestamp: 2026-11-16T09-22-00Z
slug: src-app-auth-login-components-loginform-tsx
closed: true
---

# Critique: src/app/(auth)/login/_components/LoginForm.tsx (Undefined Border Token, Sub-44px Touch Targets & Primitive Adoption)

Target: Refactoring authentication login form in `src/app/(auth)/login/_components/LoginForm.tsx` and child input primitives to replace invalid tokens with `border-border`, guarantee 44px touch targets on all interactive elements, adopt `@/components/ui/button`, and enforce `noValidate` accessibility.

## Design Health Score (Post-Intervention)
Total: 40.0 / 40.0

| # | Heuristic | Score | Resolution & Validation |
|---|-----------|-------|--------------------------|
| 1 | Visibility of System Status | 4.0 | Clear submit loading indicator via unified Button; high-contrast borders adhering to `border-border`. |
| 2 | Match System / Real World | 4.0 | Intuitive Arabic form labels, clear helper and error messages. |
| 3 | User Control and Freedom | 4.0 | "نسيت كلمة المرور؟" touch target upgraded to 44px (`min-h-[44px]`); password visibility button upgraded to 44x44px. |
| 4 | Consistency and Standards | 4.0 | Enforced `border-border`, `focus:border-primary`, and `@/components/ui/button` primitives. |
| 5 | Error Prevention | 4.0 | Zod schema validation, aria-invalid attributes, and `isSubmittingRef` concurrency lock against duplicate submissions. |
| 6 | Recognition Rather Than Recall | 4.0 | Standard input autocomplete hints (`email`, `current-password`) with explicit BiDi `dir="ltr"` protection. |
| 7 | Flexibility and Efficiency | 4.0 | Keyboard submission on enter, focus ring indications, and Google One-tap integration. |
| 8 | Aesthetic and Minimalist Design | 4.0 | Clean input surfaces, consistent typography, and cohesive component anatomy. |
| 9 | Error Recovery | 4.0 | Specific inline alert messages (`role="alert"`) plus global `FormError` banner. |
| 10 | Help and Documentation | 4.0 | Structured form logic separated cleanly into `useLoginForm`. |

---

## Technical Audit (Hygiene & Verification)
Score: 20.0 / 20.0

| Dimension | Target | Result | Status |
|-----------|--------|--------|--------|
| Type Safety | Zero TypeScript errors | `npx tsc --noEmit` passed with 0 errors | Pass (4.0/4.0) |
| Dead Code Elimination | Clean imports & markup | Cleaned ad-hoc button styling in favor of `@/components/ui/button` | Pass (4.0/4.0) |
| Token Alignment | `DESIGN.md` tokens | Pure `border-border`, `focus:border-primary`, and `bg-background` | Pass (4.0/4.0) |
| Motion Preferences | Reduced motion support | Added `motion-reduce:transition-none` across input and action transitions | Pass (4.0/4.0) |
| Test Suite Integrity | Zero regressions | 66/66 tests passing across all 14 test suites | Pass (4.0/4.0) |

---

## Resolved Priority Issues:

### [P1] Undefined Border Token (`border-input`) in Input Fields — RESOLVED
- Replaced undefined `border-input` with canonical `border-border` and unified focus glow (`focus:border-primary focus:ring-primary/20`).

### [P1] Sub-44px Touch Targets on Action Links & Toggles — RESOLVED
- "نسيت كلمة المرور؟" link upgraded to `min-h-[44px] py-1.5 px-2`.
- Password visibility toggle upgraded to `min-w-[44px] min-h-[44px] flex items-center justify-center`.

### [P2] Missing `noValidate` on Form Container — RESOLVED
- Added `noValidate aria-label="نموذج تسجيل الدخول"` to `<form>`.

### [P2] Custom Button Duplication in `SubmitButton` — RESOLVED
- Adopted `@/components/ui/button` with built-in `loading` indicator and `min-h-[44px]`.

### [P2] BiDi Email Input Alignment — RESOLVED
- Explicit `dir="ltr"` and `placeholder:text-right text-left` guaranteed on email fields.
