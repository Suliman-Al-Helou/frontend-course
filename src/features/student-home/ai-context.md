# student-home — Architectural Context (immutable anchor)

## Purpose

Student dashboard home: stats cards, exam results, Zoom attendance calendar.

## Layers

- types/ Contracts mirroring Laravel JSON.
- api/ Pure Axios client (`getStudentHomeStats`, `getZoomMeetingsByMonth`, `joinZoomMeeting`).
- queries/ TanStack Query v5 `studentHomeQueries` factory (`queryOptions`). `select` fns are module-level (stable).
- server/ server-only. Reads iron-session token, prefetches stats with a 1500ms budget, returns dehydrated state.
- components/ UI only. page.tsx is a Server Component that wraps <StudentHome/> in <HydrationBoundary/>.
- index.ts client-safe barrel. NEVER export server/ from it (server-only would leak into client bundles).

## Data contracts (backend source of truth)

- GET /dashboard/stats → { stats, exam_results[], pass_rate }
- GET /zoom-meetings?month=YYYY-MM → ZoomMeeting[] (includes ends_at, joined, attended, code_open)
- POST /zoom-meetings/{id}/attend → { zoom_link }
- `joined` = pressed "join". `attended` = CONFIRMED (code or admin). Never set `attended` client-side.

## Rules (inherited, non-negotiable)

- No useState/useEffect for server data. No empty catch. Errors via mapApiError → notify.error.
- QueryState wraps every query-driven region. Toolbar/navigation stays OUTSIDE QueryState.
- Hooks never run inside a QueryState render-prop: put them in a child component (ZoomCalendarContent).
- Tokens only (background, foreground, muted, border, primary, success, destructive). No dark:, gradients, shadows, framer-motion, ml/mr/pl/pr.
- Spacing scale 1,2,3,4,6,8,12,16 only. Icons size-4/size-5. Max two font weights (normal, semibold).
- Meeting duration comes from `ends_at` (meetingMinutes). Never hardcode 60.
- Strings in constants/labels.ts (TODO translate) until NextIntlClientProvider wraps the app.

## Known gaps / debt (do not "fix" silently)

1. Backend: StudentDashboardResource exists, unwrapped on purpose (top-level `stats`). enrolled_courses = approved only; completed_courses = all lessons completed (no task requirement). STILL OPEN: learning_hours = lessons*30min (invented), streak uses updated_at, exam_results unbounded, app.timezone = UTC (day boundaries are UTC).
2. Admin ManageZoomTab sends course_name but backend requires course_id → 422 on create/update.
3. No UI for attendance code confirmation (POST /zoom-meetings/{id}/confirm-attendance).
4. Attendance % is computed client-side while /zoom-meetings/attendance-summary exists (two sources of truth).
5. mapApiError maps every 403 to ROLE_FORBIDDEN → wrong message for "meeting not started". Add ZOOM_* error codes.
6. [RESOLVED] DashboardHeader refactored into HomeHeader adhering to DESIGN.md tokens & Card/Avatar primitives; legacy dashboard files removed.
