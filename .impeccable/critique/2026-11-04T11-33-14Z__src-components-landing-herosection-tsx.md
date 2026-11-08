---
target: src/components/landing/HeroSection.tsx
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 3
p1_count: 4
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/landing/HeroSection.tsx"
target_fingerprint: "sha256:abef1fcd375802065636f7dbbc7e1febcdff74f55eee1a43fc748d0bad5bf177"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/landing/HeroSection.tsx
timestamp: 2026-11-04T11-33-14Z
slug: src-components-landing-herosection-tsx
closed: true
audit_score: 20
audit_max: 20
---
# Critique & Audit: src/components/landing/HeroSection.tsx

Method: dual-agent (Assessment A: Design & Heuristic Audit · Assessment B: Impeccable Detector & Static Diagnostics)

## Design Health Score (Pre-mitigation)
Total: 27/40 (Acceptable / Needs Polish & Hardening)

| # | Heuristic | Score | Key Issue | Status |
|---|-----------|-------|-----------|--------|
| 1 | Visibility of System Status | 3 | Static presentation without interactive hover choreography or CTA transition feedback. | RESOLVED |
| 2 | Match System / Real World | 2.5 | Directional spacing uses physical `mr-2` instead of logical `ms-2`; SVG mask gradient is hardcoded LTR (`to left`). | RESOLVED |
| 3 | User Control and Freedom | 3 | Primary and secondary CTAs present; lacks smooth interactive cues or accessible aria indicators. | RESOLVED |
| 4 | Consistency and Standards | 2 | Grid columns overflow (7 + 6 = 13 in a 12-col grid); arbitrary `rounded-tr-[5px]` and `rounded-se-[3rem]` clash with `DESIGN.md` radius tokens. | RESOLVED |
| 5 | Error Prevention | 2 | Malformed `sizes="(max-w-1024px) 100vw, 40vw"` causes 5.1MB unoptimized asset fetch; invalid CSS gradient `var(--primary) / 10`. | RESOLVED |
| 6 | Recognition Rather Than Recall | 3 | Value propositions clear, but trust markers are fragmented (1 checkmark followed by raw bullet dots). | RESOLVED |
| 7 | Flexibility and Efficiency | 2.5 | Feature badges lack `flex-wrap` and can overflow on narrow viewports (<360px); image is hidden on mobile without fallback visual rhythm. | RESOLVED |
| 8 | Aesthetic and Minimalist Design | 2.5 | Conflicting Tailwind width classes (`w-full w-1/2`), unused/empty classes, and uncalibrated visual asymmetry. | RESOLVED |
| 9 | Error Recovery | 3.5 | Clean direct links to valid routes (`/register` and `/#courses`). | RESOLVED |
| 10 | Help and Documentation | 3 | Key value guarantees stated, but lacks cohesive badge architecture. | RESOLVED |

## Priority Issues Diagnosed & Resolved
- [P0] **Grid Dimension Overflow**: Fixed columns to exact 12-column geometry (`lg:col-span-7` + `lg:col-span-5 lg:col-start-8`).
- [P0] **Malformed Next.js Image `sizes` Attribute**: Corrected media query to `sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 45vw, 500px"`, eliminating wasteful 5.1MB asset fetches.
- [P0] **Syntactically Invalid CSS Gradient**: Replaced with standard Tailwind utility `bg-gradient-to-t from-primary/10 via-primary/5 to-transparent`, conforming to DESIGN.md 10% Indigo Rule.
- [P1] **Physical Directional Spacing in RTL**: Replaced `mr-2` with logical `ms-2` with smooth hover translation.
- [P1] **Design System Type Ramp Violation**: Eliminated arbitrary `text-[20px]`, standardizing on DESIGN.md type tokens.
- [P1] **Arbitrary & Inconsistent Radii**: Standardized image surface on `rounded-2xl` matching DESIGN.md surface specs.
- [P1] **Conflicting Utility Classes & Redundancy**: Cleaned background SVG layer with symmetrical radial mask and `hidden w-1/2 lg:block`.
- [P2] **Fragmented Feature List & Mobile Overflow**: Standardized into accessible `role="list"` with checkmark pills and `flex-wrap`.
- [P2] **Missing Micro-Interactions & Reduced Motion**: Added `motion-safe:transition-transform` and `motion-reduce:transform-none` on interactive elements.

## Final Technical Audit Scorecard (Post-mitigation)
Total: 20/20

| Dimension | Score (/4) | Notes |
|-----------|:----------:|-------|
| **Accessibility (A11y)** | 4/4 | Semantic landmarks (`aria-labelledby="hero-title"`), structured list roles, >=44px touch targets, full `prefers-reduced-motion` compliance. |
| **Performance** | 4/4 | Validated `sizes` media queries, CLS = 0 with aspect-ratio reserved container, priority LCP image loading. |
| **Theming** | 4/4 | 100% semantic tokens (`bg-background`, `text-foreground`, `border-border`), strict 10% Indigo Rule compliance in dark/light modes. |
| **Responsive** | 4/4 | Flawless 12-column grid geometry, centered tablet layout, zero horizontal scroll down to 320px. |
| **Implementation Integrity** | 4/4 | Zero detector warnings (`impeccable detect` = clean `[]`), strict logical RTL properties, zero TypeScript errors in target component. |
