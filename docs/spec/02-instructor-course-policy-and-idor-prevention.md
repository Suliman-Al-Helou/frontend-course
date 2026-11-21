# Spec: Phase 2 — CoursePolicy, IDOR Prevention Boundary, and Dedicated Instructor Workspace

**Status**: Ready for Implementation  
**Triage Label**: `ready-for-agent`  
**Parent Roadmap**: [Wayfinder Map](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/map.md)  
**Associated Ticket**: [Ticket 02: Phase 2](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/02-course-policy-authorization.md)  
**Governing Architectural Decisions**:
- [ADR 0014: Instructor Portal Vertical Slice and Isolated Components](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0014-instructor-portal-vertical-slice-and-isolated-components.md)
- [ADR 0015: Strict 1-to-1 Instructor Identity Linkage with Display-Only Profile Support](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0015-decoupled-instructor-identity-and-display-profiles.md)
- [ADR 0016: Instructor CoursePolicy, IDOR Prevention Boundary, and Centralized Parent Traversal](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0016-instructor-course-policy-and-idor-prevention.md)

---

## Problem Statement

When academic faculty log into the learning platform, there is no isolated, authorization-guarded API boundary specifically built for instructors. Currently, course and curriculum mutations are processed through administrative endpoints or lack strict role and ownership gates.

Without strict authorization, the system is exposed to Insecure Direct Object References (IDOR): an authenticated instructor could probe, inspect, modify, or delete courses, sections, and lessons assigned to another instructor by manipulating URL parameters. Furthermore:
1. Malicious or malformed payloads can leak validation schemas before authorization is checked (ID enumeration).
2. Deleting lessons or sections currently risks wiping student progress history and invalidating course completion certificates.
3. Administrative responsibilities are blurred with instructor duties (administrators are burdened with manually typing instructors' personal biographies and social links, while instructors might accidentally be exposed to platform pricing and YouTube channel tokens).

---

## Solution

Establish an isolated, hardened Instructor API boundary (`/api/instructor/*`) protected by a centralized **Parent Traversal Authorization** engine in `CoursePolicy`.

The solution guarantees that:
1. Instructors can access, modify, and build curriculum only for courses explicitly assigned to their profile (`courses.instructor_id === user.instructor.id`).
2. Any unauthorized cross-tenant attempt immediately terminates with `403 Forbidden` prior to payload validation (Zero-Leakage Lifecycle).
3. Instructors self-manage their academic profile (bio, title, expertise, avatar, social handles) via dedicated zero-IDOR endpoints, while administrators maintain supervisory oversight, course assignment custody, and control over guest "Display-Only" profiles.
4. Commercial attributes (pricing, publishing approvals, YouTube integration keys) and statistical metrics (rating, reviews, student counts) are guarded using defensive validation (`prohibited`), preventing any unauthorized tampering.
5. Student academic records are protected by a **Curriculum Deletion Integrity Guard** that blocks the deletion of lessons or sections containing recorded student completions.

---

## User Stories

1. As an instructor, I want to access only the courses explicitly assigned to my profile, so that I cannot view or tamper with other instructors' courses.
2. As an instructor, I want any attempt by another instructor to access, view, or modify my assigned course to be rejected immediately with `403 Forbidden`, so that my intellectual property and course materials are completely secure.
3. As an instructor, I want any unauthorized attempt to update my course with an invalid payload to still return `403 Forbidden` rather than validation errors, so that attackers cannot probe my course's schema or existence.
4. As an instructor, I want to view the list of all courses assigned to me when I navigate to my courses dashboard, so that I can select a course to build or edit.
5. As an instructor with no assigned courses yet, I want the course listing endpoint to return an empty array with `200 OK`, so that my interface renders a welcoming empty state rather than an error.
6. As an instructor, I want to inspect my assigned course details through a specialized instructor resource, so that I see all necessary educational metadata without distracting administrative flags.
7. As an instructor, I want to update my course's educational metadata (title, description, cover image, learning outcomes, requirements, target audience, level), so that my syllabus is comprehensive and up-to-date.
8. As an instructor, I want the system to reject any attempt I might make to modify course pricing, platform YouTube playlist keys, or publication status with `422 Unprocessable Entity`, so that commercial and administrative platform settings remain strictly guarded.
9. As an instructor, I want to view all sections and lessons belonging to my assigned course, so that I can visualize the complete curriculum tree.
10. As an instructor, I want to create new sections under my assigned course, so that I can organize lessons into logical educational modules.
11. As an instructor, I want to update section titles and display order, so that I can correct typographical mistakes or reorganize my syllabus without having to delete and re-create sections.
12. As an instructor, I want to delete empty or unstudied sections from my course, so that I can clean up draft syllabus outlines.
13. As an instructor, I want to create new lessons under a section in my assigned course, specifying lesson title, duration, description, order, and preview status, so that students have structured content.
14. As an instructor, I want to update existing lessons in my course, so that I can refine lesson descriptions, order, and video associations.
15. As an instructor, I want to delete unstudied lessons from my course, so that I can prune obsolete draft lessons.
16. As a student, I want my lesson progress and completion timestamps preserved against accidental instructor deletion, so that my earned certificates and course completion percentage are never lost.
17. As an instructor, I want the system to block me from deleting a lesson or section that students have already completed with a clear `422 Unprocessable Entity` message, so that I am alerted to student activity and guided to edit or unpublish instead.
18. As an instructor, I want to manage my own academic dossier (name, title, bio, specializations, years of experience, avatar, social handles, achievements) directly from my portal settings, so that I have full autonomy over my professional representation.
19. As an instructor, I want updating my name in my academic dossier to atomically synchronize my user account name, so that my legal and display identities remain unified across the platform.
20. As an instructor, I want to view my average rating, total reviews, and total enrolled students as read-only metric badges on my profile, so that I can monitor my performance without having permission to forge my reputation.
21. As an administrator, I want to access and supervise any course on the platform through the instructor endpoints with `200 OK`, so that I can review instructor progress and provide administrative support.
22. As an administrator, I want to filter the instructor course listing to show courses under direct admin custody, so that I can quickly assign them to faculty or manage them directly.
23. As an administrator, I want a skeleton instructor profile automatically bootstrapped whenever I promote a user to an instructor, so that the instructor record is immediately available for course assignment without manual data entry.
24. As an administrator, I want to create Display-Only instructor profiles for guest professors without login accounts, so that our public course catalog can feature guest lecturers while course management remains under admin fallback custody.
25. As a student or unauthenticated visitor, I want any request I send to `/api/instructor/*` to be rejected with `403 Forbidden` (for students) or `401 Unauthorized` (for guests), so that instructor controls are strictly gated by authentication and role checks.

---

## Implementation Decisions

### 1. Identity Linkage & Profile Architecture
- **Strict 1-to-1 Model**: One `User` maps to at most one `Instructor` profile (`User::instructor()`, `Instructor::user()`). The database enforces uniqueness on `instructors.user_id` while allowing `null` for Display-Only profiles.
- **Skeleton Profile Bootstrap**: Granting the Spatie `instructor` role automatically instantiates a minimal `Instructor` profile (`name = user.name`, `user_id = user.id`) if none exists.
- **Self-Service Zero-IDOR Endpoints**: Profile inspection and mutation are routed through `GET /api/instructor/profile` and `PUT /api/instructor/profile`. The controller resolves the model from `Auth::user()->instructor`, eliminating URL ID parameters and completely neutralizing IDOR risks.

### 2. Centralized Parent Traversal Authorization Engine
- **Single Authority**: `CoursePolicy::manageAsInstructor(User $user, Course $course): bool` is the sole policy method governing all course and curriculum actions.
- **Parent Traversal in Controllers**:
  - Courses: Authorize `$course`.
  - Sections: Authorize `$section->course` (or parent `$course` on store).
  - Lessons: Authorize `$lesson->getCourse()` (or parent `$section->course` on store).
- **Orphan Guard**: If an entity is detached or lacks its expected parent in the database, the controller aborts with `404 Not Found` before authorization logic runs.

### 3. Route Matrix & Controller Responsibilities
Dedicated route group prefixed with `/api/instructor` protected by `auth:sanctum` and `role:instructor|admin`:
- **InstructorProfileController**:
  - `GET /profile`: Returns `CourseInstructorProfileResource` with biographical fields and read-only reputation metrics (`rating`, `total_reviews`, `students_count`).
  - `PUT /profile`: Validates `InstructorProfileRequest`, updates biographical fields, and atomically synchronizes `users.name`.
- **InstructorCourseController**:
  - `GET /courses`: Scopes query to `courses.instructor_id === $user->instructor->id`. For administrators, returns all platform courses, supporting `?managed_by_me=true`. Returns `[]` with `200 OK` for empty states.
  - `GET /courses/{course}`: Authorizes `manageAsInstructor`. Returns `CourseInstructorResource`.
  - `PUT /courses/{course}`: Authorizes `manageAsInstructor`. Validates `InstructorUpdateCourseRequest` and updates educational fields.
- **InstructorSectionController**:
  - `GET /courses/{course}/sections`: Authorizes `manageAsInstructor`. Returns curriculum tree.
  - `POST /courses/{course}/sections`: Authorizes `manageAsInstructor`. Creates section under course.
  - `PUT /sections/{section}`: Authorizes `manageAsInstructor` via `$section->course`. Updates title and order.
  - `DELETE /sections/{section}`: Authorizes `manageAsInstructor` via `$section->course`. Enforces Deletion Integrity Guard.
- **InstructorLessonController**:
  - `POST /sections/{section}/lessons`: Authorizes `manageAsInstructor` via `$section->course`. Creates lesson under section.
  - `PUT /lessons/{lesson}`: Authorizes `manageAsInstructor` via `$lesson->getCourse()`. Updates lesson details.
  - `DELETE /lessons/{lesson}`: Authorizes `manageAsInstructor` via `$lesson->getCourse()`. Enforces Deletion Integrity Guard.

### 4. Zero-Leakage FormRequest Lifecycle (Authorization Precedes Validation)
- In all mutation FormRequests (`InstructorUpdateCourseRequest`, `InstructorSectionRequest`, `InstructorLessonRequest`, `InstructorProfileRequest`), the `authorize()` method executes policy evaluation:
  ```php
  public function authorize(): bool
  {
      $course = $this->route('course') 
          ?? $this->route('section')?->course 
          ?? $this->route('lesson')?->getCourse();

      return $course !== null && $this->user()->can('manageAsInstructor', $course);
  }
  ```
- Because Laravel's request lifecycle executes `authorize()` prior to `rules()`, unauthorized requests with malformed, empty, or probing payloads fail immediately with `403 Forbidden`, preventing validation schema leakage and object existence enumeration.

### 5. Prohibited Attributes Guard
- **Course Updates**: Fields `'price'`, `'youtube_playlist_id'`, `'instructor_id'`, `'is_public'`, and `'status'` are assigned the `'prohibited'` validation rule. Requests containing any of these keys fail immediately with `422 Unprocessable Entity`.
- **Profile Updates**: Fields `'rating'`, `'total_reviews'`, `'students_count'`, and `'user_id'` are assigned the `'prohibited'` validation rule. In the current MVP, these metrics are strictly maintained by platform administrators or calculated internally.

### 6. Curriculum Deletion Integrity Guard
- Before deleting a lesson or section, the system queries for existing student completion records:
  ```php
  if ($lesson->progress()->where('completed', true)->exists()) {
      abort(422, 'Cannot delete a lesson with recorded student progress.');
  }
  ```
- For sections, if any contained lesson has recorded completed progress, deletion is aborted with `422 Unprocessable Entity`.

---

## Testing Decisions

### Testing Seam
- **Primary Seam**: Exactly **ONE** high-level seam at the **HTTP API boundary** (`tests/Feature/Instructor/InstructorAuthorizationTest.php`).
- All tests execute through Laravel's standard HTTP testing client (`$this->actingAs($user)->getJson(...)`, `putJson`, `postJson`, `deleteJson`).
- **Why this seam?**
  1. It exercises the entire production pipeline: routing, Sanctum authentication, Spatie role middleware, FormRequest authorization timing, policy rules, controllers, database transactions, and JSON resource serialization.
  2. Avoids mocking internal policies or controllers, guaranteeing zero false positives and capturing real-world IDOR vulnerabilities.

### Test Matrix & Behavioral Scenarios
1. **Multi-Tenant IDOR Matrix**:
   - `Instructor A` (assigned to `Course A`) and `Instructor B` (assigned to `Course B`).
   - Acting as `Instructor A`:
     - Accessing `Course A` returns `200 OK`.
     - Accessing `Course B` returns `403 Forbidden`.
     - Sending a `PUT` request with an empty body to `Course B` returns `403 Forbidden` (proving authorization precedes validation).
     - Adding a section to `Course B` returns `403 Forbidden`.
     - Renaming a section of `Course B` returns `403 Forbidden`.
     - Deleting a section of `Course B` returns `403 Forbidden`.
     - Adding, editing, or deleting a lesson on `Course B` returns `403 Forbidden`.
2. **Prohibited Parameter Tampering**:
   - `Instructor A` attempting to update `price` on `Course A` receives `422 Unprocessable Entity`.
   - `Instructor A` attempting to update `rating` on their profile receives `422 Unprocessable Entity`.
3. **Deletion Integrity**:
   - `Instructor A` deleting a lesson with `completed = true` progress receives `422 Unprocessable Entity`.
   - `Instructor A` deleting a draft lesson with zero student progress receives `204 No Content`.
4. **Self-Service Profile**:
   - `Instructor A` updating their profile receives `200 OK`, and `users.name` matches the updated `instructors.name`.
5. **Role Hierarchy & Oversight**:
   - `Admin` accessing or modifying `Course A` or `Course B` returns `200 OK`.
   - `Student` sending any request to `/api/instructor/*` returns `403 Forbidden`.
   - `Guest` (unauthenticated) sending any request to `/api/instructor/*` returns `401 Unauthorized`.

### Prior Art
- `tests/Feature/CourseTest.php`: Public and student-facing course endpoint tests.
- `tests/Feature/Admin/InstructorUserLinkingTest.php`: Administrator instructor-linking feature tests.
- `tests/Feature/ProgressTest.php`: User progress tracking and completion assertions.

---

## Out of Scope

1. **Direct Course Creation by Instructors**: Instructors only manage courses explicitly assigned to them by administrators. Self-service course creation (`POST /api/instructor/courses`) is strictly deferred out of MVP.
2. **Lesson Task / Exam CRUD**: Authorizing and editing quiz missions (`/lessons/{lesson}/task`) is deferred to Phase 4 (Exam Gating) and Phase 6 (Curriculum Tree UI).
3. **Automated Algorithmic Rating Calculation**: Automatic calculation of ratings from student reviews is deferred; in MVP, ratings are administered manually by administrators.
4. **HLS Streaming Tokens**: Video delivery abstraction and signed HLS streaming tokens are isolated to the Launch Gate (Phase 7).

---

## Further Notes

- All changes adhere to the **TanStack Query v5 & Vertical Slice Architecture Protocol** and **Minimalist Surface Rule** documented in `AGENTS.md`.
- No composite components or controllers are shared between administrative and instructor domains.
- Upon completion of Phase 2 tests and code verification, the Wayfinder tracker for Phase 2 will be closed, unblocking Phase 3 (Educational Metadata Updates & Activity Audit Logging).