# 02: Video Player Lifecycle Teardown Guard & Watch State Retention

**What to build:**
Prevent spurious HLS player destruction on parent re-renders by storing callbacks in stable refs. Maintain watched progress percentage and completion status across HLS token renewals for the same lesson.

**Blocked by:** None (can start immediately).

**Status:** completed

- [x] Store `onTokenExpired` in a stable `useRef` inside `VideoPlayer.tsx` and remove it from `useEffect` dependencies.
- [x] Do not reset `watchedMaxRef` or `completedRef` on token refresh when `activeTarget` updates for the same lesson.
- [x] Only reset watched metrics when the lesson remounts (guaranteed by `key={numericLessonId}`).
- [x] Add unit test in `src/features/student-courses/__tests__/video-player-helpers.test.ts`.
