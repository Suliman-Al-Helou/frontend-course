# courses (Public Catalog & Overview) — Architectural Context & PRD (immutable anchor)

## Purpose & Scope
This feature encapsulates the **Public Courses Domain** exclusively. It is designed for visitors, guests, and exploring students to browse courses, inspect curricula, and request enrollment.

### Explicit Domain Boundaries
- ✅ **IN SCOPE (This Feature):**
  - Public Course Catalog (`/courses`) with client-side search and level filtering.
  - Landing Page Course Highlights (`CoursesSection` on `/`).
  - Footer Quick Course Links (`Footer`).
  - Public Course Detail / Overview (`/courses/[courseId]`) with syllabus outline and enrollment request trigger.
- ❌ **OUT OF SCOPE (Strictly Separate Features):**
  - **Student Learning & Progress (`src/features/student-courses/`):** Enrolled courses dashboard (`/dashboard/courses`), video lesson player, quiz/task submissions, lesson watch progress.
  - **Admin Course Management (`src/features/admin-courses/`):** Course creation/edit/delete CRUD, section/lesson management, attendance admin tables.

---

## Architectural Layers

```text
src/features/courses/
├── api/
│   ├── getCourses.ts          # Pure Axios gateway call to GET /courses
│   └── getCourseDetail.ts     # Pure Axios gateway call to GET /courses/{id} + toCourseDetail transform
├── queries/
│   └── courses.queries.ts     # TanStack Query v5 queryOptions factory (list / detail)
├── hooks/
│   └── useCourseDetail.ts     # Wrapper around courseQueries.detail(id)
├── utils/                     # Pure helpers & route calculators
│   ├── courseLevel.ts         # Level labels and color styles
│   └── courseLinks.ts         # Route calculator helper
├── server/
│   └── index.ts               # Server-only RSC Prefetching with timeout budget (getDehydratedCourses, getDehydratedCourseDetail)
├── components/                # Decomposed UI components
│   ├── catalog/               # Public catalog page components:
│   │   ├── CoursesHero.tsx       # Search hero with clear button & reduced motion
│   │   ├── CourseLevelFilters.tsx# A11y group filter buttons with aria-pressed
│   │   └── CoursesEmptyState.tsx # Zero-result state with one-click reset action
│   ├── detail/                # Course detail page components:
│   │   ├── CourseHero.tsx        # Hero banner, stats & instructor info
│   │   ├── EnrollCard.tsx        # Decomposed checkout & enrollment card with lock
│   │   ├── CourseCurriculum.tsx  # Accessible accordion syllabus with preview links
│   │   ├── CourseOutcomes.tsx    # Learning outcomes, requirements & target audience
│   │   └── CourseBottomCta.tsx   # Floating/bottom registration CTA
│   ├── CourseCard.tsx         # Course card with cover, level badge, rating, CTA
│   ├── CourseCardSkeleton.tsx # Accessible skeleton with motion-reduce support
│   ├── CourseLevelBadge.tsx   # Level badge
│   └── StarRating.tsx         # Accessible rating with screen reader aria-label
└── index.ts                   # Client-safe barrel export
```

---

## Data Contracts (Backend Source of Truth)

- `GET /courses` → `Course[] | { data: Course[] }`: Returns active public courses.
- `GET /courses/{id}` → `Course & { sections?: unknown[] }`: Returns course syllabus, sections, lessons.
- `GET /courses/{id}/enrollment` → `{ status: "pending" | "approved" | "rejected" }`: Current user enrollment status.
- `POST /courses/{id}/enroll` → Sends course enrollment request to backend.

---

## Strict Rules (Inherited & Non-Negotiable)

1. **NO RAW FETCHING IN COMPONENTS:** `useState` + `useEffect` for fetching course data is strictly banned.
2. **QUERY OPTIONS ONLY:** All consumers MUST use `courseQueries.list()` or `courseQueries.detail(id)`. Never write inline string query keys like `["courses"]`.
3. **CACHE SHARING VIA `select`:** If a component only requires a subset or transformed projection of courses (e.g. Footer top 5, Landing page hot badges), it MUST use `useQuery({ ...courseQueries.list(), select: ... })` to share in-memory cache without duplicate network hits.
4. **DERIVED STATE VIA `useMemo`:** Never copy query data into a `useState` for local filtering or search. Use `useMemo` over `courses`.
5. **ZERO DUPLICATE BRIDGES:** Never keep legacy files or proxy re-exports after moving components to `src/features/courses/`.
6. **DESIGN TOKENS ONLY:** Enforce semantic tokens (`bg-background`, `text-foreground`, `bg-muted`, `border-border`, `bg-primary`, `text-success`). Never hardcode hex values or arbitrary colors.

