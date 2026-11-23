# Spec: Phase 4 — Server-Side Exam Gating & Atomic Progress Completion

**Status**: Ready for Implementation  
**Triage Label**: `ready-for-agent`  
**Parent Roadmap**: [Wayfinder Map](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/map.md)  
**Associated Ticket**: [Ticket 04: Phase 4](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/04-exam-gating-and-atomic-completion.md)  
**Governing Architectural Decisions**:
- [ADR 0016: Instructor CoursePolicy, IDOR Prevention Boundary, and Centralized Parent Traversal](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0016-instructor-course-policy-and-idor-prevention.md)
- [ADR 0017: Video Provider Driver and Curriculum Publication Contract](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0017-video-provider-driver-and-curriculum-publication-contract.md)
- [ADR 0020: Dual-Requirement Lesson Progression and Atomic Task Gating](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0020-dual-requirement-lesson-progression-and-atomic-task-gating.md)

---

## Problem Statement

When students navigate sequential course curriculum, the learning platform enforces prerequisite lesson completion before granting access to subsequent lessons. In the existing architecture:

1. **The Deadlock Flaw**: Task viewing and task submission endpoints evaluate whether the student has completed the lesson before allowing access to the task. However, for lessons that include an assessment task, the lesson cannot and should not be marked complete until the student successfully submits the task. This introduces an immediate architectural deadlock: students who watch 100% of the lesson video can neither view the questions nor submit their answers because the lesson itself remains incomplete.
2. **Task Skipping & Premature Progression**: The video watch progress tracking endpoint indiscriminately marks lessons as completed whenever watch percentage reaches or exceeds 80%, completely ignoring whether the lesson has an attached task. Consequently, students can bypass mandatory comprehension checks and unlock downstream lessons by simply letting the video player stream or scrubbing forward.
3. **Weak Schema & Incomplete Submission Vulnerability**: The task submission validation layer merely checks that the payload contains an array. It permits empty payloads or partially answered questionnaires, allowing students to submit blank sheets and obtain progression credit without engaging with the educational material.
4. **The Zero-Index Type Coercion Trap**: In the canonical question contract, option indices are zero-based integers (where `0` denotes the first choice). Standard truthiness checks in scripting runtimes evaluate `0` as falsy, misclassifying valid first-choice answers as blank or omitted responses.
5. **Non-Atomic Progression & Partial Mutation Risk**: Task attempt logging and student lesson progress updates are processed in independent steps without database transaction boundaries. If a system failure or network disconnection occurs between creating the attempt and updating progress, the student's attempt is logged without unlocking the next lesson, or the lesson is unlocked without preserving their attempt history.
6. **Progress Degradation on Review**: When an enrolled student who has previously completed a lesson revisits it to review key concepts from the beginning, subsequent watch progress updates risk overwriting their earned completion status back to incomplete.

---

## Solution

Establish an airtight, deterministic **Dual-Requirement Progression Engine** that strictly governs syllabus advancement based on both media playback and assessment completion:

1. **Decoupled Task Unlock Gate**:
   - The task inspection and submission endpoints gate access exclusively on video engagement (requiring $\ge 80\%$ watch duration), decoupling task availability from overall lesson completion status and eliminating the architectural deadlock.
2. **Dual-Requirement Watch Progression**:
   - The video watch tracking endpoint distinguishes between lessons with attached tasks and taskless lessons.
   - For lessons with tasks, saving video progress stores playback position and watch percentage, but leaves completion status false until the task is submitted (preserving true if the lesson was already completed).
   - For taskless lessons, watch percentage reaching $\ge 80\%$ immediately marks the lesson complete and unlocks the subsequent lesson.
   - Subsequent video playback on already completed lessons is strictly idempotent and never revokes earned completion.
3. **Dynamic Full-Schema Validation & Zero-Index Guard**:
   - Task submission requests dynamically load the lesson's task definition and verify that an explicit, non-null numeric option index is provided for every question defined in the questionnaire.
   - Missing or blank answers are rejected with `422 Unprocessable Content` and a localized Arabic explanation, preventing partial submissions.
4. **Deterministic Auto-Grading & Formative Progression**:
   - Submissions are graded deterministically against the canonical question schema, comparing student option indices directly against correct option indices.
   - In accordance with formative learning design, submitting complete answers to all questions completes the lesson and unlocks the subsequent curriculum item immediately, regardless of whether the score satisfies the passing threshold.
   - Diagnostic scores and attempt records are permanently preserved, and students may utilize remaining attempt allocations to improve their grade without jeopardizing their unlocked syllabus progress.
5. **Atomic Transaction Boundary**:
   - Attempt creation and lesson progress updates are bound within a single database transaction with pessimistic row-locking on prior attempts. If any error occurs, the transaction rolls back cleanly, guaranteeing zero orphaned attempts and zero unearned completions.

---

## User Stories

1. As an enrolled student, I want to unlock a lesson's interactive task as soon as I have watched at least 80% of its video, so that I can demonstrate my comprehension.
2. As an enrolled student, I want to be blocked from viewing or submitting a task before watching 80% of the video, so that I am motivated to engage with the educational lecture first.
3. As an enrolled student on a lesson with a task, I want the subsequent lesson to remain locked even if I watch 100% of the video, so that I cannot skip mandatory practical exercises.
4. As an enrolled student on a lesson without any task, I want the lesson to be marked complete automatically as soon as I watch 80%, so that I can proceed directly to the next lesson without friction.
5. As an enrolled student, I want to submit answers to a task and have my answers validated against all questions in the questionnaire, so that I receive accurate evaluation across the full curriculum topic.
6. As an enrolled student, I want the system to reject my submission with a clear 422 error if I leave any question unanswered, so that I know exactly which questions require my attention.
7. As an enrolled student choosing the first option (index 0) for a question, I want my selection recognized as a valid answer, so that I am never falsely accused of submitting an empty response.
8. As an enrolled student who answers all questions but scores below the passing mark, I want the lesson marked complete and the next lesson unlocked, so that I can maintain learning momentum and diagnose my conceptual gaps.
9. As an enrolled student who wishes to improve a low score on a task, I want to use my remaining attempts to retake the questionnaire, so that I can master the material and improve my academic record.
10. As an enrolled student retaking a task, I want my previously unlocked next lesson to remain unlocked regardless of my retry score, so that my curriculum pacing is never demoted.
11. As an enrolled student who has exhausted all allowed attempts on a task, I want subsequent submission attempts rejected with a rate-limiting status, so that assessment limits are respected.
12. As an enrolled student who failed a task attempt with an active cooldown timer, I want to be informed of the remaining cooldown minutes before I can retry, so that I have time to review the lecture.
13. As an enrolled student returning to review a completed video lesson from the start, I want my lesson completion and overall course progress percentage preserved, so that refreshing my knowledge never penalizes my completion record.
14. As an instructor, I want to know that students cannot unlock lessons downstream of my assigned tasks without submitting answers to all my questions, so that pedagogical standards are maintained.
15. As an instructor, I want student task attempts and scores recorded permanently, so that I can diagnose common student errors and refine my curriculum.
16. As a platform administrator, I want task attempts and lesson progress updates to occur atomically, so that database disconnects or server crashes never create corrupt, partially updated student states.
17. As an unauthenticated guest or student not enrolled in the course, I want any attempt to view or submit lesson tasks or update lesson progress rejected with 401 or 403, so that course content remains protected.

---

## Implementation Decisions

### 1. Decoupled Task Gating Layer
- The task retrieval and submission endpoints verify that the student possesses a recorded progress entry with a watch percentage of at least 80%.
- All checks against the composite completion flag on task endpoints are completely removed.
- If watch percentage is under 80% or no progress record exists, access terminates with `403 Forbidden` and an explicit watch requirement message.

### 2. Dual-Requirement Video Progress State Machine
- When processing video watch progress updates:
  - If the lesson has an associated task:
    - Update highest watch percentage and playback position.
    - Preserve existing completion state (if already complete, retain true; if incomplete, retain false).
    - Return `task_unlocked: true` when watch percentage $\ge 80\%$.
  - If the lesson does not have an associated task:
    - Update highest watch percentage and playback position.
    - Set completion to true if watch percentage $\ge 80\%$, otherwise false.
- Ensure all video progress mutations are idempotent: once completion is true, it remains true permanently.

### 3. Dynamic Form Request Questionnaire Validator
- The task submission form request intercepts validation to dynamically inspect the questions attached to the target lesson's task.
- Enforces that the incoming answers dictionary contains an entry for every question ID present in the task definition.
- Enforces the **Zero-Index Option Guard**: verifies that every provided answer is non-null and numeric (`is_numeric($val) && !is_null($val)`), protecting index `0` from falsy coercion.
- Rejects incomplete or invalid payloads with `422 Unprocessable Content` and standardized Arabic error feedback:
  ```json
  {
    "message": "يجب الإجابة على جميع الأسئلة لتسليم المهمة",
    "errors": {
      "answers": ["..."]
    }
  }
  ```

### 4. Deterministic Auto-Grading & Atomic Submission Transaction
- Task submission execution runs entirely within a database transaction:
  1. Acquires a pessimistic row-lock on prior attempts for the user and task.
  2. Enforces maximum attempt boundaries and cooldown timers.
  3. Re-verifies video watch requirement ($\ge 80\%$) under database isolation.
  4. Auto-grades student answers against the canonical question schema (`mcq` and `true_false` types), comparing integer student choices directly with stored correct choices.
  5. Computes percentage score and pass status.
  6. Creates the immutable `TaskAttempt` record.
  7. Atomically updates or creates the `UserLessonProgress` record with `completed = true`.
- Both writes commit together; any failure triggers an automatic transaction rollback.

---

## Testing Decisions

### What Makes a Good Test
- Tests must interact exclusively through external HTTP API boundaries (endpoints, request payloads, response statuses, and database state assertions).
- Tests must never assert internal private service variables or mock out business logic unless simulating infrastructure faults.
- Every progression invariant must be verified end-to-end: verifying that completing the prerequisite lesson genuinely allows access to the subsequent lesson via the authorization policy.

### Modules Under Test
- Progression and watch tracking endpoints (`/api/lessons/{id}/progress`).
- Task inspection and submission endpoints (`/api/lessons/{id}/task`).
- Lesson access authorization policy (`watchLesson`).
- Transaction rollback resilience during database failures.

### Prior Art
- `backendCourse/tests/Feature/TaskTest.php` (Existing baseline task testing).
- `backendCourse/tests/Feature/ProgressTest.php` (Existing baseline progress testing).
- `backendCourse/tests/Feature/LessonProgressionGatingTest.php` (The dedicated Phase 4 test suite).

---

## Out of Scope

- **Open-Ended Free-Text Grading**: Manual grading queues and subjective text evaluation are excluded from the initial release; assessment is limited to auto-graded Multiple Choice and True/False questions.
- **Dynamic Question Randomization**: Shuffling question orders or option orders per attempt is deferred to post-MVP iterations.
- **Audio/Voice Answer Submissions**: Uploading voice recordings or MP3 answers is out of scope.
- **Certificate Auto-Generation**: Triggering course completion diplomas upon final lesson completion is handled in a separate feature.

---

## Further Notes

- The canonical schema for task questions conforms to ADR 0017 and is stored in `tasks.questions` as typed JSON.
- Frontend components (`TaskSection.tsx` and `LessonSidebar.tsx`) consume the `completed` and `task_unlocked` flags to render interactive state and syllabus locks.
