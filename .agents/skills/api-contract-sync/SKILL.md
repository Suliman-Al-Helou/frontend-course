---
name: api-contract-sync
description: "Synchronizes and validates full-stack API contracts between Laravel (backendCourse) and Next.js (frontend-course). Use whenever creating or modifying endpoints, FormRequests, API Resources, TypeScript types, or query factories to eliminate Contract Drift and guarantee 100% type-safety across repos."
---

# API Contract Sync Skill

## Purpose
Enforces cross-repository contract synchronization between `backendCourse` (Laravel 11/13 API) and `frontend-course` (Next.js 16 App Router). Eliminates "Contract Drift" where backend payloads change without matching frontend TypeScript definitions.

## When to Use
- Whenever creating or modifying any Laravel FormRequest or API Resource.
- Whenever updating frontend API fetching functions (`src/features/*/api/*.ts`) or types (`src/types/` or `src/features/*/types/`).
- Whenever a `422 Unprocessable Content` or `500 Server Error` occurs due to mismatched payload shape.

## Verification Checklist

### 1. Request Payload Symmetry
- Check `app/Http/Requests/*` in `backendCourse` for validation rules.
- Ensure the frontend Zod schema and TypeScript interface in `src/types/` match field-for-field:
  - Exact property names (e.g. `snake_case` vs `camelCase`).
  - Nullable vs undefined properties.
  - Strict upper bounds (e.g. `max: 50` in Laravel matches `.max(50)` in Zod).

### 2. Response Payload Symmetry
- Inspect the corresponding `app/Http/Resources/*` in `backendCourse`.
- Never guess response shapes! Verify what fields the `JsonResource` actually serializes.
- Ensure the frontend TypeScript return type in `src/types/` mirrors the Resource output exactly.
- Confirm content gating: ensure sensitive fields (e.g. `user_id`, raw `video_id`, internal emails) are never returned to unauthorized roles.

### 3. Status Codes & Error Contract
- Success: `200 OK` (reads/updates) or `201 Created` (creation).
- Validation failure: `422 Unprocessable Content` with `{ message: string, errors: Record<string, string[]> }`.
- Authentication failure: `401 Unauthorized`.
- Authorization failure: `403 Forbidden` (checked against `CoursePolicy` or `LessonPolicy`).
- Gating / Draft failure: `404 Not Found` for unreleased or draft lessons accessed by unauthorized students.
