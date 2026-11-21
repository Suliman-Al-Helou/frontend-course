# ADR 0015: Strict 1-to-1 Instructor Identity Linkage with Display-Only Profile Support (MVP)

## Status
Accepted (Amended for MVP Simplification)

## Context
In Ticket 01 (Phase 1) and Ticket 02 (Phase 2), the platform establishes identity linkage between authentication accounts (`users`) and faculty profiles (`instructors`).
Initially, a non-unique foreign key was considered to support future multi-persona faculty. However, in line with the project's **Minimalist Surface Rule** and the specialized focus of the MVP (a single programming academy domain), multi-persona profiles introduce premature architectural overhead, profile-switching UX friction, and authorization ambiguity.

The platform requires a clean, robust, and mathematically sound model that supports two core realities:
1. **Display-Only (Ghost/Marketing) Profiles**: Guest lecturers or public profiles without system login accounts (`user_id = NULL`), managed exclusively by platform administrators under Admin Fallback Custody.
2. **Managed Profiles**: Active instructor accounts linked deterministically in a **strict 1-to-1 relationship** with a single user account (`user_id` is UNIQUE when present).

## Decision
1. **Unique Nullable `user_id` Foreign Key**:
   - The `instructors` table defines `user_id` as unique and nullable:
     ```php
     $table->foreignId('user_id')
         ->nullable()
         ->unique()
         ->after('id')
         ->constrained('users')
         ->nullOnDelete();
     ```
2. **Separation of Responsibilities & Self-Service Profile Workspace**:
   - **Admin Responsibility**: Platform administrators are strictly relieved from filling out or managing personal instructor dossiers. Administrators only:
     a) Promote users to the `instructor` role.
     b) Assign courses to instructors (`courses.instructor_id`).
     c) Create and manage **Display-Only Profiles** (`user_id = NULL`) for guest lecturers or unlinked catalog entries.
   - **Instructor Responsibility**: Upon role promotion, an atomic skeleton profile (`name = user.name`, `user_id = user.id`) is automatically bootstrapped. The instructor manages, customizes, and updates their own academic dossier (bio, expertise, avatar, social links, achievements) directly within their dedicated instructor settings workspace via `GET /api/instructor/profile` and `PUT /api/instructor/profile`.
3. **Deterministic 1-to-1 Eloquent Linkage**:
   - `User::instructor()` is a strict `hasOne(Instructor::class)` relationship.
   - `Instructor::user()` is a strict `belongsTo(User::class)` relationship.
   - A user can be linked to at most ONE instructor profile. An instructor profile can belong to at most ONE user.
4. **Atomic Role Lifecycle & Admin Protection**:
   - Promoting a user to an instructor automatically ensures the presence of their linked profile and grants the Spatie `instructor` role.
   - Unlinking or deleting an instructor profile demotes the user to `student`, **unless** the user possesses the `admin` role (preventing accidental administrative lockout).
5. **Deterministic Policy Authorization**:
   - `CoursePolicy::manageAsInstructor` evaluates ownership directly without collection iteration or profile-switching headers:
     ```php
     return $course->instructor_id !== null
         && $course->instructor_id === $user->instructor?->id;
     ```

## Consequences
- **Positive**:
  - Eliminates all collection-iteration overhead and ambiguous active-profile states in policies and queries.
  - Database-enforced uniqueness guarantees zero collision where two profiles claim the same login credentials.
  - Greatly simplifies both backend API and frontend admin UI (single user picker, clean validation).
- **Negative**:
  - If a faculty member teaches distinct disciplines in the future, they operate under a single unified profile during MVP.
