# 01: Instructor Course Workspace Shell & Navigation Binding

**What to build:**
Create the dedicated course workspace page at `/instructor/courses/[id]` with horizontal navigation tabs (Curriculum, Course Content, Enrolled Students). Update the course card in `InstructorCourseCard.tsx` to link directly to this workspace, and establish the TanStack Query v5 cache factory for course details with layout-shift prevention skeletons.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] Route `/instructor/courses/[id]/page.tsx` renders dynamic workspace with course header and horizontal tabs.
- [x] `InstructorCourseCard.tsx` action button links to `/instructor/courses/${course.id}`.
- [x] `instructorPortalQueries.courseDetail(id)` query factory configured with 5-minute staleTime.
- [x] Layout shift (CLS) prevented with custom skeleton loading state.
- [x] Unit tests verify navigation and query factory behavior.
