# 02: Educational Mutation Boundary, Whitelisting & Silent Stripping

**What to build:** An isolated instructor course mutation endpoint (`match(['PUT', 'PATCH', 'POST'], '/api/instructor/courses/{course}')`) guarded by `CoursePolicy::manageAsInstructor`. Incoming payloads are validated by `InstructorUpdateCourseRequest` against a strict whitelist of pedagogical attributes (`title`, `description`, `level`, `what_you_learn`, `requirements`, `target_audience`, `cover_image`). Any commercial or administrative fields (`price`, `status`, `is_public`, `instructor_id`, `rating`, `is_popular`, `youtube_playlist_id`) are silently stripped from the validated data per ADR 0019, returning `200 OK` without altering database commercial columns.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] Create `App\Http\Requests\InstructorUpdateCourseRequest` with educational whitelist rules and authorization via `Gate::authorize('manageAsInstructor', $course)`.
- [x] Ensure non-educational fields are omitted from rules so `$request->validated()` silently excludes them.
- [x] Add `update` method in `App\Http\Controllers\Api\Instructor\InstructorCourseController` returning `CourseInstructorResource`.
- [x] Register route in `routes/api.php` under the instructor prefix with `auth:sanctum` and role middleware.
- [x] Verify IDOR guard rejects unauthorized instructors with `403 Forbidden` and unauthenticated requests with `401 Unauthorized`.
