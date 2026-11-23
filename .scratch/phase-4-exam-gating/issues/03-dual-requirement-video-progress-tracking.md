# 03: Dual-Requirement Video Progress State Machine & Re-watch Preservation

**What to build:** Differentiate progress calculation in `ProgressController::update` between lessons with tasks and taskless lessons. For lessons with tasks, watching $\ge 80\%$ records watch percentage and sets `task_unlocked = true` but keeps `completed = false` until the task is submitted. For taskless lessons, watching $\ge 80\%$ marks `completed = true` immediately. Subsequent video playback on already completed lessons never revokes completion.

**Blocked by:** 01: Decouple Task Access & Eliminate Progression Deadlock

**Status:** ready-for-agent

- [ ] In `ProgressController::update`, check `$lesson->task()->exists()`.
- [ ] If a task exists, update `watched_percent` and `last_position`, but set `'completed' => (bool) ($existing?->completed ?? false)`.
- [ ] If no task exists, set `'completed' => ($best >= 80)`.
- [ ] Return `'task_unlocked' => ($best >= 80)` in the JSON response alongside `completed` and `watched_percent`.
- [ ] Verify that re-watching a completed lesson with lower watch percentage preserves `completed = true`.
