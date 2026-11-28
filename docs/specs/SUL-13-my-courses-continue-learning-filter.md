# [Feature] My Courses, Continue Learning & Free/Paid Filter (SUL-13)

> **Status**: Completed (2026-11-28)

## Problem Statement
1. Free courses that a student started watching do not appear in "My Courses" or "My Videos" unless an enrollment row was created.
2. Unfinished videos in "Continue Learning" are missed if progress wasn't flushed or cache wasn't invalidated, and students need to see where they stopped regardless of whether the course is free or paid.
3. Students need a filter for Free vs Paid courses in "My Courses".

## Solution
- Ensure `GET /api/my-courses` includes courses the student has started watching (via `UserLessonProgress`) in addition to `Enrollment` records, and support `?type=free|paid` filtering.
- Ensure `GET /api/lessons/in-progress` returns all unfinished lessons (`completed = false`, `watched_percent > 0`) regardless of free/paid, and invalidate `inProgressLessons` on progress save.
- Add Free / Paid filter support in the frontend "My Courses" view.

## Testing Decisions
- Backend API feature tests: `GET /api/my-courses`, `GET /api/my-courses?type=free|paid`, and `GET /api/lessons/in-progress`.
- Frontend unit/integration tests for the Free/Paid filter.
