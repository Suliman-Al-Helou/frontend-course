# 04: Backend Instructor Task Controller & Task Integrity Guard

**What to build:**
Create `InstructorTaskController` in `backendCourse` with `show`, `store`, `update`, and `destroy` endpoints under `/api/instructor/lessons/{lesson}/task`. Authorize requests via `CoursePolicy::manageAsInstructor` on `$lesson->getCourse()`. Enforce the Task Integrity Guard: deleting a task with recorded student attempts is strictly blocked with `422 Unprocessable Entity`, and question updates apply only to future attempts without modifying past grades.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] `InstructorTaskController` handles `GET`, `POST`, `PUT`, `DELETE` under `/api/instructor/lessons/{lesson}/task`.
- [x] Authorization checks traverse to course and evaluate `CoursePolicy::manageAsInstructor`.
- [x] IDOR protection: attempts by non-owning instructors or students fail with `403 Forbidden`.
- [x] Task Integrity Guard: `DELETE` aborts with `422` when `$task->attempts()->exists()`.
- [x] Automated Pest/PHPUnit tests prove all authorization, validation, and integrity rules.
