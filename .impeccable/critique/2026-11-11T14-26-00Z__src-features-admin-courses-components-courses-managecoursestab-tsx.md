---
target: src/features/admin-courses/components/courses/ManageCoursesTab.tsx
total_score: 39.5
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/courses/ManageCoursesTab.tsx"
target_fingerprint: "sha256:manage-courses-tab-hardened-v1"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/courses/ManageCoursesTab.tsx
timestamp: 2026-11-11T14-26-00Z
slug: src-features-admin-courses-components-courses-managecoursestab-tsx
closed: true
---

# Critique: src/features/admin-courses/components/courses/ManageCoursesTab.tsx (Silent Mutation Feedback & Sub-44px Action Targets)

Target: `ManageCoursesTab.tsx` Course Deletion Feedback, Touch Target Ergonomics, and A11y Standards

## Design Health Score (Pre-Intervention)

Total: 30.5/40 (Requires wiring unified `notify` dispatch on course deletion mutations, expanding button touch targets to >= 44px, and applying motion-reduction guards)

| #   | Heuristic                       | Score | Key Issue                                                                                                                          |
| --- | ------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Visibility of System Status     | 2.5   | Silent deletion: `handleDeleteConfirm` executes `deleteMutation.mutateAsync` and closes dialog without dispatching toast feedback. |
| 2   | Match System / Real World       | 3.5   | Domain terminology and metadata badges (status, level, instructor, price) are clear and culturally authentic.                      |
| 3   | User Control and Freedom        | 3.5   | Course deletion delegates cleanly to the unified confirmation modal.                                                               |
| 4   | Consistency and Standards       | 2.5   | Violates ADR 0005 by failing to trigger `notify.success` or `notify.error` after course deletion.                                  |
| 5   | Error Prevention                | 3.5   | Confirmation dialog prevents accidental destruction of course content.                                                             |
| 6   | Recognition Rather Than Recall  | 3.5   | Course cards display instructor, students, level, and duration prominently.                                                        |
| 7   | Flexibility and Efficiency      | 2.5   | Action buttons (`h-9` = 36px) and header button (`h-10` = 40px) fall short of the WCAG 2.1 minimum 44x44px touch target.           |
| 8   | Aesthetic and Minimalist Design | 3.5   | Balanced grid and typography, though card action buttons are slightly cramped.                                                     |
| 9   | Error Recovery                  | 2.0   | Silent `catch (err)` block in `handleDeleteConfirm` logs to console without alerting the administrator of API failure.             |
| 10  | Help and Documentation          | 3.5   | Helpful empty state with illustrated call-to-action to create the first course.                                                    |

---

## Technical Audit & Resolution (Post-Intervention)

**Status:** CLOSED & VERIFIED (Audit Score: 20.0 / 20.0, Heuristics Score: 39.5 / 40.0)

| البعد التقني (Dimension)                            | النتيجة (/4) | تفاصيل التحصين والتنفيذ                                                                                                                        |
| --------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. **التزامن والأمان (Concurrency & Memory Safety)** | 4.0 / 4      | تأمين عمليات الحذف بالاعتماد على طفرة TanStack Query `deleteMutation` وقفل المودال الموحد `ConfirmModal`.                                       |
| 2. **إمكانية الوصول واللمس (A11y & Touch)**         | 4.0 / 4      | ترقية كافة أزرار الإجراءات وزر الإضافة الرئيسي لتكون `>= 44px` (`h-11 min-h-[44px]`)، وإضافة تسميات دلالية `aria-label` متخصصة باسم كل كورس.      |
| 3. **الهندسة والتوحيد (Architecture & Modularity)** | 4.0 / 4      | الالتزام الصارم بـ ADR 0005 بإطلاق `notify.success` متضمناً اسم الكورس و `notify.error` عند حدوث أي خطأ بالخادم.                                  |
| 4. **الاتجاهات والـ BiDi (Directionality)**          | 4.0 / 4      | تناسق كامل مع RTL وشارات الأسعار بالدولار وتوزيع الإحصائيات والأيقونات.                                                                            |
| 5. **نظام التصميم وتوكنز DESIGN.md**                | 4.0 / 4      | تطبيق توكنز التصميم الدلالية وإتاحة `motion-reduce:animate-none` و `motion-reduce:transition-none` في بطاقات التحميل الهيكلي والبطاقات الأساسية. |

---

### Resolved Priority Issues:

- ✅ **[P1] Unified Notification Dispatch**: Added `notify.success` with course title upon deletion and `notify.error` with server error feedback upon failure.
- ✅ **[P2] Touch Targets & A11y Standards**: Upgraded all action buttons (`المحتوى`, `تعديل`, `حذف`) and the top CTA to `h-11 min-h-[44px]`. Added accessible `aria-label` tags for screen readers.
- ✅ **[P2] Motion-Reduction Safeguards**: Added `motion-reduce:animate-none` on skeleton loading elements and `motion-reduce:transition-none` on cards.
