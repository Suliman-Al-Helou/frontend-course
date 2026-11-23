# Impeccable Critique: Instructor Curriculum Tree, Task Editor & Video Ingestion

**Date:** 2026-11-23T17:03:00Z  
**Target:** `src/features/instructor-portal/components/` & `src/app/(instructor)/instructor/courses/[id]/page.tsx`  
**Reviewer:** Antigravity (Impeccable 4-Step Atomic Governance Protocol)  
**Status:** Closed (Audit Complete)  
**closed:** true  

---

## 1. Problem Diagnosis & Architectural Alignment

### Issues Identified & Resolved:

1. **Missing Deep-Focus Workspace Route [P0]:**
   - **Resolved**: Created the dedicated dynamic route `src/app/(instructor)/instructor/courses/[id]/page.tsx` powered by `InstructorCourseWorkspace.tsx`. Features three ergonomic horizontal tabs:
     - **المنهج الدراسي والدروس:** Section accordions, lesson rows, publication toggle, video attachment, and task builder.
     - **بيانات المقرر التعليمية:** Content editor (`InstructorCourseContentEditor`) strictly omitting pricing, public publish status, and deletion controls per ADR 0014.
     - **الطلاب المسجلين:** Read-only student count and overview.

2. **Drag-and-Drop Bloat vs. Directional Arrow Ordering [P1]:**
   - **Resolved**: Replaced heavy, fragile third-party drag-and-drop libraries with **Directional Arrow Ordering** (`↑` and `↓`). Zero extra dependencies, zero gesture conflicts with vertical touch scrolling on mobile, full keyboard accessibility, and boundary disabling (top item cannot move up, bottom item cannot move down).

3. **Dual-Mode Video Attachment & Unlinked Playlist Resilience [P0]:**
   - **Resolved**: Implemented `InstructorCurriculumVideoPickerModal.tsx` supporting:
     - **Mode 1 (Direct Unlisted URL):** Instant 11-character video ID regex extraction with live YouTube thumbnail preview and direct YouTube link.
     - **Mode 2 (Course Playlist Gallery):** Connects to `instructorPortalQueries.youtubeVideos(courseId)` in the backend. If unlinked or channel disconnected, seamlessly provides an intuitive fallback to Mode 1.

4. **Task Integrity Guard & Canonical TaskQuestion Contract [P0]:**
   - **Resolved**: Implemented `InstructorLessonTaskEditor.tsx` conforming to the canonical `TaskQuestion` contract (ADR 0017, ADR 0023):
     - Supports Multiple Choice (MCQ) with $\ge 2$ options and True/False (صح / خطأ).
     - **Zero-Index Option Guard:** Explicit handling ensuring option index `0` is treated as a valid selection, completely eliminating the PHP/JS falsy evaluation bug.
     - **Historical Attempt Notice:** Displays an informational banner when `attempts_count > 0`, confirming revisions apply to subsequent attempts without altering past grades.
     - **Backend Barrier:** Backend strictly aborts with `422 Unprocessable Entity` if an attempt is made to delete a task with existing student submissions.

5. **Double-Submission Concurrency Locks & Touch Targets [P1]:**
   - **Resolved**: Enforced `useRef(false)` (`isSubmittingRef`) concurrency locks across all mutation handlers (`InstructorCurriculumView`, `InstructorCurriculumVideoPickerModal`, `InstructorLessonTaskEditor`, `InstructorCourseContentEditor`). All buttons and interactive targets measure $\ge 44 \times 44\text{px}$, and loading skeletons eliminate layout shifting (CLS).

---

## 2. Nielsen 10 Heuristics Score: 40/40

| # | Heuristic | Initial | Final | Notes |
|---|---|:---:|:---:|---|
| 1 | Visibility of system status | 2/4 | 4/4 | Clear loading skeletons for curriculum tree and course details; instant toast notifications on mutations. |
| 2 | Match between system and real world | 4/4 | 4/4 | Familiar educational taxonomy ("المنهج الدراسي", "أقسام المقرر", "الدروس", "المهمة التفاعلية"). |
| 3 | User control and freedom | 4/4 | 4/4 | Intuitive accordion expand/collapse, quick cancel on modals, and safe confirmation on destructive actions. |
| 4 | Consistency and standards | 3/4 | 4/4 | Full compliance with `DESIGN.md` (10% Indigo Rule, Two-Weights Rule, rounded-2xl cards). |
| 5 | Error prevention | 3/4 | 4/4 | `useRef` concurrency locks, deletion barriers on completed lessons/tasks (`422`), boundary arrow disabling. |
| 6 | Recognition rather than recall | 4/4 | 4/4 | Live video thumbnail preview, explicit question type tags, publication status badges (`منشور` / `مسودة`). |
| 7 | Flexibility and efficiency of use | 4/4 | 4/4 | Dual-mode video picker, quick publication toggle in one click, directional order swapping. |
| 8 | Aesthetic and minimalist design | 4/4 | 4/4 | Clean horizontal tabs, absence of visual clutter, compact and focused modal dialogs. |
| 9 | Help users recognize, diagnose, and recover from errors | 3/4 | 4/4 | Specific Arabic error toasts, field-level validation messages in task editor. |
| 10| Help and documentation | 3/4 | 4/4 | Explanatory labels for question options, pass percentage guidelines, and task attempt notices. |

---

## 3. Technical Audit Checklist (/20)
- [x] Strict Vertical Slice segregation (`src/features/instructor-portal/`) (4/4)
- [x] Zero cross-role component or route leakage (4/4)
- [x] TanStack Query v5 `queryOptions` factory pattern with cache invalidation (4/4)
- [x] Double-submission concurrency locks via `useRef` on all mutation forms (4/4)
- [x] Touch targets $\ge 44 \times 44\text{px}$, BiDi input safety, and zero-dependency A11y ordering (4/4)
- **Total Technical Audit Score: 20/20**
