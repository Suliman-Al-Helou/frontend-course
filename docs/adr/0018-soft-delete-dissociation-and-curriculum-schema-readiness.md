# ADR 0018: Soft-Delete Dissociation Guard, Bidirectional Role Synchronization, and Curriculum Schema Readiness

## Status
Accepted

## Context
During cross-phase dependency analysis between Phase 1 and downstream phases (Phases 2 through 7), three foundational risks were identified:
1. **Ghost References on User Soft-Deletion**:
   - The `User` model uses `SoftDeletes`. Database-level foreign key triggers (`nullOnDelete()`) ONLY fire on physical hard deletes (`DELETE FROM users`).
   - When an administrator soft-deletes a user (`$user->delete()`), the database row remains. Without application-level interception, `instructors.user_id` continues to point to the soft-deleted user ID, while Eloquent's `$instructor->user` resolves to `null` due to `SoftDeletingScope`.
2. **Administrative Direct Role Demotion Desynchronization**:
   - In `AdminController::updateUserRole`, an administrator could change an instructor user's role directly to `student`.
   - Without a synchronization hook, the user lost their role, but their instructor profile remained linked to them, resulting in locked courses and broken state in `CoursePolicy`.
3. **Curriculum Schema Readiness for Later Phases**:
   - Phase 5 and Phase 7 introduce the pluggable `VideoDeliveryManager` (YouTube vs HLS).
   - Phase 4 and Phase 6 introduce lesson drafting (`is_published`).
   - Creating these columns (`video_provider` and `is_published`) in Phase 1 establishes a rock-solid schema base that subsequent phases can immediately consume without backward-incompatible migrations.

## Decision
1. **Automated Soft-Delete Hook on `User` Model**:
   - In `User::booted()`, attach a `deleting` listener:
     ```php
     static::deleting(function (User $user) {
         if (! $user->isForceDeleting()) {
             Instructor::where('user_id', $user->id)->update(['user_id' => null]);
             ContentCache::forgetInstructors();
         }
     });
     ```
2. **Bidirectional Role Demotion in `AdminController::updateUserRole`**:
   - If a user currently holding the `instructor` role is reassigned to any other role, any linked instructor profile is atomically unlinked (`user_id = null`) and the cache cleared:
     ```php
     if ($user->hasRole('instructor') && $validated['role'] !== 'instructor') {
         Instructor::where('user_id', $user->id)->update(['user_id' => null]);
         ContentCache::forgetInstructors();
     }
     ```
3. **Forward-Looking Curriculum Migration**:
   - Add `video_provider` (string, default: `'youtube'`) and `is_published` (boolean, default: `true`) to the `lessons` table with an index on `['section_id', 'is_published']`.
   - Update `Lesson` Eloquent model `$fillable` and `$casts`.

## Consequences
- **Positive**:
  - Zero ghost references: soft-deleting a user immediately reverts their instructor profile to Admin Fallback Custody.
  - Bulletproof role synchronization regardless of whether changes originate from the Instructors tab or the Users tab.
  - Future-proof curriculum schema: Phases 2, 4, 5, 6, and 7 proceed with complete schema stability.
- **Negative**:
  - Requires running the new migration `2026_11_21_123000_add_video_provider_and_is_published_to_lessons_table.php`.
