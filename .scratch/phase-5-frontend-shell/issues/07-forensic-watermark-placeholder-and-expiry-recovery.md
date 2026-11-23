# 07: Uniform Forensic Watermark, Processing Placeholder & Expiry Recovery

**What to build:** Render animated Forensic Watermark (`WATERMARK_POSITIONS`) uniformly across both YouTube and HLS engines displaying authenticated user identity. Display an accessible processing placeholder (`role="status"`) when `playback === null` and no fallback video ID exists. When HLS encounters 403 token expiry, automatically invalidate lesson query cache and refresh signed URL resuming from `last_position`.

**Blocked by:** 06: Dual-Engine Streaming Switcher (YouTube & HLS)

**Status:** ready-for-agent

- [ ] Render Forensic Watermark uniformly over both YouTube and HLS containers.
- [ ] Render accessible processing placeholder when `playback === null`.
- [ ] Add error handler for HLS 403 / network errors that refreshes lesson query and resumes playback.
- [ ] Vitest component tests verifying watermark and placeholder rendering.
