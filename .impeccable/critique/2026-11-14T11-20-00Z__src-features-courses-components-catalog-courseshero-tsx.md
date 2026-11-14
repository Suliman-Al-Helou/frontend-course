---
target: src/features/courses/components/catalog/CoursesHero.tsx
total_score: 34.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 1
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/courses/components/catalog/CoursesHero.tsx"
target_fingerprint: "sha256:courses-hero-search-input-adoption"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/courses/components/catalog/CoursesHero.tsx
timestamp: 2026-11-14T11-20-00Z
slug: src-features-courses-components-catalog-courseshero-tsx
closed: false
---

# Critique: src/features/courses/components/catalog/CoursesHero.tsx (Ad-hoc Search Bar Layout & Unused Icon Imports)

Target: Refactoring course catalog search hero in `CoursesHero.tsx` to adopt `@/components/ui/search-input`

## Design Health Score (Pre-Intervention)
Total: 34.0/40

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Search bar has clear placeholder and reset button. |
| 2 | Match System / Real World | 4.0 | Clear Arabic copy ("ابحث عن كورس أو مهارة"). |
| 3 | User Control and Freedom | 3.5 | Clear button present, but implemented as an ad-hoc local button. |
| 4 | Consistency and Standards | 3.0 | Uses manual wrapper and absolute icons instead of standard `SearchInput` primitive. |
| 5 | Error Prevention | 4.0 | Controlled search input with parent callback. |
| 6 | Recognition Rather Than Recall | 3.5 | Standard search icon and clear affordances. |
| 7 | Flexibility and Efficiency | 3.5 | Fluid centered hero search input. |
| 8 | Aesthetic and Minimalist Design | 3.5 | Clean hero presentation, but 25 lines of repetitive markup clutter component. |
| 9 | Error Recovery | 4.0 | Instant clear callback resets catalog filters. |
| 10 | Help and Documentation | 3.5 | Props interface cleanly typed. |

---

## Identified Priority Issues:

### [P1] Repetitive Ad-hoc Search DOM Implementation
- **Problem**: Lines 32-55 construct a custom search input with manual `div relative`, absolute `Search` icon, raw `<input>`, and separate `<button>`.
- **Remedy**: Replace with `<SearchInput>` primitive from `@/components/ui/search-input`, setting `onClear={() => onSearch("")}` and custom shadow/elevation classes.

### [P2] Dead/Unused Imports from `lucide-react`
- **Problem**: `BookOpen` is imported but never referenced; `Search` and `X` become redundant once `SearchInput` is adopted.
- **Remedy**: Remove unused imports from `lucide-react`.

### [P2] Focus Glow Alignment with System Tokens
- **Problem**: Raw input uses `focus:ring-primary` which lacks the refined 20% opacity indigo glow defined in `DESIGN.md`.
- **Remedy**: Inherit the unified `focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20` from `SearchInput`.
