---
target: src/features/student-courses/
total_score: 39
max_score: 40
audit_score: 20
audit_max: 20
p0_count: 0
p1_count: 0
p2_count: 0
target_path: src/features/student-courses/
timestamp: 2026-11-08T10-35-00Z
slug: student-courses-domain
closed: true
---

# Critique & Architectural Diagnosis: Student Courses Domain (Phase 2)

Evaluated Scope & Migrated Files:

1. `src/features/student-courses/` (Complete Vertical Slice)
2. `src/app/(student)/dashboard/courses/page.tsx` (Enrolled courses dashboard)
3. `src/app/(student)/courses/[courseId]/lessons/[lessonId]/page.tsx` (Lesson player & quiz)
4. `src/app/(public)/courses/page.tsx` & `src/components/landing/CoursesSection.tsx` (Shared cache via select)

---

## 1. Usability & Heuristic Evaluation (Nielsen 10 Heuristics: 39/40)

| #   | Heuristic                                  | Score | Resolution / Status                                                                                                   |
| --- | ------------------------------------------ | ----- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | Visibility of System Status                | 4.0/4 | Accessible skeletons with `role="status"` and `sr-only`; clear loading and completion indicators.                     |
| 2   | Match Between System & Real World          | 4.0/4 | RTL mirrored directional arrows; accurate Arabic terminology for all states.                                          |
| 3   | User Control & Freedom                     | 3.5/4 | Accordion sections can be toggled via keyboard; retry options on tasks.                                               |
| 4   | Consistency & Standards                    | 4.0/4 | Fully tokenized with `DESIGN.md` (`bg-card`, `border-border`, `text-success`, `text-destructive`).                    |
| 5   | Error Prevention                           | 4.0/4 | `useRef` concurrency lock on `TaskSection` prevents duplicate submissions; N+1 loop replaced by TanStack Query cache. |
| 6   | Recognition Rather Than Recall             | 4.0/4 | Clear lock badges, progress percentages with ARIA progressbar, and step counters.                                     |
| 7   | Flexibility & Efficiency of Use            | 4.0/4 | Single in-memory cache shared across all pages via `studentCourseQueries.enrolled()`.                                 |
| 8   | Aesthetic & Minimalist Design              | 4.0/4 | Strict 10% Indigo Rule, Two-Weights Rule, and zero AI-slop.                                                           |
| 9   | Help Users Recognize & Recover from Errors | 3.5/4 | Immediate accessible feedback on task failures with explanation and retry triggers.                                   |
| 10  | Help & Documentation                       | 4.0/4 | Explicit instructions for locked lessons and pass requirements.                                                       |

---

## 2. Resolved Priority Issues

### Critical Issues [P0] - ALL RESOLVED:

- [x] **[P0-1] Raw Fetching & Cache Bypass:** Replaced all ad-hoc `useEffect` + `useState` fetching with `studentCourseQueries.enrolled()` using TanStack Query v5 Singleton pattern.
- [x] **[P0-2] N+1 Query Cascade Bomb:** Replaced un-cached cascading lesson progress requests with `studentCourseQueries.completedLessons` cached query option.
- [x] **[P0-3] Monolithic Data Loading:** Separated course details (`courseQueries.detail`) from lesson progress (`studentCourseQueries.lessonProgress`) into clean independent queries.

### Severe Issues [P1] - ALL RESOLVED:

- [x] **[P1-1] Concurrency & Double-Submit Risk:** Implemented `isSubmittingRef` (`useRef(false)`) inside `TaskSection.tsx`.
- [x] **[P1-2] Accordion Accessibility Deficit:** Added `aria-expanded`, `aria-controls`, `role="region"`, and keyboard support in `LessonSidebar.tsx`.
- [x] **[P1-3] Broken Legacy Routing:** Deleted orphan file `EnrolledCourses.tsx` and unified routes to canonical lesson and video destinations.
- [x] **[P1-4] Missing Motion Accessibility:** Transitions comply with `DESIGN.md` guidelines and respect `prefers-reduced-motion`.
- [x] **[P1-5] Mobile Touch Targets (< 44px):** All buttons and interactive links meet or exceed `min-h-[44px]`.

### Polish & Hygiene Issues [P2] - ALL RESOLVED:

- [x] **[P2-1] Design Token Violations:** Removed hardcoded colors; integrated semantic tokens (`text-success`, `bg-destructive/10`, `text-primary-foreground`).
- [x] **[P2-2] Any Types & Loose Typing:** Replaced all `any[]` with strict domain interfaces (`StudentEnrollment`, `Task`, `TaskResult`).
- [x] **[P2-3] Dead Code & Lingering Hooks:** Deleted `UseMyEnrolledCourses.ts` and `EnrolledCourses.tsx`; replaced with query selectors.
- [x] **[P2-4] Two-Weights Rule:** Enforced strictly Regular (400) and Semibold (600) weights throughout the UI.

---

## 3. Final Technical Audit (20/20)

| Dimension                | Score | Evidence                                                                                                    |
| ------------------------ | ----- | ----------------------------------------------------------------------------------------------------------- |
| **Accessibility (A11y)** | 4/4   | `aria-expanded`, `aria-controls`, `role="alert"`, `role="progressbar"`, touch targets >= 44x44px.           |
| **Performance & Motion** | 4/4   | In-memory cache sharing via `select`, elimination of N+1 requests, zero memory leaks with interval cleanup. |
| **Theming & Tokens**     | 4/4   | 100% compliant with `DESIGN.md` (Obsidian canvas, 10% Indigo, Two-Weights, zero font-size deviations).      |
| **Responsive (375px)**   | 4/4   | Mobile-first layout, touch-friendly inputs and buttons, no horizontal overflow.                             |
| **Architecture & State** | 4/4   | Strict 3-Layer pattern (`api/`, `queries/`, `components/`), TanStack Query v5 Singleton, zero raw fetching. |
