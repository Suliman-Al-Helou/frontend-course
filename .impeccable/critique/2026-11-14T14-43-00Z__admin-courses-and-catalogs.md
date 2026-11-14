# Impeccable Critique: Admin Courses, Instructors & FAQs (`src/features/admin-courses/`, `instructors/`, `faqs/`)

- **Target**: `src/features/admin-courses/`, `src/features/instructors/`, `src/features/faqs/`
- **Timestamp**: `2026-11-14T14:43:00Z`
- **Evaluator**: Antigravity Impeccable Governance Protocol
- **Status**: Open (Diagnosis & Heuristics)

---

## 1. Nielsen Heuristics Scorecard (34/40)

| Heuristic | Score | Observations |
| :--- | :---: | :--- |
| **1. Visibility of system status** | 4/4 | Pulse loading skeletons, mutation spinners, sonner toasts on creation/update/deletion. |
| **2. Match between system & real world** | 3/4 | Missing grammatical Arabic pluralization across administrative counters (`X كورس`, `X طالب`, `X درس`, `X مدرب`, `X سؤال`). |
| **3. User control & freedom** | 4/4 | `ConfirmModal` on destructive actions, inline editing cancelation, modal escape key support. |
| **4. Consistency & standards** | 3/4 | Hardcoded color utilities (`amber-500`, `emerald-500`) in `statusConfig` within `EnrollmentRequests.tsx`. |
| **5. Error prevention** | 4/4 | Concurrency locks (`updatingIdRef`, `isDeletingRef`, `savingIdRef`), validation before dispatch. |
| **6. Recognition rather than recall** | 4/4 | Calculated student counts in memory, price badges, instructor avatars, course level indicators. |
| **7. Flexibility & efficiency of use** | 4/4 | Live multi-criteria search, filter tabs, quick inline FAQ draft saving. |
| **8. Aesthetic & minimalist design** | 4/4 | Follows the Minimalist Surface Rule; cards layout with consistent border radii and spacing. |
| **9. Help users with errors** | 4/4 | Meaningful error toast feedback, empty states when queries return zero results. |
| **10. Help & documentation** | 4/4 | Explanatory subheaders for each management section. |

---

## 2. Issues & Prioritization

### [P0] Critical (None)
- No runtime blockers detected; full TanStack Query v5 conformance with clean mutations.

### [P1] Major / Consistency
1. **Hardcoded Color Utilities in `EnrollmentRequests.tsx`**:
   - Status config uses `bg-amber-500/10 text-amber-600` and `bg-emerald-500/10 text-emerald-600` instead of design tokens (`warning` and `success`).
2. **Missing Grammatical Arabic Pluralization**:
   - `ManageCoursesTab.tsx`: `{courses.length} كورس`, `{students_count} طالب`, `{lessons_count} درس`.
   - `ManageInstructorsTab.tsx`: `{instructors.length} مدرب`.
   - `ManageFaqTab.tsx`: `{faqs.length} سؤال`.
   - `EnrollmentRequests.tsx`: `{enrollments.length} طلب`.
3. **BiDi Precision on Email in Enrollment Requests**:
   - Student email in enrollment requests table needs explicit `dir="ltr"` and `font-mono text-xs`.

### [P2] Minor / Polish
1. **Touch Target Dimensions**:
   - Table action buttons (Accept, Reject, Edit, Delete) should maintain `min-h-[36px]` with accessible click target areas.
2. **Reduced Motion on Expandable Accordions**:
   - Ensure FAQ expansion and skeleton pulses respect `motion-reduce:animate-none`.

---

## 3. Planned Remediation
1. **Step 2 (Polish)**:
   - Enforce `DESIGN.md` tokens in `statusConfig` (`bg-warning/10 text-warning`, `bg-success/10 text-success`).
   - Implement Arabic pluralization helpers across all admin catalog counters.
   - Add explicit `dir="ltr"` to email representations.
   - Expand touch targets on action icon buttons.
2. **Step 3 (Harden)**:
   - Verify concurrency locks across all mutations (`updatingIdRef`, `isDeletingRef`, `isAddingRef`).
   - Ensure `motion-reduce:animate-none` on modals and loaders.
3. **Step 4 (Audit)**:
   - Run typecheck, Vitest test suite, and Turbopack build.
   - Update critique file with `closed: true` and 20/20 scorecard.
