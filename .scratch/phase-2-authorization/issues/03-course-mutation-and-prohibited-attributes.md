# 03: Course Mutation & Prohibited Attributes Guard Slice

**What to build:** An instructor-facing update endpoint (`PUT /api/instructor/courses/{course}`) allowing assigned faculty to update their course's educational syllabus metadata (title, description, level, learning outcomes, requirements, target audience, cover image). The endpoint enforces strict authorization before validation (`authorize()` in `InstructorUpdateCourseRequest`), guaranteeing that cross-tenant probe attempts return `403 Forbidden` even with invalid bodies. Sensitive administrative and commercial fields (`price`, `youtube_playlist_id`, `instructor_id`, `is_public`, `status`) are strictly prohibited and return `422 Unprocessable Entity` if present.

**Blocked by:** 02: CoursePolicy Engine & Scoped Course Listing Slice

**Status:** completed

- [x] Create `InstructorUpdateCourseRequest` with an `authorize()` method enforcing `$this->user()->can('manageAsInstructor', $this->route('course'))`.
- [x] In `InstructorUpdateCourseRequest`, enforce `prohibited` validation rules on `price`, `youtube_playlist_id`, `instructor_id`, `is_public`, and `status`.
- [x] Implement `InstructorCourseController@update` applying validated educational updates to the assigned course.
- [x] Sending a `PUT` request targeting another instructor's course with an empty or malformed payload returns `403 Forbidden` (proving authorization precedes validation).
- [x] Attempting to modify `price` or other prohibited fields on an owned course returns `422 Unprocessable Entity`.
- [x] Feature test verifies educational updates, prohibited attribute blocks, and zero information leak on cross-tenant updates.
