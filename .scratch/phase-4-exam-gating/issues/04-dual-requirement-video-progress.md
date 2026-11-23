# 04: Dual-Requirement Video Progress State Machine

**What to build:** Differentiate progress calculation in `ProgressController::update` between lessons with tasks and taskless lessons. For lessons with tasks, watching $\ge 80\%$ records watch percentage and sets `task_unlocked = true` but keeps `completed = false` until the task is submitted. For taskless lessons, watching $\ge 80\%$ marks `completed = true` immediately and unlocks the next lesson.

**Blocked by:** 01: Decouple Task Access & Eliminate Deadlock

**Status:** completed

- [x] In `ProgressController::update`, check `$lesson->task()->exists()`.
- [x] If a task exists, update `watched_percent` and `last_position`, but keep `completed = false`.
- [x] If no task exists, set `'completed' => ($best >= 80)`.
- [x] Return `'task_unlocked' => ($best >= 80)` in the JSON response alongside `completed` and `watched_percent`.
