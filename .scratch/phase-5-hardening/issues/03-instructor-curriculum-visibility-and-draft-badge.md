# 03: Instructor Curriculum Visibility & Draft Badge Indicator

**What to build:**
Expose `is_published` in frontend course types and render a clear "مسودة" (Draft) badge in the curriculum listing for course managers and instructors, fulfilling US 10.

**Blocked by:** None (can start immediately).

**Status:** completed

- [x] Expose `is_published: boolean` on `CourseLessonUI` in `src/features/courses/index.ts` and map it in `getCourseDetail.ts`.
- [x] Update public curriculum section lesson items to display a subtle draft badge when `is_published === false`.
- [x] Verify that unauthenticated visitors and students never see draft lessons in public listings.
