# Ticket 02: Phase 2 — CoursePolicy & IDOR Prevention Tests

**Tracker Label**: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/map.md)  
**Spec**: [Spec: Phase 2](file:///home/suliman/Documents/courses/frontend-course/docs/spec/02-instructor-course-policy-and-idor-prevention.md)  
**Status**: Ready for Execution (`ready-for-agent`)  
**Assignee**: Unassigned  
**Sub-Tickets (Tracer Bullets)**:
1. [01: Self-Service Profile & Skeleton Bootstrap](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-2-authorization/issues/01-self-service-profile-and-bootstrap.md) (`ready-for-agent`, Frontier)
2. [02: CoursePolicy Engine & Scoped Course Listing](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-2-authorization/issues/02-course-policy-engine-and-scoping.md) (Blocked by 01)
3. [03: Course Mutation & Prohibited Attributes Guard](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-2-authorization/issues/03-course-mutation-and-prohibited-attributes.md) (Blocked by 02)
4. [04: Curriculum Sections & Integrity Guard](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-2-authorization/issues/04-curriculum-sections-and-integrity-guard.md) (Blocked by 03)
5. [05: Curriculum Lessons & Full Security Suite](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-2-authorization/issues/05-curriculum-lessons-and-security-suite.md) (Blocked by 04)

## Question

How do we eliminate IDOR vulnerabilities across all instructor course, curriculum, and lesson endpoints so that instructors can strictly access only courses explicitly assigned to them, while platform administrators retain oversight?

## Acceptance Criteria

1. **Policy Enforcement in `app/Policies/CoursePolicy.php`:**
   - Implement `manageAsInstructor(User $user, Course $course): bool`:
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
             && $course->instructor_id === $user->instructor?->id;
     }
     ```
   - Enforce centralized **Parent Traversal Authorization** (ADR 0016) for nested curriculum elements (`$section->course` and `$lesson->getCourse()`).
   - If an entity has a broken/missing parent relation, immediately abort with `404 Not Found` before running authorization.

2. **Dedicated Instructor Route Group (`backendCourse/routes/api.php`):**
   - Register route group:
     ```php
     Route::middleware(['auth:sanctum', 'role:instructor|admin'])
         ->prefix('instructor')
         ->group(function () {
             // Self-Service Profile (Zero-IDOR)
             Route::get('/profile', [InstructorProfileController::class, 'show']);
             Route::put('/profile', [InstructorProfileController::class, 'update']);

             // Courses
             Route::get('/courses', [InstructorCourseController::class, 'index']);
             Route::get('/courses/{course}', [InstructorCourseController::class, 'show']);
             Route::put('/courses/{course}', [InstructorCourseController::class, 'update']);

             // Curriculum Sections
             Route::get('/courses/{course}/sections', [InstructorSectionController::class, 'index']);
             Route::post('/courses/{course}/sections', [InstructorSectionController::class, 'store']);
             Route::put('/sections/{section}', [InstructorSectionController::class, 'update']);
             Route::delete('/sections/{section}', [InstructorSectionController::class, 'destroy']);

             // Curriculum Lessons
             Route::post('/sections/{section}/lessons', [InstructorLessonController::class, 'store']);
             Route::put('/lessons/{lesson}', [InstructorLessonController::class, 'update']);
             Route::delete('/lessons/{lesson}', [InstructorLessonController::class, 'destroy']);
         });
     ```
   - In all mutation FormRequests (`InstructorUpdateCourseRequest`, `InstructorSectionRequest`, `InstructorLessonRequest`, `InstructorProfileRequest`), implement `authorize()` so authorization strictly precedes input validation.
   - Guard course mutation payloads with `prohibited` on: `['price', 'youtube_playlist_id', 'instructor_id', 'is_public', 'status']`.
   - Guard profile mutation payloads with `prohibited` on: `['rating', 'total_reviews', 'students_count', 'user_id']`. Expose these stats as read-only badges in `GET /profile` (managed exclusively by Admin in MVP). Editing `name` in profile atomically syncs `users.name`.
   - Enforce **Curriculum Deletion Integrity Guard**: Reject section/lesson deletion requests with `422 Unprocessable Entity` if any student has completed progress (`completed = true`).

3. **Automated Feature Security Tests (`tests/Feature/Instructor/InstructorAuthorizationTest.php`):**
   - Create `Instructor A` (assigned to `Course A`) and `Instructor B` (assigned to `Course B`).
   - Acting as `Instructor A`:
     - Accessing `Course A` returns `200 OK` via `CourseInstructorResource`.
     - Accessing `Course B` returns `403 Forbidden`.
     - Attempting to update `Course B` returns `403 Forbidden` (even with invalid/empty payloads, proving zero data leak).
     - Attempting to add/update/delete a section or lesson on `Course B` returns `403 Forbidden`.
     - Updating `Course A` with a prohibited field (`price`) returns `422 Unprocessable Entity`.
     - Updating own profile with a prohibited field (`rating`) returns `422 Unprocessable Entity`.
     - Deleting a lesson on `Course A` that has completed student progress returns `422 Unprocessable Entity`.
     - Deleting an unstudied lesson on `Course A` returns `204 No Content`.
   - Acting as `Admin`:
     - Accessing or modifying `Course A` or `Course B` returns `200 OK`.
     - Listing `/api/instructor/courses` returns all courses (or filtered by `?managed_by_me=true`).
   - Acting as `Student`:
     - Any request to `/api/instructor/*` returns `403 Forbidden`.
   - Unauthenticated:
     - Any request to `/api/instructor/*` returns `401 Unauthorized`.
