# Spec: Phase 4 — Server-Side Exam Gating & Atomic Progress Completion

**Status**: Ready for Implementation  
**Triage Label**: `ready-for-agent`  
**Parent Roadmap**: [Wayfinder Map](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/map.md)  
**Associated Ticket**: [Ticket 04: Phase 4](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/04-exam-gating-and-atomic-completion.md)  
**Governing Architectural Decisions**:
- [ADR 0016: Instructor CoursePolicy, IDOR Prevention Boundary, and Centralized Parent Traversal](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0016-instructor-course-policy-and-idor-prevention.md)
- [ADR 0017: Video Provider Driver and Curriculum Publication Contract](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0017-video-provider-driver-and-curriculum-publication-contract.md)
- [ADR 0020: Dual-Requirement Lesson Progression and Atomic Task Gating](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0020-dual-requirement-lesson-progression-and-atomic-task-gating.md)

---

## Problem Statement

In the learning platform, curriculum advancement is controlled by sequential prerequisites: students must complete each lesson before accessing the next. Previously:
1. **The Deadlock Flaw**: `TaskController` checked `$progress->completed` to allow viewing or submitting tasks. However, for lessons with tasks, `completed` must not be set until the task is solved. This caused an immediate deadlock where students who watched 100% of the video could neither view nor submit the task.
2. **Task Skipping Vulnerability**: In `ProgressController::update`, watching $\ge 80\%$ set `completed = true` unconditionally for all lessons. As a result, students could completely bypass required tasks and unlock subsequent lessons without answering a single question.
3. **Weak Submission Validation**: `SubmitTaskRequest` only verified that `answers` was an array. It permitted empty payloads (`[]`) or partial answers, allowing students to submit blank sheets and obtain progression credit.
4. **The Zero-Index Trap**: In PHP, `empty(0)` evaluates to `true`. Submitting option `0` for Multiple Choice or True/False questions risked being treated as an unanswered question if not validated with strict numeric checks.
5. **Non-Atomic Progression**: Grading and progress updates occurred in disjoint steps, creating vulnerability to partial writes where attempts were recorded without unlocking progress or vice-versa.

---

## Solution

Implement an airtight, deterministic **Dual-Requirement Progression Engine** in `backendCourse` adhering to [ADR 0020](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0020-dual-requirement-lesson-progression-and-atomic-task-gating.md):

1. **Decoupled Task Access Gate**:
   - `TaskController::show` and `submit` verify `$progress && (float)$progress->watched_percent >= 80`.
   - Eliminates the deadlock and guarantees that only students who watched $\ge 80\%$ can view or submit tasks.

2. **Dual-Requirement Progress Logic in `ProgressController::update`**:
   - If `$lesson->task()->exists()`: video watch updates `watched_percent` and `last_position`, but sets `'completed' => (bool) ($existing?->completed ?? false)`.
   - If `$lesson->task()->doesntExist()`: sets `'completed' => ($best >= 80)`.
   - Re-watching video on already completed lessons is fully idempotent and never revokes `completed`.

3. **Dynamic Form Request Validation (`SubmitTaskRequest`)**:
   - Dynamically inspects `$lesson->task->questions`.
   - Verifies that every question ID has an explicit, non-null numeric answer (`is_numeric($val) && !is_null($val)`).
   - Rejects incomplete submissions with `422 Unprocessable Content` and Arabic validation message:
     `{"message": "يجب الإجابة على جميع الأسئلة لتسليم المهمة", "errors": {"answers": [...]}}`.

4. **Atomic Transaction & Formative Progression in `TaskService::submitAttempt`**:
   - Executes inside `DB::transaction()`:
     1. Pessimistic row locking on `TaskAttempt` to enforce attempt limits (`max_attempts`) and cooldowns.
     2. Verifies student watched $\ge 80\%$ of video.
     3. Grades answers deterministically against `TaskQuestion.correct_answer`.
     4. Saves `TaskAttempt` with score, passed status, and timestamp.
     5. Atomically calls `UserLessonProgress::updateOrCreate(['user_id' => $user->id, 'lesson_id' => $task->lesson_id], ['completed' => true])`.
   - Submitting complete answers unlocks progression to the next lesson regardless of pass threshold (formative progression), while diagnostic scores and retry attempts are preserved.
   - Any database error automatically rolls back both writes.

---

## User Stories

1. As an enrolled student, I want to unlock a lesson's task when I watch at least 80% of the video, so that I can demonstrate my understanding.
2. As an enrolled student, I want the next lesson to remain locked until I submit all questions of the current lesson's task, so that curriculum pacing is properly enforced.
3. As an enrolled student, I want to be blocked from submitting an incomplete task questionnaire with a clear `422` error, so that I know exactly which questions require answers.
4. As an enrolled student selecting the first option (index `0`), I want my answer recognized correctly, so that I am never falsely accused of submitting blank answers.
5. As an enrolled student, when I submit complete answers to a task, I want the next lesson unlocked immediately, even if my score was below the passing mark, so that I can continue learning without being indefinitely blocked.
6. As an enrolled student who failed a task attempt, I want the option to retry the task up to the maximum attempts allowed, so that I can improve my score and master the concepts.
7. As an enrolled student, when I re-watch a lesson I already completed, I want my completion status preserved, so that my course progress percentage is never reduced.
8. As a student on a lesson without any task, I want the lesson marked complete immediately when I watch 80%, so that I can proceed without waiting for an exam that doesn't exist.

---

## Implementation Plan & Red-to-Green Test Suite

### Sub-ticket 01: Decouple Task Access & Fix Deadlock
- File: `backendCourse/app/Http/Controllers/Api/TaskController.php`
- Change: Replace `$progress->completed` checks with `$progress->watched_percent >= 80`.

### Sub-ticket 02: Dynamic Full-Schema Validation & Zero-Index Guard
- File: `backendCourse/app/Http/Requests/SubmitTaskRequest.php`
- Change: Add `withValidator` inspecting `$lesson->task->questions` and validating presence of all question IDs with non-null numeric answers.

### Sub-ticket 03: Dual-Requirement Video Progress Tracking
- File: `backendCourse/app/Http/Controllers/Api/ProgressController.php`
- Change: In `update()`, check `$lesson->task()->exists()`; preserve `$existing->completed` if true, otherwise leave false until task submission.

### Sub-ticket 04: Deterministic Grading & Atomic Transaction
- File: `backendCourse/app/Services/TaskService.php`
- Change: Enforce video watch verification inside `submitAttempt`, grade MCQ/True-False against integer indices, atomically update `UserLessonProgress::updateOrCreate(['completed' => true])`, and rollback on failures.

### Sub-ticket 05: Automated Feature Tests
- File: `backendCourse/tests/Feature/LessonProgressionGatingTest.php`
- Tests:
  1. `test_video_alone_does_not_unlock_next_lesson_when_task_exists`
  2. `test_incomplete_task_submission_is_rejected_with_422`
  3. `test_zero_index_first_option_is_accepted_as_valid_answer`
  4. `test_submitting_all_questions_atomically_unlocks_next_lesson_regardless_of_score`
  5. `test_database_failure_during_progress_update_rolls_back_task_attempt`
  6. `test_taskless_lesson_unlocks_next_lesson_at_80_percent_watch`
  7. `test_rewatching_completed_lesson_preserves_completed_status`
