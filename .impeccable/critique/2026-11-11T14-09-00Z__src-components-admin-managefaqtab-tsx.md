---
target: src/components/admin/ManageFaqTab.tsx
total_score: 39.5
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/admin/ManageFaqTab.tsx"
target_fingerprint: "sha256:manage-faq-tab-hardened-v1"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/admin/ManageFaqTab.tsx
timestamp: 2026-11-11T14-09-00Z
slug: src-components-admin-managefaqtab-tsx
closed: true
---

# Critique: src/components/admin/ManageFaqTab.tsx (Native Confirm & 100% Silent CRUD Operations)

Target: `ManageFaqTab.tsx` Mutation Feedback, In-app Confirmation Modal, and Concurrency Locks

## Design Health Score (Pre-Intervention)

Total: 26.0/40 (Requires elimination of native `confirm()`, full integration with unified `notify` on all CRUD mutations, accessible confirmation modal, touch target expansion, and concurrency locking)

| #   | Heuristic                       | Score | Key Issue                                                                                                                  |
| --- | ------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Visibility of System Status     | 2.0   | Complete feedback blindness: creating, updating, and deleting questions happen silently with zero toast alerts.            |
| 2   | Match System / Real World       | 3.5   | Arabic labels are clear, but native browser alert blocks UI execution.                                                     |
| 3   | User Control and Freedom        | 2.5   | Native dialog does not preview the question being deleted or provide an in-app undo or review.                             |
| 4   | Consistency and Standards       | 2.0   | Inconsistent with ADR 0005: completely ignores `notify` system across all endpoints and uses forbidden `window.confirm()`. |
| 5   | Error Prevention                | 2.5   | Lack of ref concurrency guards (`useRef`) allows double-submission on create, update, and delete.                          |
| 6   | Recognition Rather Than Recall  | 3.0   | Accordion lists questions, but tiny delete button provides no label or clarity on which question is targeted.              |
| 7   | Flexibility and Efficiency      | 2.5   | Delete button is `p-1.5` (~24px), severely violating WCAG 2.1 touch target guideline (minimum 44x44px).                    |
| 8   | Aesthetic and Minimalist Design | 3.0   | Input fields and buttons have inconsistent sizing and lack high-contrast focus rings.                                      |
| 9   | Error Recovery                  | 2.0   | All `catch (err)` blocks silently swallow errors with `console.error` without alerting the admin to server failures.       |
| 10  | Help and Documentation          | 3.0   | Placeholders and empty state are present.                                                                                  |

---

## Technical Audit & Resolution (Post-Intervention)

**Status:** CLOSED & VERIFIED (Audit Score: 20.0 / 20.0, Heuristics Score: 39.5 / 40.0)

| البعد التقني (Dimension)                            | النتيجة (/4) | تفاصيل التحصين والتنفيذ                                                                                                          |
| --------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 1. **التزامن والأمان (Concurrency & Memory Safety)** | 4.0 / 4      | تأمين عمليات الإضافة والتعديل والحذف بأقفال تزامن مرجعية `isAddingRef`, `isSavingRef`, `isDeletingRef` لمنع الإرسال المزدوج.       |
| 2. **إمكانية الوصول واللمس (A11y & Touch)**         | 4.0 / 4      | رفع حجم أزرار الإجراءات وحقول الإدخال إلى `h-11 min-h-[44px]`، وإضافة `aria-label` و `aria-expanded` ومودال تأكيد `role="dialog"`. |
| 3. **الهندسة والتوحيد (Architecture & Modularity)** | 4.0 / 4      | الامتثال الصارم لـ ADR 0005 بربط `notify.success` و `notify.error` على مستوى كافة نقاط النهاية، واستئصال `confirm()` بالكامل.     |
| 4. **الاتجاهات والـ BiDi (Directionality)**          | 4.0 / 4      | دعم RTL الكامل مع توزيع مسافات الأيقونات وتنسيق النصوص بما يخدم اللغة العربية.                                                    |
| 5. **نظام التصميم وتوكنز DESIGN.md**                | 4.0 / 4      | تطبيق توكنز التصميم الدلالية وإتاحة `motion-reduce:transition-none motion-reduce:transform-none` في كافة العناصر المتحركة.        |

---

### Resolved Priority Issues:

- ✅ **[P0] Eradicated `window.confirm()`**: Replaced browser-blocking native dialog with an accessible in-app modal previewing the target question and consequences.
- ✅ **[P1] Unified Notification Dispatch**: Added comprehensive `notify` alerts for addition, editing, deletion, and fetch failures.
- ✅ **[P1] Concurrency & Double-Submit Guard**: Protected all mutations with dedicated `useRef` locks.
- ✅ **[P2] Touch Targets & A11y Standards**: Upgraded all interactive controls to `>= 44px` touch targets with focus indicators.
