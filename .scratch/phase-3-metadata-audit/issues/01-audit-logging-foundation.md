# 01: Audit Logging Foundation & Referential Preservation

**What to build:** An immutable, append-only database table `course_activity_logs` and Eloquent model `CourseActivityLog` to persist forensic change logs for courses. Crucially, `user_id` is nullable with a foreign key constraint configured with `nullOnDelete()`, guaranteeing that historical audit logs remain preserved even if a user account is deleted.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] Create migration for `course_activity_logs` with `id`, `course_id` (constrained, cascadeOnDelete), `user_id` (nullable, constrained, nullOnDelete), `action` (string), `changes` (json), `ip_address` (nullable string), and timestamps.
- [x] Add indexes on `['course_id', 'created_at']` and `['user_id']`.
- [x] Create Eloquent model `App\Models\CourseActivityLog` with `$fillable`, `$casts = ['changes' => 'array']`, and relations `belongsTo(Course::class)` and `belongsTo(User::class)`.
- [x] Unit/feature verification proving user deletion retains activity log row with `user_id = null`.
