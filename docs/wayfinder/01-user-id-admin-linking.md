# Ticket 01: Phase 1 — User ID Migration & Admin Instructor Linking

**Tracker Label**: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/docs/wayfinder/map.md)  
**Status**: Open (Frontier — Unblocked)  
**Assignee**: Unassigned  
**Blocked by**: None  

## Question

How do we establish deterministic identity linkage between authentication accounts (`users`) and instructor profiles (`instructors`), and resolve UNVERIFIED #1 by allowing administrators to link an instructor to a user account before any instructor endpoint is introduced?

## Acceptance Criteria

1. **Database Schema & Eloquent Relations:**
   - Create migration adding `user_id` (`foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()`) with an index to the `instructors` table.
   - Update `app/Models/Instructor.php`:
     - Add `user_id` to `$fillable`.
     - Define `public function user(): BelongsTo { return $this->belongsTo(User::class); }`.
   - Update `app/Models/User.php`:
     - Define `public function instructor(): HasOne { return $this->hasOne(Instructor::class); }`.
     - Add `public function isInstructor(): bool { return $this->hasRole('instructor'); }`.
   - Update `app/Enums/UserRole.php` to include `case INSTRUCTOR = 'instructor'`.
2. **Admin API Updates (`backendCourse`):**
   - Update `app/Http/Requests/InstructorRequest.php` & `UpdateInstructorRequest.php` to accept `'user_id' => ['nullable', 'integer', 'exists:users,id']`.
   - Update `app/Http/Resources/InstructorResource.php` and `InstructorDetailResource.php` to expose `user_id` and basic linked user summary (`id`, `name`, `email`).
   - In `app/Services/InstructorService.php`, ensure `user_id` is persisted during `create()` and `update()`.
3. **Admin Frontend User-Linking UI (Resolves UNVERIFIED #1):**
   - In `frontend-course/src/features/instructors/components/InstructorModal.tsx` (or admin instructor form):
     - Add a searchable User Select field querying users with role `instructor` (or candidate users) to link to the profile.
     - Display linked user account badge on the Instructor card/table row.
4. **Seeders & Tests:**
   - Update `database/seeders/DatabaseSeeder.php` and `DemoSeeder.php` to create an instructor user account with Spatie role `instructor` linked to an instructor profile.
   - Write feature test `tests/Feature/Admin/InstructorUserLinkingTest.php` proving admin can create/update an instructor profile with a linked `user_id`.
