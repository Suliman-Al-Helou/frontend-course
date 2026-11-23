# 01: Types & Auth Contracts (VideoPlaybackPayload, Lesson, User.role)

**What to build:** Establish the foundational type contracts across the frontend platform: define the discriminated `VideoPlaybackPayload` union, extend the `Lesson` and `LessonDetail` schemas with delivery metadata (`playback`, `video_provider`, `is_published`), extend `User.role` to include `"instructor"`, and update post-login redirection to safely route instructors to `/instructor` with open-redirect sanitization.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Export `VideoPlaybackPayload` discriminated union (`youtube` with `source` vs `hls` with `url` and `expires_at`) in `src/types/index.ts`.
- [ ] Extend `Lesson` and `LessonDetail` with `playback: VideoPlaybackPayload | null`, `video_provider: "youtube" | "hls"`, and `is_published: boolean`.
- [ ] Extend `User.role` to `"admin" | "student" | "instructor"`.
- [ ] Update `resolvePostLoginRedirect` in `src/lib/auth-helpers.ts` to route `instructor` to `"/instructor"` by default.
- [ ] Add unit tests verifying `resolvePostLoginRedirect` with instructor role and malicious redirect URLs.
- [ ] Ensure `vp check` / `tsc --noEmit` compiles without any type regressions.
