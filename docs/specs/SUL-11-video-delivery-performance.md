# [Phase 2] Video Delivery Performance, Caching & Player UX (SUL-11)

> **Status**: Completed (2026-11-28)

## Problem Statement
Student videos load slowly and buffer excessively, lesson details are re-fetched unnecessarily when unchanged, students lose their playback position when returning to a video, and double-clicking the video does not toggle fullscreen.

## Solution
Optimize HLS.js buffering and adaptive bitrate startup, cache unchanged lesson metadata using versioned query keys with infinite stale time, resume playback from the student's last saved position, and support double-click fullscreen toggling.

## User Stories
1. As a student, I want videos to start quickly and play smoothly without frequent buffering, so that I can focus on learning.
2. As a student, I want unchanged video details to load from cache after the first fetch, while automatically refreshing if an instructor or admin edits the video, so that navigation feels instant without stale data.
3. As a student, I want my video to resume from the exact timestamp where I stopped when I return, so that I don't have to search for my place.
4. As a student, I want to double-click the video to enter fullscreen and double-click again to exit, so that I have a familiar, effortless viewing experience.

## Implementation Decisions
- HLS.js configuration: Tune `maxBufferLength`, `maxMaxBufferLength`, `abrEwmaDefaultEstimate`, and `startLevel` for fast startup and smooth adaptive streaming.
- Client caching: Use TanStack Query `queryOptions` with `staleTime: Infinity` and a versioned query key (`[lessonId, updatedAt]`) so the first fetch hits the server and subsequent reads use the cache until an instructor/admin updates the lesson.
- Resume playback: Restore `last_position` on `loadedmetadata` when returning to a partially watched lesson.
- Fullscreen UX: Bind double-click on the player surface to toggle fullscreen state cleanly.

## Testing Decisions
- Test at the highest seams:
  - Frontend player integration tests: Verify `last_position` restoration on metadata load, double-click fullscreen toggle, and HLS.js configuration initialization.
  - Query cache tests: Verify cached reads when `updatedAt` is unchanged and fresh server fetches when `updatedAt` changes.

## Out of Scope
- Lesson access gating and progress-flush 403 fix (covered in Phase 1 / SUL-10).
- Video security, signed proxy URLs, and multi-provider switching (covered in Phase 3 / SUL-12).
