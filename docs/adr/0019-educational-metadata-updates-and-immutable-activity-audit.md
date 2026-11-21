# ADR 0019: Educational Metadata Updates, Silent Commercial Stripping, and Immutable Activity Audit Logging

## Status
Accepted

## Context
In the full-stack Instructor Portal, instructors require the ability to refine and maintain course pedagogical content in real time. However, allowing instructors to modify course attributes presents significant financial, legal, and operational risks:
1. **Commercial Tampering**:
   - Courses with paying enrolled students or active marketplace listings must not have their pricing (`price`), publication state (`status`), visibility (`is_public`), popularity flags (`is_popular`), rating (`rating`), or administrative owner (`instructor_id`) modified by instructors.
   - Malicious or inadvertent modification of these attributes compromises platform revenue and public catalog integrity.
2. **Defensive API Behavior (Silent Stripping vs. Strict Rejection)**:
   - When an attacker or compromised client probes the update endpoint by passing commercial keys (`price = 0`, `status = "published"`), returning validation rejection errors (`422 Unprocessable Entity`) provides the adversary with actionable feedback about guarded parameters.
   - In contrast, utilizing a strict whitelist that silently ignores non-educational parameters while fulfilling the legitimate educational updates deprives the adversary of exploratory feedback.
3. **Forensic Audit Integrity**:
   - Educational outcomes (`what_you_learn`), requirements, and descriptions form a contractual commitment with enrolled students.
   - If an instructor alters these fields after students have purchased the course, administrators must possess an immutable historical log (`course_activity_logs`) capturing:
     - The acting user (`user_id`).
     - The action performed (`action: 'course_metadata_updated'`).
     - The before-and-after diff (`changes`: `['field' => ['old' => ..., 'new' => ...]]`).
     - The originator's network IP address (`ip_address`).
4. **Referential Integrity on User Deletion**:
   - If an instructor account is soft-deleted or removed, historical audit logs must NOT cascade-delete, as this would erase forensic accountability. `user_id` must be nullable and set to `nullOnDelete()`.
5. **Direct Cover Image Upload**:
   - Without an external media CDN service, the platform must accept direct multipart file uploads from the instructor's device, store the file locally under `storage/app/public/courses/covers/`, and expose the public asset URL while preserving existing images when unchanged.
   - Because native PHP fails to populate `$_FILES` on HTTP `PUT` and `PATCH` requests containing `multipart/form-data`, the API route must support `POST` (or `match(['PUT', 'PATCH', 'POST'])`) to guarantee seamless payload reception.

## Decision
1. **Strict Educational Whitelist via `InstructorUpdateCourseRequest`**:
   - Whitelist only educational properties:
     - `title`: `['sometimes', 'string', 'min:3', 'max:255']`
     - `description`: `['sometimes', 'string', 'min:10']`
     - `cover_image`: `['sometimes', 'nullable']` (validated as `image|mimes:jpeg,png,jpg,webp|max:2048` if a file is supplied, or `string` if unchanged)
     - `level`: `['sometimes', 'in:beginner,intermediate,advanced']`
     - `what_you_learn`: `['sometimes', 'nullable', 'array']`
     - `requirements`: `['sometimes', 'nullable', 'array']`
     - `target_audience`: `['sometimes', 'nullable', 'array']`
   - Authorization is verified using `Gate::authorize('manageAsInstructor', $course)`.
   - Any prohibited or commercial parameters (`price`, `status`, `is_public`, `instructor_id`, `rating`, `is_popular`, `youtube_playlist_id`) are excluded from the rules, ensuring `$request->validated()` silently strips them.
2. **Direct Image Ingestion in `CourseService`**:
   - If `$request->hasFile('cover_image')`, store the asset in `courses/covers` on the `public` disk and update the course's `cover_image` path.
   - If a new image is stored, safely prune the prior local cover image from disk if one existed under `courses/covers/`.
3. **Immutable `course_activity_logs` Table**:
   - Migration creates `course_activity_logs`:
     - `id` (bigint, primary key)
     - `course_id` (foreignId -> `courses`, `cascadeOnDelete`)
     - `user_id` (foreignId -> `users`, `nullable`, `nullOnDelete`)
     - `action` (string, e.g. `'course_metadata_updated'`)
     - `changes` (json, holding `['field' => ['old' => ..., 'new' => ...]]`)
     - `ip_address` (string, nullable)
     - `timestamps()`
   - Eloquent model `App\Models\CourseActivityLog` with `$fillable` and `$casts = ['changes' => 'array']`.
4. **Explicit Diffing in `CourseService::updateEducationalMetadata`**:
   - Compare old and new values before saving. Normalize array fields to prevent false diffs.
   - If no values have genuinely changed, skip log creation entirely.
   - If genuine changes exist, execute the update and log creation inside a database transaction, followed by `ContentCache::forgetCourses()`.
5. **Flexible Route Binding**:
   - Register route supporting `match(['PUT', 'PATCH', 'POST'], 'courses/{course}', [InstructorCourseController::class, 'update'])` within the instructor API route group.

## Consequences
- **Positive**:
  - Total defense against commercial parameter tampering without providing probing hints to attackers.
  - Complete, tamper-evident audit history preserved even upon user deletion.
  - Seamless support for both JSON payloads and multipart image file uploads from the instructor device.
  - Zero redundant empty logs created when no educational content changes.
- **Negative**:
  - Requires executing the new `course_activity_logs` migration.
  - Requires running `php artisan storage:link` in deployment environments if not already linked.
