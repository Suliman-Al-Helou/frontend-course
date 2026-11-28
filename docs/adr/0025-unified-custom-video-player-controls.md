# ADR-0025: Unified Custom Video Player Controls & Click-Shield Overlay

- **Date:** 2026-11-25
- **Status:** Accepted
- **Linear Issue:** [SUL-9](https://linear.app/sulimanalhello/issue/SUL-9/unified-custom-video-player-controls-hls-and-youtube-with-click-shield)

## Context
`VideoPlayer.tsx` currently renders native `<video controls>` for HLS streams and `react-youtube` with default YouTube controls for YouTube videos. This creates an inconsistent student UI across providers and exposes YouTube's video title, channel name, and external links ("Watch on YouTube"), making it trivial for students to locate and share unlisted YouTube videos.

## Decision
1. **Unified Custom Control Bar (`Unified Player Controls`):**
   - Replace native `<video controls>` and YouTube's default control bar (`controls: 0`, `rel: 0`) with a single custom React control bar supporting Play/Pause, LTR Progress/Seek bar, Time display, Volume/Mute, and Fullscreen.
   - Auto-hide controls after 3 seconds of pointer inactivity; keep controls visible when paused.
   - On touch devices, tapping reveals/hides controls first rather than immediately toggling playback.
2. **Click-Shield Overlay (`Click-Shield Overlay`):**
   - Place a transparent overlay above the YouTube IFrame to intercept pointer/touch events, block right-click context menus, and prevent direct clicks on YouTube's title, channel name, or external links.
3. **YouTube Progress Polling:**
   - Because YouTube IFrame API does not emit a continuous `timeupdate` event, poll `getCurrentTime()` on a lightweight `250ms` interval **only while playing** for smooth UI progress, while keeping server progress reporting throttled to at most once every 5 seconds.

## Consequences
- **Positive:** Consistent, minimal UI across HLS and YouTube; deters casual users from copying YouTube URLs or navigating to the channel.
- **Negative / Limitations:** YouTube `videoId` remains visible in DOM/Network DevTools, and YouTube may still briefly flash the video title on initial load/pause. Full content protection requires HLS (see ADR-0024).
