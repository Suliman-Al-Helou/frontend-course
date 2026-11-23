# Spec: Phase 3 — Educational Metadata Updates, Silent Stripping, and Immutable Activity Audit Logging

**Status**: Ready for Implementation  
**Triage Label**: `ready-for-agent`  
**Parent Roadmap**: [Wayfinder Map](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/map.md)  
**Associated Ticket**: [Ticket 03: Phase 3](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/03-metadata-updates-activity-audit.md)  
**Governing Architectural Decisions**:
- [ADR 0016: Instructor CoursePolicy, IDOR Prevention Boundary, and Centralized Parent Traversal](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0016-instructor-course-policy-and-idor-prevention.md)
- [ADR 0018: Soft-Delete Dissociation Guard, Bidirectional Role Synchronization, and Curriculum Schema Readiness](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0018-soft-delete-dissociation-and-curriculum-schema-readiness.md)
- [ADR 0019: Educational Metadata Updates, Silent Commercial Stripping, and Immutable Activity Audit Logging](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0019-educational-metadata-updates-and-immutable-activity-audit.md)

---

## Problem Statement

Instructors need the ability to maintain and refine their course educational metadata (title, description, outcomes, requirements, target audience, difficulty level, cover image) in real time without administrative bottlenecks. However, allowing instructors direct mutation access to the `courses` entity presents severe operational and financial vulnerabilities:

1. **Commercial & Financial Tampering**:
   - Instructors could tamper with financial or catalog settings—such as dropping course prices to zero (`price = 0`), publishing unapproved courses (`status = "published"`), hiding published courses from paying students (`is_public = false`), or altering platform YouTube channel integration playlists (`youtube_playlist_id`).
2. **Attacker Probing & Validation Telemetry**:
   - If unauthorized commercial fields are rejected with HTTP 422 errors, an adversary probing the API gains intelligence regarding which parameters are guarded.
3. **Contractual Vulnerability & Bait-and-Switch**:
   - When a student enrolls in a paid course, the syllabus and learning outcomes constitute a contractual learning agreement. If an instructor arbitrarily changes or clears out outcomes without accountability, administrators have no verifiable forensic record to adjudicate student disputes.
4. **Referential Fragility on User Deletion**:
   - If an instructor account is soft-deleted or removed from the system, standard cascading deletion (`cascadeOnDelete`) would wipe out the historical audit logs, permanently erasing the forensic paper trail.
5. **Asset Storage Bottlenecks**:
   - Without an external cloud media microservice, cover images must be uploaded directly from the instructor's device without breaking standard HTTP REST conventions in PHP/Laravel (where native multipart form data parsing fails on `PUT`/`PATCH`).

---

## Solution

Build an isolated, defensively guarded educational mutation pipeline that enforces **Silent Commercial Stripping** and records an immutable forensic **Course Activity Log**.

Key architectural components include:
1. **Defensive FormRequest Whitelist**:
   - `InstructorUpdateCourseRequest` explicitly whitelists only pedagogical fields.
   - Any injected commercial or administrative properties (`price`, `status`, `is_public`, `instructor_id`, `rating`, `is_popular`, `youtube_playlist_id`) are stripped silently from the validated payload. The request completes with `200 OK`, updating legitimate educational parameters while leaving commercial parameters strictly intact in the database.
2. **Direct Local Ingestion for Cover Images**:
   - The mutation accepts both direct file uploads (`image|mimes:jpeg,png,jpg,webp|max:2048`) and existing URL strings.
   - Files are stored on the `public` storage disk under `courses/covers/`, with old local cover files pruned upon replacement.
3. **Immutable `course_activity_logs` Table**:
   - An append-only historical log table capturing `course_id`, `user_id` (with `nullOnDelete`), `action`, `changes` (JSON holding exact `old` vs `new` diffs), `ip_address`, and timestamps.
4. **Smart Diffing in `CourseService::updateEducationalMetadata`**:
   - The service inspects incoming values against current course attributes (normalizing arrays to prevent false positives). If no values genuinely changed, log creation is bypassed to avoid database bloat.
5. **Multi-Verb Route Binding**:
   - Registering `match(['PUT', 'PATCH', 'POST'], 'courses/{course}', ...)` ensures both standard JSON payloads and multipart `FormData` submissions (via `_method: 'PUT'`) are parsed cleanly without runtime exceptions.

---

## User Stories

1. As an instructor, I want to update my assigned course's title and description, so that my course information remains accurate and engaging.
2. As an instructor, I want to update learning outcomes (`what_you_learn`) as a structured list, so that prospective students clearly understand what skills they will acquire.
3. As an instructor, I want to update course prerequisites (`requirements`) and target audiences (`target_audience`), so that prospective students can assess if the course fits their background.
4. As an instructor, I want to adjust the course difficulty level (`beginner`, `intermediate`, `advanced`), so that learners are properly categorized.
5. As an instructor, I want to upload a new cover image directly from my computer, so that my course displays an attractive, relevant banner in the catalog.
6. As an instructor, I want to update educational text attributes without re-uploading the cover image, so that I don't have to keep a local copy of the existing banner image on hand.
7. As an instructor, I want any unauthorized attempt by another instructor to modify my course to be blocked with `403 Forbidden`, so that my curriculum is protected from malicious tampering.
8. As a malicious user or penetration tester, when I submit prohibited commercial fields (such as `price: 0`, `status: "published"`, or a hijacked `youtube_playlist_id`), I want the server to return `200 OK` without error indicators, while secretly discarding all commercial parameters, so that my exploratory probing yields no actionable validation hints while the database remains completely untampered.
9. As a platform administrator, I want course pricing, publication status, visibility flags, instructor ownership, and YouTube playlist IDs to remain strictly unchanged when an instructor edits their course, so that the platform's revenue model and catalog integrity are preserved.
10. As a platform administrator, I want every educational update made to a course to be logged in `course_activity_logs` with the exact before-and-after diff, acting user ID, and IP address, so that I have a verifiable forensic audit trail in case of student disputes.
11. As a platform administrator, I want no audit log entries to be created if an instructor clicks "Save" without changing any values, so that the audit table is not cluttered with empty records.
12. As a platform administrator, I want to be able to supervise and edit any course's educational metadata via the instructor endpoint, with my admin user ID correctly logged as the acting author of the change.
13. As a platform administrator, I want audit log entries to remain permanently in the database with `user_id = null` even if the instructor user account is soft-deleted or removed, so that historical accountability is never erased.
14. As a student, I want the course catalog and detail views to reflect updated course titles and descriptions immediately without delay, guaranteed by automatic cache invalidation (`ContentCache::forgetCourses()`).
15. As an API client, I want validation errors (`422 Unprocessable Entity`) returned with clear field-specific feedback when educational constraints are violated (e.g., title < 3 characters, description < 10 characters, or invalid level strings), so that forms can display localized error messages.

---

## Implementation Decisions

### 1. Dedicated FormRequest (`App\Http\Requests\InstructorUpdateCourseRequest`)
- Authorization delegated to `Gate::authorize('manageAsInstructor', $course)`.
- Strict validation rules:
  - `title`: `['sometimes', 'string', 'min:3', 'max:255']`
  - `description`: `['sometimes', 'string', 'min:10']`
  - `cover_image`: `['sometimes', 'nullable']` (validated via callable/rules: file must be `image|mimes:jpeg,png,jpg,webp|max:2048`; string must be `string|max:2048`)
  - `level`: `['sometimes', 'in:beginner,intermediate,advanced']`
  - `what_you_learn`: `['sometimes', 'nullable', 'array']`, `what_you_learn.*`: `['string', 'max:255']`
  - `requirements`: `['sometimes', 'nullable', 'array']`, `requirements.*`: `['string', 'max:255']`
  - `target_audience`: `['sometimes', 'nullable', 'array']`, `target_audience.*`: `['string', 'max:255']`
- Commercial/administrative attributes are omitted from rules, ensuring `$request->validated()` silently excludes them.

### 2. Database Schema Migration (`create_course_activity_logs_table`)
- Columns:
  - `id`: bigIncrements primary key
  - `course_id`: foreignId constrained to `courses` table with `cascadeOnDelete()`
  - `user_id`: foreignId constrained to `users` table with `nullable()` and `nullOnDelete()`
  - `action`: string (e.g. `'course_metadata_updated'`)
  - `changes`: json (holding `['field' => ['old' => ..., 'new' => ...]]`)
  - `ip_address`: string nullable
  - `timestamps()`
- Indexes on `['course_id', 'created_at']` and `['user_id']`.

### 3. Eloquent Model (`App\Models\CourseActivityLog`)
- Fillable: `course_id`, `user_id`, `action`, `changes`, `ip_address`.
- Casts: `'changes' => 'array'`.
- Relationships:
  - `belongsTo(Course::class)`
  - `belongsTo(User::class)`

### 4. Service Layer (`App\Services\CourseService`)
- New method `updateEducationalMetadata(Course $course, array $validated, ?User $user = null, ?string $ipAddress = null): Course`:
  1. Detect and store uploaded file if present (`$validated['cover_image'] instanceof UploadedFile`), resolving public URL and pruning old local file if found under `courses/covers/`.
  2. Compute array diff against current `$course` attributes, normalizing JSON arrays (`array_values`).
  3. If diff is empty, return `$course` immediately without writing a log.
  4. Wrap in `DB::transaction`:
     - Update `$course->update($attributesToUpdate)`.
     - Create `CourseActivityLog::create([...])`.
  5. Call `ContentCache::forgetCourses()`.
  6. Return `$course->fresh()`.

### 5. Controller Endpoint (`App\Http\Controllers\Api\Instructor\InstructorCourseController`)
- Implement `update(InstructorUpdateCourseRequest $request, Course $course): JsonResponse`:
  - Invoke `CourseService::updateEducationalMetadata`.
  - Return updated course wrapped in `CourseInstructorResource`.

### 6. Route Registration (`routes/api.php`)
- Inside `Route::prefix('instructor')->middleware(['auth:sanctum', 'role:instructor|admin'])`:
  - `Route::match(['PUT', 'PATCH', 'POST'], 'courses/{course}', [InstructorCourseController::class, 'update']);`

---

## Testing Decisions

### What Makes a Good Test
- Tests must assert observable external outcomes (HTTP status codes, database persisted rows, audit log entries, JSON response schemas) rather than internal implementation details.
- Every test must verify both positive execution and strict negative defense boundaries (authorization IDOR blocks, schema bounds, and commercial tamper isolation).

### Test Suite (`tests/Feature/Instructor/InstructorCourseMetadataUpdateTest.php`)
1. **Authentication Gate**: Unauthenticated requests receive `401 Unauthorized`.
2. **Cross-Tenant IDOR Prevention**: Instructor B attempting to modify Instructor A's course receives `403 Forbidden`.
3. **Educational Metadata Update & Diff Logging**: Instructor updates pedagogical attributes; database updates, and `course_activity_logs` records the exact before/after diff.
4. **Silent Commercial Stripping**: Payload injecting `price`, `status`, `is_public`, `is_popular`, `rating`, `instructor_id`, and `youtube_playlist_id` returns `200 OK`, updates educational fields, leaves commercial fields strictly untouched in the database, and excludes them from the audit log.
5. **Redundant Log Suppression**: Submitting identical data returns `200 OK` with zero new rows in `course_activity_logs`.
6. **Direct Cover Image Upload**: Uploading an image file stores the asset on the public disk, updates the course's `cover_image`, and logs the change.
7. **Referential Integrity on Soft-Delete**: Soft-deleting the instructor user preserves the audit log row with `user_id = null`.
8. **Supervisory Admin Modification**: Admin updating the course succeeds and logs `user_id == admin->id`.
9. **Validation Bounds**: Titles < 3 characters, descriptions < 10 characters, invalid level strings, and non-image files return `422 Unprocessable Entity` with validation errors.

### Prior Art
- `tests/Feature/Instructor/InstructorCourseTest.php` (Authorization, course listing, and show endpoints).
- `tests/Feature/Instructor/InstructorProfileTest.php` (Profile mutations, prohibited attribute assertions).

---

## Out of Scope

1. **Direct Course Creation/Deletion by Instructors**:
   - Instructors only manage courses assigned by administrators; self-service course creation and hard course deletion remain administrative responsibilities.
2. **Pre-Approval Moderation Queue**:
   - Educational updates take effect immediately in real time; there is no pending approval state before live application.
3. **Public/Instructor Audit Log Viewer UI**:
   - Phase 3 implements the storage, schema, service, and validation boundaries. Dedicated administrative audit log viewers and timeline dashboards belong to later administrative tooling phases.
4. **Third-Party CDN Image Uploads**:
   - Image assets are stored on the local public storage disk; external image CDN offloading is deferred.

---

## Further Notes

- Executing this phase requires generating and running the migration for `course_activity_logs`.
- Deployment requires verifying that `php artisan storage:link` has been executed to expose uploaded cover images.
