# 02: Curriculum Tree Sections, Lessons & Directional Arrow Ordering

**What to build:**
Implement `InstructorCurriculumView.tsx` rendering course sections as collapsible accordions with nested lesson rows. Support creating, editing, and deleting sections and lessons (with deletion guarded against completed student progress). Support publication state toggling (`is_published`) and reorder sections and lessons using accessible directional up/down arrow buttons without external drag-and-drop dependencies.

**Blocked by:** 01: Instructor Course Workspace Shell & Navigation Binding

**Status:** completed

- [x] `InstructorCurriculumView.tsx` renders section accordions and nested lesson rows.
- [x] Directional Arrow Ordering (`↑` and `↓`) implemented for both sections and lessons with boundary disabling.
- [x] Lesson publication toggle switches `is_published` state with optimistic UI feedback.
- [x] Creation and editing modals for sections and lessons enforce `useRef(false)` concurrency locks.
- [x] Deletion of lessons with student progress is prevented and surfaces appropriate domain feedback.
