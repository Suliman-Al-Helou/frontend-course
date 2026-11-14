# Impeccable Critique: Public Landing Page & Discovery Surface (`src/components/landing/`)

- **Timestamp**: 2026-11-14T14:12:00Z
- **Target**: `src/components/landing/` (`Navbar.tsx`, `NavbarClient.tsx`, `HeroSection.tsx`, `CoursesSection.tsx`, `FeaturesSection.tsx`, `TestimonialsSection.tsx`, `CTASection.tsx`, `FAQSection.tsx`, `Footer.tsx`)
- **Surface Mode**: Persuade (Main Public Gateway & Student Conversion Surface)
- **Closed**: false

---

## 1. Nielsen Heuristics Evaluation (Initial Score: 34.5 / 40)

| Heuristic | Score (/4) | Findings & Observations |
| :--- | :---: | :--- |
| **1. Visibility of system status** | 3.5 | Course cards skeleton states, active FAQ accordion indicator, contact form submission loading state. |
| **2. Match between system & real world** | 3.5 | Authentic Arabic technical terminology with developer sanctuary atmosphere. |
| **3. User control and freedom** | 3.5 | Quick smooth scrolling anchors, responsive mobile menu drawer with explicit dismiss triggers. |
| **4. Consistency and standards** | 3.0 | Mixed physical classes (`left-4`, `mr-2`) instead of RTL logical box properties (`end-4`, `ms-2`), and hardcoded color classes in testimonials. |
| **5. Error prevention** | 3.5 | Contact form in FAQ section enforces double-submit prevention lock (`isSubmittingRef`). |
| **6. Recognition rather than recall** | 3.5 | Clear visual pillars in methodology, prominent star ratings and student feedback. |
| **7. Flexibility and efficiency of use** | 3.5 | Dual CTAs (primary registration + secondary catalog browse) tailored for new and returning visitors. |
| **8. Aesthetic and minimalist design** | 3.5 | Clean dark-mode IDE atmosphere; 10% Indigo rule respected with focused interactive accents. |
| **9. Help recognize & recover from errors** | 3.5 | Informative feedback and error states in contact dialogs. |
| **10. Help and documentation** | 3.5 | Thorough FAQ accordion covering certificates, course progression, refund guarantees, and support channels. |

---

## 2. Issues Breakdown & Priority Classification

### 🚨 [P0] Critical Issues (Must Resolve Before Ship)
- None. (Landing components and TanStack Query integration are structurally sound).

### ⚠️ [P1] Serious Issues (RTL Logical Direction & Token Alignment)
1. **Physical Positioning in RTL (`TestimonialsSection.tsx` & `CTASection.tsx`)**:
   - `TestimonialsSection.tsx` uses `top-4 left-4` for the quote glyph instead of logical `top-4 end-4`.
   - `CTASection.tsx` uses `mr-2` on the arrow icon instead of `ms-2` (which inverts start/end spacing in RTL), and `top-0 left-0` / `bottom-0 right-0` instead of logical coordinates.
2. **Hardcoded Ad-hoc Colors (`TestimonialsSection.tsx` line 59)**:
   - Rating stars use `text-yellow-400 fill-yellow-400` overriding the design token `text-warning fill-warning`.

### 💡 [P2] Polish & Refinement Issues
1. **Motion-Reduce Compliance**:
   - Ensure all `motion.div` animations across `FeaturesSection`, `TestimonialsSection`, and `CTASection` respect `prefers-reduced-motion`.
2. **Touch Targets Consistency**:
   - Verify `min-h-[44px]` on all footer buttons, social links, and navigation items.

---

## 3. Required Life-Cycle Progression
- [ ] **Step 1**: Critique documented & user approval obtained (Current Step)
- [ ] **Step 2**: Polish (`/impeccable polish`): Enforce logical RTL properties (`end-4`, `ms-2`, `start-0`), replace hardcoded yellow with `text-warning`, adhere to `DESIGN.md` tokens
- [ ] **Step 3**: Harden (`/impeccable harden`): Touch targets >= 44px, reduced-motion guards, accessible social link labels
- [ ] **Step 4**: Hygiene & Audit: Dead code cleanup, final audit score card (20/20), `closed: true`
