# Spec: Phase 6 — Isolated Curriculum Tree & Auto-Graded Task Editor UI

**Status**: Ready for Implementation  
**Triage Label**: `ready-for-agent`  
**Parent Roadmap**: [Wayfinder Map](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/map.md)  
**Associated Ticket**: [Ticket 06: Phase 6](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/06-curriculum-tree-and-task-editor-ui.md)  
**Governing Architectural Decisions**:
- [ADR 0014: Instructor Portal Vertical Slice and Isolated Role Components Architecture](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0014-instructor-portal-vertical-slice-and-isolated-components.md)
- [ADR 0016: Instructor CoursePolicy and IDOR Prevention Boundary](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0016-instructor-course-policy-and-idor-prevention.md)
- [ADR 0017: Pluggable Video Delivery Driver, Lesson Publication State, and Canonical Task Question Contract](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0017-video-provider-driver-and-curriculum-publication-contract.md)
- [ADR 0020: Dual-Requirement Lesson Progression and Atomic Task Gating](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0020-dual-requirement-lesson-progression-and-atomic-task-gating.md)
- [ADR 0021: Discriminated Video Playback Contract, Secure Delivery Gating, and Instructor Route Shell](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0021-discriminated-video-playback-and-instructor-route-shell.md)
- [ADR 0023: Instructor Curriculum Tree, Task Integrity Guard, and Dual-Mode Video Ingestion Contract](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0023-instructor-curriculum-tree-task-integrity-and-video-picker-contract.md)

---

## Problem Statement

As the platform transitions to academic faculty enablement, instructors require an ergonomic, deep-focus environment to structure their courses, attach media, and design interactive evaluations:

1. **Missing Curriculum & Task Endpoints for Faculty in Backend**:
   - While course educational metadata can be edited by instructors, lesson task management endpoints (`storeTask`, `updateTask`, `getTask`) currently reside exclusively under `/api/admin/lessons/{lesson}/task`.
   - Without dedicated instructor task endpoints traversing up to the parent course via `CoursePolicy::manageAsInstructor`, instructors cannot build formative assessments for their lessons.
2. **Academic Integrity & Historical Attempt Vulnerability**:
   - Lessons feature auto-graded tasks evaluated against immutable student attempts (`task_attempts`).
   - If an instructor deletes a task that has recorded student attempts, completion histories and learning analytics are corrupted.
   - Similarly, modifying task questions post-submission must not retroactively mutate past student scores.
3. **Rigid Video Ingestion & Missing Playlist Endpoints**:
   - The route `/api/instructor/courses/{id}/youtube-videos` does not exist in the backend.
   - Forcing instructors to rely solely on admin-created YouTube playlists blocks syllabus development whenever an admin has not yet linked a playlist. Instructors need a direct, unlisted YouTube URL parser.
4. **Mobile Usability & UI Bloat in Curriculum Reordering**:
   - Reordering sections and lessons via third-party drag-and-drop libraries introduces 40-60KB of bundle bloat, gesture clashes with vertical touch scrolling on mobile devices, and accessibility (A11y) barriers.
5. **Modal Overcrowding vs. Dedicated Deep-Focus Workspace**:
   - Conflating curriculum building, lesson video attachment, and multi-question task creation inside temporary popups on the course listing page damages usability and prevents URL deep-linking.

---

## Solution

1. **Dedicated Instructor Course Workspace Route (`/instructor/courses/[id]`)**:
   - Establish `src/app/(instructor)/instructor/courses/[id]/page.tsx` as the canonical course editor workspace with three clean horizontal tabs:
     - **Tab 1 (Curriculum & Lessons - Default)**: Section accordions, lesson rows, publish/draft toggles, video attachment triggers, and task questionnaire editors.
     - **Tab 2 (Course Content)**: Educational metadata editor (`InstructorCourseContentEditor`) strictly omitting price, status, public toggle, and deletion controls.
     - **Tab 3 (Enrolled Students)**: Read-only roster of enrolled students and completion progress.
2. **Dedicated Backend Task Controller (`InstructorTaskController`)**:
   - Implement `InstructorTaskController` in `backendCourse` with routes:
     - `GET /api/instructor/lessons/{lesson}/task`
     - `POST /api/instructor/lessons/{lesson}/task`
     - `PUT /api/instructor/lessons/{lesson}/task`
     - `DELETE /api/instructor/lessons/{lesson}/task`
   - Authorize all mutations via `CoursePolicy::manageAsInstructor` on `$lesson->getCourse()`.
3. **Task Integrity Guard**:
   - Permit non-retroactive question updates with an informational UI banner if `task.attempts_count > 0`.
   - Enforce a strict backend barrier blocking task deletion if `$task->attempts()->exists()`, aborting with `422 Unprocessable Entity`.
4. **Dual-Mode Video Ingestion (`InstructorCurriculumVideoPickerModal`)**:
   - **Mode 1 (Direct Unlisted URL - Default)**: Pasting any valid YouTube URL immediately parses the 11-character video ID with regex validation.
   - **Mode 2 (Course Playlist Gallery)**: If `youtube_playlist_id` exists, fetches playlist items via `GET /api/instructor/courses/{course}/youtube-videos`. If unlinked, falls back seamlessly to Mode 1.
5. **Directional Arrow Ordering (Zero-Dependency A11y Pattern)**:
   - Provide discrete `Move Up ↑` and `Move Down ↓` buttons on sections and lessons with boundary disabling, eliminating third-party DnD bloat while ensuring 100% mobile and keyboard accessibility.
6. **Canonical `TaskQuestion` Contract & Concurrency Hardening**:
   - Build `InstructorLessonTaskEditor.tsx` supporting Multiple Choice (MCQ) and True/False (صح / خطأ) questions, correct answer selection, and explanations.
   - Enforce `useRef(false)` (`isSubmittingRef`) double-submission guards across all modals and mutations.
   - Adhere to the Impeccable 4-Step UI Governance Protocol (`Critique -> Polish -> Harden -> Audit`).

---

## User Stories

1. As an instructor, I want to access a dedicated workspace for each assigned course at `/instructor/courses/:id`, so that I can build curriculum without distraction.
2. As an instructor, I want to see the course header (title, cover image, level, enrolled student count) in the workspace, so that I can confirm which course I am editing.
3. As an instructor, I want to navigate between Curriculum, Course Content, and Enrolled Students via horizontal tabs, so that complex management tasks remain clearly segregated.
4. As an instructor, I want to view my course curriculum structured into collapsible section accordions, so that I can easily navigate large courses.
5. As an instructor, I want to add a new section with a custom title, so that I can organize lessons logically.
6. As an instructor, I want to update an existing section title, so that I can refine module titles over time.
7. As an instructor, I want to delete an empty section, so that I can remove obsolete modules.
8. As an instructor, I want to reorder sections using up/down arrow buttons, so that I can sequence syllabus modules cleanly on both touchscreens and desktop.
9. As an instructor, I want to add lessons within a section specifying title, duration, and preview state, so that students have structured learning units.
10. As an instructor, I want to toggle a lesson's publication state (`is_published`), so that I can draft lessons privately before making them visible to enrolled students.
11. As an instructor, I want to reorder lessons within a section using up/down arrow buttons, so that I can maintain sequential curriculum progression without gesture conflicts.
12. As an instructor, I want to delete a lesson that has no completed student progress, so that I can correct curriculum mistakes safely.
13. As an instructor, I want the system to reject deleting a lesson with completed student progress (`422`), so that student completion histories are preserved.
14. As an instructor, I want to attach an unlisted YouTube video to a lesson by pasting its URL directly, so that the 11-character video ID is parsed automatically.
15. As an instructor, I want to browse videos from the course's connected YouTube playlist when available, so that I can attach existing video assets with a single click.
16. As an instructor, I want the video picker to fall back gracefully to direct URL entry if no playlist is linked, so that my workflow is never blocked.
17. As an instructor, I want to open a dedicated Task Editor modal for any lesson, so that I can configure an auto-graded evaluation mission.
18. As an instructor, I want to add Multiple Choice (MCQ) questions with multiple options and designate the zero-indexed correct answer, so that assessments evaluate specific knowledge points.
19. As an instructor, I want to add True/False (صح / خطأ) questions with predefined options, so that I can quickly verify conceptual understanding.
20. As an instructor, I want to write an optional explanation for each question, so that students learn why an answer is correct after submission.
21. As an instructor, I want to configure passing percentage (default 70%) and maximum attempts (default 3), so that I can calibrate assessment rigor.
22. As an instructor, I want to see an informational warning banner if I edit a task with existing student attempts, so that I understand my edits apply to future attempts only.
23. As a platform administrator, I want the system to strictly reject deleting any task with recorded student attempts (`422`), so that historical attempt records are never orphaned.
24. As an instructor, I want to update informational metadata (title, description, cover image, learning outcomes, requirements) in `InstructorCourseContentEditor`, so that the course catalog is up to date.
25. As a platform administrator, I want the instructor course editor to physically omit price, status, public toggle, and course deletion buttons, so that commercial custody remains exclusively with administrators.
26. As an instructor, I want all modal save buttons to enforce concurrency locks (`isSubmittingRef`), so that double-clicking does not generate duplicate sections, lessons, or tasks.
27. As an instructor, I want all interactive buttons and inputs to measure at least 44x44px, so that mobile touch interaction is comfortable and error-free.
28. As an instructor, I want smooth skeleton placeholders while curriculum queries load, so that layout shifting (CLS) is prevented.

---

## Implementation Decisions

### 1. Backend Architecture (`backendCourse`)
- **Controller**: `App\Http\Controllers\Api\Instructor\InstructorTaskController`
  - `show(Lesson $lesson)`: returns `TaskResource` after verifying `$this->authorize('manageAsInstructor', $lesson->getCourse())`.
  - `store(TaskRequest $request, Lesson $lesson)`: validates payload and stores task under `$lesson`.
  - `update(TaskRequest $request, Lesson $lesson)`: updates task payload.
  - `destroy(Lesson $lesson)`: enforces **Task Integrity Guard**:
    ```php
    if ($task->attempts()->exists()) {
        abort(422, 'Cannot delete a task with recorded student attempts.');
    }
    $task->delete();
    ```
- **YouTube Playlist Resolution**:
  - Add `YouTubeService::getPlaylistVideos(string $playlistId): array` utilizing Google YouTube Client.
  - Register `GET /api/instructor/courses/{course}/youtube-videos` (authorized via `CoursePolicy::manageAsInstructor`).
  - Register `GET /api/admin/courses/{course}/youtube-videos`.

### 2. Frontend Vertical Slice Architecture (`frontend-course`)
- **Slice Location**: `src/features/instructor-portal/`
- **Pure API Layer (`api/index.ts`)**:
  - `getInstructorCourse(id)`
  - `updateInstructorCourse(id, payload)`
  - `getInstructorSections(courseId)`
  - `createInstructorSection(courseId, payload)`
  - `updateInstructorSection(sectionId, payload)`
  - `deleteInstructorSection(sectionId)`
  - `createInstructorLesson(sectionId, payload)`
  - `updateInstructorLesson(lessonId, payload)`
  - `deleteInstructorLesson(lessonId)`
  - `getInstructorLessonTask(lessonId)`
  - `saveInstructorLessonTask(lessonId, payload)`
  - `deleteInstructorLessonTask(lessonId)`
  - `getInstructorCourseYouTubeVideos(courseId)`
- **TanStack Query v5 Factory (`queries/instructor-portal.queries.ts`)**:
  - `instructorPortalKeys.courseDetail(id)`
  - `instructorPortalKeys.sections(courseId)`
  - `instructorPortalKeys.task(lessonId)`
  - `instructorPortalKeys.youtubeVideos(courseId)`
- **UI Components (`components/`)**:
  - `InstructorCourseCard.tsx` (links to `/instructor/courses/${course.id}`).
  - `InstructorCurriculumView.tsx` (Section accordions, lesson rows, publication toggle, directional order buttons).
  - `InstructorCurriculumVideoPickerModal.tsx` (Dual-Mode direct URL parser + playlist gallery).
  - `InstructorLessonTaskEditor.tsx` (TaskQuestion contract editor for MCQ & True/False, pass_percentage, max_attempts).
  - `InstructorCourseContentEditor.tsx` (Metadata form omitting commercial fields).
- **Workspace Page**: `src/app/(instructor)/instructor/courses/[id]/page.tsx`.

---

## Testing Decisions

- **Testing Principles**: Test observable external behavior and security boundaries, never internal component state or implementation details.
- **Backend Seam (HTTP Feature Tests)**:
  - `tests/Feature/Instructor/InstructorTaskTest.php`:
    - Tests `GET`, `POST`, `PUT`, `DELETE` on `/api/instructor/lessons/{lesson}/task`.
    - Verifies IDOR prevention: an instructor attempting to manage tasks on another instructor's course receives `403 Forbidden`.
    - Verifies Task Integrity Guard: deleting a task with attempts aborts with `422`.
    - Verifies validation errors on missing question text, empty options, or invalid correct answer index.
- **Frontend Seam (State & Contract Tests)**:
  - `src/features/instructor-portal/__tests__/instructor-curriculum-and-tasks.test.ts`:
    - Verifies TanStack Query keys and staleTime configurations.
    - Verifies `TaskQuestion` contract serialization (MCQ and True/False).
    - Verifies YouTube URL parser extracting 11-char video IDs from standard and short URLs.
    - Verifies Directional Arrow Ordering boundary logic (first item cannot move up, last item cannot move down).
- **Prior Art**:
  - `tests/Feature/Instructor/InstructorCurriculumTest.php`
  - `src/features/admin-courses/__tests__/admin-courses.test.ts`
  - `src/features/instructor-portal/__tests__/instructor-dashboard-stats.test.ts`

---

## Out of Scope

- Modifying course pricing or payment gateway settings (admin-only).
- Toggling course public publishing status or deleting courses (admin-only).
- Managing platform YouTube OAuth tokens and channel connectivity (admin-only).
- Heavy drag-and-drop third-party gesture libraries (explicitly replaced by Directional Arrow Ordering).
- Free-form open-ended text questions or automated code compilation assessments in tasks.

---

## Further Notes

- Strict adherence to `DESIGN.md` (10% Indigo Rule, Two-Weights Rule, min 44x44px touch targets).
- Full compliance with the 4-Step Impeccable UI Governance Protocol:
  1. **Step 1:** Critique (`frontend-course/.impeccable/critique/<timestamp>__instructor-portal-curriculum.md`).
  2. **Step 2:** Polish (`DESIGN.md` tokens, P0/P1 fixes).
  3. **Step 3:** Harden (BiDi, reduced-motion, `isSubmittingRef` concurrency locks).
  4. **Step 4:** Hygiene & Audit (clean code, technical audit score /20).
