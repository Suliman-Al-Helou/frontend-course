# 02: Candidate User Autocomplete & Managed Faculty Linking

**What to build:**
Platform administrators can search candidate user accounts in the Instructor Dossier modal and link an authenticated user account to an instructor profile in a strict 1-to-1 relationship. The linked user is automatically granted the `instructor` role, candidate queries enforce an upper bound of 20 results, and the admin faculty card renders the "حساب مربوط: [الاسم]" badge.

**Blocked by:** 01: Display-Only Faculty Baseline & Presentation

**Status:** ready-for-agent

- [ ] Candidate user search API endpoint enforces a strict upper limit of 20 results per page to guard against resource exhaustion.
- [ ] Linking a user account to an instructor profile automatically assigns the Spatie `instructor` role to the user.
- [ ] Linking requests reject assigning users who already possess the `admin` role with a 422 validation error.
- [ ] Linking requests reject duplicate linkages (user already linked to another instructor) enforcing the strict 1-to-1 rule with a 422 error.
- [ ] Linking requests reject soft-deleted or non-existent user accounts with a 422 error.
- [ ] Instructor Dossier Form modal provides a searchable, debounced candidate user input (300ms, max 5 results) with clear selection state.
- [ ] Admin faculty cards render the active "حساب مربوط: [الاسم]" badge with linked account details.
- [ ] Automated feature tests verify candidate search limits, linking, role promotion, and validation rejection rules.
