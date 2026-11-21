# ADR 0017: Pluggable Video Delivery Driver, Lesson Publication State, and Canonical Task Question Contract

## Status
Accepted

## Context
During cross-phase architectural analysis and the `/grill-with-docs` review across all 7 frontier tickets, four cross-cutting dependencies were identified that would otherwise force structural refactoring and breaking changes in later phases:
1. **Zero-Code Video Provider Switching**:
   - The platform starts with unlisted YouTube videos during MVP and transitions to encrypted HLS streams (e.g., Bunny.net Stream) at the Phase 7 Launch Gate.
   - Without storing the provider per lesson or using a pluggable driver pattern, switching `.env` would cause historical YouTube lessons to break on the HLS player, and vice versa.
2. **Deterministic Task & Assessment Contract**:
   - Phase 4 implements the backend auto-grading engine (`TaskService::submitAttempt`) based on `tasks.questions` JSON.
   - Phase 6 implements the frontend assessment builder (`InstructorLessonTaskEditor.tsx`).
   - An untyped JSON schema creates an immediate risk of silent grading failures due to schema drift between backend evaluation and frontend submission.
3. **Lesson Publication Lifecycle**:
   - Instructors need to draft syllabus sections and lessons without immediately exposing half-configured lessons or unattached video placeholders to enrolled students.
   - By default, newly added lessons in published courses should be published (`is_published = true`), but instructors must retain the ability to set them as drafts (`is_published = false`).
4. **Course Authorization Alignment**:
   - In Phase 2, `CoursePolicy::manageAsInstructor` must authenticate against `$course->instructor?->user_id === $user->id`, remaining resilient whether single-profile or multi-profile models are evaluated.

## Decision
1. **Pluggable Video Manager & Driver Pattern**:
   - Backend implements a `VideoDeliveryManager` driven by `config('services.video.default')` (environment variable `VIDEO_DEFAULT_PROVIDER=youtube`).
   - The `lessons` table includes `video_provider` (string, default: `'youtube'`) alongside `video_id`.
   - When generating playback payloads, the driver determines whether to issue YouTube source payloads or signed expiring HLS `.m3u8` manifests.
   - Switching providers at the Launch Gate requires only setting `VIDEO_DEFAULT_PROVIDER=bunny` without changing code.
2. **Canonical Task Question Schema**:
   - The JSON structure stored in `tasks.questions` is strictly specified:
     ```typescript
     export interface TaskQuestion {
       id: string; // Unique identifier (UUID or nanoid)
       type: "mcq" | "true_false";
       question: string;
       options: string[]; // Answer options (for true_false: ["صح", "خطأ"])
       correct_answer: number; // 0-based index of the correct option
       explanation?: string; // Optional explanation shown post-submission
     }
     ```
3. **Lesson Publication Toggle (`is_published`)**:
   - The `lessons` table includes `is_published` (boolean, default: `true`).
   - Student progress and curriculum queries (`GET /courses/{id}/curriculum`) strictly filter out `is_published = false` unless the viewer is an administrator or the assigned instructor.
4. **Policy Ownership Invariant**:
   - `CoursePolicy::manageAsInstructor` evaluates:
     ```php
     return $course->instructor_id !== null
         && $course->instructor?->user_id === $user->id;
     ```

## Consequences
- **Positive**:
  - Future-proof video delivery: historical YouTube videos and new encrypted HLS streams can coexist simultaneously or transition seamlessly with zero downtime and zero code rewrites.
  - Complete contract alignment between Phase 4 grading and Phase 6 UI.
  - Granular syllabus control: instructors can stage draft lessons safely before publishing.
  - Zero authorization bugs when validating instructor course ownership.
- **Negative**:
  - Requires adding `video_provider` and `is_published` columns to `lessons` table in a forward-looking migration.
