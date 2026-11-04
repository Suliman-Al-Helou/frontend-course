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
closed: false
---
# Critique: src/components/landing/HeroSection.tsx

Method: dual-agent (Assessment A: Design & Heuristic Audit · Assessment B: Impeccable Detector & Static Diagnostics)

## Design Health Score
Total: 27/40 (Acceptable / Needs Polish & Hardening)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Static presentation without interactive hover choreography or CTA transition feedback. |
| 2 | Match System / Real World | 2.5 | Directional spacing uses physical `mr-2` instead of logical `ms-2`; SVG mask gradient is hardcoded LTR (`to left`). |
| 3 | User Control and Freedom | 3 | Primary and secondary CTAs present; lacks smooth interactive cues or accessible aria indicators. |
| 4 | Consistency and Standards | 2 | Grid columns overflow (7 + 6 = 13 in a 12-col grid); arbitrary `rounded-tr-[5px]` and `rounded-se-[3rem]` clash with `DESIGN.md` radius tokens. |
| 5 | Error Prevention | 2 | Malformed `sizes="(max-w-1024px) 100vw, 40vw"` causes 5.1MB unoptimized asset fetch; invalid CSS gradient `var(--primary) / 10`. |
| 6 | Recognition Rather Than Recall | 3 | Value propositions clear, but trust markers are fragmented (1 checkmark followed by raw bullet dots). |
| 7 | Flexibility and Efficiency | 2.5 | Feature badges lack `flex-wrap` and can overflow on narrow viewports (<360px); image is hidden on mobile without fallback visual rhythm. |
| 8 | Aesthetic and Minimalist Design | 2.5 | Conflicting Tailwind width classes (`w-full w-1/2`), unused/empty classes, and uncalibrated visual asymmetry. |
| 9 | Error Recovery | 3.5 | Clean direct links to valid routes (`/register` and `/#courses`). |
| 10 | Help and Documentation | 3 | Key value guarantees stated, but lacks cohesive badge architecture. |

## Priority Issues
- [P0] **Grid Dimension Overflow**: `lg:grid-cols-12` contains `lg:col-span-7 lg:col-start-1` alongside `lg:col-span-6 lg:col-start-8` (starts at 8 and spans 6, exceeding column 12 to 13), causing unexpected grid blowout on desktop viewports.
- [P0] **Malformed Next.js Image `sizes` Attribute**: `sizes="(max-w-1024px) 100vw, 40vw"` is an invalid CSS media query (`max-width:` is required), causing browser parser rejection and triggering the fallback full-screen (100vw) download of a 5.1MB raw image.
- [P0] **Syntactically Invalid CSS Gradient**: `linear-gradient(to top, var(--primary) / 10, transparent)` is discarded by browsers because `--primary` is defined as a hex value (`#6d5ef0`), rendering this overlay completely inert and broken.
- [P1] **Physical Directional Spacing in RTL**: `<ArrowLeft className="mr-2" />` uses physical margin-right instead of logical inline start `ms-2`, causing visual spacing distortion in RTL.
- [P1] **Design System Type Ramp Violation**: Hardcoded arbitrary font size `text-[20px]` on bullet points directly violates `DESIGN.md` typography ramp.
- [P1] **Arbitrary & Inconsistent Radii**: Mixing physical `rounded-tr-[5px] rounded-bl-[5px]` with arbitrary `rounded-se-[3rem]` instead of using `DESIGN.md` tokens (`rounded-2xl`, `rounded-xl`).
- [P1] **Conflicting Utility Classes & Redundancy**: Decorative background uses conflicting `w-full w-1/2 lg:block` classes simultaneously, causing ambiguous rendering and dirty DOM.
- [P2] **Fragmented Feature List & Mobile Overflow**: Benefit pills have single `<Check />` icon for the first item and raw bullets for the rest, lacking `flex-wrap` on small mobile screens.
- [P2] **Missing Micro-Interactions & Reduced Motion**: CTAs and hero elements lack subtle entry motion and respect for `prefers-reduced-motion`.
