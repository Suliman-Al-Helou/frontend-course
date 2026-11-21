# ADR 0016: Instructor CoursePolicy, IDOR Prevention Boundary, and Centralized Parent Traversal

## Status
Accepted

## Context
In Ticket 02 (Phase 2), the platform introduces dedicated endpoints for instructors (`/api/instructor/*`) to manage their assigned courses, curriculum sections, and lessons.
A critical vulnerability in multi-tenant and role-based learning management systems is Insecure Direct Object References (IDOR), where an authenticated instructor attempts to view, modify, or delete courses or nested curriculum items belonging to another instructor.

We evaluated two architectural approaches for nested curriculum authorization (sections, lessons):
1. **Proliferation of Individual Policies**: Creating separate `SectionPolicy` and `LessonPolicy` classes duplicating permission checks across 3 files.
2. **Centralized Course Traversal Authorization (Chosen)**: Delegating all curriculum permission decisions directly to `CoursePolicy::manageAsInstructor` by traversing up to the owning course (`$section->course` and `$lesson->getCourse()`).

## Decision
1. **Centralized Policy Authority (`CoursePolicy::manageAsInstructor`)**:
   - `CoursePolicy::manageAsInstructor(User $user, Course $course): bool` serves as the single source of truth for all instructor curriculum mutations:
     ```php
     public function manageAsInstructor(User $user, Course $course): bool
     {
         if ($user->isAdmin()) {
             return true;
         }

         if (! $user->hasRole('instructor')) {
             return false;
         }

         return $course->instructor_id !== null
             && $course->instructor?->user_id === $user->id;
     }
     ```
2. **Parent Traversal in Nested Controllers**:
   - In `InstructorSectionController`:
     - Creating section under course: `$this->authorize('manageAsInstructor', $course);`
     - Updating section: `$this->authorize('manageAsInstructor', $section->course);`
     - Deleting section: `$this->authorize('manageAsInstructor', $section->course);`
   - In `InstructorLessonController`:
     - Creating lesson under section: `$this->authorize('manageAsInstructor', $section->course);`
     - Updating/Deleting lesson: `$this->authorize('manageAsInstructor', $lesson->getCourse());`
3. **Self-Service Instructor Profile & Metric Integrity (Zero-IDOR Endpoints)**:
   - Dedicated endpoints allow authenticated instructors to inspect and edit their own public dossier without passing an ID parameter in the URL:
     - `GET /api/instructor/profile` (fetches `Auth::user()->instructor`, exposing educational fields plus read-only metric badges: `rating`, `total_reviews`, and `students_count`).
     - `PUT /api/instructor/profile` (updates `Auth::user()->instructor` with biography, title, avatar, specializations, achievements, and social links).
   - **Metric Tampering Guard**: Statistical attributes (`rating`, `total_reviews`, `students_count`) and `user_id` are enforced as `prohibited` in `InstructorProfileRequest`, rejecting any tampering attempts with `422 Unprocessable Entity`.
   - **Admin Metric Custody in MVP**: Platform administrators retain full manual authority in the admin panel to input or adjust `rating` and `total_reviews`, while instructors have view-only access from their dashboard.
   - **Atomic Name Synchronization**: Editing the instructor `name` inside `PUT /api/instructor/profile` automatically and atomically updates both `instructors.name` and `users.name` within a database transaction.
4. **Resource Isolation & Prohibited Attributes Guard**:
   - A dedicated `CourseInstructorResource` is introduced for all `/api/instructor/courses` responses, exposing only educational and syllabus metadata, completely stripping sensitive administrative parameters (such as `price`, `youtube_playlist_id`, and admin audit metadata).
   - In update requests (`InstructorUpdateCourseRequest`), sensitive admin fields are explicitly guarded using Laravel's `prohibited` validation rule:
     ```php
     'price' => ['prohibited'],
     'youtube_playlist_id' => ['prohibited'],
     'instructor_id' => ['prohibited'],
     'is_public' => ['prohibited'],
     'status' => ['prohibited'],
     ```
     Any payload containing these forbidden keys will be rejected immediately with `422 Unprocessable Entity`.
4. **Admin Oversight & Scoped Querying**:
   - `GET /api/instructor/courses` returns:
     - For Instructors: strictly courses where `courses.instructor_id === $user->instructor->id`. If the user has no linked profile, an empty array `[]` is returned safely (preventing orphan course leakage).
     - For Administrators: returns all platform courses by default for full supervisory oversight, with support for `?managed_by_me=true` to isolate courses under direct Admin Fallback Custody for assignment or self-management.
5. **Curriculum Deletion Integrity Guard**:
   - In `InstructorSectionController@destroy` and `InstructorLessonController@destroy`, deletion is strictly guarded against wiping active student progress:
     ```php
     if ($lesson->progress()->where('completed', true)->exists()) {
         abort(422, 'Cannot delete a lesson with recorded student progress.');
     }
     ```
   - For sections, if any contained lesson has recorded student completion, the section deletion request is rejected with `422 Unprocessable Entity`.
   - New or unstudied curriculum elements without recorded student progress can be deleted immediately by the assigned instructor.
6. **Authorization Precedes Validation (Zero-Leakage FormRequest Lifecycle)**:
   - All mutation FormRequests targeting instructor endpoints (`InstructorUpdateCourseRequest`, `InstructorSectionRequest`, `InstructorLessonRequest`) implement `authorize()` executing policy traversal before input validation:
     ```php
     public function authorize(): bool
     {
         $course = $this->route('course') ?? $this->route('section')?->course ?? $this->route('lesson')?->getCourse();
         return $course !== null && $this->user()->can('manageAsInstructor', $course);
     }
     ```
   - This ensures that unauthorized requests received with invalid or probing payloads immediately fail with `403 Forbidden` rather than leaking validation errors (`422 Unprocessable Entity`), completely closing ID enumeration vectors.
7. **Orphan & Broken Relationship Guard**:
   - If an element has no associated parent (e.g., corrupted record where `$section->course` or `$lesson->section` is null), the controller immediately aborts with `404 Not Found` before executing policy checks.
6. **Strict HTTP Response Codes**:
   - Non-existent resource: `404 Not Found`.
   - Existing resource belonging to another instructor: `403 Forbidden` (strictly verified by automated feature security tests).

## Consequences
- **Positive**:
  - Zero code duplication: curriculum authorization logic is defined in exactly one place.
  - Bulletproof IDOR protection across shallow and nested routes alike.
  - Perfectly matches the simplified strict 1-to-1 instructor model established in ADR 0015.
- **Negative**:
  - Requires database parent relations (`course`, `section`) to be loaded or traversed during mutation requests.