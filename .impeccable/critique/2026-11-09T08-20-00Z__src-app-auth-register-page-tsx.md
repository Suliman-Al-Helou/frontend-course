---
target: src/app/(auth)/register/page.tsx
total_score: 28
max_score: 40
na_heuristics: []
p0_count: 0
p1_count: 2
p2_count: 2
target_identity: "file:/home/suliman/Documents/courses/frontend-course/src/app/(auth)/register/page.tsx"
target_path: /home/suliman/Documents/courses/frontend-course/src/app/(auth)/register/page.tsx
timestamp: 2026-11-09T08-20-00Z
slug: src-app-auth-register-page-tsx
closed: false
---

# Critique: src/app/(auth)/register/page.tsx & GoogleAuthButton Integration

## Design Health Score (Nielsen Heuristics)
Total: 28/40

| # | Heuristic | Score | Diagnostic Findings |
|---|-----------|-------|---------------------|
| 1 | Visibility of System Status | 3/4 | Loading state in RegisterForm exists, but Google SSO lacks dedicated contextual progress indicator during OAuth token exchange. |
| 2 | Match System & Real World | 3/4 | Terminology is clear in Arabic; Google branding requires authentic colors and RTL typography alignment (`IBM Plex Sans Arabic`). |
| 3 | User Control & Freedom | 3/4 | Back navigation to Home (`/`) and Login (`/login`) exists. Dismissing SSO returns cleanly to manual form. |
| 4 | Consistency & Standards | 2.5/4 | Current Google button iframe clashes with dark theme (`card: #10141e`, `border: #222939`) and font scale of `DESIGN.md`. |
| 5 | Error Prevention | 3/4 | Form validation exists via Zod; SSO needs concurrency lock (`useRef`) to prevent double-submit on rapid clicks. |
| 6 | Recognition Rather Than Recall | 3/4 | Form inputs have clear labels and placeholders; SSO option provides instant 1-click alternative without password fatigue. |
| 7 | Flexibility & Efficiency | 2/4 | Register page currently lacks Google SSO option entirely, forcing full manual entry (name, email, password, confirm). |
| 8 | Aesthetic & Minimalist Design | 3/4 | Clean card layout, but requires visual separator ("أو المتابعة باستخدام") respecting 10% Indigo Rule and subtle stroke vocabulary. |
| 9 | Error Recovery | 3/4 | Sonner toast and field errors present; API failure in SSO must display localized Arabic error toast gracefully. |
| 10| Help & Documentation | 2.5/4 | Password constraints are illustrated; helper text for SSO accounts should clarify automatic account provisioning. |

## Priority Issues
- **[P1] Missing SSO on Registration Flow:** Users on `/register` have no 1-click registration via Google, creating signup drop-off.
- **[P1] Design System Discrepancy (Iframe vs DESIGN.md):** Default Google `renderButton` iframe does not adhere to `card` elevation, custom borders, and `IBM Plex Sans Arabic` typography.
- **[P2] Visual Divider & Rhythm:** Need consistent separator (`border-t border-border` with muted label) matching `DESIGN.md` spacing scale (`mb-6`).
- **[P2] Accessibility & Touch Target:** Ensure custom button satisfies `min-h-[44px]` (44x44px touch target) and full keyboard focus ring (`focus-visible:ring-2 focus-visible:ring-primary`).
