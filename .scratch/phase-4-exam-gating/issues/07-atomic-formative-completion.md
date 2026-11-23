# 07: Atomic Formative Completion & Rollback Integrity

**What to build:** Atomic execution in `TaskService::submitAttempt` inside `DB::transaction()` with pessimistic locking, creating immutable `TaskAttempt` and atomically setting `UserLessonProgress::updateOrCreate(['completed' => true])`. Submitting all questions unlocks the next lesson regardless of pass score, with complete rollback on DB failure.

**Blocked by:** 05: Re-Watch Idempotency & Progress Preservation, 06: Deterministic Auto-Grading Engine

**Status:** completed

- [x] Verify student has watched $\ge 80\%$ of video inside `submitAttempt`.
- [x] Inside `DB::transaction()`, create `TaskAttempt` and set `UserLessonProgress.completed = true`.
- [x] Submitting all questions completes the lesson and unlocks the next lesson even if score is below pass mark (e.g. 25%).
- [x] Ensure database failure during progress update triggers full rollback so no attempt is recorded.
