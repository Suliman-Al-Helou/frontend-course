# 01: Display-Only Faculty Baseline & Presentation

**What to build:**
Platform administrators can create, edit, and view Display-Only Instructor Profiles for guest lecturers or catalog marketing entries without requiring or creating platform user login accounts (`user_id = null`). Assigned courses remain stewarded directly under Admin Fallback Custody, public and student API endpoints strip all internal user fields, and the admin UI renders a distinct "بروفايل للعرض فقط" status badge.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Database migration adds nullable unique `user_id` foreign key with `nullOnDelete()` constraint on the `instructors` table.
- [ ] Instructor Eloquent model supports nullable `user_id`, exposes `isDisplayOnly()` helper, and defines `belongsTo(User::class)`.
- [ ] User Eloquent model defines `hasOne(Instructor::class)` and `isInstructor()` helper.
- [ ] Store and update instructor form requests accept nullable `user_id` with existence validation.
- [ ] Public and student endpoints (`/api/instructors` and `/api/instructors/{id}`) never expose `user_id` or `user` object in responses.
- [ ] Administrative endpoints (`/api/admin/instructors/*`) include `user_id` and linked user summary (`id`, `name`, `email`).
- [ ] Admin instructor UI cards render the "بروفايل للعرض فقط" badge when `user_id` is null.
- [ ] Automated feature tests prove creation, updating, and public data isolation for display-only profiles.
