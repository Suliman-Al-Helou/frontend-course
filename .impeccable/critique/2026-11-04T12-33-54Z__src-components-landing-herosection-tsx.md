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
closed: false
---
# Critique: src/components/landing/HeroSection.tsx (Governance Cycle 2)

Method: dual-agent (Assessment A: Design & Heuristic Audit · Assessment B: Impeccable Detector & Static Diagnostics) + Grill-with-Docs Specifications

## Design Health Score
Total: 25/40 (Needs Polish, Architecture Alignment & Hardening)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2.5 | Static CTAs without interactive micro-transitions or focus rings; background layers lack dynamic depth. |
| 2 | Match System / Real World | 2.5 | Directional spacing uses physical `mr-2` instead of logical `ms-2`; hardcoded LTR mask gradient (`to left`). |
| 3 | User Control and Freedom | 3 | CTAs exist but lack accessible landmark relationships (`aria-labelledby`). |
| 4 | Consistency and Standards | 2 | Grid columns overflow (7 + 6 = 13 in a 12-col grid); arbitrary `rounded-tr-[5px]` and `rounded-se-[3rem]` clash with `DESIGN.md`. |
| 5 | Error Prevention | 2 | Malformed `sizes="(max-w-1024px) 100vw, 40vw"` causes 5.1MB unoptimized asset fetch; invalid CSS gradient `var(--primary) / 10`. |
| 6 | Recognition Rather Than Recall | 2.5 | Benefit markers are fragmented (1 checkmark followed by raw bullet dots with empty classes). |
| 7 | Flexibility and Efficiency | 2 | Grid background is hidden/broken on mobile; desktop lacks dual-zone text/image contrast lighting. |
| 8 | Aesthetic and Minimalist Design | 2.5 | Conflicting Tailwind width classes (`w-full w-1/2`), broken gradient layer, missing center-outward radial fade. |
| 9 | Error Recovery | 3 | Direct routing to `/register` and `/#courses`. |
| 10 | Help and Documentation | 3 | Value propositions clear, but trust markers lack semantic structure (`role="list"`). |

## Priority Issues Diagnosed

### [P0] Critical
- [P0] **Mobile Background Grid Deficiency**: Background grid is partially masked and visually broken on mobile devices, failing the requirement of maintaining an ambient developer grid across mobile viewports.
- [P0] **Grid Dimension Overflow**: `lg:grid-cols-12` contains `lg:col-span-7 lg:col-start-1` alongside `lg:col-span-6 lg:col-start-8` (starts at 8 and spans 6, exceeding column 12 to 13), creating layout instability on desktop.
- [P0] **Malformed Next.js Image `sizes` Attribute**: `sizes="(max-w-1024px) 100vw, 40vw"` is an invalid CSS media query, causing browser rejection and triggering fallback 100vw downloads of a 5.1MB raw image.
- [P0] **Syntactically Invalid CSS Gradient**: `linear-gradient(to top, var(--primary) / 10, transparent)` is discarded by browsers because `--primary` is hex (`#6d5ef0`), rendering the overlay inert.

### [P1] Major
- [P1] **Missing Dual-Zone Desktop Grid Lighting**: Large screens lack calibrated tonal distinction (lighter/elevated behind text, darker/subdued behind image) and center-outward radial fade.
- [P1] **Physical Directional Spacing in RTL**: `<ArrowLeft className="mr-2" />` uses physical margin-right instead of logical `ms-2`, distorting spacing in RTL.
- [P1] **Design System Type Ramp Violation**: Hardcoded arbitrary font size `text-[20px]` on bullet points directly violates `DESIGN.md` typography ramp.
- [P1] **Arbitrary & Inconsistent Radii**: Mixing physical `rounded-tr-[5px] rounded-bl-[5px]` with arbitrary `rounded-se-[3rem]` instead of using `DESIGN.md` tokens (`rounded-2xl`).

### [P2] Minor / Polish
- [P2] **Fragmented Feature List & Mobile Overflow**: Benefit pills have single `<Check />` icon for the first item and raw bullets for the rest, lacking `flex-wrap` on small mobile screens.
- [P2] **Missing Micro-Interactions & Reduced Motion**: CTAs lack smooth hover translation and respect for `prefers-reduced-motion`.
