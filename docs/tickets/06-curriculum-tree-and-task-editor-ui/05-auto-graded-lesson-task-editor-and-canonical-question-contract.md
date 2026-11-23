# 05: Auto-Graded Lesson Task Editor & Canonical Question Contract

**What to build:**
Build `InstructorLessonTaskEditor.tsx` modal supporting the canonical `TaskQuestion` contract (ADR 0017). Enable instructors to add, edit, and delete Multiple Choice (MCQ) and True/False (صح / خطأ) questions, configure passing percentage (default 70%) and max attempts (default 3), provide explanations, and display a non-retroactive warning banner if student attempts already exist.

**Blocked by:** 02: Curriculum Tree Sections, Lessons & Directional Arrow Ordering, 04: Backend Instructor Task Controller & Task Integrity Guard

**Status:** completed

- [x] `InstructorLessonTaskEditor.tsx` renders interactive question builder conforming to `TaskQuestion` contract.
- [x] Supports MCQ (>= 2 options, 0-based correct answer) and True/False (`["صح", "خطأ"]`).
- [x] Zero-Index Option Guard: option index `0` is treated as a valid selection, never as a missing value.
- [x] Warning notice is displayed when editing a task with existing student attempts.
- [x] Concurrency lock (`isSubmittingRef`) prevents rapid duplicate submissions.
- [x] Unit tests verify contract serialization and question validation.
