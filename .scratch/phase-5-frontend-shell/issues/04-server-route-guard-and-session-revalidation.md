# 04: Server Route Guard & Session Revalidation

**What to build:** Implement server-side route guards for the `(instructor)` route group, protecting faculty workflows from unauthorized access while avoiding infinite redirect loops. If an authenticated user's session cookie still reflects `role = "student"`, revalidate against `/api/auth/me` to instantly detect administrative role promotions before redirecting to `/dashboard`. Update `(admin)/layout.tsx` to bounce instructors to `/instructor`.

**Blocked by:** 01: Types & Auth Contracts

**Status:** ready-for-agent

- [ ] Create `src/app/(instructor)/layout.tsx` using `getIronSessionData()`.
- [ ] Redirect unauthenticated users to `/login?redirect=/instructor`.
- [ ] If `session.user.role === "student"`, revalidate with server-side check. If still student, redirect to `/dashboard`.
- [ ] Allow users with `role === "instructor"` or `role === "admin"`.
- [ ] Update `src/app/(admin)/layout.tsx` to redirect `role === "instructor"` to `/instructor`.
- [ ] Ensure `(student)/layout.tsx` permits instructors who enroll in courses as learners.
- [ ] Add unit/integration tests verifying the route redirection matrix.
