# 0007. Admin Students Management Slice, Student-Centric Enrollment Revocation, and Dynamic Confirmation Challenges

## Context

Administration of platform users and registered students was previously hampered by structural and security limitations:

1. `src/components/admin/StudentsTable.tsx` relied on prop-drilling (`users`, `enrollments`, and `onRefresh`) originating from imperative `useState + useEffect` calls in `src/app/(admin)/admin/page.tsx`, bypassing TanStack Query v5 cache synchronization.
2. Destructive user deletions were performed with basic triggers without protecting authenticated administrators from accidentally deleting their own account (`Self-Action Guard`).
3. Inability to inspect a student's enrolled courses from their profile: an administrator wishing to revoke an enrollment had to navigate to the global requests table (`/admin?tab=enrollments`) where multiple applications from the same student were scattered.
4. Risk of accidental deletions or role updates due to lack of deliberate confirmation barriers.

## Decision

We establish a dedicated **Admin Users & Students Vertical Slice (`src/features/admin-users/`)** adhering to the 3-layer architecture, TanStack Query v5, and strict destructive action governance:

1. **Autonomous TanStack Query Layer (`adminUserQueries.list()`)**:
   - `adminUserQueries.list()` queries `GET /admin/users` with automatic garbage collection and stale-time caching.
   - Deletion mutation (`useDeleteUserMutation`) invalidates `adminUserQueries.all()` and `adminEnrollmentQueries.all()`, completely removing the need for manual `onRefresh` prop passing.
   - Decouple `src/app/(admin)/admin/page.tsx` from raw fetching: stats and tables consume the query cache directly.

2. **GitHub-Style Destructive Challenge (`DeleteStudentDialog`)**:
   - Deleting a student account requires the administrator to explicitly type the target student's email/name before the deletion button activates.
   - Enforces an `isSubmittingRef` concurrency lock to prevent double-submits.
   - Native `window.confirm` is strictly prohibited in favor of accessible, design-token-bound dialogs.

3. **Student Profile Dossier & Course Revocation (`StudentDetailsModal`)**:
   - Provides a student-centric modal displaying the student's identity, joined date, and all associated course enrollments.
   - Enables the administrator to revoke course access via `PATCH /admin/enrollments/{id}` (marking status as `rejected` and `payment_confirmed: false`), preserving financial and academic audit histories.

4. **Self-Action Guard**:
   - Evaluates the authenticated admin identity (`authQueries.user()`).
   - Disables and hides destructive deletion and role demotion controls for the active administrator's own record.

5. **Strict Vertical Slice Internal Anatomy**:
   ```text
   src/features/admin-users/
   ├── api/                    # Pure Axios calls for /admin/users
   ├── queries/                # TanStack Query v5 queryOptions & mutations
   ├── components/             # StudentsManagementTab, StudentDetailsModal, DeleteStudentDialog
   ├── types/                  # AdminUser, UserFilterStatus contracts
   ├── __tests__/              # Automated unit tests for query keys and filtering
   ├── ai-context.md           # Immutable PRD & domain boundaries anchor
   └── index.ts                # Client-safe public barrel export
   ```

## Consequences

- **Positive**: Complete eradication of `useState + useEffect` for user fetching in the admin panel; full safety against accidental self-deletion; single-pane-of-glass enrollment management per student; adherence to zero-lingering-bridges rule.
- **Negative / Trade-off**: Deleting a student requires typing their identifier, adding a deliberate friction step intended to safeguard data integrity.
