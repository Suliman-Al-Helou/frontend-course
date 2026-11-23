# 02: Role Extension & Post-Login Redirection

**What to build:** Extend `User.role` to `"admin" | "student" | "instructor"`. Update `resolvePostLoginRedirect` in `src/lib/auth-helpers.ts` to redirect `instructor` to `"/instructor"` by default while preserving safe relative redirect parameters and sanitizing open-redirect attacks.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] Extend `User.role` in `src/types/index.ts` to `"admin" | "student" | "instructor"`.
- [x] Update `resolvePostLoginRedirect()` in `src/lib/auth-helpers.ts` to return `"/instructor"` when `user.role === "instructor"` and redirect parameter is absent.
- [x] Add unit tests in `src/lib/__tests__/auth-helpers.test.ts` covering instructor redirection and open redirect sanitation.
