---
target: src/app/(auth)/login/_components/LoginForm.tsx
total_score: 37.2
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 3
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/app/(auth)/login/_components/LoginForm.tsx"
target_fingerprint: "sha256:auth-login-form-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/app/(auth)/login/_components/LoginForm.tsx
timestamp: 2026-11-16T09-22-00Z
slug: src-app-auth-login-components-loginform-tsx
closed: false
---

# Critique: src/app/(auth)/login/_components/LoginForm.tsx (Undefined Border Token, Sub-44px Touch Targets & Primitive Adoption)

Target: Diagnosing authentication login form in `src/app/(auth)/login/_components/LoginForm.tsx` and child input primitives

## Design Health Score (Baseline Diagnostic)
Total: 37.2 / 40.0

| # | Heuristic | Score | Findings & Observations |
|---|-----------|-------|--------------------------|
| 1 | Visibility of System Status | 3.5 | Shows loading state on submit, but input borders rely on an undefined `border-input` token. |
| 2 | Match System / Real World | 4.0 | Intuitive Arabic form labels ("البريد الإلكتروني", "كلمة المرور", "نسيت كلمة المرور؟"). |
| 3 | User Control and Freedom | 3.5 | "نسيت كلمة المرور؟" link has a sub-44px tap target (`min-h-[36px]`); password visibility toggle button is cramped (`p-1.5`). |
| 4 | Consistency and Standards | 3.2 | **Design Token Inconsistency**: Uses undefined `border-input` Tailwind class instead of `border-border`; ignores unified `@/components/ui/input` and `@/components/ui/button`. |
| 5 | Error Prevention | 4.0 | Zod client validation and `isSubmittingRef` concurrency lock prevent double-submissions. |
| 6 | Recognition Rather Than Recall | 3.8 | Standard input autocomplete hints (`email`, `current-password`). |
| 7 | Flexibility and Efficiency | 4.0 | Supports enter-key submission, tab navigation, and Google sign-in integration. |
| 8 | Aesthetic and Minimalist Design | 3.5 | Clean form layout, but button and inputs duplicate ad-hoc styling instead of adopting design system primitives. |
| 9 | Error Recovery | 4.0 | Granular field-level error messages (`role="alert"`) plus global `FormError` alert. |
| 10 | Help and Documentation | 3.8 | Clean hook separation via `useLoginForm`. |

---

## Priority Issues Identified:

### [P1] Undefined Border Token (`border-input`) in Input Fields
- `FormField.tsx` and `PasswordField.tsx` use `border-input`, but `--input` is not defined in `globals.css` (only `--border` exists).
- **Impact:** Inputs display fallback/transparent border styling in modern Tailwind v4 engines.
- **Remedy:** Switch to `border-border` and adopt the standardized `@/components/ui/input` styling.

### [P1] Sub-44px Touch Targets on Action Links & Toggles
- "نسيت كلمة المرور؟" link is styled with `min-h-[36px]` instead of `min-h-[44px]`.
- The password visibility toggle button uses `p-1.5` without a $\ge 44\times 44\text{px}$ touch target.
- **Violation:** Violates WCAG 2.5.5 / 2.5.8 touch target standards.

### [P2] Missing `noValidate` on Form Container
- Form lacks `noValidate`, risking browser-native tooltip popups clashing with styled Zod error messages.

### [P2] Custom Button Duplication in `SubmitButton`
- `SubmitButton` hand-rolls custom `<button>` styling instead of wrapping the canonical `@/components/ui/button` primitive.

### [P2] BiDi Email Input Alignment
- Email input uses `isEmail ? "text-left placeholder:text-right " : ""` which works, but wrapping in explicit `dir="ltr"` and `placeholder:text-start` ensures bidirectional stability.
