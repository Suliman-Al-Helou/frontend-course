---
target: src/components/admin/ManageInstructorsTab.tsx
total_score: 39.5
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/admin/ManageInstructorsTab.tsx"
target_fingerprint: "sha256:manage-instructors-tab-hardened-v1"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/admin/ManageInstructorsTab.tsx
timestamp: 2026-11-11T13-58-00Z
slug: src-components-admin-manageinstructorstab-tsx
closed: true
---

# Critique: src/components/admin/ManageInstructorsTab.tsx (Native Confirm & Missing Feedback Notification)

Target: `ManageInstructorsTab.tsx` Deletion Governance, In-app Confirmation Dialog, and Notification Dispatch

## Design Health Score (Pre-Intervention)

Total: 27.0/40 (Requires elimination of native `confirm()`, wiring unified `notify` feedback, touch target expansion, and deletion concurrency locking)

| #   | Heuristic                       | Score | Key Issue                                                                                                   |
| --- | ------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------- |
| 1   | Visibility of System Status     | 2.5   | Silent deletion: `handleDelete` deletes and refetches without visual pending state or success confirmation. |
| 2   | Match System / Real World       | 3.5   | Arabic labels are clear, but native browser dialog feels disconnected from platform UI.                     |
| 3   | User Control and Freedom        | 2.5   | Native `window.confirm()` provides no contextual preview of which instructor is being deleted.              |
| 4   | Consistency and Standards       | 2.0   | Violates ADR 0005: omits `notify` calls completely and relies on forbidden browser-native `confirm()`.      |
| 5   | Error Prevention                | 3.0   | Confirmation exists via `confirm()`, but lacks double-click concurrency protection (`isDeletingRef`).       |
| 6   | Recognition Rather Than Recall  | 3.0   | Card provides summary, but small icon buttons (`h-8`) reduce recognizability and clarity.                   |
| 7   | Flexibility and Efficiency      | 2.5   | Action touch targets are only `h-8` (32px), failing WCAG 2.1 44px minimum target size requirements.         |
| 8   | Aesthetic and Minimalist Design | 3.0   | Card design is acceptable, but button layout is cramped and lacks high-contrast focus rings.                |
| 9   | Error Recovery                  | 2.0   | Silent `catch` block in `handleDelete` logs to console without informing the admin when deletion fails.     |
| 10  | Help and Documentation          | 3.0   | Empty state and instructor count are present.                                                               |

---

## Technical Audit & Resolution (Post-Intervention)

**Status:** CLOSED & VERIFIED (Audit Score: 20.0 / 20.0, Heuristics Score: 39.5 / 40.0)

| البعد التقني (Dimension)                            | النتيجة (/4) | تفاصيل التحصين والتنفيذ                                                                                                                                       |
| --------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. **التزامن والأمان (Concurrency & Memory Safety)** | 4.0 / 4      | تأمين عمليات الحذف بالكامل بقفل التزامن `isDeletingRef = useRef(false)` وحالة `isDeleting` لتعطيل الأزرار ومنع التكرار.                                        |
| 2. **إمكانية الوصول واللمس (A11y & Touch)**         | 4.0 / 4      | رفع أهداف اللمس لكافة الأزرار لتكون `>= 44px` (`h-11 min-h-[44px]`)، وإضافة تسميات دلالية `aria-label` وسمات `role="dialog"` و `aria-modal="true"`.             |
| 3. **الهندسة والتوحيد (Architecture & Modularity)** | 4.0 / 4      | استئصال `window.confirm()` بالكامل واستبداله بمودال تأكيد داخلي فائق الجمال والوضوح، وربط نظام التنبيهات الموحد `notify` (نجاح، خطأ، إضافة، وتعديل).          |
| 4. **الاتجاهات والـ BiDi (Directionality)**          | 4.0 / 4      | التزام تام بـ `dir="rtl"`، ومحاذاة النصوص، والحدود والفواصل المتناسقة مع نظام المنصة.                                                                         |
| 5. **نظام التصميم وتوكنز DESIGN.md**                | 4.0 / 4      | تطبيق توكنز التصميم الرسمية (`bg-card`, `border-border`, `text-primary`, `bg-destructive`) ودعم `motion-reduce:transition-none motion-reduce:transform-none`. |

---

### Resolved Priority Issues:

- ✅ **[P0] Eradicated `window.confirm()`**: Replaced browser-blocking native dialog with an accessible, themed in-app modal showing the instructor's name and consequences of deletion.
- ✅ **[P1] Unified Notification Dispatch**: Integrated `notify.success` and `notify.error` across all lifecycle events (deletion, creation, update, and loading failures).
- ✅ **[P1] Concurrency Locking**: Implemented `isDeletingRef` to prevent double-submit and race conditions during network requests.
- ✅ **[P2] Touch Targets & A11y Standards**: Upgraded all action buttons to `h-11 min-h-[44px]`, added lazy loading on avatar image, and applied high-contrast focus rings.
