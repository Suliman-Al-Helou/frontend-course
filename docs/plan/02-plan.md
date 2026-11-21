# Instructor Interface MVP Plan

## Step 1: Type System & Role Extension
- [ ] Extend `UserRole` in `src/features/auth/types/index.ts` to `"admin" | "student" | "instructor"`
- [ ] Extend `User.role` in `src/types/index.ts` to `"admin" | "student" | "instructor"`
- [ ] Update session validation helpers in `src/lib/auth-helpers.ts`

## Step 2: Route Architecture & Server-Side Access Guard
- [ ] Create route group `src/app/(instructor)`
- [ ] Implement `src/app/(instructor)/layout.tsx` using `getIronSessionData()`
- [ ] Guard `/(instructor)/*` requiring `session.user.role === "instructor"` (or `"admin"`), redirecting unauthorized users to `/dashboard` or `/login?redirect=/instructor`

## Step 3: Vertical Slice Directory Setup (`src/features/instructor-portal`)
- [ ] Create directory structure `src/features/instructor-portal/{api,queries,components,types}`
- [ ] Create subdirectories `components/{dashboard,course,curriculum,tasks,media}`
- [ ] Create immutable documentation anchor `src/features/instructor-portal/ai-context.md` defining in-scope boundaries (assigned courses, two-way video ingestion, syllabus, tasks) and out-of-scope boundaries (deletion, pricing, channel binding)
- [ ] Create barrel export `src/features/instructor-portal/index.ts`

## Step 4: Data Contracts & TanStack Query v5 Factory
- [ ] Define TypeScript contracts in `src/features/instructor-portal/types/index.ts` (InstructorDashboardStats, AssignedCourse, CurriculumSection, CurriculumLesson, LessonTaskPayload, ChunkUploadParams)
- [ ] Implement pure Axios fetchers in `src/features/instructor-portal/api/instructor.api.ts`:
  - `GET /instructor/courses` (assigned courses list and overview stats)
  - `GET /instructor/courses/:id` (assigned course detail)
  - `PUT /instructor/courses/:id` (update course content metadata)
  - `GET /instructor/courses/:id/sections` (course curriculum tree)
  - `POST /instructor/courses/:id/sections` (create curriculum section)
  - `DELETE /instructor/sections/:id` (delete empty/assigned section)
  - `POST /instructor/sections/:id/lessons` (create lesson)
  - `PUT /instructor/lessons/:id` (update lesson title, video ID, duration)
  - `DELETE /instructor/lessons/:id` (delete lesson)
  - `GET /instructor/lessons/:id/task` (fetch lesson mission task)
  - `POST /instructor/lessons/:id/task` (save/update lesson mission task)
  - `POST /instructor/video-assets/upload-chunk` (sliced 5MB chunked video upload)
  - `GET /instructor/courses/:id/youtube-videos` (hydrated playlist videos for lesson assignment)
- [ ] Implement query factory `src/features/instructor-portal/queries/instructor.queries.ts` with explicit `staleTime` and keys `["instructor-portal", ...]`
- [ ] Implement mutation hooks with automatic cache invalidation in `src/features/instructor-portal/queries/instructor.mutations.ts`

## Step 5: Instructor Dashboard & Shell Navigation (`/instructor`)
- [ ] Create `InstructorLayoutClient.tsx` following Minimalist Surface Rule with responsive sidebar and header
- [ ] Create `InstructorStatsCards.tsx` rendering:
  - Total assigned courses
  - Total enrolled students taught across assigned courses
  - Average student completion rate %
- [ ] Create `InstructorCourseCard.tsx` displaying course cover, title, student count, lesson count, and direct link to course workspace
- [ ] Create `src/app/(instructor)/instructor/page.tsx` rendering the stats and assigned courses grid with memoized filtering

## Step 6: Course Workspace Route (`/instructor/courses/[courseId]`)
- [ ] Create route `src/app/(instructor)/instructor/courses/[courseId]/page.tsx`
- [ ] Implement Course Header with quick actions:
  - `InstructorCourseContentEditor.tsx` modal (edit Title, Description, Cover Image, What You Learn, Requirements)
  - Strictly omit price change, public publishing toggle, and course deletion
- [ ] Implement Segmented Tab Navigation:
  - Tab 1: **Curriculum (المنهج الدراسي)**
  - Tab 2: **Course Media (فيديوهات الكورس)**

## Step 7: Curriculum Builder & Lesson Tasks
- [ ] Implement `InstructorCurriculumView.tsx` with section accordions and drag/inline lesson items
- [ ] Implement section and lesson creation/editing modals with `useRef` concurrency locks
- [ ] Implement `InstructorCurriculumVideoPickerModal.tsx` allowing instructors to select from their course's playlist videos
- [ ] Implement `InstructorLessonTaskEditor.tsx` for Lesson Missions (Tasks):
  - Question types: Multiple Choice (MCQ), True/False (صح / خطأ), Short Text Answer
  - Pass percentage threshold (e.g. 70%)
  - Max attempt limit configuration
  - Concurrency-safe submit with `useRef` lock

## Step 8: Course Media & Two-Way Video Ingestion
- [ ] Implement `InstructorCourseMediaView.tsx` displaying uploaded course videos and upload status
- [ ] Implement `InstructorVideoUploadModal.tsx`:
  - Client-side sliced 5MB chunk upload with progress bar
  - Automatic duration extraction via offscreen HTML5 `<video>` element
  - Cancel in-flight upload trigger
  - Auto-invalidation of course media and playlist queries upon completion

## Step 9: Impeccable UI Governance Protocol
- [ ] Step 9.1: Critique & Diagnose (`/impeccable critique`) - Audit Nielsen Heuristics, DOM tree, RTL/BiDi, touch targets (>= 44px), record in `.impeccable/critique/`
- [ ] Step 9.2: Polish (`/impeccable polish`) - Apply `DESIGN.md` tokens, 10% Indigo Rule, Two-Weights Rule, resolve P0/P1 issues
- [ ] Step 9.3: Harden (`/impeccable harden`) - Enforce `useRef` double-submit locks, `prefers-reduced-motion`, BiDi sanitization, CLS skeletons
- [ ] Step 9.4: Hygiene & Audit - Remove dead code, conduct 5-dimension technical audit (score /20), close critique record

## Step 10: Verification & Toolchain Checks
- [ ] Run `vp check` to validate formatting, linting, and TypeScript compilation
- [ ] Run `vp test` to verify query factory and component tests
- [ ] Add end-to-end integration test flow covering instructor authentication, dashboard overview, course content update, chunked video upload, and lesson task creation
