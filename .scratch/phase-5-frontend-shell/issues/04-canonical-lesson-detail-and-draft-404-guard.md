# 04: Canonical Lesson Detail Serialization & Draft 404 Guard

**What to build:** Refactor `LessonController::show` (`GET /api/lessons/{lesson}`) to use `new LessonResource($lesson)` so students receive the full `playback` object. Add a strict 404 guard blocking students and guests from accessing draft lessons (`is_published = false`), permitting access only for assigned instructors and administrators.

**Blocked by:** 03: Pluggable Video Delivery Driver & Authorized Gate

**Status:** completed

- [x] Update `LessonResource` to serialize `playback` and `is_published`.
- [x] Refactor `LessonController::show` to return `new LessonResource($lesson)`.
- [x] In `LessonController::show`, abort with 404 if `is_published = false` and viewer cannot manage course.
- [x] Add Feature tests in `tests/Feature/LessonPlaybackDeliveryTest.php` asserting draft 404 behavior and authorized playback delivery.
