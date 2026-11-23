# 03: Dual-Engine Video Player & Lifecycle Guard

**What to build:** Upgrade the student video player (`VideoPlayer.tsx`) to switch dynamically between YouTube and HLS streaming engines. Mount with `key={lesson.id}` in parent page to isolate consecutive lessons, implement an `isCancelled` lifecycle guard in `useEffect`, provide automatic query invalidation on HLS token expiry (HTTP 403), render an accessible uploading/processing placeholder when `playback === null`, and maintain uniform Forensic Watermark protection and progress tracking.

**Blocked by:** 01: Types & Auth Contracts

**Status:** ready-for-agent

- [ ] Support `playback: VideoPlaybackPayload | null` prop with backward-compatible `videoId` fallback.
- [ ] Render dynamic `react-youtube` when `playback?.provider === "youtube"`.
- [ ] Render accessible HTML5 `<video>` tag with lazy-loaded `hls.js` attach for non-Safari browsers when `playback?.provider === "hls"`.
- [ ] In parent page (`/courses/[courseId]/lessons/[lessonId]/page.tsx`), mount `<VideoPlayer key={numericLessonId} ... />` to guarantee zero state leak across lessons.
- [ ] Guard player `useEffect` with `isCancelled` flag and ensure `hls.destroy()` / `player.destroy()` on teardown to eliminate zombie audio.
- [ ] Display an accessible placeholder (`role="status"`) when `playback === null` and no fallback video ID exists.
- [ ] Render animated Forensic Watermark (`WATERMARK_POSITIONS`) uniformly across both YouTube and HLS.
- [ ] Add component tests in Vitest verifying player switching, placeholder rendering, and watermark display.
