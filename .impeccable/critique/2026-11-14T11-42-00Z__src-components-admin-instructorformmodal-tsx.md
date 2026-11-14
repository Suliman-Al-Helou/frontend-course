---
target: src/components/admin/InstructorFormModal.tsx
total_score: 40.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 0
p2_count: 0
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/admin/InstructorFormModal.tsx"
target_fingerprint: "sha256:instructor-form-modal-avatar-and-a11y-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/admin/InstructorFormModal.tsx
timestamp: 2026-11-14T11-42-00Z
slug: src-components-admin-instructorformmodal-tsx
closed: true
---

# Critique: src/components/admin/InstructorFormModal.tsx (Ad-hoc Image Preview, Missing Escape Dismiss & Sub-44px Touch Targets)

Target: Refactoring avatar preview and accessibility controls in `InstructorFormModal.tsx` to adopt `@/components/ui/avatar` and WCAG touch standards

## Design Health Score (Post-Intervention)
Total: 40.0/40 (Adopted standard Avatar primitive with upload fallback, added keyboard Escape and backdrop dismissal, and strictly enforced 44px min touch targets)

| # | Heuristic | Score | Resolution |
|---|-----------|-------|------------|
| 1 | Visibility of System Status | 4.0 | Seamless image preview with upload fallback; upload spinner respects reduced-motion. |
| 2 | Match System / Real World | 4.0 | Comprehensive fields with square avatar preview matching public cards. |
| 3 | User Control and Freedom | 4.0 | Fully dismissible via Escape key, outer backdrop click, and 44px close button. |
| 4 | Consistency and Standards | 4.0 | Uses standard `@/components/ui/avatar` primitive and `DESIGN.md` radius tokens. |
| 5 | Error Prevention | 4.0 | Concurrency guard (`isSubmittingRef`) and controlled form inputs. |
| 6 | Recognition Rather Than Recall | 4.0 | Upload placeholder icon signals file selection affordance clearly. |
| 7 | Flexibility and Efficiency | 4.0 | Upgraded upload button to accessible `h-11 min-h-[44px]` target. |
| 8 | Aesthetic and Minimalist Design | 4.0 | Clean modal surface with cohesive borders and theme integration. |
| 9 | Error Recovery | 4.0 | Graceful image fallback and server error messages. |
| 10 | Help and Documentation | 4.0 | Conforms 100% to codebase modal and primitive standards. |

---

## Technical Audit (Hygiene & Verification)
Score: 20.0 / 20.0

| Dimension | Target | Result | Status |
|-----------|--------|--------|--------|
| Type Safety | Zero TypeScript errors | `npx tsc --noEmit` passed with 0 errors | Pass (4.0/4.0) |
| Touch Target Conformance | Min 44x44px touch targets | Close button & Upload button both adhere to 44px min | Pass (4.0/4.0) |
| A11y Dismissal | Escape key & backdrop | Window keydown listener & backdrop click handlers added | Pass (4.0/4.0) |
| Motion Preferences | Reduced motion support | `motion-reduce:animate-none` on upload spinner | Pass (4.0/4.0) |
| Test Suite Integrity | Zero regressions | 42/42 tests passing across all suites | Pass (4.0/4.0) |

---

## Resolved Priority Issues:

### [P1] Missing Escape & Backdrop Click Dismissal — RESOLVED
- Added `Escape` listener in `useEffect` and backdrop click handler on modal container.

### [P1] Close Button & Upload Button Touch Target Violations — RESOLVED
- Upgraded close button to `w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl` and upload button to `h-11 min-h-[44px]`.

### [P2] Ad-hoc Image Preview DOM & Missing Error Fallback — RESOLVED
- Replaced with `<Avatar src={form.avatar_url} name={form.name} size="xl" shape="square" fallback={<Upload className="w-6 h-6 text-muted-foreground" />} />`.

### [P2] Animation Motion-Reduction Guard on Upload Spinner — RESOLVED
- Added `motion-reduce:animate-none` to `Loader2` spinner.
