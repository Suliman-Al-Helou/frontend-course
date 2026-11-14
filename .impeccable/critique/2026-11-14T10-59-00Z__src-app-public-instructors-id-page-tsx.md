---
target: src/app/(public)/instructors/[id]/page.tsx
total_score: 30.0
max_score: 40
na_heuristics: 0
p0_count: 0
p1_count: 2
p2_count: 1
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/app/(public)/instructors/[id]/page.tsx"
target_fingerprint: "sha256:instructor-detail-page-avatar-critique"
target_path: /home/suliman/Documents/courses/frontend-course/src/app/(public)/instructors/[id]/page.tsx
timestamp: 2026-11-14T10-59-00Z
slug: src-app-public-instructors-id-page-tsx
closed: false
---

# Critique: src/app/(public)/instructors/[id]/page.tsx (Third-Party Network Dependency & Missing Offline Avatar Primitive)

Target: Refactoring instructor avatar presentation in `src/app/(public)/instructors/[id]/page.tsx` to adopt `@/components/ui/avatar`

## Design Health Score (Pre-Intervention)
Total: 30.0/40

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3.5 | Clean hero animation and loading spinner for instructor profile. |
| 2 | Match System / Real World | 3.5 | Displays rich bio, stats, and course list. |
| 3 | User Control and Freedom | 4.0 | Seamless back navigation to instructors index. |
| 4 | Consistency and Standards | 2.5 | Uses ad-hoc `motion.img` and external `ui-avatars.com` API instead of unified `@/components/ui/avatar`. |
| 5 | Error Prevention | 2.0 | Fragile external network dependency on `https://ui-avatars.com/api/?name=...` fails if offline or firewalled. |
| 6 | Recognition Rather Than Recall | 3.5 | Clear typography hierarchy and badge accents. |
| 7 | Flexibility and Efficiency | 3.5 | Responsive desktop and mobile hero layout. |
| 8 | Aesthetic and Minimalist Design | 3.5 | Beautiful glassmorphic profile strip, marred by external avatar latency/failure. |
| 9 | Error Recovery | 2.0 | No graceful fallback if `ui-avatars.com` is unreachable or image returns 404. |
| 10 | Help and Documentation | 3.0 | Public landing experience. |

---

## Identified Priority Issues:

### [P1] Dangerous Third-Party Network Reliance (`ui-avatars.com`)
- **Problem**: Lines 139-141 call `https://ui-avatars.com/api/?name=${instructor.name}&background=0d2258&color=fff`. In offline testing or slow connections, this network request stalls or breaks.
- **Remedy**: Replace with local client-side initials rendering using `<Avatar>` primitive.

### [P1] Missing Centralized Avatar Primitive
- **Problem**: Hand-rolled `motion.img` bypasses design system tokens and lacks `onError` recovery.
- **Remedy**: Wrap `<Avatar src={instructor.avatar_url} name={instructor.name} size="3xl" shape="card" />` in a motion container.

### [P2] Inconsistent Fallback Styling
- **Problem**: `ui-avatars.com` injects hardcoded hex colors (`#0d2258`) that do not match the system's `DESIGN.md` primary indigo tokens.
- **Remedy**: Render standard `bg-primary/10 text-primary` tokens natively.
