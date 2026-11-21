# ADR 0020: Dual-Requirement Lesson Progression and Atomic Task Gating

## Status
Accepted

## Context
In the online learning platform, lesson advancement and course progress tracking must ensure authentic student engagement and comprehension without introducing architectural deadlocks or race conditions:

1. **Deadlock in Video Watch Check vs. Lesson Completion**:
   - Previously, `ProgressController::update` conflated video watching with complete lesson progression by setting `completed = ($watched_percent >= 80)`.
   - Concurrently, `TaskController::show` and `TaskController::submit` enforced `if (!$progress || !$progress->completed) abort(403)`.
   - If progress tracking for lessons with tasks leaves `completed = false` until the task is submitted, students are trapped in a deadlock: they can never inspect or submit the task because `completed` is false.
   - The prerequisite to unlock the task is strictly video engagement (`watched_percent >= 80`), whereas `completed` represents the composite fulfillment of all lesson requirements.

2. **Formative Completion vs. Diagnostic Retries**:
   - In the initial platform MVP (V1), interactive tasks act as mandatory formative checkpoints. Students must actively answer every single question to unlock the next lesson.
   - However, forcing a high passing grade (`score >= pass_percentage`) before unlocking the next lesson can stall student momentum and discourages risk-taking.
   - Instead, the platform requires complete answers to all questions for lesson completion, while recording granular diagnostic scores and leaving remaining attempts (`max_attempts`) accessible for students who choose to re-test and sharpen their mastery.

3. **Concurrency, Atomicity, and Rollback Integrity**:
   - When a student submits a task, two critical database mutations must occur:
     a) Creating an immutable `TaskAttempt` record with answers and deterministic score.
     b) Updating or creating `UserLessonProgress` with `completed = true`.
   - If either write fails (or during unexpected database disconnects), partial state could leave an attempt recorded without unlocking progress, or unlock progress without recording student answers.
   - Both writes must execute inside an atomic `DB::transaction()` with pessimistic row-locking on `TaskAttempt` to prevent rapid concurrent submissions.

4. **Idempotent Watch Progression (Re-watch Preservation)**:
   - When a student completes a lesson and later returns to review the video from the beginning (e.g. streaming position 0 with `watched_percent: 10%`), `ProgressController::update` must never revoke or reset `completed` back to `false`.

5. **Strict Schema Validation & The PHP Zero-Index Trap**:
   - In the canonical `TaskQuestion` contract (ADR 0017), answer options are zero-indexed (`0`, `1`, `2`, ...).
   - In PHP, `empty(0)` and `!$val` evaluate to `true`. Using loose truthiness checks would misclassify legitimate selections of the first option as missing answers.
   - Validation must verify that every question ID defined in `$lesson->task->questions` is supplied with a valid, non-null numeric option index.

## Decision

1. **Dual-Requirement Progression Logic in `ProgressController`**:
   - When saving video watch progress via `POST /api/lessons/{id}/progress`:
     - Calculate best watch percentage: `$best = max((float) $validated['watched_percent'], $existing?->watched_percent ?? 0)`.
     - If `$lesson->task()->exists()`:
       - Set `'completed' => (bool) ($existing?->completed ?? false)`. (Completion is deferred until task submission, preserving true if already earned).
     - If `$lesson->task()->doesntExist()`:
       - Set `'completed' => $best >= 80`.
     - Return `'task_unlocked' => ($best >= 80)` alongside `'completed'` and `'watched_percent'`.

2. **Decoupled Task Gating in `TaskController`**:
   - In `TaskController::show` and `TaskController::submit`:
     - Inspect `$progress = UserLessonProgress::where('user_id', $user->id)->where('lesson_id', $lesson->id)->first();`.
     - Authorize task access if `$progress && (float) $progress->watched_percent >= 80`.
     - Remove dependencies on `$progress->completed`.

3. **Strict Payload Validation in `SubmitTaskRequest`**:
   - Form request inspects `$this->route('lesson')->task`.
   - Validates that `answers` is an array containing an answer for **every question** defined in the task.
   - Enforces the **Zero-Index Option Guard**: validates each answer with `!is_null($val) && $val !== '' && is_numeric($val)`.
   - Rejects missing, null, or blank answers with `422 Unprocessable Content`:
     ```json
     {
       "message": "يجب الإجابة على جميع الأسئلة لتسليم المهمة",
       "errors": { "answers": ["..."] }
     }
     ```

4. **Deterministic Grading and Atomic Transaction in `TaskService::submitAttempt`**:
   - Execute under `DB::transaction()`:
     1. Verify attempt limits (`attemptsUsed < maxAttempts`) using `TaskAttempt::where(...)->lockForUpdate()`.
     2. Verify cooldown interval if previous attempt failed and `cooldown_minutes > 0`.
     3. Verify video requirement: `$userProgress && (float) $userProgress->watched_percent >= 80`.
     4. Calculate deterministic score comparing `(int) $userAnswer === (int) $question['correct_answer']` for supported auto-graded types (`mcq`, `true_false`).
     5. Create `TaskAttempt`.
     6. Atomically set `UserLessonProgress::updateOrCreate(['user_id' => $user->id, 'lesson_id' => $task->lesson_id], ['completed' => true])`.
   - Any database error rolls back both the attempt and completion atomically.

## Consequences

- **Positive**:
  - Eliminates the video-to-task deadlock completely while guaranteeing students cannot skip tasks to unlock subsequent lessons.
  - Safe zero-index option handling prevents false validation rejections.
  - Formative progression empowers students to advance while preserving detailed attempt diagnostics for instructor review.
  - Atomic transactions prevent orphaned attempts or unearned lesson completions.
  - Re-watching completed video lessons is fully idempotent and never revokes earned completions.

- **Negative**:
  - Requires updating `SubmitTaskRequest`, `TaskController`, `ProgressController`, and `TaskService`.
  - Deprecates obsolete `type: open` processing branches in legacy task grading.
