---
target: src/features/admin-courses/components/courses/CourseFormModal.tsx
total_score: 39.5
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/courses/CourseFormModal.tsx"
target_fingerprint: "sha256:course-form-modal-hardened-v1"
target_path: /home/suliman/Documents/courses/frontend-course/src/features/admin-courses/components/courses/CourseFormModal.tsx
timestamp: 2026-11-11T15-14-00Z
slug: src-features-admin-courses-components-courses-courseformmodal-tsx
closed: true
---

# Critique: src/features/admin-courses/components/courses/CourseFormModal.tsx (Silent Mutation Feedback & Escape Key Handling)

Target: `CourseFormModal.tsx` Creation/Update Feedback, Keyboard Dismissal, and Motion Safeguards

## Design Health Score (Pre-Intervention)

Total: 30.5/40 (Requires wiring unified `notify` dispatch on course create/update, adding Escape key dismissal, and enforcing motion-reduction guards)

| #   | Heuristic                       | Score | Key Issue                                                                                                    |
| --- | ------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------ |
| 1   | Visibility of System Status     | 2.5   | Silent mutation: `handleSubmit` executes mutations and calls `onClose()` without dispatching toast feedback. |
| 2   | Match System / Real World       | 3.5   | Domain copy, tab layout, and curriculum metadata are clear and natural.                                      |
| 3   | User Control and Freedom        | 3.0   | Close button is present, but modal lacks `Escape` key listener and backdrop click-to-dismiss.                |
| 4   | Consistency and Standards       | 2.5   | Violates ADR 0005: ignores unified `notify` upon course creation and update.                                 |
| 5   | Error Prevention                | 3.5   | Local pre-validation (title, instructor) and server 422 field error mappings are implemented.                |
| 6   | Recognition Rather Than Recall  | 3.5   | Tabs (Basic, Pricing, Content) segment complex form fields effectively.                                      |
| 7   | Flexibility and Efficiency      | 3.0   | Multi-line tag pasting is supported, but missing Escape key hinders power-user keyboard ergonomics.          |
| 8   | Aesthetic and Minimalist Design | 3.5   | Professional modal layout adhering to `DESIGN.md`.                                                           |
| 9   | Error Recovery                  | 2.5   | General server errors are rendered only inline without alert toast for immediate perception.                 |
| 10  | Help and Documentation          | 3.5   | Descriptive field placeholders and helper text provide adequate guidance.                                    |

---

## Technical Audit & Resolution (Post-Intervention)

**Status:** CLOSED & VERIFIED (Audit Score: 20.0 / 20.0, Heuristics Score: 39.5 / 40.0)

| البعد التقني (Dimension)                            | النتيجة (/4) | تفاصيل التحصين والتنفيذ                                                                                                                       |
| --------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. **التزامن والأمان (Concurrency & Memory Safety)** | 4.0 / 4      | تأمين عمليات الإرسال بقفل `isSubmittingRef` وقفل `isSaving` لحماية دورة حياة المودال ومنع الازدواجية.                                           |
| 2. **إمكانية الوصول واللمس (A11y & Touch)**         | 4.0 / 4      | تفعيل إغلاق المودال بمفتاح `Escape` وبالنقر على الخلفية الضبابية، وضمان أهداف لمس `>= 44px` لكافة أزرار التبويبات وأزرار الحفظ والإغلاق.         |
| 3. **الهندسة والتوحيد (Architecture & Modularity)** | 4.0 / 4      | الامتثال الصارم لـ ADR 0005 بإطلاق `notify.success` متضمناً اسم الكورس عند الإنشاء أو التعديل، و `notify.error` عند أخطاء الحقول أو أخطاء الخادم. |
| 4. **الاتجاهات والـ BiDi (Directionality)**          | 4.0 / 4      | دعم RTL الكامل في توزيع الحقول، التبويبات، حقول الأسعار، وقوائم المخرجات.                                                                      |
| 5. **نظام التصميم وتوكنز DESIGN.md**                | 4.0 / 4      | التزام بتوكنز المنصة وتفعيل `motion-reduce:animate-none` على كافة لوحات التبويبات المتحركة.                                                   |

---

### Resolved Priority Issues:

- ✅ **[P1] Unified Notification Dispatch**: Added `notify.success` for both course creation and updates (with course title), and `notify.error` for validation and server failures.
- ✅ **[P2] Keyboard Dismissal (Escape Key) & Backdrop Interaction**: Added native Escape key listener and backdrop click handler to enhance modal accessibility.
- ✅ **[P2] Motion-Reduction Safeguards**: Applied `motion-reduce:animate-none` across all tab containers.
