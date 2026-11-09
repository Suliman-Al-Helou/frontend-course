# admin-courses (Admin Course CRUD, Curriculum & Enrollments) — Architectural Context & PRD (immutable anchor)

## Purpose & Scope
This feature encapsulates the **Admin Courses & Curriculum Domain** exclusively. It is designed for platform administrators to manage the full lifecycle of courses, structured sections, lessons, interactive tasks/quizzes, and student enrollment verification.

### Explicit Domain Boundaries
- ✅ **IN SCOPE (This Feature):**
  - Admin Courses CRUD (`/admin?tab=courses`):
    - Course creation, modification, deletion, and status management (`draft`, `published`, `coming_soon`).
    - Instructor assignment, pricing, and difficulty configuration.
  - Syllabus & Curriculum Builder (`CourseSectionsModal`):
    - Course sections reordering and creation.
    - Video lessons management (YouTube ID, duration, and free preview toggle).
    - Lesson task & quiz questionnaire creator (`LessonTaskEditor`) with MCQ, True/False, and open-ended questions.
  - Enrollment Requests & Manual Assignment (`/admin?tab=enrollments`):
    - Approval, rejection, and payment confirmation of student applications.
    - Manual assignment of students to courses (`AddEnrollmentModal`).
  - Course Performance & Pricing Metrics (`AdminStatsCards`, `CoursesPriceOverview`).
- ❌ **OUT OF SCOPE (Strictly Separate Features):**
  - **Public Course Catalog (`src/features/courses/`):** Public browsing, marketing overview, syllabus outline preview for visitors.
  - **Student Learning & Progress (`src/features/student-courses/`):** Student enrolled hub, video playback tracking, quiz taking.
  - **Admin Users & Instructors (`src/features/admin-users/`, `src/store/instructorsStore.ts`):** Managing user roles and global instructor profiles.
  - **Admin Zoom Meetings & FAQs:** Dedicated tabs for video calls and platform FAQs.

---

## Architectural Layers

```text
src/features/admin-courses/
├── api/
│   └── index.ts                  # Pure Axios gateway calls for /admin/courses, /admin/sections, /admin/lessons, /admin/enrollments
├── queries/
│   ├── adminCourses.queries.ts   # TanStack Query v5 queryOptions factory (list, detail, sections, task, enrollments)
│   └── adminCourses.mutations.ts # Mutation hooks with automatic cache invalidation
├── types/
│   └── index.ts                  # Strict domain TypeScript interfaces and DTOs
├── components/
│   ├── courses/
│   │   ├── ManageCoursesTab.tsx  # Course cards listing with memoized student counts & modal triggers
│   │   ├── CourseFormModal.tsx   # Course create/edit modal with useRef double-submit lock
│   │   └── DeleteCourseDialog.tsx# Accessible confirmation modal for course deletion
│   ├── sections/
│   │   ├── CourseSectionsModal.tsx# Decomposed root modal for course curriculum
│   │   ├── SectionAccordion.tsx  # Section accordion with add-lesson inline form
│   │   ├── LessonRow.tsx         # Inline lesson viewer/editor & task trigger
│   │   └── LessonTaskEditor.tsx  # Dedicated lesson task builder with useRef lock
│   ├── enrollments/
│   │   ├── EnrollmentRequests.tsx# Requests management with live status toggling
│   │   └── AddEnrollmentModal.tsx# Student assignment modal with useRef lock
│   └── overview/
│       ├── AdminStatsCards.tsx   # Metric cards derived from in-memory cache
│       └── CoursesPriceOverview.tsx# Course pricing and enrollment summary table
├── ai-context.md                 # Immutable PRD & architectural anchor
└── index.ts                      # Client-safe barrel export
```

---

## Data Contracts (Backend Source of Truth)

- `GET /admin/courses` → `AdminCourse[] | { data: AdminCourse[] }`: List of all courses with administrative metadata.
- `GET /admin/courses/{id}` → `AdminCourse`: Full details for a course.
- `POST /admin/courses` → Creates a new course.
- `PUT /admin/courses/{id}` → Updates course details.
- `DELETE /admin/courses/{id}` → Deletes course and cascaded relations.
- `GET /admin/courses/{id}/sections` → `{ sections: AdminSection[] }`: Curriculum sections and nested lessons.
- `POST /admin/courses/{id}/sections` → Creates a new section.
- `DELETE /admin/sections/{id}` → Deletes a section and its lessons.
- `POST /admin/sections/{id}/lessons` → Creates a new lesson.
- `PUT /admin/lessons/{id}` → Updates lesson title, duration, video ID, or preview flag.
- `DELETE /admin/lessons/{id}` → Deletes a lesson.
- `GET /admin/lessons/{id}/task` → `AdminTaskResponse`: Questions, passing threshold, and max attempts.
- `POST /admin/lessons/{id}/task` | `PUT /admin/lessons/{id}/task` → Saves or updates task configuration.
- `GET /admin/enrollments` → `AdminEnrollment[] | { data: AdminEnrollment[] }`: List of student enrollment applications.
- `PATCH /admin/enrollments/{id}` → `{ status: string, payment_confirmed: boolean }`: Updates enrollment status.
- `POST /admin/enrollments` → Manually registers a student into a course.

---

## Strict Rules (Inherited & Non-Negotiable)

1. **NO RAW FETCHING IN COMPONENTS:** `useState` + `useEffect` for fetching server data is strictly banned.
2. **QUERY OPTIONS ONLY:** All consumers MUST use `adminCourseQueries.list()`, `adminCourseQueries.detail(id)`, `adminCourseQueries.sections(courseId)`, or `adminEnrollmentQueries.list()`.
3. **AUTOMATIC CACHE INVALIDATION:** All mutations MUST invalidate relevant queries (`adminCourseQueries.all()`, `adminEnrollmentQueries.all()`, and public catalog `["courses"]`) upon success.
4. **DOUBLE-SUBMIT CONCURRENCY LOCK:** Any mutation or save form MUST employ a `useRef` lock (`isSubmittingRef`) to reject duplicate rapid submissions.
5. **ZERO DOM BUGS:** Modals (such as `CourseSectionsModal`) must NEVER be rendered inside a `.map()` iteration.
6. **ACCESSIBILITY & DESIGN TOKENS:** Native browser `confirm()` is banned; accessible dialogs with focus states are mandatory. Colors must use semantic tokens (`bg-card`, `border-border`, `text-foreground`, `bg-primary`, `text-destructive`).
7. **ZERO LINGERING BRIDGES:** Delete old legacy components immediately upon migration.

