---
target: src/components/landing/TestimonialsSection.tsx
total_score: 37.6
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 3
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/landing/TestimonialsSection.tsx"
target_fingerprint: "sha256:landing-testimonials-section-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/landing/TestimonialsSection.tsx
timestamp: 2026-11-16T09-04-00Z
slug: src-components-landing-testimonialssection-tsx
closed: false
---

# Critique: src/components/landing/TestimonialsSection.tsx (Commented-out Code, Missing Avatars & Header Reduced Motion)

Target: Diagnosing student social proof section in `src/components/landing/TestimonialsSection.tsx`

## Design Health Score (Baseline Diagnostic)
Total: 37.6 / 40.0

| # | Heuristic | Score | Findings & Observations |
|---|-----------|-------|--------------------------|
| 1 | Visibility of System Status | 4.0 | Social proof with 5-star ratings and student career outcomes. |
| 2 | Match System / Real World | 4.0 | Authentic localized testimonials matching student aspirations. |
| 3 | User Control and Freedom | 4.0 | Clear scannable cards. |
| 4 | Consistency and Standards | 3.2 | Commented-out `<Image>` code; dead `Image` import from `next/image`; header animation omits `useReducedMotion`. |
| 5 | Error Prevention | 4.0 | Safe rendering of rating stars and static reviews. |
| 6 | Recognition Rather Than Recall | 3.2 | Avatars were commented out, leaving text-heavy blocks without visual personification. |
| 7 | Flexibility and Efficiency | 4.0 | 3-column desktop grid collapsing to single-column on mobile. |
| 8 | Aesthetic and Minimalist Design | 3.4 | Uneven card heights due to varying quote lengths; typography and section padding desynced from adjacent sections. |
| 9 | Error Recovery | 4.0 | Static data; zero crash risks. |
| 10 | Help and Documentation | 3.8 | Clean React component structure. |

---

## Priority Issues Identified:

### [P1] Commented-out Code Clutter & Dead `next/image` Import
- Lines 11, 20, 27, 34, and 72-77 contain commented-out avatar blocks and unsplash URLs.
- Line 6 imports unused `Image` from `next/image`.
- **Remedy:** Clean dead code and adopt the unified `@/components/ui/avatar` primitive, generating accessible Arabic initials automatically.

### [P1] Missing `useReducedMotion` Guard on Section Header
- Line 93 animates header `<motion.div initial={{ opacity: 0, y: 30 }} ...>` unconditionally, ignoring user motion preferences even though child cards inspect `useReducedMotion`.

### [P2] Uneven Card Heights on Varied Quote Lengths
- Review cards have varying body copy lengths, causing uneven bottom alignments.
- Applying `flex flex-col justify-between` and `flex-1` on body text aligns all author signatures along the same baseline.

### [P2] Section Accessibility & Heading Landmark
- Missing `aria-labelledby="testimonials-title"` and `id="testimonials"`.
- Typography and padding scale should align with `FeaturesSection` and `CoursesSection` (`py-20 md:py-24`).

### [P2] Subtle Decorative Quote Watermark
- Current `Quote` icon is positioned with raw opacity; tuning to `size-7 text-primary/15` provides an unobtrusive editorial accent.
