# 05: Re-Watch Idempotency & Progress Preservation

**What to build:** Protect earned lesson completion status when students re-watch completed lessons. If a lesson was already completed (`completed == true`), re-watching it from earlier positions permanently preserves `completed = true`.

**Blocked by:** 04: Dual-Requirement Video Progress State Machine

**Status:** completed

- [x] In `ProgressController::update`, preserve `$existing?->completed` if already true.
- [x] Ensure resetting progress backwards does not demote course completion percentage.
