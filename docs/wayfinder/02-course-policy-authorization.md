# Ticket 02: Phase 2 — CoursePolicy & IDOR Prevention Tests

**Tracker Label**: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/docs/wayfinder/map.md)  
**Status**: Open (Blocked by Ticket 01)  
**Assignee**: Unassigned  
**Blocked by**: [Ticket 01: Phase 1 — User ID Migration & Admin Instructor Linking](file:///home/suliman/Documents/courses/docs/wayfinder/01-user-id-admin-linking.md)  

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
   - Extend policy checks for nested curriculum elements (`manageSectionAsInstructor`, `manageLessonAsInstructor`) verifying ownership of the parent course via `$section->course` and `$lesson->getCourse()`.
2. **Dedicated Instructor Route Group (`backendCourse/routes/api.php`):**
   - Register route group:
     ```php
     Route::middleware(['auth:sanctum', 'role:instructor|admin'])
         ->prefix('instructor')
         ->group(function () {
             Route::get('/courses', [InstructorCourseController::class, 'index']);
             Route::get('/courses/{course}', [InstructorCourseController::class, 'show']);
             Route::put('/courses/{course}', [InstructorCourseController::class, 'update']);
             Route::get('/courses/{course}/sections', [InstructorSectionController::class, 'index']);
             Route::post('/courses/{course}/sections', [InstructorSectionController::class, 'store']);
             Route::delete('/sections/{section}', [InstructorSectionController::class, 'destroy']);
             Route::post('/sections/{section}/lessons', [InstructorLessonController::class, 'store']);
             Route::put('/lessons/{lesson}', [InstructorLessonController::class, 'update']);
             Route::delete('/lessons/{lesson}', [InstructorLessonController::class, 'destroy']);
         });
     ```
   - In all controller actions, call `$this->authorize('manageAsInstructor', $course)` or use middleware `can:manageAsInstructor,course`.
3. **Automated Feature Security Tests (`tests/Feature/Instructor/InstructorAuthorizationTest.php`):**
   - Create `Instructor A` (assigned to `Course A`) and `Instructor B` (assigned to `Course B`).
   - Acting as `Instructor A`:
     - Accessing `Course A` returns `200 OK`.
     - Accessing `Course B` returns `403 Forbidden`.
     - Attempting to update `Course B` returns `403 Forbidden`.
     - Attempting to add a section/lesson to `Course B` returns `403 Forbidden`.
   - Acting as `Admin`:
     - Accessing or modifying `Course A` or `Course B` returns `200 OK`.
   - Acting as `Student`:
     - Any request to `/api/instructor/*` returns `403 Forbidden`.
