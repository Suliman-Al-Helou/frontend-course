---
target: src/components/admin/InstructorFormModal.tsx
total_score: 30.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/admin/InstructorFormModal.tsx"
target_fingerprint: "sha256:instructor-form-modal-avatar-and-a11y-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/admin/InstructorFormModal.tsx
timestamp: 2026-11-14T11-42-00Z
slug: src-components-admin-instructorformmodal-tsx
closed: false
---

# Critique: src/components/admin/InstructorFormModal.tsx (Ad-hoc Image Preview, Missing Escape Dismiss & Sub-44px Touch Targets)

Target: Refactoring avatar preview and accessibility controls in `InstructorFormModal.tsx` to adopt `@/components/ui/avatar` and WCAG touch standards

## Design Health Score (Pre-Intervention)
Total: 30.0/40

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Image upload shows spinner; server errors displayed inline. |
| 2 | Match System / Real World | 3.5 | Comprehensive fields matching instructor profile domain. |
| 3 | User Control and Freedom | 2.5 | Lacks Escape key dismiss and backdrop click dismiss; users trapped if close button is missed. |
| 4 | Consistency and Standards | 3.0 | Uses manual raw `<img>` preview and ad-hoc buttons instead of standard primitives. |
| 5 | Error Prevention | 4.0 | Submitting concurrency lock (`isSubmittingRef`) guards against duplicate submissions. |
| 6 | Recognition Rather Than Recall | 3.5 | Clear labels and field placeholders. |
| 7 | Flexibility and Efficiency | 3.0 | Image upload button touch target is tight (`h-9` 36px). |
| 8 | Aesthetic and Minimalist Design | 3.5 | Clean dark-mode layout with nice card surface. |
| 9 | Error Recovery | 3.5 | Server errors displayed clearly with retry capability. |
| 10 | Help and Documentation | 3.5 | Field labels clearly explain inputs. |

---

## Identified Priority Issues:

### [P1] Missing Escape & Backdrop Click Dismissal
- **Problem**: Modal cannot be dismissed via the `Escape` key or by clicking the outer backdrop.
- **Remedy**: Add `Escape` key event listener in `useEffect` and handle backdrop click on container.

### [P1] Close Button & Upload Button Touch Target Violations
- **Problem**: Header close button is `p-2` (~32px) and image upload button is `h-9` (36px), violating the 44px WCAG touch target guideline.
- **Remedy**: Upgrade close button to `w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl` and upload button to `h-11 min-h-[44px]`.

### [P2] Ad-hoc Image Preview DOM & Missing Error Fallback
- **Problem**: Lines 147-153 hand-roll a raw `<img>` without `onError` fallback handling.
- **Remedy**: Replace with `<Avatar src={form.avatar_url} name={form.name} size="xl" shape="square" fallback={<Upload className="w-6 h-6 text-muted-foreground" />} />`.

### [P2] Animation Motion-Reduction Guard on Upload Spinner
- **Problem**: `Loader2 animate-spin` lacks `motion-reduce:animate-none`.
- **Remedy**: Add `motion-reduce:animate-none`.
