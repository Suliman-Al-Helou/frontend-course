# student-courses (Enrolled Courses, Lessons & Learning Hub) — Architectural Context & PRD (immutable anchor)

## Purpose & Scope
This feature encapsulates the **Student Learning & Enrolled Courses Domain** exclusively. It is designed for authenticated students to access their registered courses, watch video lessons, monitor watch completion, and take/submit interactive lesson tasks.

### Explicit Domain Boundaries
- ✅ **IN SCOPE (This Feature):**
  - Student Enrolled Courses Dashboard (`/dashboard/courses`).
  - Shared Enrolled Courses Query (`studentCourseQueries.enrolled()` used across the app via `select` projections for Landing and Catalog enrollment state).
  - Student Lesson Player & Progression (`/courses/[courseId]/lessons/[lessonId]`):
    - Video playback with throttled progress persistence.
    - Accessible syllabus sidebar with lock/unlock status and completion indicators.
    - Interactive task/quiz questionnaire with double-submit lock and immediate scoring feedback.
  - Subordinate student dashboard routes (`/dashboard/videos`, `/dashboard/tasks`, `/dashboard/continue`).
- ❌ **OUT OF SCOPE (Strictly Separate Features):**
  - **Public Course Catalog (`src/features/courses/`):** Public course cards, overview syllabus preview, guest enrollment triggers.
  - **Admin Course Management (`src/features/admin-courses/`):** Admin course CRUD, section/lesson creation/edit modals, attendance tables.
  - **Student Home Overview (`src/features/student-home/`):** General dashboard stats, exam overview cards, and Zoom live sessions calendar.

---

## Architectural Layers

```text
src/features/student-courses/
├── api/
│   └── index.ts                  # Pure Axios gateway calls to /my-courses, /lessons/*
├── queries/
│   └── studentCourses.queries.ts # TanStack Query v5 queryOptions factory (enrolled, lessonProgress, lessonTask)
├── types/
│   └── index.ts                  # Strict domain TypeScript interfaces
├── hooks/
│   └── useVideoProgressTracker.ts# Throttled video progress synchronization
├── components/
│   ├── EnrolledCourseCard.tsx    # Accessible enrolled course card with progress bar
│   ├── EnrolledCoursesGrid.tsx   # Enrolled courses listing with empty & skeleton states
│   ├── player/
│   │   ├── VideoPlayer.tsx       # YouTube player with user watermark and completion listener
│   │   ├── LessonSidebar.tsx     # Accessible curriculum navigation with ARIA accordion
│   │   └── TaskSection.tsx       # Interactive task solver with useRef double-submit lock
│   └── skeletons/
│       ├── EnrolledCourseSkeleton.tsx
│       └── LessonPageSkeleton.tsx
├── ai-context.md                 # Immutable PRD & architectural anchor
└── index.ts                      # Client-safe barrel export
```

---

## Data Contracts (Backend Source of Truth)

- `GET /my-courses` → `StudentEnrollment[] | { data: StudentEnrollment[] }`: List of courses user has enrolled in.
- `GET /lessons/{lessonId}/progress` → `LessonProgress`: Current student watch percentage, completion boolean, and last position.
- `POST /lessons/{lessonId}/progress` → `{ watched_percent: number; last_position: number }`: Throttled save endpoint for video progress.
- `GET /lessons/{lessonId}/task` → `Task`: Lesson quiz questions, passing threshold, and max attempts.
- `POST /lessons/{lessonId}/task` → `{ answers: Record<string, string> }`: Submits quiz responses and returns `TaskResult`.

---

## Strict Rules (Inherited & Non-Negotiable)

1. **NO RAW FETCHING IN COMPONENTS:** `useState` + `useEffect` for fetching server data is strictly banned.
2. **QUERY OPTIONS ONLY:** All consumers MUST use `studentCourseQueries.enrolled()`, `studentCourseQueries.lessonProgress(id)`, or `studentCourseQueries.lessonTask(id)`.
3. **CACHE SHARING VIA `select`:** Any view needing enrolled course info (such as the Public Catalog or Landing page enrolled badges) MUST share the in-memory cache using `select`.
4. **DOUBLE-SUBMIT CONCURRENCY LOCK:** Any mutation or task submission MUST employ a `useRef` lock (`isSubmittingRef`) to reject duplicate rapid submissions.
5. **A11Y & MOTION SAFETY:** All accordions MUST declare `aria-expanded` and `aria-controls`. Animations MUST respect `prefers-reduced-motion`. All interactive elements MUST meet `>= 44x44px` touch targets.
6. **ZERO LINGERING BRIDGES:** Delete old unused files immediately upon migration (`EnrolledCourses.tsx`, `UseMyEnrolledCourses.ts`).

