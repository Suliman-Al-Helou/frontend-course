# Impeccable Critique: Admin Courses, Instructors & FAQs (`src/features/admin-courses/`, `instructors/`, `faqs/`)

- **Target**: `src/features/admin-courses/`, `src/features/instructors/`, `src/features/faqs/`
- **Timestamp**: `2026-11-14T14:43:00Z`
- **Evaluator**: Antigravity Impeccable Governance Protocol
- **Status**: Closed (Audit Complete)
- **closed**: true

---

## 1. Nielsen Heuristics Scorecard (34/40 Initial -> 40/40 Post-Remediation)

| Heuristic | Initial | Final | Remediation Implemented |
| :--- | :---: | :---: | :--- |
| **1. Visibility of system status** | 4/4 | 4/4 | Pulse loading skeletons, mutation spinners, sonner toasts on creation/update/deletion. |
| **2. Match between system & real world** | 3/4 | 4/4 | Implemented grammatical Arabic pluralization helpers across all admin catalog counters (`formatCoursesCount`, `formatStudentsCount`, `formatHoursCount`, `formatInstructorsCount`, `formatFaqsCount`, `formatRequestsCount`). |
| **3. User control & freedom** | 4/4 | 4/4 | `ConfirmModal` on destructive actions, inline editing cancelation, modal escape key support. |
| **4. Consistency & standards** | 3/4 | 4/4 | Enforced `DESIGN.md` tokens across `statusConfig` (`warning`, `success`, `destructive`, `primary`). |
| **5. Error prevention** | 4/4 | 4/4 | Concurrency locks (`updatingIdRef`, `isDeletingRef`, `savingIdRef`), validation before dispatch. |
| **6. Recognition rather than recall** | 4/4 | 4/4 | Calculated student counts in memory, price badges, instructor avatars, course level indicators. |
| **7. Flexibility & efficiency of use** | 4/4 | 4/4 | Live multi-criteria search, filter tabs, quick inline FAQ draft saving. |
| **8. Aesthetic & minimalist design** | 4/4 | 4/4 | Follows the Minimalist Surface Rule; cards layout with consistent border radii and spacing. |
| **9. Help users with errors** | 4/4 | 4/4 | Meaningful error toast feedback, empty states when queries return zero results. |
| **10. Help & documentation** | 4/4 | 4/4 | Explanatory subheaders for each management section. |

---

## 2. Issues & Prioritization

### [P0] Critical (None)
- No runtime blockers detected; full TanStack Query v5 conformance with clean mutations.

### [P1] Major / Consistency (Resolved)
1. **Hardcoded Color Utilities in `EnrollmentRequests.tsx`**:
   - Replaced `amber-500` and `emerald-500` with semantic design tokens (`warning` and `success`).
2. **Missing Grammatical Arabic Pluralization**:
   - Implemented pluralization for courses, lessons, students, instructors, FAQs, and enrollment requests.
3. **BiDi Precision on Email in Enrollment Requests**:
   - Added explicit `dir="ltr"` and `text-left font-mono` to student email column in table.

### [P2] Minor / Polish (Resolved)
1. **Touch Target Dimensions**:
   - Ensured table action buttons (Accept, Reject, Edit, Content, Delete) maintain `>= 36px` to `44px` click zones.
2. **Reduced Motion on Expandable Accordions**:
   - Verified `motion-reduce:animate-none` across skeletons, loaders, and transitions.

---

## 3. Five-Dimension Technical Audit Scorecard (20/20)

| Dimension | Weight | Score | Verdict |
| :--- | :---: | :---: | :--- |
| **1. DOM & Semantic Architecture** | 4 | 4/4 | Semantic admin cards, tables, clean drawer and modal structures. |
| **2. Contrast & Color Tokens** | 4 | 4/4 | 100% compliance with `DESIGN.md` tokens (`success`, `warning`, `primary`, `destructive`). |
| **3. RTL & BiDi Precision** | 4 | 4/4 | Native Arabic pluralization across all counters; `dir="ltr"` for email entries. |
| **4. Concurrency & Performance** | 4 | 4/4 | Query options factory cache consumption; strict ref concurrency locks on mutations. |
| **5. Accessibility & Motion** | 4 | 4/4 | Touch targets >= 36-44px; full `motion-reduce:animate-none` compliance. |
| **Total Technical Audit Score** | **20** | **20/20** | **Exemplary (Production-Ready)** |
