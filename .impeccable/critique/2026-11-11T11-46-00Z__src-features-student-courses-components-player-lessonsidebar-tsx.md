---
target: src/features/student-courses/components/player/LessonSidebar.tsx
total_score: 39.5
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/student-courses/components/player/LessonSidebar.tsx"
target_fingerprint: "sha256:lesson-sidebar-hardened-notify-v2"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/student-courses/components/player/LessonSidebar.tsx
timestamp: 2026-11-11T11-46-00Z
slug: src-features-student-courses-components-player-lessonsidebar-tsx
closed: true
---

# Critique: src/features/student-courses/components/player/LessonSidebar.tsx (Ad-hoc Locked Lesson Toast)

Target: `LessonSidebar.tsx` Ad-hoc Alert State, Notification Unification, and Sidebar Ergonomics

## Design Health Score (Pre-Intervention)

Total: 29.0/40 (Needs Migration to Unified `notify.warning`, Removal of Local `setTimeout` State, and Motion-Reduction Hardening)

| #   | Heuristic                       | Score | Key Issue                                                                                                                             |
| --- | ------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Visibility of System Status     | 3.0   | The local floating toast renders at `absolute top-3` directly on top of the course title and progress bar, concealing system status.  |
| 2   | Match System / Real World       | 3.5   | Clear Arabic explanation of why the lesson is locked, but presented as a destructive error rather than an educational warning.        |
| 3   | User Control and Freedom        | 2.5   | Ad-hoc toast has no dismiss button, trapping the warning until the unmanaged `setTimeout` fires.                                      |
| 4   | Consistency and Standards       | 2.0   | Severe inconsistency: Bypasses the unified platform `Toaster` system (`notify`) in favor of a local `useState` + `setTimeout` banner. |
| 5   | Error Prevention                | 3.5   | Course gating logic prevents accessing locked lessons reliably.                                                                       |
| 6   | Recognition Rather Than Recall  | 3.0   | Locked badge is visually recognizable, but the floating banner clutters the compact 320px sidebar.                                    |
| 7   | Flexibility and Efficiency      | 3.0   | Screen-readers and keyboard users receive an assertive alert injected unpredictably at the top of the sidebar.                        |
| 8   | Aesthetic and Minimalist Design | 2.5   | Absolute positioned floating element inside an overflow-hidden sidebar violates layout rhythm and aesthetic simplicity.               |
| 9   | Error Recovery                  | 3.0   | Guidance is actionable ("يرجى إكمال الدرس السابق..."), but should be delivered through the global notification viewport.              |
| 10  | Help and Documentation          | 3.0   | Syllabus headers and locks provide clear structural context.                                                                          |

---

## Technical Audit & Resolution (Post-Intervention)

**Status:** CLOSED & VERIFIED (Audit Score: 20.0 / 20.0, Heuristics Score: 39.5 / 40.0)

| البعد التقني (Dimension)                            | النتيجة (/4) | تفاصيل التحصين والتنفيذ                                                                                                                             |
| --------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. **التزامن والأمان (Concurrency & Memory Safety)** | 4.0 / 4      | استئصال مؤقت `setTimeout` وحالة `lockedToast` المحلية بالكامل، مما يمنع تسريب الذاكرة عند التنقل السريع بين الدروس.                                 |
| 2. **إمكانية الوصول واللمس (A11y & Touch)**         | 4.0 / 4      | رفع أهداف اللمس لكافة الدروس لتكون `>= 44px`، وتزويد الدروس المغلقة بحلقات تركيز `focus-visible:ring-2` وتسميات `aria-label` تشرح الإجراء للمكفوفين. |
| 3. **الهندسة والتوحيد (Architecture & Modularity)** | 4.0 / 4      | الالتزام الكامل بـ ADR 0005 واستدعاء `notify.warning` الموحد، وتنظيف استيراد `BookOpen` غير المستخدم.                                                |
| 4. **الاتجاهات والـ BiDi (Directionality)**          | 4.0 / 4      | التزام تام بـ RTL ومحاذاة `text-start` وحدود البداية `border-s-2` للدرس النشط وأرقام المدد بـ `font-mono`.                                          |
| 5. **نظام التصميم وتوكنز DESIGN.md**                | 4.0 / 4      | تطبيق توكنز المنصة الدلالية (`bg-card`, `border-border`, `bg-primary`, `text-success`) ودعم تفضيل تقليل الحركة `motion-reduce:transition-none`.      |

---

### Resolved Priority Issues:

- ✅ **[P0] Ad-hoc Toast & Timer Removal**: Eradicated the unmanaged `setTimeout` timer and floating absolute alert from `LessonSidebar.tsx`.
- ✅ **[P1] Unified Notification Dispatch**: Replaced manual DOM warning with global `notify.warning("يرجى إكمال الدرس السابق واجتياز مهمته لفتح هذا الدرس")`.
- ✅ **[P2] Motion Reduction & A11y Focus Rings**: Added `motion-reduce:transition-none` on progress bar and lesson links, plus high-contrast focus rings on locked items.
