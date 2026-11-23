# 01: Secure RSC Session Guard & Role Synchronization

**What to build:**
Safely evaluate and synchronize instructor session roles in Server Components without illegal cookie mutations during render. Expand live role revalidation to cover both instructor and admin promotions.

**Blocked by:** None (can start immediately).

**Status:** completed

- [x] Eliminate illegal `saveAuthSession` / `cookies().set()` inside `src/app/(instructor)/layout.tsx` during RSC render.
- [x] Expand `/auth/me` role check to recognize both `instructor` and `admin` live promotions.
- [x] Provide client-side or Route Handler mechanism for committing the updated session cookie if promoted.
- [x] Verify test suite `src/lib/__tests__/instructor-guard.test.ts`.
