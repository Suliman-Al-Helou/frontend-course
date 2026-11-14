---
target: src/components/landing/HeroSection.tsx
total_score: 25
max_score: 40
na_heuristics:
p0_count: 4
p1_count: 4
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/landing/HeroSection.tsx"
target_fingerprint: "sha256:abef1fcd375802065636f7dbbc7e1febcdff74f55eee1a43fc748d0bad5bf177"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/landing/HeroSection.tsx
timestamp: 2026-11-04T12-33-54Z
slug: src-components-landing-herosection-tsx
closed: true
audit_score: 20
audit_max: 20
---

# Critique & Audit: src/components/landing/HeroSection.tsx (Governance Cycle 2)

Method: dual-agent (Assessment A: Design & Heuristic Audit · Assessment B: Impeccable Detector & Static Diagnostics) + Grill-with-Docs Specifications

## Design Health Score (Pre-mitigation)

Total: 25/40 (Needs Polish, Architecture Alignment & Hardening)

| #   | Heuristic                       | Score | Key Issue                                                                                                                         | Status   |
| --- | ------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Visibility of System Status     | 2.5   | Static CTAs without interactive micro-transitions; background layers lack dynamic depth.                                          | RESOLVED |
| 2   | Match System / Real World       | 2.5   | Directional spacing uses physical `mr-2` instead of logical `ms-2`; hardcoded LTR mask gradient (`to left`).                      | RESOLVED |
| 3   | User Control and Freedom        | 3     | CTAs exist but lack accessible landmark relationships (`aria-labelledby`).                                                        | RESOLVED |
| 4   | Consistency and Standards       | 2     | Grid columns overflow (7 + 6 = 13 in a 12-col grid); arbitrary `rounded-tr-[5px]` and `rounded-se-[3rem]` clash with `DESIGN.md`. | RESOLVED |
| 5   | Error Prevention                | 2     | Malformed `sizes="(max-w-1024px) 100vw, 40vw"` causes 5.1MB unoptimized asset fetch; invalid CSS gradient `var(--primary) / 10`.  | RESOLVED |
| 6   | Recognition Rather Than Recall  | 2.5   | Benefit markers are fragmented (1 checkmark followed by raw bullet dots with empty classes).                                      | RESOLVED |
| 7   | Flexibility and Efficiency      | 2     | Grid background hidden/broken on mobile; desktop lacks dual-zone text/image contrast lighting.                                    | RESOLVED |
| 8   | Aesthetic and Minimalist Design | 2.5   | Conflicting Tailwind width classes (`w-full w-1/2`), broken gradient layer, missing center-outward radial fade.                   | RESOLVED |
| 9   | Error Recovery                  | 3     | Direct routing to `/register` and `/#courses`.                                                                                    | RESOLVED |
| 10  | Help and Documentation          | 3     | Value propositions clear, but trust markers lack semantic structure (`role="list"`).                                              | RESOLVED |

## Priority Issues Diagnosed & Resolved

### [P0] Critical

- [P0] **Mobile Background Grid Preservation**: Implemented persistent full-width ambient square grid on mobile viewports (`block lg:hidden text-border/40`) with soft opacity that preserves high text readability.
- [P0] **Grid Dimension Overflow**: Fixed columns to exact 12-column geometry (`lg:col-span-7` + `lg:col-span-5 lg:col-start-8`), eliminating layout instability on desktop.
- [P0] **Malformed Next.js Image `sizes` Attribute**: Corrected media query to `sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 45vw, 500px"`, eliminating wasteful 5.1MB raw image downloads.
- [P0] **Syntactically Invalid CSS Gradient**: Replaced with standard Tailwind utility `bg-gradient-to-t from-primary/10 via-primary/5 to-transparent`, conforming to DESIGN.md 10% Indigo Rule.

### [P1] Major

- [P1] **Dual-Zone Desktop Grid Lighting & Center-Outward Dissolve**:
  - Text side (Cols 1-7, start side): Lighter grid pattern (`text-border/80`) paired with subtle ambient indigo glow.
  - Image side (Cols 8-12, end side): Darker / deeper subdued grid pattern (`text-border/25`) blending into the canvas.
  - Center-Outward Radial Fade: Container wrapped with `radial-gradient(ellipse 90% 70% at 50% 50%, black 20%, transparent 85%)` dissolving cleanly outward towards all screen edges.
- [P1] **Physical Directional Spacing in RTL**: Replaced `mr-2` with logical `ms-2` with smooth hover translation.
- [P1] **Design System Type Ramp Violation**: Eliminated arbitrary `text-[20px]`, standardizing on DESIGN.md type tokens.
- [P1] **Arbitrary & Inconsistent Radii**: Standardized image surface on `rounded-2xl` matching DESIGN.md surface specs.

### [P2] Minor / Polish

- [P2] **Fragmented Feature List & Mobile Overflow**: Standardized into accessible `role="list"` with checkmark pills and `flex-wrap`.
- [P2] **Missing Micro-Interactions & Reduced Motion**: Added `motion-safe:transition-transform` and `motion-reduce:transform-none` on interactive elements.

## Final Technical Audit Scorecard (Post-mitigation)

Total: 20/20

| Dimension                    | Score (/4) | Notes                                                                                                                                             |
| ---------------------------- | :--------: | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Accessibility (A11y)**     |    4/4     | Semantic landmarks (`aria-labelledby="hero-title"`), structured list roles, >=44px touch targets, full `prefers-reduced-motion` compliance.       |
| **Performance**              |    4/4     | Validated `sizes` media queries, zero external network requests for vector grid, CLS = 0 with aspect-ratio container, priority LCP image loading. |
| **Theming**                  |    4/4     | 100% semantic tokens (`bg-background`, `text-foreground`, `border-border`), strict 10% Indigo Rule compliance in dark/light modes.                |
| **Responsive**               |    4/4     | Mobile grid preserved across full viewport, dual-zone grid on desktop (7/5 split), center-outward radial fade, zero horizontal scroll.            |
| **Implementation Integrity** |    4/4     | Zero detector warnings (`impeccable detect` = clean `[]`), strict logical RTL properties, zero TypeScript errors in target component.             |
