# 06: Dual-Engine Streaming Switcher (YouTube & HLS)

**What to build:** Extend `VideoPlayer.tsx` to switch seamlessly between YouTube (`react-youtube`) and HLS (`<video>` element with lazy-imported `hls.js` for non-Safari browsers). Ensure deterministic teardown (`hls.destroy()`, player cleanup) when switching engines or unmounting to eliminate zombie background audio.

**Blocked by:** 05: Video Player Lifecycle Isolation & State Reset Guard

**Status:** completed

- [x] Render `react-youtube` when `playback?.provider === "youtube"`.
- [x] Render HTML5 `<video>` with lazy dynamic import of `hls.js` when `playback?.provider === "hls"`.
- [x] Implement deterministic teardown (`hls.destroy()`, `player.destroy()`) on unmount.
- [x] Add component tests in Vitest verifying player switching.
