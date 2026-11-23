# Ticket 04: Phase 4 — Server-Side Exam Gating & Atomic Progress Completion

**Tracker Label**: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/docs/wayfinder/map.md)  
**Status**: Completed  
**Completed at**: 2026-11-23  
**Spec**: [Spec: Phase 4](file:///home/suliman/Documents/courses/frontend-course/docs/spec/04-exam-gating-and-atomic-completion.md)  
**Governing ADRs**:
- [ADR 0017: Video Provider Driver and Curriculum Publication Contract](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0017-video-provider-driver-and-curriculum-publication-contract.md)
- [ADR 0020: Dual-Requirement Lesson Progression and Atomic Task Gating](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0020-dual-requirement-lesson-progression-and-atomic-task-gating.md)  
**Assignee**: Antigravity  
**Sub-Tickets (Tracer Bullets)**:
1. [01: Decouple Task Access & Eliminate Deadlock](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-4-exam-gating/issues/01-decouple-task-access-and-fix-deadlock.md) (`completed`)
2. [02: Dynamic Questionnaire Schema Validation](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-4-exam-gating/issues/02-dynamic-schema-validation-and-zero-guard.md) (`completed`)
3. [03: Zero-Index Option Guard & Type Defense](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-4-exam-gating/issues/03-zero-index-option-guard.md) (`completed`)
4. [04: Dual-Requirement Video Progress State Machine](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-4-exam-gating/issues/04-dual-requirement-video-progress.md) (`completed`)
5. [05: Re-Watch Idempotency & Progress Preservation](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-4-exam-gating/issues/05-rewatch-idempotency-preservation.md) (`completed`)
6. [06: Deterministic Auto-Grading Engine](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-4-exam-gating/issues/06-deterministic-auto-grading.md) (`completed`)
7. [07: Atomic Formative Completion & Rollback Integrity](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-4-exam-gating/issues/07-atomic-formative-completion.md) (`completed`)

## Question

How do we enforce server-side progression where watching $\ge 80\%$ unlocks the task, answering EVERY question in the task unlocks the next lesson upon submission in a single atomic database transaction, and incomplete submissions are strictly rejected with 422?

## Acceptance Criteria

1. **Validation of Complete Submissions & Schema Conformance (`app/Http/Requests/SubmitTaskRequest.php`):**
   - The task submission request must validate that an answer is provided for **every question** defined on `$lesson->task->questions` according to the canonical `TaskQuestion` contract (ADR 0016).
   - If any question is missing an answer or blank, reject with `422 Unprocessable Content`:
     `{"message": "يجب الإجابة على جميع الأسئلة لتسليم المهمة", "errors": {"answers": [...]}}`.
2. **Deterministic Grading in `app/Services/TaskService.php`:**
   - Score calculation verifies student `answer_index` directly against `$question['correct_answer']`.
3. **Dual-Requirement Progress Logic in `app/Http/Controllers/Api/ProgressController.php`:**
   - In `update()`:
     - If `$lesson->task()->exists()`: saving watch progress saves `watched_percent` and `last_position`, but sets `completed = false` (or preserves existing boolean if already completed).
     - If `$lesson->task()->doesntExist()`: sets `completed = ($best >= 80)`.
3. **Atomic Transaction in `app/Services/TaskService.php` (`submitAttempt`):**
   - Inside `DB::transaction()`:
     1. Verify attempt limits and cooldown timer.
     2. Verify student watched $\ge 80\%$ of video.
     3. Verify all questions are answered.
     4. Calculate score and record `TaskAttempt::create(...)`.
     5. Atomically set `UserLessonProgress::updateOrCreate(['user_id' => $user->id, 'lesson_id' => $task->lesson_id], ['completed' => true])`.
   - If an exception occurs during either write, the transaction automatically rolls back so neither the attempt nor completion is saved.
4. **Automated Feature Tests (`tests/Feature/LessonProgressionGatingTest.php`):**
   - **Test 1 (Video Alone Does Not Unlock Next Lesson):** Student watches 90% of lesson with task; assert `completed == false` and next lesson returns `403 Forbidden`.
   - **Test 2 (Incomplete Submission Rejected):** Student submits answers for 2 out of 3 questions; assert `422 Unprocessable Content`, no attempt saved, and `completed` remains `false`.
   - **Test 3 (Atomic Submission Unlocks Next Lesson):** Student submits all questions (scoring 25%); assert `200 OK`, `UserLessonProgress.completed == true`, and next lesson returns `200 OK`.
   - **Test 4 (Transaction Rollback Integrity):** Simulate a database failure during progress update; assert `TaskAttempt` is rolled back and not persisted.
   - **Test 5 (Taskless Lesson Progression):** Student watches 80% on lesson without a task; assert `completed == true` immediately.
