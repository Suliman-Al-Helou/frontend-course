# Impeccable Critique: Student Video Player & Classroom (`src/features/student-courses/components/player/`)

- **Timestamp**: 2026-11-14T13:47:00Z
- **Target**: `src/features/student-courses/components/player/` (`VideoPlayer.tsx`, `LessonSidebar.tsx`, `TaskSection.tsx`) and host page `src/app/(student)/courses/[courseId]/lessons/[lessonId]/page.tsx`
- **Surface Mode**: Operate (Interactive Student Classroom & Video Streaming)
- **Closed**: false

---

## 1. Nielsen Heuristics Evaluation (Score: 32.5 / 40)

| Heuristic | Score (/4) | Findings & Observations |
| :--- | :---: | :--- |
| **1. Visibility of system status** | 4.0 | Real-time progress bar, completion percentage, task loading spinner, and completion banners are present. |
| **2. Match between system & real world** | 3.5 | Domain terms ("الدرس السابق", "التالي", "اجتياز المهمة") align with Arabic educational expectations. Minor pluralization nuance on lesson counts. |
| **3. User control and freedom** | 3.0 | Next lesson button completely disappears when locked rather than showing a disabled/locked state with reason. |
| **4. Consistency and standards** | 3.5 | Follows YouTube iframe player standards and Lucide iconography. |
| **5. Error prevention** | 3.5 | Double-submission guard (`isSubmittingRef`) on task submissions and disabled submit button when incomplete. |
| **6. Recognition rather than recall** | 3.5 | Sidebar clearly distinguishes completed, current, and locked lessons using semantic color and icons. |
| **7. Flexibility and efficiency of use** | 3.0 | Accordion collapse/expand per section works well. Lacks keyboard navigation shortcuts for lesson hopping. |
| **8. Aesthetic and minimalist design** | 3.5 | Clean card aesthetics; watermark is static rather than drifting/dynamic per domain glossary. |
| **9. Help recognize & recover from errors** | 3.0 | Locked lesson click emits toast warning. **Critical flaw**: silent `catch {}` on task submission network errors. |
| **10. Help and documentation** | 3.0 | Task answers include explanation hints on failure. |

---

## 2. Issues Breakdown & Priority Classification

### 🚨 [P0] Critical Issues (Must Resolve Before Ship)
1. **Silent Catch on Task Submission (`TaskSection.tsx`)**:
   - `handleSubmit` suppresses network failures silently without firing a destructive toast or showing error feedback, leaving the user with an idle screen without knowing why their answers weren't recorded.
2. **Forensic Watermark Static Placement (`VideoPlayer.tsx`)**:
   - Watermark is statically pinned to `top-4 start-4`, making it vulnerable to cropping or fixed overlays. Must support periodic dynamic position drift across frame quadrants per `GLOSSARY.md`.

### ⚠️ [P1] Serious Issues (Usability & Accessibility)
1. **Disappearing Next Lesson Button (`page.tsx`)**:
   - When the student hasn't completed the video or task, the "التالي" button completely vanishes from the sticky header, causing layout instability and confusion. Should render a disabled/locked button with a tooltip or visual lock indicator.
2. **Directional Arrow Inversion in RTL (`page.tsx`)**:
   - Return-to-course and next/prev arrows require explicit RTL inspection to prevent inverted navigation cues in Arabic mode.
3. **Missing Empty State for Syllabus**:
   - If a course has no lessons or empty sections, `LessonSidebar` renders a bare divide container without a fallback message.

### 💡 [P2] Polish & Refinement Issues
1. **Task Radio Item Micro-Interactions**:
   - Enhance option selection states with tactile active scale and keyboard focus rings.
2. **Sidebar Height Adaptability**:
   - Ensure `max-h` adapts smoothly on smaller viewports (e.g. tablet landscape / small laptops) without double-scrolling friction.

---

## 3. Required Life-Cycle Progression
- [ ] **Step 1**: Critique documented & user approval obtained (Current Step)
- [ ] **Step 2**: Polish (`/impeccable polish`): Resolve P0 & P1 issues, align tokens with `DESIGN.md`
- [ ] **Step 3**: Harden (`/impeccable harden`): Concurrency guards, toast notifications on task error, dynamic watermark drift, reduced-motion compliance
- [ ] **Step 4**: Hygiene & Audit: Dead code cleanup, final audit score card

