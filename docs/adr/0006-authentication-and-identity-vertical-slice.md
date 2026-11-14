# 0006. Authentication & Identity Vertical Slice, Zero-FOUC Session Hydration, and Server-Only Cryptography

## Context

User identity and authentication were previously fragmented across multiple disparate patterns:

1. Client-side authentication state lived in a standalone Zustand store (`src/store/authStore.ts`).
2. An imperatively mounted component (`AuthBootstrap.tsx`) triggered an asynchronous `fetch('/api/auth/me')` on every page load and refresh, causing a visual Flash of Unauthenticated Content (FOUC) and redundant client-side network round-trips.
3. Upon logout, Zustand state was cleared, but TanStack Query caches across domain features (`courses`, `student-courses`, `admin-courses`) remained in memory, presenting potential stale data exposure risks.
4. Session encryption and cookie handling logic resided loosely in `src/lib/session.ts` without strict vertical slice encapsulation or compile-time `server-only` guards.

## Decision

We establish a canonical, cohesive **Authentication & Identity Vertical Slice (`src/features/auth/`)** following the TanStack Query v5 Single Source of Truth architecture and Next.js App Router security standards:

1. **TanStack Query as Single Source of Truth (`authQueries.user()`)**:
   - Retire the ad-hoc Zustand user store in favor of an official query factory: `authQueries.user()`.
   - All client components consume user identity via `useQuery(authQueries.user())`.
   - Centralize logout mutation: `useLogoutMutation` calls the backend BFF endpoint `/api/auth/logout`, executes `queryClient.clear()` to purge all cached domain data across the application, and initiates a clean route transition.

2. **Zero-FOUC Session Hydration**:
   - The Root Layout (`src/app/layout.tsx`) reads the encrypted session cookie on the server via `getIronSessionData()` with zero network overhead.
   - The initial session state is passed directly into the client hydration boundary (TanStack Query `initialData` or HydrationBoundary), ensuring that the navbar, user avatars, and protected interfaces render with authenticated state in the very first HTML frame without layout shifts.

3. **Encapsulated Server-Only Cryptography (`src/features/auth/server/session.ts`)**:
   - Route handlers remain standard Next.js endpoints in `src/app/api/auth/*` (`login`, `register`, `logout`, `me`, `google`).
   - All session sealing, unsealing, cookie setting, and iron-session encryption logic are housed strictly in `src/features/auth/server/session.ts`.
   - The module is guarded by `import "server-only";` to guarantee that cryptographic secrets, passwords, and server session helpers can never be bundled into the client browser bundle.

4. **Strict Vertical Slice Internal Anatomy**:
   ```text
   src/features/auth/
   ├── api/                    # Pure Axios calls to Next.js BFF endpoints (/api/auth/*)
   ├── queries/                # TanStack Query v5 queryOptions factory & concurrency-locked mutations
   ├── components/             # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, GoogleAuthButton
   ├── server/                 # session.ts (encrypted cookies & iron-session with "server-only")
   ├── types/                  # User, AuthSession, and DTO contracts
   ├── __tests__/              # Automated unit tests for query keys and auth mutations
   ├── ai-context.md           # Immutable PRD & domain boundaries anchor
   └── index.ts                # Client-safe public barrel export
   ```

## Consequences

- **Positive**: Complete elimination of client-side auth flickering (FOUC); zero bootstrap network latency on page load; total memory cache purge upon user logout; strict compile-time protection against server secret leaks.
- **Negative / Trade-off**: Removing `useAuthStore` requires migrating any legacy references to `useQuery(authQueries.user())` and ensuring mock sessions in isolated unit tests supply initial QueryClient data.
