# 04: Canonical Lesson Detail Serialization & Draft 404 Guard

**What to build:** Refactor `LessonController::show` (`GET /api/lessons/{lesson}`) to use `new LessonResource($lesson)` so students receive the full `playback` object. Add a strict 404 guard blocking students and guests from accessing draft lessons (`is_published = false`), permitting access only for assigned instructors and administrators.

**Blocked by:** 03: Pluggable Video Delivery Driver & Authorized Gate

**Status:** ready-for-agent

- [ ] Update `LessonResource` to serialize `playback` and `is_published`.
- [ ] Refactor `LessonController::show` to return `new LessonResource($lesson)`.
- [ ] In `LessonController::show`, abort with 404 if `is_published = false` and viewer cannot manage course.
- [ ] Add Feature tests in `tests/Feature/LessonPlaybackDeliveryTest.php` asserting draft 404 behavior and authorized playback delivery.
