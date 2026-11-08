---
target: src/features/student-courses/
total_score: 24
max_score: 40
audit_score: 11
audit_max: 20
p0_count: 3
p1_count: 5
p2_count: 4
target_path: src/features/student-courses/
timestamp: 2026-11-08T10-35-00Z
slug: student-courses-domain
closed: false
---

# Critique & Architectural Diagnosis: Student Courses Domain (Phase 2)

Evaluated Scope & Existing Files:
1. `src/app/(student)/dashboard/courses/page.tsx` (Enrolled courses dashboard)
2. `src/app/(student)/courses/[courseId]/lessons/[lessonId]/page.tsx` (Lesson player & quiz)
3. `src/app/(student)/courses/[courseId]/lessons/[lessonId]/_components/` (`VideoPlayer`, `LessonSidebar`, `TaskSection`)
4. `src/app/(student)/courses/[courseId]/lessons/[lessonId]/_hooks/` (`useLessonData`, `useVideoProgress`)
5. `src/components/dashboard/EnrolledCourses.tsx` (Legacy unused component)
6. `src/components/landing/_hooks/UseMyEnrolledCourses.ts` (Raw fetch hook)
7. `src/services/lessonApi.ts` (Ad-hoc API client)

---

## 1. Usability & Heuristic Evaluation (Nielsen 10 Heuristics: 24/40)

| # | Heuristic | Score | Diagnostic Finding |
|---|---|---|---|
| 1 | Visibility of System Status | 2.5/4 | Skeletons lack a11y labels; no feedback during progress sync or task verification retry. |
| 2 | Match Between System & Real World | 3.0/4 | Good Arabic domain terminology; arrow icons in lesson navigation require proper RTL mirroring. |
| 3 | User Control & Freedom | 2.5/4 | Accordion sidebar lack ARIA control and full expand/collapse keyboard triggers; no easy lesson restart. |
| 4 | Consistency & Standards | 2.0/4 | Hardcoded non-semantic colors (`text-white`, `text-green-500`, `text-red-400`); raw image tags bypassing Next.js Image optimizations. |
| 5 | Error Prevention | 2.0/4 | `TaskSection` lacks concurrency lock (`useRef`), allowing double submission of quizzes; N+1 network requests swallow errors with empty catch blocks. |
| 6 | Recognition Rather Than Recall | 2.5/4 | Lesson lock conditions are not clear to screen readers; progress percentage needs visual and audible context. |
| 7 | Flexibility & Efficiency of Use | 2.0/4 | Redundant network requests to `/my-courses` across 5 different pages instead of single in-memory TanStack Query cache. |
| 8 | Aesthetic & Minimalist Design | 3.0/4 | UI layout is functional but suffers from legacy card styling that deviates from `DESIGN.md` tokens. |
| 9 | Help Users Recognize & Recover from Errors | 2.0/4 | Silent failure on video progress save and quiz submission failures; toast message uses absolute styling without standard accessibility alerts. |
| 10 | Help & Documentation | 2.5/4 | Quiz pass/fail explanation is partially hidden; prerequisites for locked lessons lack explicit instructions. |

---

## 2. Priority Issues Inventory

### Critical Issues [P0]:
- **[P0-1] Raw Fetching & Cache Bypass:** Multiple components (`dashboard/courses`, `dashboard/videos`, `dashboard/tasks`, `continue`, `UseMyEnrolledCourses`) independently call `api.get("/my-courses")` inside `useEffect` + `useState`, violating the TanStack Query v5 Singleton protocol.
- **[P0-2] N+1 Query Cascade Bomb:** In `LessonPage` and `videos/page.tsx`, an array of parallel `api.get(/lessons/${id}/progress)` calls is made for all lessons in every course without caching or batching.
- **[P0-3] Monolithic Data Loading in `useLessonData`:** Tightly couples course fetching, client-side lesson parsing, and separate progress fetching into imperative `useEffect` logic.

### Severe Issues [P1]:
- **[P1-1] Concurrency & Double-Submit Risk (`TaskSection.tsx`):** Quiz submission uses only `loading` state; rapid double clicks can trigger duplicate task submissions on slow network connections. Needs `useRef(false)` concurrency lock.
- **[P1-2] Accordion Accessibility Deficit (`LessonSidebar.tsx`):** Section buttons lack `aria-expanded`, `aria-controls`, and keyboard navigation support.
- **[P1-3] Broken Legacy Routing (`EnrolledCourses.tsx`):** Contains dead link to `/learn/${course.id}` instead of the canonical route, and is completely orphaned from the application tree.
- **[P1-4] Missing Motion Accessibility:** Framer motion and progress bar animations do not respect `prefers-reduced-motion`.
- **[P1-5] Mobile Touch Targets (< 44px):** Lesson item buttons and navigation arrows measure under 36px in height on mobile screens.

### Polish & Hygiene Issues [P2]:
- **[P2-1] Design Token Violations:** Hardcoded colors (`text-white`, `text-green-500`, `text-red-400`, `bg-red-500/10`) instead of semantic tokens (`bg-destructive/10`, `text-success`, `text-destructive`).
- **[P2-2] Any Types & Loose Typing:** Pervasive `any[]` and `res.data` untyped usages across student course pages.
- **[P2-3] Dead Code & Lingering Hooks:** Legacy `UseMyEnrolledCourses.ts` and `EnrolledCourses.tsx` must be removed once vertical slice is operational.
- **[P2-4] Two-Weights Rule:** Inconsistent font weights (mixing 400, 500, 600, 700) on single card surfaces.

---

## 3. Baseline Technical Audit (11/20)

| Dimension | Score | Finding |
|---|---|---|
| **Accessibility (A11y)** | 2/4 | Accordions lack ARIA attributes; touch targets < 44px; screen reader hints missing on locked lessons. |
| **Performance & Motion** | 2/4 | N+1 fetch waterfalls; animations run regardless of `prefers-reduced-motion`. |
| **Theming & Tokens** | 2/4 | Hardcoded color classes and raw arbitrary utility values. |
| **Responsive (375px)** | 2.5/4 | Functional responsive layout, but tap targets and headers are tight on small mobile devices. |
| **Architecture & State** | 2.5/4 | Imperative `useState` + `useEffect` fetching instead of TanStack Query `queryOptions` factory. |
