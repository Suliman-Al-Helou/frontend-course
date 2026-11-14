# auth (Authentication & Identity Domain) — Architectural Context & PRD (immutable anchor)

## Purpose & Scope

This feature encapsulates the **Authentication & Identity Domain** exclusively. It provides cryptographically secure user authentication, identity synchronization, and session lifecycle management across the platform.

### Explicit Domain Boundaries

- ✅ **IN SCOPE (This Feature):**
  - Session and identity queries (`authQueries.user()`) backed by TanStack Query v5 as Single Source of Truth.
  - User login, registration, logout, and password recovery mutations.
  - Server-only session sealing, unsealing, and cookie encryption (`src/features/auth/server/session.ts`) using AES-GCM and Iron Session.
  - Concurrency-locked authentication forms (`useRef` lock against double submits).
  - Memory cache purge on logout (`queryClient.clear()`).
  - Google OAuth / One-Tap client integrations.
- ❌ **OUT OF SCOPE (Strictly Separate Features):**
  - **User Role Management & Students Administration (`src/features/admin-users/`):** Changing user roles, banning, listing platform users.
  - **Public Instructor Profiles (`src/features/instructors/`):** Public marketing profiles of course instructors.
  - **Route Handlers Location (`src/app/api/auth/*`):** App Router endpoints remain in `src/app/api/auth/*` to comply with Next.js conventions while consuming `src/features/auth/server/session.ts`.

---

## Architectural Layers

```text
src/features/auth/
├── api/                    # Pure Axios calls to /api/auth/* BFF endpoints
├── queries/                # TanStack Query v5 queryOptions factory & mutations
│   ├── auth.queries.ts     # authQueries.user() with hierarchical key ["auth", "user"]
│   └── auth.mutations.ts   # useLoginMutation, useRegisterMutation, useLogoutMutation
├── server/
│   └── session.ts          # Encrypted cookies & Iron Session with "server-only" guard
├── types/
│   └── index.ts            # AuthUser, SessionData, LoginPayload, RegisterPayload
├── __tests__/
│   └── auth-queries.test.ts# Automated unit tests for query keys and contracts
├── ai-context.md           # Immutable PRD & domain boundaries anchor
└── index.ts                # Client-safe barrel export
```

---

## Data Contracts (BFF Source of Truth)

- `GET /api/auth/me` → `{ user: AuthUser | null }`: Returns the authenticated user from the encrypted session cookie without exposing bearer tokens.
- `POST /api/auth/login` → `{ message?: string, user: AuthUser }`: Authenticates credentials, sets HttpOnly cookie, and returns user claims.
- `POST /api/auth/register` → `{ message?: string, user: AuthUser }`: Creates student account, logs in, and sets HttpOnly cookie.
- `POST /api/auth/logout` → Destroys server session cookie and returns 200 OK.
- `POST /api/auth/forgot-password` → Sends password reset email.
- `POST /api/auth/reset-password` → Sets new password via token.

---

## Strict Rules (Inherited & Non-Negotiable)

1. **NO CLIENT-SIDE BEARER TOKEN:** Tokens are strictly server-only in HttpOnly cookies; client code never reads or stores raw tokens.
2. **QUERY AS SINGLE SOURCE OF TRUTH:** User identity must be queried via `useQuery(authQueries.user())`. Zustand user store is retired.
3. **COMPLETE CACHE PURGE ON LOGOUT:** `useLogoutMutation` MUST execute `queryClient.clear()` to eliminate cross-session data leaks.
4. **DOUBLE-SUBMIT CONCURRENCY LOCK:** Any authentication form MUST employ `useRef` lock (`isSubmittingRef`) to reject duplicate requests.
5. **SERVER-ONLY CRYPTOGRAPHY:** `session.ts` MUST begin with `import "server-only";` to guarantee zero server secrets in browser bundles.
