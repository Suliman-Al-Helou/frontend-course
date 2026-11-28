# In-App Notifications System (Bell Icon)

**Status:** In Progress  
**Repos:** `backendCourse`, `frontend-course`

## Problem Statement
Authenticated users (Students, Instructors, Admins) currently have no in-app notification center to alert them about course enrollments, upcoming Zoom meetings, or newly published lessons.

## Solution
Implement a database-backed in-app notification system using Laravel's built-in `notifications` table (`database` channel) and a `NotificationBell` component in Next.js powered by TanStack Query v5 smart polling (`refetchInterval: 60_000`).

## API Contract (`auth:sanctum`)
- `GET /api/notifications` -> `{ data: NotificationItem[], meta: { unread_count: number, current_page: number, last_page: number } }` (max 20 per page).
- `POST /api/notifications/{id}/read` -> marks a single notification owned by `auth()->id()` as read.
- `POST /api/notifications/read-all` -> marks all unread notifications owned by `auth()->id()` as read.

## Out of Scope
- Real-time WebSockets (Laravel Reverb / Pusher).
- Push notifications (FCM / Web Push).
