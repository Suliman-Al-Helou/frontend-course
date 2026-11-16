---
target: src/components/landing/CTASection.tsx
total_score: 37.2
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 3
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/landing/CTASection.tsx"
target_fingerprint: "sha256:landing-cta-section-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/landing/CTASection.tsx
timestamp: 2026-11-16T09-02-00Z
slug: src-components-landing-ctasection-tsx
closed: false
---

# Critique: src/components/landing/CTASection.tsx (Brand Palette Drift, Un-tokenized Gradients & Dead Imports)

Target: Diagnosing landing call-to-action banner in `src/components/landing/CTASection.tsx`

## Design Health Score (Baseline Diagnostic)
Total: 37.2 / 40.0

| # | Heuristic | Score | Findings & Observations |
|---|-----------|-------|--------------------------|
| 1 | Visibility of System Status | 4.0 | High-contrast call to action; clear primary and secondary conversion goals. |
| 2 | Match System / Real World | 4.0 | Compelling Arabic copy ("لا تنتظر الوقت المثالي، الوقت المثالي هو الآن") addressing student hesitation. |
| 3 | User Control and Freedom | 4.0 | Direct paths to registration or catalog exploration. |
| 4 | Consistency and Standards | 2.8 | **Severe Brand Drift**: Uses arbitrary raw blue gradients (`from-blue-deep via-blue-mid to-blue-light`) and hardcoded `text-white` instead of the canonical Electric Indigo (`text-primary`) and theme token canvas (`bg-background` / `bg-card`). |
| 5 | Error Prevention | 4.0 | Resilient client links with keyboard and touch accessibility. |
| 6 | Recognition Rather Than Recall | 3.6 | Highlight text uses disconnected `text-blue-light` rather than platform `text-primary`. |
| 7 | Flexibility and Efficiency | 4.0 | Accessible dual CTA buttons with full mobile-stacking support. |
| 8 | Aesthetic and Minimalist Design | 3.0 | Unframed full-bleed blue banner clashes with adjacent landing sections; dead empty comment and dead imports. |
| 9 | Error Recovery | 4.0 | Static routing; zero runtime risk. |
| 10 | Help and Documentation | 3.8 | Clean component structure with reduced-motion support. |

---

## Priority Issues Identified:

### [P1] Chromatic Brand Drift & Violation of 10% Indigo Rule
- `CTASection` abandons the design system's Electric Indigo identity (`#6d5ef0`) and card elevation in favor of a full-bleed raw blue gradient (`from-blue-deep via-blue-mid to-blue-light`).
- Hardcoded `text-white` ignores light/dark theme tokens.
- **Remedy:** Re-anchor to the design system: a framed, elevated card surface (`bg-card border-primary/20`) with subtle Indigo ambient glow (`bg-primary/10 blur-3xl`), `text-foreground`, and `text-primary` for the accent phrase.

### [P1] Dead Imports & Relative Path Deviation
- Line 4 imports unused `Link` from `next/link`.
- Line 7 uses relative import `../ui/button` instead of alias `@/components/ui/button`.
- Line 42 contains an empty dead comment `{/* Badge */}`.

### [P2] Section Accessibility & Landmark Heading
- Missing `aria-labelledby="cta-section-title"` on `<section>`.
- Spacing should align with landing standard (`py-20 md:py-24`).

### [P2] Inconsistent Button Variant Theming on Dark Blue
- The secondary button uses `variant="outline"` which inherits `bg-background`, creating an opaque dark rectangle on top of the blue gradient. Bringing the background into standard `bg-card` resolves this naturally.

### [P2] Reduced Motion Consistency
- `framer-motion` properties can be tightened to ensure clean layout stability under `shouldReduceMotion`.
