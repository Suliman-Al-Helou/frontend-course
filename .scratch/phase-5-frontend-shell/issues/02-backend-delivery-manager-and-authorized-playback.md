# 02: Backend Delivery Manager & Authorized Playback Serialization

**What to build:** Implement the backend `VideoDeliveryManager` with driver resolution (`$lesson->video_provider` > default) and an Authorized Playback Gate that shields locked video sources from leaking in public syllabus listings. Unify `LessonController::show` to return `LessonResource` with full `playback` data for authorized viewing sessions, and reject draft lesson requests (`is_published = false`) with 404 for unprivileged students.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Create `App\Services\Video\VideoDeliveryManager` resolving playback payloads based on lesson configuration.
- [ ] Implement Authorized Playback Gate: in `SectionResource` / curriculum listing, `playback` is `null` unless `is_preview = true`.
- [ ] Update `LessonResource.php` to serialize `playback` and `is_published`.
- [ ] Refactor `LessonController::show` (`GET /api/lessons/{lesson}`) to return `new LessonResource($lesson)`.
- [ ] Add 404 Not Found guard in `LessonController::show` for draft lessons (`is_published = false`) when requested by students or visitors, permitting access for course instructor or admin.
- [ ] Add feature tests in `tests/Feature/LessonPlaybackDeliveryTest.php` asserting public curriculum censorship, authorized playback payload structure, and draft 404 gating.
