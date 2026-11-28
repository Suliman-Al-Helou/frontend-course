# Notifications Feature (`src/features/notifications`)

## Scope

- **In-Scope:** In-app notification bell (`NotificationBell`), smart polling via TanStack Query (`60s`), mark-as-read and mark-all-as-read mutations.
- **Out-of-Scope:** WebSockets, push notifications, email digests.

## Backend Contract (`backendCourse`)

- `GET /api/notifications?per_page=15` (max 20)
- `POST /api/notifications/{id}/read`
- `POST /api/notifications/read-all`
