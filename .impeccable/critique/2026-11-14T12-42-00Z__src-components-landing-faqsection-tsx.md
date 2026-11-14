---
target: src/components/landing/FAQSection.tsx
total_score: 33.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 3
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/landing/FAQSection.tsx"
target_fingerprint: "sha256:faqsection-accordion-a11y-motion-and-form-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/landing/FAQSection.tsx
timestamp: 2026-11-14T12-42-00Z
slug: src-components-landing-faqsection-tsx
closed: false
---

# Critique: src/components/landing/FAQSection.tsx (Accordion ARIA Linkage, Reduced Motion & Form Live Status)

Target: Diagnosing accessibility (ARIA controls & regions), motion reduction, and form submission resilience in `FAQSection.tsx`

## Design Health Score (Pre-Intervention)
Total: 33.0/40

| # | Heuristic | Score | Issues Observed |
|---|-----------|-------|-----------------|
| 1 | Visibility of System Status | 3.0 | Success feedback container lacks `role="status"` and `aria-live="polite"` for screen readers. |
| 2 | Match System / Real World | 3.5 | Clean two-column layout separating FAQs and direct contact forms. |
| 3 | User Control and Freedom | 3.0 | Accordion items toggle accurately, but lack ARIA attributes (`aria-controls`, `role="region"`, `aria-labelledby`). |
| 4 | Consistency and Standards | 3.5 | Adopts `DESIGN.md` tokens, but submit button doesn't utilize standard `loading` prop of `Button`. |
| 5 | Error Prevention | 3.0 | Form submission relies purely on React state for loading without concurrency ref guard against double-clicks. |
| 6 | Recognition Rather Than Recall | 3.5 | Clear question titles and contact options (WhatsApp & Email). |
| 7 | Flexibility and Efficiency | 3.5 | 44px+ touch targets on accordion triggers and contact action buttons. |
| 8 | Aesthetic and Minimalist Design | 3.5 | Clean card-based surfaces with subtle transitions. |
| 9 | Error Recovery | 3.5 | In-line error message shown if form submission fails. |
| 10 | Help and Documentation | 3.0 | Missing `prefers-reduced-motion` compliance on Framer Motion accordion height and chevron rotation. |

---

## Priority Issues Identified:

### [P1] Missing ARIA Linking in Accordion (`aria-controls` & `role="region"`)
- Buttons possess `aria-expanded={isOpen}` but lack `aria-controls={`faq-answer-${i}`}` and `id={`faq-question-${i}`}`.
- Expandable panels lack `id={`faq-answer-${i}`}`, `role="region"`, and `aria-labelledby={`faq-question-${i}`}`.

### [P1] Missing Motion-Reduction Compliance on Framer Motion Animations
- Accordion expansion (`height: auto`, `opacity`) and chevron rotation do not respect `useReducedMotion()`.

### [P1] Missing Live Region on Submission Confirmation Box
- When `sent === true`, message is displayed visually but not announced to assistive technologies (`role="status"` / `aria-live="polite"`).

### [P2] Submit Button Primitive Loading Adoption
- Submit button manually renders text and conditional disable instead of delegating to `<Button loading={loading}>`.

### [P2] Concurrency Guard on Form Submission
- Double-clicks before React re-render can cause multiple network dispatches; wrap with `isSubmittingRef`.
