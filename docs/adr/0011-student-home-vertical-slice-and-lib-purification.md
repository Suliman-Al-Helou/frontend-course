# 0011. Student Home Vertical Slice and Lib Directory Purification

## Context

The `src/features/student-home/` slice was constructed in the project's early days and left several architectural artifacts lingering in `src/lib/`:
1. `src/lib/api/studentHome.ts` held API endpoints outside the feature boundary.
2. `src/lib/queryKeys.ts` held an outdated global query key registry violating the feature-encapsulated `queryOptions` factory pattern.
3. `src/lib/api/` and `src/lib/queries/` existed solely for these legacy files.

## Decision

We fully modernize `src/features/student-home/` into a standard 3-layer vertical slice and purify `src/lib/`.

1. **Encapsulated Feature API**:
   - Establish `src/features/student-home/api/index.ts` containing `getStudentHomeStats`, `getZoomMeetingsByMonth`, and `joinZoomMeeting`.
2. **Unified Query Factory (`studentHomeQueries`)**:
   - Establish `src/features/student-home/queries/studentHome.queries.ts` with `studentHomeKeys` and `queryOptions` factories (`stats`, `zoom`).
3. **Internal Hook & SSR Alignment**:
   - Update `useStudentHomeStats`, `useStatCards`, `useExamResults`, `useZoomMeetings`, `useJoinZoomMeeting`, and `server/prefetch.ts` to consume the new query factory.
4. **Purification of `src/lib/`**:
   - Delete `src/lib/api/studentHome.ts` and `src/lib/queryKeys.ts`.
   - Remove `src/lib/api/` and `src/lib/queries/` directories permanently.
   - `src/lib/` now strictly houses generic utilities, validation schemas, and platform helpers.

## Consequences

- **Pros**:
  - `src/features/student-home/` is 100% self-contained with no external dependencies on `src/lib/api` or `src/lib/queryKeys`.
  - `src/lib/` is completely free of feature-specific code.
- **Cons**:
  - None.

