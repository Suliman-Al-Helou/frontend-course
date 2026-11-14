# admin-users (Admin Students & Users Domain) — Architectural Context & PRD (immutable anchor)

## Purpose & Scope

This feature encapsulates the **Admin Users & Students Management Domain** exclusively. It provides administrators with a centralized, secure interface to inspect registered students, examine individual student course dossiers, revoke course enrollments, and execute deliberate, GitHub-style verified account deletions.

### Explicit Domain Boundaries

- ✅ **IN SCOPE (This Feature):**
  - Querying platform users via TanStack Query v5 (`adminUserQueries.list()`).
  - Student table with 3-way status filtering (`all`, `active`, `no-courses`) and instant search.
  - Student Profile Dossier (`StudentDetailsModal`) showing joined date and individual course enrollments.
  - Course enrollment revocation directly from the student's profile via `useEnrollmentMutations().updateStatus` with `status: 'rejected'` and `payment_confirmed: false`.
  - GitHub-style destructive deletion challenge (`DeleteStudentDialog`) requiring explicit input matching the student's identifier before unlocking the delete action.
  - Self-Action Guard protecting the active administrator from deleting their own account.
- ❌ **OUT OF SCOPE (Strictly Separate Features):**
  - **Public User Profiles / Instructors (`src/features/instructors/`):** Public marketing bios and teaching credentials.
  - **Authentication & Login Credentials (`src/features/auth/`):** Session minting, password hashing, and token encryption.
  - **Courses Catalog & Curriculum (`src/features/admin-courses/`):** Creating courses, editing sections, lessons, or global enrollment requests.

---

## Architectural Layers

```text
src/features/admin-users/
├── api/                    # Pure Axios calls for /admin/users
├── queries/                # TanStack Query v5 queryOptions & mutations
│   ├── adminUsers.queries.ts   # adminUserQueries.list() with key ["admin-users", "list"]
│   └── adminUsers.mutations.ts # useDeleteUserMutation, useUpdateUserRoleMutation
├── components/             # UI Components
│   ├── StudentsManagementTab.tsx # Main decoupled tab view with filters & Self-Action Guard
│   ├── StudentDetailsModal.tsx   # Student dossier with enrollment revocation
│   └── DeleteStudentDialog.tsx   # GitHub-style deletion verification challenge
├── types/                  # AdminUser, UserRole, UserFilterStatus
├── __tests__/              # Automated unit tests for query keys
├── ai-context.md           # Immutable PRD & domain boundaries anchor
└── index.ts                # Client-safe barrel export
```

---

## Data Contracts (Backend Source of Truth)

- `GET /admin/users` → `AdminUser[] | { data: AdminUser[] }`: Returns all platform users.
- `DELETE /admin/users/{id}` → Deletes a user account and purges associations.
- `PATCH /admin/users/{id}` → `{ role: "admin" | "student" }`: Updates user administrative role.
- `PATCH /admin/enrollments/{id}` → `{ status: "rejected", payment_confirmed: false }`: Revokes course access while preserving audit trail.

---

## Strict Rules (Inherited & Non-Negotiable)

1. **ZERO PROP DRILLING:** `StudentsManagementTab` must NEVER accept `users`, `enrollments`, or `onRefresh` as props. It must consume TanStack Query directly.
2. **DELIBERATE DESTRUCTION:** Deletions require the administrator to manually type the target identifier in `DeleteStudentDialog`.
3. **SELF-ACTION GUARD:** The currently authenticated administrator cannot delete or demote themselves.
4. **DOUBLE-SUBMIT LOCK:** All mutation actions must be guarded by `useRef` locks.
5. **ZERO LINGERING BRIDGES:** Retire legacy `StudentsTable.tsx` immediately upon integration.
