# Ticket 03: Phase 3 — Educational Metadata Updates & Activity Audit Logging

**Tracker Label**: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/docs/wayfinder/map.md)  
**Status**: Open (Blocked by Ticket 02)  
**Assignee**: Unassigned  
**Blocked by**: [Ticket 02: Phase 2 — CoursePolicy & IDOR Prevention Tests](file:///home/suliman/Documents/courses/docs/wayfinder/02-course-policy-authorization.md)  

## Question

How do we allow instructors to maintain their course educational metadata (title, description, outcomes, requirements) in real time while strictly preventing commercial tampering (price, visibility, status) and maintaining an immutable audit log for courses with enrolled paying students?

## Acceptance Criteria

1. **Dedicated FormRequest (`app/Http/Requests/InstructorUpdateCourseRequest.php`):**
   - Whitelist only educational content attributes:
     - `title`: `['sometimes', 'string', 'min:3', 'max:255']`
     - `description`: `['sometimes', 'string', 'min:10']`
     - `cover_image`: `['sometimes', 'nullable', 'url']`
     - `level`: `['sometimes', 'in:beginner,intermediate,advanced']`
     - `what_you_learn`: `['sometimes', 'nullable', 'array']`
     - `requirements`: `['sometimes', 'nullable', 'array']`
     - `target_audience`: `['sometimes', 'nullable', 'array']`
   - Explicitly reject or strip unauthorized attributes (`price`, `status`, `is_public`, `instructor_id`, `rating`, `is_popular`).
2. **Audit Logging Migration & Model (`course_activity_logs`):**
   - Create migration for table `course_activity_logs`:
     - `id`
     - `foreignId('course_id')->constrained()->cascadeOnDelete()`
     - `foreignId('user_id')->constrained()->cascadeOnDelete()`
     - `string('action')` (e.g., `course_metadata_updated`, `section_created`, `lesson_deleted`)
     - `json('changes')` (holding `['field' => ['old' => ..., 'new' => ...]]`)
     - `string('ip_address')->nullable()`
     - `timestamps()`
   - Create Eloquent model `App\Models\CourseActivityLog`.
3. **Audit Observer / Service Hook:**
   - Attach an Eloquent `updated` event or service method in `app/Services/CourseService.php` that inspects `$course->isDirty()` and records any changed educational fields into `course_activity_logs`.
4. **Feature Tests (`tests/Feature/Instructor/InstructorCourseMetadataUpdateTest.php`):**
   - Test 1: Instructor updates `title` and `what_you_learn`; course updates successfully, and an activity log entry is created with the exact diff.
   - Test 2: Instructor sends `price = 0` or `status = "published"` in payload; assert payload is stripped or rejected with `422`, and course `price`/`status` in database remains unchanged.
