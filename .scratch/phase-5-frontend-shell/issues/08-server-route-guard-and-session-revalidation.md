# 08: Server-Side Instructor Route Guard & Cross-Role Redirection

**What to build:** Implement server-side route guard in `src/app/(instructor)/layout.tsx` using `getIronSessionData()`. Unauthenticated users redirect to `/login?redirect=/instructor`. If session has `role === "student"`, revalidate against `/api/auth/me` to instantly detect administrative role promotions before redirecting to `/dashboard`. Update `src/app/(admin)/layout.tsx` to redirect `instructor` to `/instructor`.

**Blocked by:** 02: Role Extension & Post-Login Redirection

**Status:** ready-for-agent

- [ ] Create `src/app/(instructor)/layout.tsx` enforcing server-side role check.
- [ ] Implement session revalidation via `/api/auth/me` for student sessions to catch real-time promotions.
- [ ] Update `src/app/(admin)/layout.tsx` to redirect instructors to `"/instructor"`.
- [ ] Ensure `src/app/(student)/layout.tsx` permits instructors who enroll in courses as learners.
- [ ] Test the route redirection matrix with unit/integration tests.
