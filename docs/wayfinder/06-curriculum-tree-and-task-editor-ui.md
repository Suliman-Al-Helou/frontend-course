# Ticket 06: Phase 6 — Isolated Curriculum Tree & Auto-Graded Task Editor UI

**Tracker Label**: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/docs/wayfinder/map.md)  
**Status**: Completed  
**Assignee**: Unassigned  
**Blocked by**: [Ticket 05: Phase 5 — Frontend Shell, Role Guards & VideoDelivery Playback Contract](file:///home/suliman/Documents/courses/docs/wayfinder/05-frontend-shell-and-playback-contract.md)  

## Question

How do we build the isolated `src/features/instructor-portal/` vertical slice with dedicated role components, curriculum management, YouTube video attachment, and the auto-graded MCQ/TF lesson task editor while complying strictly with the 4-Step Impeccable UI Governance Protocol?

## Acceptance Criteria

1. **Vertical Slice Setup (`src/features/instructor-portal/`):**
   - Create directories: `api/`, `queries/`, `components/`, `types/`, and `ai-context.md`.
   - Setup TanStack Query v5 factory (`queries/instructor.queries.ts`) with query keys `['instructor', ...]` and explicit `staleTime`.
   - Setup mutation hooks with automatic cache invalidation (`queries/instructor.mutations.ts`).
2. **Dedicated Course Management Components:**
   - `InstructorCourseCard.tsx`: Displays assigned course title, cover, enrolled student count, lesson count, and direct link to workspace.
   - `InstructorCourseContentEditor.tsx`: Modal to update educational metadata (`title`, `description`, `cover_image`, `level`, `what_you_learn`, `requirements`). **Strictly omits** price, status, public toggle, and course deletion buttons.
3. **Curriculum & Video Attachment Builder:**
   - `InstructorCurriculumView.tsx`: Section accordions with collapsible drag/inline lesson items, including an `is_published` visibility toggle (defaulting to published).
   - `InstructorCurriculumVideoPickerModal.tsx`:
     - Allows entering an unlisted YouTube URL (auto-extracting video ID into `playback.source`).
     - Allows selecting from videos in the course's linked YouTube playlist (via `/api/instructor/courses/{id}/youtube-videos`).
4. **Auto-Graded Lesson Task Editor (`InstructorLessonTaskEditor.tsx`):**
   - Complies strictly with the canonical `TaskQuestion` contract (ADR 0016).
   - Supports **Multiple Choice (MCQ)** and **True/False (صح / خطأ)** questions.
   - Input fields for question text, options, selection of correct answer index, and explanation text.
   - Configurable `pass_percentage` (default 70%) and `max_attempts` (default 3).
5. **Technical Hardening & Concurrency Locks:**
   - All modal submission handlers enforce `useRef(false)` double-submission locks (`isSubmittingRef`).
   - Skeletons provided for loading states to prevent CLS.
   - Touch targets meet $\ge 44 \times 44\text{px}$.
6. **Impeccable UI Governance Protocol Execution:**
   - **Step 1:** Critique & record findings in `frontend-course/.impeccable/critique/<timestamp>__instructor-portal-curriculum.md`.
   - **Step 2:** Polish against `DESIGN.md` tokens (10% Indigo Rule, Two-Weights Rule).
   - **Step 3:** Harden (BiDi fields, `prefers-reduced-motion`, concurrency locks).
   - **Step 4:** Hygiene & Audit (dead code cleanup, technical audit score /20).
