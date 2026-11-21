# Ticket 03: Phase 3 — Educational Metadata Updates & Activity Audit Logging

**Tracker Label**: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/docs/wayfinder/map.md)  
**Status**: In Progress  
**Assignee**: Antigravity  
**Unblocked by**: [Ticket 02: Phase 2 — CoursePolicy & IDOR Prevention Tests](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/02-course-policy-authorization.md)  
**Governing ADR**: [ADR 0019](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0019-educational-metadata-updates-and-immutable-activity-audit.md)  

## Question

How do we allow instructors to maintain their course educational metadata (title, description, outcomes, requirements) in real time while strictly preventing commercial tampering (price, visibility, status) and maintaining an immutable audit log for courses with enrolled paying students?

## Acceptance Criteria

1. **Dedicated FormRequest (`app/Http/Requests/InstructorUpdateCourseRequest.php`):**
   - Whitelist only educational content attributes:
     - `title`: `['sometimes', 'string', 'min:3', 'max:255']`
     - `description`: `['sometimes', 'string', 'min:10']`
     - `cover_image`: `['sometimes', 'nullable']` (validated as `image|mimes:jpeg,png,jpg,webp|max:2048` when a file is provided, or `string|max:2048` when existing URL is passed)
     - `level`: `['sometimes', 'in:beginner,intermediate,advanced']`
     - `what_you_learn`: `['sometimes', 'nullable', 'array']`, `what_you_learn.*`: `['string', 'max:255']`
     - `requirements`: `['sometimes', 'nullable', 'array']`, `requirements.*`: `['string', 'max:255']`
     - `target_audience`: `['sometimes', 'nullable', 'array']`, `target_audience.*`: `['string', 'max:255']`
   - Silently strip unauthorized commercial/administrative attributes (`price`, `status`, `is_public`, `instructor_id`, `rating`, `is_popular`, `youtube_playlist_id`) per ADR 0019 without raising validation errors, ensuring zero probing feedback.
2. **Audit Logging Migration & Model (`course_activity_logs`):**
   - Create migration for table `course_activity_logs`:
     - `id`
     - `foreignId('course_id')->constrained()->cascadeOnDelete()`
     - `foreignId('user_id')->nullable()->constrained()->nullOnDelete()`
     - `string('action')` (e.g., `course_metadata_updated`, `section_created`, `lesson_deleted`)
     - `json('changes')` (holding `['field' => ['old' => ..., 'new' => ...]]`)
     - `string('ip_address')->nullable()`
     - `timestamps()`
   - Create Eloquent model `App\Models\CourseActivityLog` with `$casts = ['changes' => 'array']`.
3. **Audit Service Hook (`app/Services/CourseService.php`):**
   - Implement `updateEducationalMetadata(Course $course, array $validated, ?User $user, ?string $ipAddress): Course`:
     - Resolves and stores local image files to `storage/app/public/courses/covers/` when present.
     - Computes the exact before-and-after diff on educational fields (normalizing arrays to prevent false diffs).
     - If no values genuinely changed, skips activity log creation entirely.
     - If diff is non-empty, executes database transaction to update course, insert `CourseActivityLog`, and invalidate cache via `ContentCache::forgetCourses()`.
4. **Feature Tests (`tests/Feature/Instructor/InstructorCourseMetadataUpdateTest.php`):**
   - Test 1: Instructor updates `title` and `what_you_learn`; course updates successfully, and an activity log entry is created with the exact diff.
   - Test 2: Instructor sends `price = 0` or `status = "published"` alongside educational attributes; request succeeds (200 OK), educational attributes update, but course `price`/`status` in database remains strictly unchanged.
   - Test 3: Submitting identical data without modifications returns success but creates NO redundant activity log entry.
   - Test 4: Unauthorized instructor attempting update receives `403 Forbidden` via `CoursePolicy::manageAsInstructor`.
   - Test 5: Soft-deleting user preserves `course_activity_logs` rows with `user_id = null`.
