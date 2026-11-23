# Spec 08: Full-Stack Contract Alignment, Zero-Regression Audit & Boundary Adapter Implementation

**Tracker Label**: `spec:contract-alignment`  
**Status**: Active / Approved  
**Governing ADR**: [ADR 0022: Full-Stack Contract-Driven Alignment](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0022-fullstack-contract-driven-alignment-and-zero-regression-protocol.md)  
**Parent Map**: [Wayfinder Map](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/map.md)

---

## 1. Objective
Establish an airtight, mathematical contract synchronization bridge between `backendCourse` (Laravel 13 API) and `frontend-course` (Next.js 16 App Router) without breaking any existing production code or components.

---

## 2. Architectural Protocol

### A. The Tooling Pipeline
1. **Backend Exporter**:
   - Package: `dedoc/scramble` (v0.13+)
   - Command: `php artisan scramble:export --path=public/api.json`
   - Target Artifact: `backendCourse/public/api.json` (OpenAPI 3.1.2)
2. **Frontend Type Generator**:
   - Package: `openapi-typescript` (v7.13+)
   - Command: `npm run sync:types`
   - Target Artifact: `frontend-course/src/types/api.generated.ts` (Zero manual edits permitted).

### B. The Boundary Adapter Pattern
Whenever a server schema diverges from existing frontend expectations (e.g. naming conventions, array vs string fields, or nullability), the normalization logic belongs exclusively inside `src/features/<feature>/api/*.ts`:

```typescript
// Example: src/features/admin-courses/api/admin-stats.api.ts
import type { paths } from "@/types/api.generated";
import type { AdminStats } from "@/types";

type RawAdminStats = paths["/admin/stats"]["get"]["responses"][200]["content"]["application/json"];

export function adaptAdminStats(raw: RawAdminStats): AdminStats {
  return {
    totalStudents: raw.total_students,
    totalCourses: raw.total_courses,
    totalInstructors: raw.total_instructors,
    pendingEnrollments: raw.total_enrollments,
  };
}
```

### C. Type-Level Verification Suite
- Test File: `src/types/__tests__/contract-audit.test.ts`
- Purpose: Asserts type compatibility between `components["schemas"]` and `src/types/index.ts` across the 6 core domain models:
  1. `User` / `UserAdminResource`
  2. `Course` / `CourseDetailResource` / `CourseAdminResource`
  3. `Lesson` / `LessonResource`
  4. `Section` / `SectionResource`
  5. `Task` / `TaskQuestion`
  6. `AdminStats` / `/admin/stats` response

---

## 3. Acceptance Criteria
1. `npm run sync:types` is registered in `frontend-course/package.json` and completes in $< 500\text{ms}$.
2. `src/types/index.ts` remains intact and passes `npm run typecheck` (`tsc --noEmit`) with 0 errors.
3. `src/types/__tests__/contract-audit.test.ts` is integrated into Vitest and executes under standard `npm test`.
4. All existing tests (106 frontend unit/integration tests and 91 backend matrix tests) remain green.
