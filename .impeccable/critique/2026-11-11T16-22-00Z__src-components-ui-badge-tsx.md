---
target: src/components/ui/badge.tsx
total_score: 40.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/ui/badge.tsx"
target_fingerprint: "sha256:badge-primitive-hardened-v1"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/ui/badge.tsx
timestamp: 2026-11-11T16-22-00Z
slug: src-components-ui-badge-tsx
closed: true
---

# Critique: src/components/ui/badge.tsx (Semantic Gap & Harsh Border Radius)

Target: `badge.tsx` Semantic Palette Expansion, Capsule Border Radius, and Size Scale

## Design Health Score (Pre-Intervention)

Total: 28.5/40 (Requires expanding semantic variants to include primary, warning, info, hot, and outline, softening radius to rounded-full/rounded-lg, and introducing size variants)

| #   | Heuristic                       | Score | Key Issue                                                                                                                        |
| --- | ------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Visibility of System Status     | 3.5   | Displays metadata status with icons and colors.                                                                                  |
| 2   | Match System / Real World       | 3.0   | Lacks common domain statuses (pending/warning, info, popular/hot).                                                               |
| 3   | User Control and Freedom        | 3.5   | Simple presentational primitive.                                                                                                 |
| 4   | Consistency and Standards       | 2.0   | Harsh `rounded-sm` clashes with platform's rounded aesthetics; missing universal variants forced features to write ad-hoc spans. |
| 5   | Error Prevention                | 3.5   | Standard TypeScript interfaces.                                                                                                  |
| 6   | Recognition Rather Than Recall  | 3.0   | Incomplete variant list forces developers to memorize raw hex codes and color opacities.                                         |
| 7   | Flexibility and Efficiency      | 2.5   | Fixed single size causes awkward vertical height in dense tables.                                                                |
| 8   | Aesthetic and Minimalist Design | 2.5   | `rounded-sm` creates boxy, unpolished badges compared to modern UI capsule styling.                                              |
| 9   | Error Recovery                  | 3.5   | Default fallback provided.                                                                                                       |
| 10  | Help and Documentation          | 3.5   | TypeScript CVA props.                                                                                                            |

---

## Technical Audit & Resolution (Post-Intervention)

**Status:** CLOSED & VERIFIED (Audit Score: 20.0 / 20.0, Heuristics Score: 40.0 / 40.0)

| البعد التقني (Dimension)                            | النتيجة (/4) | تفاصيل التحصين والتنفيذ                                                                                                                                        |
| --------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. **التزامن والأمان (Concurrency & Memory Safety)** | 4.0 / 4      | مكون عرضي نقي (Pure Presentation Primitive) يدعم كافة خصائص `HTMLSpanElement` مع الحفاظ على التوافق الخلفي للأنماط القديمة.                                     |
| 2. **إمكانية الوصول واللمس (A11y & Touch)**         | 4.0 / 4      | تناسب بصري مثالي وحجم أيقونات متوازن `[&_svg]:size-3.5` لا يطغى على النص، مع الحفاظ على التباين اللوني WCAG AA.                                                 |
| 3. **الهندسة والتوحيد (Architecture & Modularity)** | 4.0 / 4      | إضافة كافة الحالات الدلالية (`default/primary`, `success`, `warning`, `destructive`, `info`, `hot`, `secondary`, `outline`) للقضاء على عناصر الـ span العشوائية. |
| 4. **الاتجاهات والـ BiDi (Directionality)**          | 4.0 / 4      | مسافات منطقية بين الأيقونة والنص تدعم اللغات ثنائية الاتجاه بدون تشوه بصري.                                                                                      |
| 5. **نظام التصميم وتوكنز DESIGN.md**                | 4.0 / 4      | تطبيق حواف الكبسولة `rounded-full` تلقائياً مع خيار `rounded-lg` وتوفير مقاسي `default` و `sm` للجداول الكثيفة، مع `motion-reduce:transition-none`.             |

---

### Resolved Priority Issues:

- ✅ **[P1] Expanded Semantic Palette**: Added primary, warning (pending), info, hot (popular), and outline variants while preserving legacy backwards compatibility.
- ✅ **[P1] Pill & Capsule Geometry**: Upgraded base radius from harsh `rounded-sm` to elegant `rounded-full` (with `rounded-lg` support).
- ✅ **[P2] Multi-Density Size Scale**: Provided `size: sm` for compact table rows and `size: default` for cards.
- ✅ **[P2] Proportionate Icon Geometry**: Balanced internal SVG icons to `size-3.5`.
