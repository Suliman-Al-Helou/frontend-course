# Impeccable Critique: Student Enrolled Courses & Continue Learning (`src/features/student-courses/components/`)

- **Timestamp**: 2026-11-14T14:01:00Z
- **Target**: `src/features/student-courses/components/` (`EnrolledCoursesGrid.tsx`, `EnrolledCourseCard.tsx`, `CourseFilterDropdown.tsx`) and host pages `src/app/(student)/dashboard/courses/page.tsx` & `src/app/(student)/dashboard/continue/page.tsx`
- **Surface Mode**: Operate (Student Enrolled Courses & Resume Learning)
- **Closed**: false

---

## 1. Nielsen Heuristics Evaluation (Initial Score: 33.5 / 40)

| Heuristic | Score (/4) | Findings & Observations |
| :--- | :---: | :--- |
| **1. Visibility of system status** | 3.5 | Card skeletons match grid layout; however, `continue/page.tsx` suffers from slow nested loading. |
| **2. Match between system & real world** | 3.5 | Domain terms ("متابعة التعلم", "مسجل") match Arabic LMS expectations. Pluralization on hours and students needs refinement. |
| **3. User control and freedom** | 3.5 | Direct one-click link to active lesson or videos catalog. |
| **4. Consistency and standards** | 2.5 | **Critical Antipattern in `dashboard/continue/page.tsx`**: Triple-nested `for` loops executing sequential axios requests inside `useEffect`, violating TanStack Query V5 rules. |
| **5. Error prevention** | 3.5 | `EnrolledCoursesGrid` gracefully handles API error and empty enrollment states. |
| **6. Recognition rather than recall** | 3.5 | Cover images, duration hours, enrolled badges, and progress bars facilitate immediate recognition. |
| **7. Flexibility and efficiency of use** | 3.0 | `CourseFilterDropdown` allows filtering tasks and videos; lacks complete ARIA listbox attributes. |
| **8. Aesthetic and minimalist design** | 3.5 | Clean dark-mode cards adhering to `DESIGN.md`. |
| **9. Help recognize & recover from errors** | 3.0 | Empty state in `continue/page.tsx` lacks actionable recovery link back to courses. |
| **10. Help and documentation** | 3.5 | Empty state in `EnrolledCoursesGrid` provides a direct primary button to discover courses. |

---

## 2. Issues Breakdown & Priority Classification

### 🚨 [P0] Critical Issues (Must Resolve Before Ship)
1. **Severe N+1 Cascading Fetch Antipattern (`dashboard/continue/page.tsx`)**:
   - Sequential nested `api.get` requests inside `useEffect` for each course, section, and lesson. Causes severe performance bottleneck and violates the TanStack Query V5 protocol. Must be replaced with a unified TanStack Query query factory or optimized parallel resolution.

### ⚠️ [P1] Serious Issues (Accessibility & UX Semantics)
1. **A11y ARIA Semantics on `CourseFilterDropdown.tsx`**:
   - Dropdown button lacks `aria-expanded`, `aria-haspopup="listbox"`, and option buttons lack `role="option"`, hindering screen reader users.
2. **Arabic Pluralization on `EnrolledCourseCard.tsx`**:
   - Hardcoded single unit string ("ساعة" and "طالب") regardless of number (`2 ساعة` instead of `ساعتان`, `4 طالب` instead of `4 طلاب`).
3. **Missing Call to Action on Empty Continue State (`dashboard/continue/page.tsx`)**:
   - When no lessons are currently in progress, user is shown an empty message with no action button to explore enrolled courses.

### 💡 [P2] Polish & Refinement Issues
1. **Card Hover Motion & Reduced Motion**:
   - Ensure `motion-reduce:transition-none` on card zoom and border hover.
2. **Explicit Touch Targets**:
   - Guarantee `min-h-[44px]` on all dropdown triggers, items, and card buttons.

---

## 3. Required Life-Cycle Progression
- [ ] **Step 1**: Critique documented & user approval obtained (Current Step)
- [ ] **Step 2**: Polish (`/impeccable polish`): Resolve P0 N+1 in continue page via TanStack Query, add Arabic pluralization, enhance empty state
- [ ] **Step 3**: Harden (`/impeccable harden`): Full ARIA listbox semantics, touch targets >= 44px, reduced-motion guards
- [ ] **Step 4**: Hygiene & Audit: Dead code cleanup, final audit score card (20/20), `closed: true`
