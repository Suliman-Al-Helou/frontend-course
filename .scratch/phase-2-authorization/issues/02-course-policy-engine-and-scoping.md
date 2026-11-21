# 02: CoursePolicy Engine & Scoped Course Listing Slice

**What to build:** The core authorization engine in `CoursePolicy::manageAsInstructor` guaranteeing that instructors can only access courses explicitly assigned to their profile (`courses.instructor_id === user.instructor.id`), while administrators retain full supervisory oversight. Endpoints include `GET /api/instructor/courses` (which returns only assigned courses for instructors, an empty array `[]` with `200 OK` for unassigned faculty, and all platform courses with `?managed_by_me=true` filter for administrators) and `GET /api/instructor/courses/{course}` (which returns the course via `CourseInstructorResource` stripped of sensitive administrative keys).

**Blocked by:** 01: Self-Service Profile & Skeleton Bootstrap Slice

**Status:** completed

- [x] Implement `CoursePolicy::manageAsInstructor(User $user, Course $course): bool` checking administrative privileges or matching `courses.instructor_id` with `$user->instructor?->id`.
- [x] Register instructor route group in `routes/api.php` with `auth:sanctum` and `role:instructor|admin`.
- [x] Implement `InstructorCourseController@index` returning only courses where `instructor_id` matches the authenticated instructor profile, or all courses for administrators.
- [x] Implement `InstructorCourseController@show` authorizing `manageAsInstructor` and returning `CourseInstructorResource`.
- [x] Any attempt by an instructor to view a course assigned to another instructor returns `403 Forbidden`.
- [x] Feature test proves course list scoping, empty state safe return, admin supervisory access, and cross-tenant `403 Forbidden` protection.
