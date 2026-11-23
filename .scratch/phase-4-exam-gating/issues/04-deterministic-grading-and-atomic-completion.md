# 04: Deterministic Auto-Grading & Atomic Formative Lesson Completion

**What to build:** Atomic execution in `TaskService::submitAttempt` inside `DB::transaction()` with pessimistic locking, deterministic auto-grading against canonical `correct_answer` option indices, immutable `TaskAttempt` creation, and atomic update of `UserLessonProgress` to `completed = true`. Submitting complete answers unlocks the next lesson regardless of score, with automatic rollback on database failure.

**Blocked by:** 02: Dynamic Full-Schema Questionnaire Validation & Zero-Index Option Guard, 03: Dual-Requirement Video Progress State Machine & Re-watch Preservation

**Status:** ready-for-agent

- [ ] Inside `DB::transaction()`, verify student has watched $\ge 80\%$ of video before proceeding.
- [ ] Auto-grade answers deterministically by comparing student option index `(int) $userAns` directly with integer `(int) $q['correct_answer']`.
- [ ] Create immutable `TaskAttempt` with score, passed flag, and answers payload.
- [ ] Atomically execute `UserLessonProgress::updateOrCreate(['user_id' => $user->id, 'lesson_id' => $task->lesson_id], ['completed' => true])`.
- [ ] Submitting complete answers marks the lesson complete and unlocks the subsequent lesson even if score is below pass mark (e.g. 25%).
- [ ] Ensure database failure during progress update triggers full rollback so no attempt is recorded.
