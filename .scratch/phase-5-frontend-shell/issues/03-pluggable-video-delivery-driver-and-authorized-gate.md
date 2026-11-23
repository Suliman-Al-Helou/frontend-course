# 03: Pluggable Video Delivery Driver & Authorized Gate

**What to build:** Create `App\Services\Video\VideoDeliveryManager` in the backend. It resolves playback payloads prioritizing `$lesson->video_provider` over default config, and enforces the Authorized Playback Gate: in curriculum listings (`SectionResource` -> `LessonResource`), `playback` is strictly `null` for locked lessons and only populated for preview lessons (`is_preview = true`).

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Implement `App\Services\Video\VideoDeliveryManager` with driver resolution and authorization gating.
- [ ] Configure `services.video.default` fallback to `'youtube'` in Laravel config.
- [ ] In `SectionResource`, ensure `playback` is sanitized to `null` for non-preview lessons.
- [ ] Write unit/feature tests for driver resolution and curriculum playback gating.
