# 03: Faculty Unlinking, Role Demotion & Administrative Custody Guards

**What to build:**
Platform administrators can unlink an active instructor profile (reverting it to a display-only profile) or delete the profile entirely. The system safely demotes the associated user account back to `student` (while strictly preserving `admin` role holders from demotion), transitions assigned courses to Admin Fallback Custody, and guards mutations with double-submit concurrency locks.

**Blocked by:** 02: Candidate User Autocomplete & Managed Faculty Linking

**Status:** ready-for-agent

- [ ] Unlinking an instructor profile (`user_id = null`) automatically removes the Spatie `instructor` role from the user.
- [ ] Deleting an instructor profile automatically removes the Spatie `instructor` role from the linked user.
- [ ] Demoting an instructor user's role via the admin users endpoint automatically sets `instructors.user_id = null`.
- [ ] Soft-deleting a user account automatically unlinks any associated instructor profile.
- [ ] If an unlinked or deleted instructor user possesses the `admin` role, their administrative privileges are strictly preserved without demotion.
- [ ] When an instructor is unlinked or deleted, all assigned courses remain intact under Admin Fallback Custody without orphan states or broken student links.
- [ ] Instructor form and deletion actions enforce double-submit concurrency locks (`useRef(false)`).
- [ ] Automated feature tests verify unlinking, deletion role cleanup, admin lockout prevention, and course custody preservation.
