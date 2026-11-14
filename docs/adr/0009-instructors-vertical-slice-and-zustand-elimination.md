# 0009. Instructors Vertical Slice and Zustand Store Elimination

## Context

Instructors were previously scattered across multiple layers with fragmented state management:
1. An ad-hoc Zustand store (`src/store/instructorsStore.ts`) caching instructor records manually.
2. Raw `useState + useEffect` fetch loops in `ManageInstructorsTab.tsx`, `/instructors/page.tsx`, and `/instructors/[id]/page.tsx`.
3. In `CourseFormModal.tsx` and `src/app/(admin)/admin/page.tsx`, instructors were fetched via `useInstructorsStore().fetchInstructors()` instead of TanStack Query v5 cache.
4. Legacy admin components were trapped in `src/components/admin/`.

This setup violated:
- **The Domain Segregation Rule**: Conflating admin management and client data fetching across scattered files.
- **The 3-Layer Feature Pattern**: Missing an encapsulated `api/`, `queries/`, `components/` structure.
- **Strict Server State Protocol**: Using Zustand for server-persisted data, causing cache divergence, stale data, and untracked network requests.

## Decision

We establish an encapsulated vertical slice: `src/features/instructors/`.

1. **Elimination of Zustand Store**:
   - `src/store/instructorsStore.ts` is permanently removed.
   - All components (`CourseFormModal`, admin tabs, directory pages) consume `instructorQueries.list()` directly via TanStack Query v5.
2. **Unified Query Factory (`instructorQueries`)**:
   - `instructorQueries.list()`: Public / common instructors list.
   - `instructorQueries.detail(id)`: Public instructor details with enrolled courses.
   - `instructorQueries.adminList()`: Administrative instructors list with audit metadata.
3. **Mutation Layer (`useInstructorMutations`)**:
   - Atomic `create`, `update`, and `delete` mutations with automatic invalidation of both `instructorQueries.all()` and related course dropdowns.
4. **Concurrency Locks & Minimalist Surface**:
   - `InstructorFormModal` implements `useRef(false)` locks to prevent duplicate submissions.
   - Elimination of `useState` + `useEffect` server data fetching across all instructor views.
5. **No Lingering Bridges**:
   - Delete `src/store/instructorsStore.ts`, `src/components/admin/ManageInstructorsTab.tsx`, `src/components/admin/InstructorFormModal.tsx`, `src/lib/api/instructors.ts`, and `src/lib/queries/instructor.queries.ts`.

## Consequences

- **Pros**:
  - 100% Type-safe, declarative data fetching with automatic caching across public and admin pages.
  - Zero out-of-sync bugs between course creation and instructor management.
  - Clean architecture adhering to the project's strict protocol.
- **Cons**:
  - Any imports pointing to `@/store/instructorsStore` or legacy files must be updated to `@/features/instructors`.
