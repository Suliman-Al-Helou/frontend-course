# Impeccable Critique: Public Courses Catalog & Course Detail (`src/features/courses/components/`)

- **Timestamp**: 2026-11-14T14:08:00Z
- **Target**: `src/features/courses/components/` (`CoursesCatalogView.tsx`, `CoursesHero.tsx`, `CourseCard.tsx`, `CourseLevelFilters.tsx`, `CourseDetailView.tsx`, `EnrollCard.tsx`, `CourseHero.tsx`, `CourseCurriculum.tsx`)
- **Surface Mode**: Persuade & Read (Visitor Public Course Discovery & Detail)
- **Closed**: false

---

## 1. Nielsen Heuristics Evaluation (Initial Score: 35.0 / 40)

| Heuristic | Score (/4) | Findings & Observations |
| :--- | :---: | :--- |
| **1. Visibility of system status** | 3.5 | Card skeletons, live available count, dynamic search and level filter updates. |
| **2. Match between system & real world** | 3.5 | Clean Arabic course levels ("الكل", "مبتدئ", "متوسط", "متقدم") and pricing indicators. Arabic pluralization on counts needs fine-tuning. |
| **3. User control and freedom** | 3.5 | Single-click reset on empty filter search results; return to catalog link on detail page. |
| **4. Consistency and standards** | 3.5 | Card design aligns with `DESIGN.md` tokens (`bg-card`, `border-border`, `primary`). |
| **5. Error prevention** | 4.0 | Concurrency lock (`isSubmittingRef`) on `EnrollCard.tsx` prevents duplicate enrollment submissions; 409 conflict handled gracefully. |
| **6. Recognition rather than recall** | 3.5 | Level badges, ratings, cover previews, and enrollment badges provide immediate visual recognition. |
| **7. Flexibility and efficiency of use** | 3.5 | Instant filter without page reload; direct deep-link into next lesson for enrolled students. |
| **8. Aesthetic and minimalist design** | 3.5 | Visual hierarchy is clean; card titles and metrics maintain structured balance. |
| **9. Help recognize & recover from errors** | 3.5 | Clear network error card with retry button on catalog fetch failure. |
| **10. Help and documentation** | 3.5 | Friendly empty state with actionable suggestions when searches return 0 matches. |

---

## 2. Issues Breakdown & Priority Classification

### 🚨 [P0] Critical Issues (Must Resolve Before Ship)
- None. (Data layer and concurrency locks are stable).

### ⚠️ [P1] Serious Issues (RTL Direction & Grammar Precision)
1. **RTL Directional Navigation Arrow Inversion (`CourseHero.tsx` line 36)**:
   - "العودة للكورسات" link uses `<ArrowLeft />` without RTL rotation, visually pointing in the wrong direction for Arabic back navigation (should point right / backward in RTL flow).
2. **Arabic Dual & Plural Grammar in Metrics (`CourseCard.tsx` & `CourseHero.tsx`)**:
   - Hardcoded metrics ("ساعة", "طالب", "درس") ignore Arabic dual and plural grammar (`ساعتان` / `ساعات`, `طالبان` / `طلاب`, `درسان` / `دروس`).
3. **Curriculum Accordion Section Pluralization (`CourseCurriculum.tsx` line 40)**:
   - `{section.lessons.length} دروس` displays `1 دروس` or `2 دروس`. Needs accurate pluralization.

### 💡 [P2] Polish & Refinement Issues
1. **Reduced Motion Enhancements**:
   - Ensure all `motion.article` cards strictly respect `useReducedMotion()`.
2. **Touch Targets Consistency**:
   - Ensure interactive links and reset buttons maintain standard `min-h-[44px]` touch areas.

---

## 3. Required Life-Cycle Progression
- [ ] **Step 1**: Critique documented & user approval obtained (Current Step)
- [ ] **Step 2**: Polish (`/impeccable polish`): Resolve RTL arrow, implement Arabic pluralization across cards and hero, enforce `DESIGN.md` tokens
- [ ] **Step 3**: Harden (`/impeccable harden`): Touch targets >= 44px, reduced-motion guards, a11y focus rings
- [ ] **Step 4**: Hygiene & Audit: Dead code cleanup, final audit score card (20/20), `closed: true`
