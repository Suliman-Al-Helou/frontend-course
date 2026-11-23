# ADR 0023: Instructor Curriculum Tree, Task Integrity Guard, and Dual-Mode Video Ingestion Contract

## Status
Accepted

## Context
During the `/grill-with-docs` architectural review for Ticket 06 (Phase 6: Isolated Curriculum Tree & Auto-Graded Task Editor UI), five critical cross-cutting decisions were evaluated across `frontend-course` and `backendCourse`:

1. **Instructor Task Management Authorization & IDOR Boundaries**:
   - Previously, task endpoints (`storeTask`, `updateTask`, `getTask`) were registered only under `/api/admin/lessons/{lesson}/task`.
   - Instructors managing their assigned courses require dedicated task endpoints under `/api/instructor/lessons/{lesson}/task`.
   - In accordance with ADR 0016, task management must traverse up to the parent course via `$lesson->getCourse()` and authorize against `CoursePolicy::manageAsInstructor`.

2. **Task Evaluation Integrity & Historical Attempt Preservation**:
   - Tasks contain auto-graded questions evaluated deterministically against student attempts (`TaskAttempt`).
   - If an instructor edits questions or changes passing criteria on a task that has existing student attempts, questions might diverge from the student's historical attempt reviews.
   - Deleting a task with existing student attempts would compromise course completion records and student grade history.

3. **Curriculum Ordering & Touch Device Ergonomics (Minimalist Surface Rule)**:
   - Reordering sections and lessons via heavy drag-and-drop JavaScript libraries introduces bundle bloat (~40-60KB), gesture collisions on mobile viewports, and accessibility (A11y) regressions.
   - A lightweight, highly accessible ordering mechanism is needed that operates natively on mobile touchscreens and desktop screens without third-party libraries.

4. **Missing YouTube Playlist Endpoints & Dual-Mode Video Attachment**:
   - The route `/api/instructor/courses/{id}/youtube-videos` was not implemented in the backend, nor was the admin counterpart registered.
   - Furthermore, `youtube_playlist_id` is an administrative secret intentionally stripped from `CourseInstructorResource` (ADR 0016).
   - Video attachment must not fail if an admin has not linked a YouTube playlist or channel to the course.

5. **Dedicated Instructor Workspace Architecture**:
   - Managing multi-tier curriculum trees, lesson tasks, and educational metadata inside small modal dialogs produces poor UX ergonomics and prevents URL deep-linking.
   - Instructors require a dedicated course workspace route (`/instructor/courses/[id]`) with clean horizontal tabs.

## Decision

1. **Dedicated Instructor Task Endpoints (`InstructorTaskController`)**:
   - Introduce `InstructorTaskController` in `backendCourse` with routes:
     - `GET /api/instructor/lessons/{lesson}/task`
     - `POST /api/instructor/lessons/{lesson}/task`
     - `PUT /api/instructor/lessons/{lesson}/task`
     - `DELETE /api/instructor/lessons/{lesson}/task`
   - All mutations execute `$this->authorize('manageAsInstructor', $lesson->getCourse());`.

2. **Task Integrity Guard**:
   - **Update Policy**: Instructors may update task questions, `pass_percentage`, and `max_attempts` at any time to correct typos or improve pedagogy. Changes take effect on future attempts only and do not alter past scores retroactively.
   - **UI Notice**: If `task.attempts_count > 0`, the UI displays an informational notice informing the instructor that revisions apply to subsequent attempts.
   - **Deletion Barrier**: Deleting a task that has existing student attempts (`$task->attempts()->exists()`) is strictly prohibited and returns `422 Unprocessable Entity` ("Cannot delete a task with recorded student attempts").

3. **Directional Arrow Ordering (Zero-Dependency A11y Pattern)**:
   - Sections and lessons are reordered using directional action buttons (`Move Up ↑` / `Move Down ↓`).
   - The UI disables boundary buttons (first item up-arrow, last item down-arrow).
   - Order swaps execute clean optimistic cache updates with rollback on failure.

4. **Dual-Mode Video Attachment & YouTube Playlist Integration**:
   - Backend registers `GET /api/instructor/courses/{course}/youtube-videos` (authorized via `CoursePolicy::manageAsInstructor`) and `GET /api/admin/courses/{course}/youtube-videos`.
   - `YouTubeService::getPlaylistVideos` reads items using the authenticated Google YouTube Client.
   - `InstructorCurriculumVideoPickerModal` enforces **Dual-Mode Attachment**:
     - **Mode 1 (Direct Unlisted URL - Default & Resilient)**: Allows pasting any valid YouTube URL (`watch?v=` or `youtu.be/`), automatically extracting the 11-character video ID with instant regex validation.
     - **Mode 2 (Course Playlist Gallery)**: If a playlist is linked, renders selectable video cards showing thumbnails and durations. If no playlist is linked or channel is disconnected, the modal gracefully falls back to Mode 1 with a clear notice.

5. **Dedicated Course Workspace Route (`/instructor/courses/[id]`)**:
   - Establish `src/app/(instructor)/instructor/courses/[id]/page.tsx` as the canonical course editor workspace.
   - Structured into clean horizontal tabs:
     - **Tab 1: Curriculum & Lessons (Default)**: Section accordions, lesson rows, publish/draft toggles, video attachment, and task editor triggers.
     - **Tab 2: Course Content**: Informational metadata editor (`InstructorCourseContentEditor`) strictly omitting pricing, status, and deletion controls.
     - **Tab 3: Enrolled Students**: Read-only roster of enrolled students and completion progress.

## Consequences

- **Positive**:
  - Full IDOR protection across task mutations.
  - Student academic integrity preserved: historical grades and attempts cannot be destroyed by task deletions.
  - Zero drag-and-drop bundle overhead and perfect mobile/screen-reader compatibility.
  - Resilient video workflow: instructors can build lessons with unlisted YouTube videos immediately, even without YouTube channel integration.
  - Deep-linkable instructor workspace conforming to `DESIGN.md`.
- **Negative**:
  - Requires implementing `InstructorTaskController`, `YouTubeService::getPlaylistVideos`, and the `/courses/{id}/youtube-videos` endpoints in the backend.
