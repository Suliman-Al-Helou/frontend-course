---
target: src/components/admin/ManageZoomTab.tsx
total_score: 21.0
max_score: 40
na_heuristics: 0
p0_count: 2
p1_count: 3
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/admin/ManageZoomTab.tsx"
target_fingerprint: "sha256:manage-zoom-tab-audit-v1"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/admin/ManageZoomTab.tsx
timestamp: 2026-11-09T14-05-00Z
slug: src-components-admin-managezoomtab-tsx
closed: false
---
# Critique: src/components/admin/ManageZoomTab.tsx

Target: `ManageZoomTab.tsx` & Zoom/Video Asset Admin Management Experience

## Design Health Score (Pre-Intervention)
Total: 21.0/40 (Needs Layout Restructuring, TanStack Query Integration, & Modals)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2.5 | Pinned permanent form takes >400px of vertical viewport; lack of mutation status badges |
| 2 | Match System / Real World | 2.5 | Flat list merges live scheduled meetings without distinguishing between live calls and recorded videos |
| 3 | User Control and Freedom | 2.0 | Form is constantly expanded inline without collapsible/modal triggers; editing locks the top section |
| 4 | Consistency and Standards | 1.5 | Bypasses TanStack Query v5 architecture rules; raw `useState` + `useEffect` fetch calls (`fetchMeetings`) |
| 5 | Error Prevention | 2.0 | Browser native `confirm()` used for deletion; no double-submit `useRef` guard on save |
| 6 | Recognition Rather Than Recall | 2.0 | No preview or quick verification of video IDs; no visual separation between live links and uploaded videos |
| 7 | Flexibility and Efficiency | 2.0 | Admin must manually copy/paste YouTube links and cannot upload/record directly from the meetings tab |
| 8 | Aesthetic and Minimalist Design | 2.0 | Dense inline form clutters the UI before the user even sees their meeting items |
| 9 | Error Recovery | 2.5 | Form error is generic and lacks field-specific validation focus |
| 10 | Help and Documentation | 2.0 | No explanatory helper text for Zoom start time zones or video provider options |

---

## Identified Priority Issues:
- **[P0] Inverted Hierarchy & Cluttered DOM**: The creation form is hard-rendered permanently on top of the list, forcing excessive scrolling and hiding the meeting catalog.
- **[P0] Architecture Protocol Violation**: Violates project `AGENTS.md` by using raw `useState` + `useEffect` fetching instead of TanStack Query v5 `queryOptions` and mutation hooks.
- **[P1] Missing Domain Distinction**: Live meetings (`zoom_link`) and uploaded video assets (`video_assets`) are not differentiated in the UI; videos lack a dedicated ingestion interface.
- **[P1] Concurrency & Safety Gaps**: Absence of double-submit concurrency lock (`isSubmittingRef`) on save/delete actions, and reliance on blocking native `window.confirm`.
- **[P2] BiDi & A11y Deficiencies**: Zoom URL and YouTube ID inputs require strict `dir="ltr"` and `font-mono` isolation; touch targets need `>= 44px` padding.
