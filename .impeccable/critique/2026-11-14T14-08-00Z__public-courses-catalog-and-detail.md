# Impeccable Critique: Public Courses Catalog & Course Detail (`src/features/courses/components/`)

- **Timestamp**: 2026-11-14T14:08:00Z
- **Target**: `src/features/courses/components/` (`CoursesCatalogView.tsx`, `CoursesHero.tsx`, `CourseCard.tsx`, `CourseLevelFilters.tsx`, `CourseDetailView.tsx`, `EnrollCard.tsx`, `CourseHero.tsx`, `CourseCurriculum.tsx`)
- **Surface Mode**: Persuade & Read (Visitor Public Course Discovery & Detail)
- **Closed**: true

---

## 1. Nielsen Heuristics Evaluation (Initial Score: 35.0 / 40 -> Post-Polish: 39.5 / 40)

| Heuristic | Initial | Post-Polish | Findings & Resolution |
| :--- | :---: | :---: | :--- |
| **1. Visibility of system status** | 3.5 | 4.0 | Real-time TanStack Query hydration, live available count, responsive level filters. |
| **2. Match between system & real world** | 3.5 | 4.0 | Culturally native Arabic dual and plural grammar applied to course hours (`ساعتان`, `ساعات`), students (`طالبان`, `طلاب`), and section lessons (`درسان`, `دروس`). |
| **3. User control and freedom** | 3.5 | 4.0 | Natural RTL back navigation with `<ArrowRight />` arrow pointing backward in Arabic reading flow. |
| **4. Consistency and standards** | 3.5 | 4.0 | Full compliance with `DESIGN.md` tokens (`bg-card`, `border-border`, `primary`). |
| **5. Error prevention** | 4.0 | 4.0 | Concurrency lock (`isSubmittingRef`) on `EnrollCard.tsx` prevents duplicate submissions; 409 conflict handled gracefully. |
| **6. Recognition rather than recall** | 3.5 | 4.0 | Level badges, ratings, cover previews, and enrollment badges provide immediate visual recognition. |
| **7. Flexibility and efficiency of use** | 3.5 | 4.0 | Real-time debounced search filter with single-click reset on empty states; deep-links directly into active lessons for enrolled students. |
| **8. Aesthetic and minimalist design** | 3.5 | 4.0 | Balanced typography, IDE-aesthetic card surfaces, minimalist surface rule strictly preserved. |
| **9. Help recognize & recover from errors** | 3.5 | 4.0 | Network error alert with retry button on catalog query failure. |
| **10. Help and documentation** | 3.5 | 3.5 | Clear informational subtitles and friendly empty-state guidance. |

---

## 2. Issues Resolution Verification

### [P1] Serious Issues (Resolved)
- ✅ **RTL Directional Navigation Arrow Inversion (`CourseHero.tsx`)**: Replaced inverted arrow with `ArrowRight rtl:rotate-0` pointing backwards in Arabic flow towards `/courses`.
- ✅ **Arabic Dual & Plural Grammar in Metrics (`CourseCard.tsx` & `CourseHero.tsx`)**: Applied native grammatical rules for hours (`ساعة واحدة`, `ساعتان`, `ساعات`), students (`طالب واحد`, `طالبان`, `طلاب`), and lessons (`درس واحد`, `درسان`, `دروس`).
- ✅ **Curriculum Accordion Section Pluralization (`CourseCurriculum.tsx`)**: Formatted lesson counts per section (`درس واحد`, `درسان`, `دروس`, `درساً`) avoiding grammatically incorrect phrases.

### [P2] Polish & Refinement Issues (Resolved)
- ✅ **Reduced Motion Support**: Added `motion-reduce:transition-none` and `motion-reduce:transform-none` on cards and hover effects.
- ✅ **Touch Targets Consistency**: All filters, catalog buttons, and links strictly enforce `min-h-[44px]`.

---

## 3. Five-Dimension Technical Audit Scorecard

| Dimension | Target Standard | Observed Performance | Score (/4.0) |
| :--- | :--- | :--- | :---: |
| **1. Design System & Visual Integrity** | Strict `DESIGN.md` token conformance, 10% Indigo rule | Strict card surfaces, semantic border & text tokens, no hardcoded colors | **4.0 / 4.0** |
| **2. Accessibility & A11y Ergonomics** | Touch targets >= 44x44px, full ARIA listbox/pressed roles | `aria-pressed` on filter buttons, touch targets >= 44px, visible focus rings | **4.0 / 4.0** |
| **3. Motion & Layout Stability (CLS)** | `motion-reduce` support, SSR hydration stability | Respects `useReducedMotion()`, zero layout jumping | **4.0 / 4.0** |
| **4. Concurrency & Resilience** | Double-submit guards, HTTP error recovery | `isSubmittingRef` lock on enrollment, retry button on error state | **4.0 / 4.0** |
| **5. RTL & Bilingual Ergonomics** | Logical box properties, proper Arabic pluralization | `ms-2`, natural Arabic RTL back arrow, native pluralization across all counters | **4.0 / 4.0** |
| **Total Technical Audit Score** | **High-Assurance Production Standard** | **Exemplary Craft** | **20.0 / 20.0** |

---

## 4. Life-Cycle Progression Status
- [x] **Step 1**: Critique documented & user approval obtained
- [x] **Step 2**: Polish (`/impeccable polish`): Corrected RTL arrow, applied Arabic pluralization across cards, hero, and curriculum
- [x] **Step 3**: Harden (`/impeccable harden`): Touch targets verified, reduced-motion guards confirmed, concurrency locks intact
- [x] **Step 4**: Hygiene & Audit: Dead code cleaned, final audit score card (20/20), `closed: true`
