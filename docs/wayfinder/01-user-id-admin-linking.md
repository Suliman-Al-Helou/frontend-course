# Ticket 01: Phase 1 — User ID Migration & Admin Instructor Linking

** **: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/docs/wayfinder/map.md)  
**Status**: Open (Frontier — Unblocked)  
**Assignee**: Unassigned  
**Blocked by**: None  

## Question

How do we establish deterministic identity linkage between authentication accounts (`users`) and instructor profiles (`instructors`), supporting both Display-Only (Ghost/Marketing) profiles and Managed operational profiles, and allowing administrators to link an instructor to a user account before any instructor endpoint is introduced?

## Acceptance Criteria

1. **Database Schema & Eloquent Relations:**
   - Create migration adding `user_id` (`foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()`) with an index (non-unique, per ADR 0015) to the `instructors` table.
   - Update `app/Models/Instructor.php`:
     - Add `user_id` to `$fillable`.
     - Define `public function user(): BelongsTo { return $this->belongsTo(User::class); }`.
     - Add helper `public function isDisplayOnly(): bool { return is_null($this->user_id); }`.
   - Update `app/Models/User.php`:
     - Define `public function instructors(): HasMany { return $this->hasMany(Instructor::class); }`.
     - Define `public function instructor(): HasOne { return $this->hasOne(Instructor::class)->latestOfMany(); }` for primary profile convenience.
     - Add `public function isInstructor(): bool { return $this->hasRole('instructor'); }`.
   - Update `app/Enums/UserRole.php` to include `case INSTRUCTOR = 'instructor'`.
2. **Admin API Updates (`backendCourse`):**
   - Update `app/Http/Requests/InstructorRequest.php` & `UpdateInstructorRequest.php` to accept `'user_id' => ['nullable', 'integer', 'exists:users,id']`.
   - Update `app/Http/Resources/InstructorResource.php` and `InstructorDetailResource.php` to expose `user_id`, `is_display_only`, and basic linked user summary (`id`, `name`, `email`).
   - In `app/Services/InstructorService.php`:
     - Ensure `user_id` is persisted during `create()` and `update()`.
     - Automatically grant Spatie `instructor` role to user upon linking if not already present.
     - When unlinking or deleting an instructor profile, if the user has no remaining linked profiles, safely revert role to `student`.
     - When an instructor is deleted, existing courses preserve integrity via `Admin Fallback Custody` (`courses.instructor_id` set to null or reassigned).
3. **Admin Frontend User-Linking UI (Resolves UNVERIFIED #1):**
   - In `frontend-course/src/features/instructors/components/InstructorModal.tsx` (or admin instructor form):
     - Add a searchable User Select field querying candidate users to link to the profile, with an option to leave blank for "Display-Only / للعرض فقط".
     - Display a distinct badge: "بروفايل للعرض فقط" (Display Only) vs "حساب مربوط: [الاسم]" (Linked Account) on the Instructor card/table row.
4. **Seeders & Tests:**
   - Update `database/seeders/DatabaseSeeder.php` and `DemoSeeder.php` to create:
     - An instructor user account with Spatie role `instructor` linked to an active instructor profile.
     - A display-only instructor profile with `user_id = null`.
   - Write feature test `tests/Feature/Admin/InstructorUserLinkingTest.php` proving admin can create/update an instructor profile with a linked `user_id`, auto-promotes role, and safely unlinks.
