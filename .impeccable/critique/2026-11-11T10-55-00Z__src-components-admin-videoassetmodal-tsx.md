---
target: src/components/admin/VideoAssetModal.tsx
total_score: 23.5
max_score: 40
na_heuristics: 0
p0_count: 2
p1_count: 3
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/components/admin/VideoAssetModal.tsx"
target_fingerprint: "sha256:video-asset-modal-youtube-v1"
target_path: /home/suliman/Documents/courses/frontend-course/src/components/admin/VideoAssetModal.tsx
timestamp: 2026-11-11T10-55-00Z
slug: src-components-admin-videoassetmodal-tsx
closed: false
---

# Critique: src/components/admin/VideoAssetModal.tsx (YouTube Integration & Video Upload)

Target: `VideoAssetModal.tsx` & YouTube Video Upload / Connection UX

## Design Health Score (Pre-Intervention)
Total: 23.5/40 (Needs Token Alignment with DESIGN.md, A11y Touch Target Hardening, and Abortable Upload Experience)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2.5 | Chunked upload shows only a percentage without byte counters (MB uploaded / total MB) or processing stage indication. |
| 2 | Match System / Real World | 3.0 | Lacks clear messaging on YouTube API quotas, "Unlisted" privacy status, and cloud video transcoding latency. |
| 3 | User Control and Freedom | 2.0 | Disconnected YouTube state is a dead-end warning with no inline connect CTA; no abort/cancel button during multi-chunk upload. |
| 4 | Consistency and Standards | 2.0 | Heavy use of hardcoded emerald utility classes (`bg-emerald-600`, `bg-emerald-500/10`) violating DESIGN.md 10% Indigo Rule and tokens. |
| 5 | Error Prevention | 2.5 | No client-side file size cap validation or corrupt/empty file guards before starting expensive multi-chunk network transfers. |
| 6 | Recognition Rather Than Recall | 2.5 | Dropzone is a `div` element without keyboard focusability (`tabIndex={0}`, `role="button"`); fallback image missing on broken video preview. |
| 7 | Flexibility and Efficiency | 2.5 | Mode switching resets form state unnecessarily; cannot pause or resume interrupted chunked uploads. |
| 8 | Aesthetic and Minimalist Design | 2.5 | High chromatic clash between emerald upload states and brand indigo accents; violates monochromatic tonal layering. |
| 9 | Error Recovery | 2.5 | Upload errors are opaque and do not clarify if the failure was due to network disruption, YouTube OAuth expiry, or server storage. |
| 10 | Help and Documentation | 2.0 | Missing inline guidance explaining that uploaded videos are stored securely on YouTube and need transcoding time. |

---

## Detailed Priority Deficiencies:

### 🔴 [P0] Critical Architecture & Control Gaps:
1. **Disconnected Channel Dead-End**: When `!ytStatus?.connected`, the modal displays an alert asking the user to close the modal and navigate to the Zoom tab to connect YouTube, rather than offering a direct inline connection action or direct link.
2. **Missing Abort Controller for Chunked Upload**: Once multi-chunk upload begins, the user cannot cancel or stop the transfer. If a wrong large file (e.g. 1GB) is selected, the browser continues transmitting all chunks.

### 🟡 [P1] Design System & Token Non-Conformance:
1. **DESIGN.md Token Violations**: Rampant usage of hardcoded colors (`bg-emerald-600`, `text-emerald-600`, `bg-emerald-500/10`, `border-emerald-500/25`) breaking the project's **10% Indigo Rule** and semantic dark theme tokens (`primary`, `card`, `border`, `muted`).
2. **Sub-44px Touch Targets**: Close button (`w-8 h-8` = 32px) and inputs (`h-10` = 40px) violate the mandatory **44x44px minimum touch target rule** defined in `DESIGN.md`.
3. **BiDi & Directionality Inconsistencies**: The video ID input and file metrics lack strict `dir="ltr"` container boundaries with appropriate start/end logical padding.

### 🔵 [P2] A11y & Usability Polish:
1. **Keyboard-Inaccessible Dropzone**: The drag-and-drop container uses `onClick` on a raw `<div>` without `role="button"`, `tabIndex={0}`, or `onKeyDown` handlers for Enter/Space activation.
2. **Granular Progress Telemetry**: Progress indicator needs uploaded MB / total MB metrics alongside percentage to reassure users on large video transfers.
