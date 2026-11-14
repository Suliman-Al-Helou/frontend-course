# Impeccable Critique: Media Pipeline Feature (`src/features/media-pipeline/`)

- **Target**: `src/features/media-pipeline/` (`MediaPipelineTab`, `LiveMeetingsView`, `VideoAssetsView`, `VideoAssetModal`, `ZoomMeetingModal`)
- **Timestamp**: `2026-11-14T14:25:00Z`
- **Evaluator**: Antigravity Impeccable Governance Protocol
- **Status**: Open (Diagnosis & Heuristics)

---

## 1. Nielsen Heuristics Scorecard (33/40)

| Heuristic | Score | Observations |
| :--- | :---: | :--- |
| **1. Visibility of system status** | 4/4 | Chunked video upload progress bar with byte counts, spinners on mutations, live YouTube polling. |
| **2. Match between system & real world** | 3/4 | Attendance records show raw numbers (`X طالب`) without Arabic pluralization rules (`طالب / طالبان / طلاب`). |
| **3. User control & freedom** | 4/4 | Upload cancellation with `isCancelledRef`, Escape key modal closing, deletion confirmation dialog. |
| **4. Consistency & standards** | 2/4 | **Protocol Violation**: `LiveMeetingsView` fetches attendances imperatively via `api.get` into `useState`, bypassing `mediaPipelineQueries.attendances()`. Raw color utilities (`emerald-500`, `amber-500`, `red-600`) used instead of tokens. |
| **5. Error prevention** | 4/4 | `ConfirmModal` for irreversible deletions, `isSubmittingRef` double-submit locks, YouTube ID extraction. |
| **6. Recognition rather than recall** | 4/4 | YouTube thumbnail preview, course badges, pre-filled edit fields, duration formatting (`mm:ss`). |
| **7. Flexibility & efficiency of use** | 4/4 | Drag-and-drop chunked file upload, course filtering, direct YouTube OAuth connection. |
| **8. Aesthetic & minimalist design** | 4/4 | Follows the Minimalist Surface Rule; clean controls bar and compact YouTube connection badge. |
| **9. Help users with errors** | 4/4 | Accessible `FormError` alerts, upload error recovery, sonner notifications. |
| **10. Help & documentation** | 4/4 | Informative empty states, file size limits and chunk size guidance. |

---

## 2. Issues & Prioritization

### [P0] Critical / Architectural Defect
1. **Direct Imperative Data Fetching in `LiveMeetingsView.tsx`**:
   - `LiveMeetingsView` uses `useState` + `api.get("/admin/zoom-meetings/${meetingId}/attendances")` instead of consuming `useQuery(mediaPipelineQueries.attendances(meetingId))`.
   - **Remediation**: Extract an isolated `MeetingAttendancesDrawer` component consuming the TanStack Query cache directly with zero imperative fetching.

### [P1] Major / Consistency
1. **Hardcoded Color Classes**:
   - `VideoAssetsView.tsx` uses `emerald-500`, `amber-500`, and `red-600` instead of semantic design tokens (`text-success`, `bg-success/10`, `text-warning`, `text-destructive`).
2. **Missing Arabic Pluralization**:
   - Attendance roster header displays `(${attendances.length} طالب)` and `(${m.attendances_count ?? 0})` without grammatical pluralization.
3. **Accessibility on Progress Indicators**:
   - Video upload progress bar in `VideoAssetModal.tsx` lacks full ARIA attributes (`role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`).

### [P2] Minor / Polish
1. **Motion Reduction on Preview Dialog**:
   - Add `motion-reduce:animate-none` to YouTube iframe preview modal and roster drawer.
2. **Touch Target Sizing**:
   - Ensure small icon action buttons (Pencil, Trash2, Close) have sufficient `min-h-[44px]` tap targets or container paddings.

---

## 3. Planned Remediation
1. **Step 2 (Polish)**:
   - Refactor `LiveMeetingsView` attendance roster to `useQuery(mediaPipelineQueries.attendances(meetingId))`, eliminating `api.get` and local state.
   - Replace raw colors with `DESIGN.md` tokens (`success`, `warning`, `destructive`).
   - Implement Arabic pluralization helper for attendance counts (`طالب`, `طالبان`, `طلاب`).
2. **Step 3 (Harden)**:
   - Add ARIA attributes (`role="progressbar"`) and `motion-reduce:animate-none` to modals and preview dialogs.
   - Verify double-submit concurrency locks (`isSubmittingRef`) across all modals.
3. **Step 4 (Audit)**:
   - Run typecheck, Vitest test suite, and Turbopack build.
   - Update critique file with `closed: true` and 20/20 scorecard.
