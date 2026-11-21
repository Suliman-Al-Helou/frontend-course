# 01: Self-Service Profile & Skeleton Bootstrap Slice

**What to build:** An automated process that bootstraps an initial instructor profile when a user is granted the instructor role, coupled with dedicated zero-IDOR profile endpoints (`GET /api/instructor/profile` and `PUT /api/instructor/profile`). The authenticated instructor can inspect their profile with read-only reputation metrics (`rating`, `total_reviews`, `students_count`), and update their personal dossier (bio, title, specializations, avatar, social handles, achievements). Updating the instructor name atomically updates the user's account name, while any attempt by the instructor to modify statistical metrics or `user_id` is blocked with `422 Unprocessable Entity`.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] When a user receives the Spatie `instructor` role, a skeleton `Instructor` record (`name = user.name`, `user_id = user.id`) is automatically instantiated if not already present.
- [ ] `GET /api/instructor/profile` resolves `Auth::user()->instructor` and returns biographical fields along with read-only reputation metrics (`rating`, `total_reviews`, `students_count`).
- [ ] `PUT /api/instructor/profile` validates `InstructorProfileRequest`, updating biographical information and atomically updating `users.name` when `name` is modified.
- [ ] In `InstructorProfileRequest`, the attributes `rating`, `total_reviews`, `students_count`, and `user_id` are strictly `prohibited`, returning `422 Unprocessable Entity` if present.
- [ ] Feature test `tests/Feature/Instructor/InstructorProfileTest.php` proves zero-IDOR profile resolution, metric tampering prevention, and atomic user name synchronization.
