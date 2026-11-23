# 01: Decouple Task Access & Eliminate Deadlock

**What to build:** Gate access to `GET /api/lessons/{lesson}/task` and `POST /api/lessons/{lesson}/task` strictly on video watch duration ($\ge 80\%$) rather than lesson completion status. This unlocks the task for students who have watched the lecture while preserving incomplete status until submission, eliminating the architectural deadlock.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] In `TaskController::show`, replace `$progress->completed` check with `$progress && (float) $progress->watched_percent >= 80`.
- [x] In `TaskController::submit`, replace `$progress->completed` check with `$progress && (float) $progress->watched_percent >= 80`.
- [x] Students with $\ge 80\%$ watch duration and `completed = false` receive `200 OK` on `GET /task` and can submit answers.
- [x] Students with $< 80\%$ watch duration receive `403 Forbidden` with `"يجب مشاهدة ≥ 80% من الفيديو أولاً"`.
