# 01: Discriminated Playback & Lesson Schema Contract

**What to build:** Define and export the `VideoPlaybackPayload` discriminated union (`youtube` with `source` vs `hls` with `url` and `expires_at`), and extend `Lesson` and `LessonDetail` with `playback: VideoPlaybackPayload | null`, `video_provider: "youtube" | "hls"`, and `is_published: boolean` in `src/types/index.ts`. Verify type-checking across all consumers.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] Export `VideoPlaybackPayload` in `src/types/index.ts`.
- [x] Extend `Lesson` and `LessonDetail` with `playback`, `video_provider`, and `is_published`.
- [x] Run `vp check` / `tsc --noEmit` and confirm zero compilation errors.
