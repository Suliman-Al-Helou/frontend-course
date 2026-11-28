# [Phase 1] Video Access Gating, Progress Integrity & Next-Lesson 403 Fix (SUL-10)

> **Status**: Completed (2026-11-28)

## Problem Statement
Students watching a course are blocked with a "don't have access" (403) error when trying to advance to the next lesson even when the current lesson has no exam, and progress/gating rules (>80% watch threshold, exam completion, sequential locking) are not reliably enforced from real student activity.

## Solution
Fix the lesson-unlocking and progress-persistence pipeline so that watching >80% of a video reliably marks a no-exam lesson as completed (or unlocks its exam if one exists), sequential lesson access is enforced strictly on the backend, and progress is persisted via throttled updates plus immediate flushes on pause, seek, end, and page unload.

## User Stories
1. As a student, I want my video watch progress to be saved reliably as I watch, so that my real progress is never lost.
2. As a student, I want to unlock the exam or the next lesson (if there is no exam) as soon as I watch more than 80% of the current video, so that I can continue learning without artificial blocks.
3. As a student, I want to be blocked from skipping to the next lesson before finishing the current lesson (and its exam, if one exists), so that the curriculum order is respected.
4. As a student, I want to see only my own progress and access only lessons I have unlocked, so that my learning state is accurate and isolated.

## Implementation Decisions
- Progress persistence: Throttle progress updates every 5 seconds during playback, and flush immediately on pause, seek, video end, and page unload (`beforeunload`).
- Completion threshold: Watching >= 80% of a lesson's video unlocks its exam (if present) or marks the lesson completed (if no exam exists).
- Exam gating: If a lesson has an exam, passing/solving the exam is required before `completed` becomes true and the next lesson unlocks.
- Root-cause fix: Ensure the backend progress endpoint sets `completed = true` when >= 80% is reached on no-exam lessons, and the frontend flushes progress before navigating to the next lesson so the lesson authorization policy sees the updated completion state.

## Testing Decisions
- Test at the highest seams:
  - Backend API feature tests: `POST /api/lessons/{id}/progress` and `GET /api/lessons/{id}` verifying 403 when previous lesson is incomplete, 200 when >= 80% watched (no exam), and 403 until exam is passed (with exam).
  - Frontend integration tests: Video player progress flushing on `ended`, `pause`, `seek`, and `beforeunload`, plus next-lesson navigation unlocking.

## Out of Scope
- HLS.js buffering/ABR tuning, TanStack Query caching, and double-click fullscreen (covered in Phase 2 / SUL-11).
- Signed stream proxy URLs, metadata obfuscation, and multi-provider switching (covered in Phase 3 / SUL-12).
