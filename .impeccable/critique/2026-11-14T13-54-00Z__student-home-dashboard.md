# Impeccable Critique: Student Home Dashboard & Calendar (`src/features/student-home/components/`)

- **Timestamp**: 2026-11-14T13:54:00Z
- **Target**: `src/features/student-home/components/` (`StudentHome.tsx`, `HomeHeader.tsx`, `StatsCards.tsx`, `ExamResults.tsx`, `zoom-calendar/`)
- **Surface Mode**: Operate (Student Main Learning Dashboard)
- **Closed**: false

---

## 1. Nielsen Heuristics Evaluation (Initial Score: 34.5 / 40)

| Heuristic | Score (/4) | Findings & Observations |
| :--- | :---: | :--- |
| **1. Visibility of system status** | 3.5 | Skeletons and `QueryState` used on `StatsCards`, `ExamResults`, and `ZoomCalendar`. |
| **2. Match between system & real world** | 3.5 | Culturally resonant Arabic greetings, native date formatters, and localized calendar weekdays. |
| **3. User control and freedom** | 3.5 | Seamless switching between Month, Week, and Day views in Zoom calendar; immediate return to Today. |
| **4. Consistency and standards** | 3.0 | **Hierarchy Inversion**: `StatsCards` is placed before `HomeHeader` in `StudentHome.tsx`. Welcome header should lead the page. |
| **5. Error prevention** | 3.5 | Zoom join action is guarded against duplicate clicks (`joiningId`); toolbar stays interactive even if meetings query fails. |
| **6. Recognition rather than recall** | 3.5 | Domain icons and color-coded status badges for exam results (passed/failed) and live meeting states. |
| **7. Flexibility and efficiency of use** | 3.5 | Adaptive mobile defaults (defaults to Day view on <=639px displays). |
| **8. Aesthetic and minimalist design** | 3.5 | Clean dark-mode card surfaces; excessive vertical rhythm (`space-y-12`) pushes calendar below the fold. |
| **9. Help recognize & recover from errors** | 3.5 | Clear empty states for exams and meetings with helpful instructions. |
| **10. Help and documentation** | 3.5 | Contextual tooltips and subtitles explaining calendar capabilities. |

---

## 2. Issues Breakdown & Priority Classification

### 🚨 [P0] Critical Issues (Must Resolve)
1. **Information Architecture Inversion (`StudentHome.tsx`)**:
   - `StatsCards` is rendered before `HomeHeader`. In standard dashboard UX, the user's identity and personalized welcome header must establish the page anchor, followed by the metric summary cards.

### ⚠️ [P1] Serious Issues (Usability & Layout Rhythm)
1. **Excessive Vertical Rhythm (`StudentHome.tsx`)**:
   - `space-y-12` (48px gaps) creates unnecessary vertical sprawl, pushing the live schedule and exam results far below the fold on standard displays. Should use balanced spacing (`space-y-6 sm:space-y-8`).
2. **Numeric Tabular Display in Stat Cards (`StatsCards.tsx`)**:
   - Metric numbers lack `font-mono tabular-nums`, leading to potential micro-shifts and inconsistent alignment across the 4 grid columns.
3. **Small Screen Stat Card Typography (`StatsCards.tsx`)**:
   - In `grid-cols-2` on narrow mobile screens (<=360px), long metric labels risk awkward wrapping without `truncate` or tighter padding.

### 💡 [P2] Polish & Refinement Issues
1. **Two-Weights & 10% Indigo Rule Compliance**:
   - Verify that primary indigo color is reserved for active states, links, and high-value accents rather than generic borders.
2. **Accessibility & Touch Targets on Calendar Grid**:
   - Ensure calendar day cells meet `min-h-[44px]` touch target minimums across all view modes.

---

## 3. Required Life-Cycle Progression
- [ ] **Step 1**: Critique documented & user approval obtained (Current Step)
- [ ] **Step 2**: Polish (`/impeccable polish`): Invert hierarchy in `StudentHome.tsx`, balance spacing to `space-y-6 sm:space-y-8`, add `tabular-nums`
- [ ] **Step 3**: Harden (`/impeccable harden`): Touch targets >= 44px, reduced-motion guards, clean layout rendering
- [ ] **Step 4**: Hygiene & Audit: Dead code cleanup, final audit score card (20/20), `closed: true`
