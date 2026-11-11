---
target: src/features/student-courses/components/player/LessonSidebar.tsx
total_score: 29.0
max_score: 40
na_heuristics: 0
p0_count: 1
p1_count: 1
p2_count: 1
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/student-courses/components/player/LessonSidebar.tsx"
target_fingerprint: "sha256:lesson-sidebar-locked-alert-critique-v1"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/student-courses/components/player/LessonSidebar.tsx
timestamp: 2026-11-11T11-46-00Z
slug: src-features-student-courses-components-player-lessonsidebar-tsx
closed: false
---

# Critique: src/features/student-courses/components/player/LessonSidebar.tsx (Ad-hoc Locked Lesson Toast)

Target: `LessonSidebar.tsx` Ad-hoc Alert State, Notification Unification, and Sidebar Ergonomics

## Design Health Score (Pre-Intervention)
Total: 29.0/40 (Needs Migration to Unified `notify.warning`, Removal of Local `setTimeout` State, and Motion-Reduction Hardening)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.0 | The local floating toast renders at `absolute top-3` directly on top of the course title and progress bar, concealing system status. |
| 2 | Match System / Real World | 3.5 | Clear Arabic explanation of why the lesson is locked, but presented as a destructive error rather than an educational warning. |
| 3 | User Control and Freedom | 2.5 | Ad-hoc toast has no dismiss button, trapping the warning until the unmanaged `setTimeout` fires. |
| 4 | Consistency and Standards | 2.0 | Severe inconsistency: Bypasses the unified platform `Toaster` system (`notify`) in favor of a local `useState` + `setTimeout` banner. |
| 5 | Error Prevention | 3.5 | Course gating logic prevents accessing locked lessons reliably. |
| 6 | Recognition Rather Than Recall | 3.0 | Locked badge is visually recognizable, but the floating banner clutters the compact 320px sidebar. |
| 7 | Flexibility and Efficiency | 3.0 | Screen-readers and keyboard users receive an assertive alert injected unpredictably at the top of the sidebar. |
| 8 | Aesthetic and Minimalist Design | 2.5 | Absolute positioned floating element inside an overflow-hidden sidebar violates layout rhythm and aesthetic simplicity. |
| 9 | Error Recovery | 3.0 | Guidance is actionable ("يرجى إكمال الدرس السابق..."), but should be delivered through the global notification viewport. |
| 10 | Help and Documentation | 3.0 | Syllabus headers and locks provide clear structural context. |

---

## Detailed Priority Deficiencies:

### 🔴 [P0] Ad-hoc Toast & Unmanaged Timer Memory Hazard:
1. **Ad-hoc Local Toast (`lockedToast`)**: Implements an isolated floating alert (`absolute top-3 inset-x-3`) that overlaps the course progress header.
2. **Unmanaged `setTimeout`**: Fires `setTimeout(() => setLockedToast(null), 3500)` without an unmount cleanup ref, risking memory leaks when navigating between lessons rapidly.

### 🟡 [P1] Architectural Bypassing of Unified `notify`:
1. **Non-Conformance with ADR 0005**: All platform feedback must route through `notify` from `@/components/ui/sonner`. Clicking a locked lesson should trigger `notify.warning()`.

### 🔵 [P2] Motion Reduction Polish:
1. **Progress Bar Animation**: The progress bar transition (`duration-300`) lacks `motion-reduce:transition-none`.
