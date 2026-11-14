---
target: src/components/landing/FAQSection.tsx
total_score: 40.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/landing/FAQSection.tsx"
target_fingerprint: "sha256:faqsection-accordion-a11y-motion-and-form-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/landing/FAQSection.tsx
timestamp: 2026-11-14T12-42-00Z
slug: src-components-landing-faqsection-tsx
closed: true
---

# Critique: src/components/landing/FAQSection.tsx (Accordion ARIA Linkage, Reduced Motion & Form Live Status)

Target: Diagnosing accessibility (ARIA controls & regions), motion reduction, and form submission resilience in `FAQSection.tsx`

## Design Health Score (Post-Intervention)
Total: 40.0/40 (Adopted complete ARIA region associations, prefers-reduced-motion hooks on Framer Motion transitions, live region announcements on confirmation, and concurrency locks)

| # | Heuristic | Score | Resolution |
|---|-----------|-------|------------|
| 1 | Visibility of System Status | 4.0 | Confirmation container uses `role="status"` and `aria-live="polite"` for screen readers; button reflects loading state. |
| 2 | Match System / Real World | 4.0 | Clear separation of questions and direct contact actions matching student mental model. |
| 3 | User Control and Freedom | 4.0 | Smooth accordion navigation with full keyboard focus indicators (`focus-visible:ring-2 focus-visible:ring-primary/20`). |
| 4 | Consistency and Standards | 4.0 | Uses standard `Button` primitive with `loading={loading}` and DESIGN.md border and radius tokens. |
| 5 | Error Prevention | 4.0 | Concurrency lock (`isSubmittingRef`) guards against accidental rapid double-submissions. |
| 6 | Recognition Rather Than Recall | 4.0 | Clear question headings, prominent WhatsApp and Email direct channels. |
| 7 | Flexibility and Efficiency | 4.0 | Meets 44px+ touch target standards on all accordion triggers and form buttons. |
| 8 | Aesthetic and Minimalist Design | 4.0 | Clean card-based visual hierarchy, balanced grid layout, zero AI slop. |
| 9 | Error Recovery | 4.0 | Descriptive error text and persistent form fields if network fails. |
| 10 | Help and Documentation | 4.0 | Full `useReducedMotion()` integration prevents jarring animations for users with vestibular needs. |

---

## Technical Audit (Hygiene & Verification)
Score: 20.0 / 20.0

| Dimension | Target | Result | Status |
|-----------|--------|--------|--------|
| Type Safety | Zero TypeScript errors | `npx tsc --noEmit` passed with 0 errors | Pass (4.0/4.0) |
| ARIA Conformance | Complete trigger/region linking | `aria-controls`, `role="region"`, `aria-labelledby`, `aria-expanded` wired | Pass (4.0/4.0) |
| Motion Preferences | Reduced motion support | `useReducedMotion()` applied to both Framer Motion panel height & chevron rotation | Pass (4.0/4.0) |
| Concurrency Guard | Prevent double-submit | `isSubmittingRef` protects form submission against duplicate dispatches | Pass (4.0/4.0) |
| Test Suite Integrity | Zero regressions | 42/42 tests passing across all test suites | Pass (4.0/4.0) |

---

## Resolved Priority Issues:

### [P1] Missing ARIA Linking in Accordion (`aria-controls` & `role="region"`) — RESOLVED
- Connected triggers and panels via `id={`faq-question-${i}`}`, `aria-controls={`faq-answer-${i}`}`, `role="region"`, and `aria-labelledby={`faq-question-${i}`}`.

### [P1] Missing Motion-Reduction Compliance on Framer Motion Animations — RESOLVED
- Added `useReducedMotion()` to nullify rotational transforms and height transitions when user has reduced-motion enabled.

### [P1] Missing Live Region on Submission Confirmation Box — RESOLVED
- Added `role="status"` and `aria-live="polite"` to confirmation container.

### [P2] Submit Button Primitive Loading Adoption — RESOLVED
- Integrated `loading={loading}` directly with `<Button>`, leveraging built-in spinning loader and accessibility attributes.

### [P2] Concurrency Guard on Form Submission — RESOLVED
- Added `isSubmittingRef` lock inside `handleSafeSubmit`.
