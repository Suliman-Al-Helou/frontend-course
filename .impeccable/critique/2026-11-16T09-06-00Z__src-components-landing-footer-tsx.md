---
target: src/components/landing/Footer.tsx
total_score: 37.1
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 3
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/landing/Footer.tsx"
target_fingerprint: "sha256:landing-footer-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/landing/Footer.tsx
timestamp: 2026-11-16T09-06-00Z
slug: src-components-landing-footer-tsx
closed: false
---

# Critique: src/components/landing/Footer.tsx (Touch Targets, Broken Anchor `#contact` & Link Parity)

Target: Diagnosing landing page footer in `src/components/landing/Footer.tsx`

## Design Health Score (Baseline Diagnostic)
Total: 37.1 / 40.0

| # | Heuristic | Score | Findings & Observations |
|---|-----------|-------|--------------------------|
| 1 | Visibility of System Status | 3.5 | Dynamic course fetching via TanStack Query; skeleton loading pulses without motion-reduce protection. |
| 2 | Match System / Real World | 4.0 | Clear Arabic labels, intuitive 4-column IA structure. |
| 3 | User Control and Freedom | 3.2 | **Broken Anchor Link**: `/#contact` fails to navigate to the real dedicated `/contact` page. |
| 4 | Consistency and Standards | 3.4 | Social buttons use custom `size-9` (36px) violating WCAG 2.5.5 / 2.5.8 touch target standards ($\ge 44\text{px}$). |
| 5 | Error Prevention | 4.0 | Safe slicing of top 5 courses; fallback message when no courses exist. |
| 6 | Recognition Rather Than Recall | 3.8 | Quick access to top published courses and platform areas. |
| 7 | Flexibility and Efficiency | 4.0 | Global navigation from any landing page. |
| 8 | Aesthetic and Minimalist Design | 3.6 | Clean card surface (`bg-card`); social icons need proportional 44px icon buttons. |
| 9 | Error Recovery | 4.0 | Resilient routing; query error handling fallback. |
| 10 | Help and Documentation | 3.6 | Support column only contains one link; lacks FAQ anchor. |

---

## Priority Issues Identified:

### [P1] Sub-44px Touch Targets on Social Action Buttons
- Social media icon buttons use `size="sm"` and `className="size-9 p-0"` (36x36px).
- **Violation:** Violates WCAG 2.5.5 / 2.5.8 touch target standard ($\ge 44\times 44\text{px}$).
- **Remedy:** Upgrade to `size="icon"` (44x44px min target).

### [P1] Broken Anchor Link in Support Column (`/#contact`)
- Support links point to `/#contact`, which does not exist as an element on the home page.
- **Remedy:** Update link to `/contact` (the official dedicated contact page) and add `/#faq` ("الأسئلة الشائعة") for comprehensive support navigation.

### [P2] Missing Reduced Motion Protection on Query Skeleton
- `CoursesColumn` skeleton items use `animate-pulse` without `motion-reduce:animate-none`.

### [P2] Sparse Support Column Architecture
- Support column only contains a single link. Expanding with `/contact`, `/#faq`, and WhatsApp assistance enriches footer usefulness.

### [P2] Hardcoded Brand Subtitle Spacing
- Refine brand logo alignment, typography tracking, and footer copyright layout.
