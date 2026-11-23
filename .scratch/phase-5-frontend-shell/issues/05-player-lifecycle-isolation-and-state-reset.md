# 05: Video Player Lifecycle Isolation & State Reset Guard

**What to build:** Prevent cross-lesson progress and timer leaks. Mount `<VideoPlayer key={numericLessonId} ... />` in `src/app/(student)/courses/[courseId]/lessons/[lessonId]/page.tsx` ensuring complete React remounting on lesson transitions. In `VideoPlayer.tsx`, implement `useEffect` with an `isCancelled` flag to guard async teardown and reset refs (`watchedMaxRef`, `completedRef`, `intervalRef`).

**Blocked by:** 01: Discriminated Playback & Lesson Schema Contract

**Status:** ready-for-agent

- [ ] Mount `<VideoPlayer key={numericLessonId} ... />` in lesson page.
- [ ] Add `isCancelled` lifecycle guard in `VideoPlayer.tsx` resetting all refs on lesson change.
- [ ] Verify that navigating between lessons does not leak watch progress or fire premature `onComplete`.
