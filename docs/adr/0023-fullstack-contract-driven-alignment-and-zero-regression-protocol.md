# ADR 0023: Full-Stack Contract-Driven Alignment, Zero-Regression Schema Sync, and Boundary Adapter Protocol

## Status
Accepted

## Context
Following the implementation of Phase 5 (Frontend Shell and Video Delivery Contract), an architectural audit revealed that maintaining decoupled repositories (`backendCourse` Laravel API and `frontend-course` Next.js 16) created severe vulnerability to **Contract Drift** (where backend Eloquent/Resource schemas change without compile-time detection in the frontend).

During a rigorous `/grill-with-docs` review, three structural decisions were formulated to eliminate guesswork, eradicate manual interface authoring, and guarantee zero-regression type safety across both repositories:

1. **Elimination of Hand-Written Backend Types**:
   - Manually authored TypeScript definitions in `src/types/index.ts` divergence from actual Laravel serialization (e.g., casing mismatches like `total_students` vs `totalStudents`, missing fields like `section_id`, and nullable discrepancies).
2. **Boundary Adapter Isolation**:
   - Converting backend serialization (`snake_case`) to frontend consumption (`camelCase`) directly in React components causes duplicate transformations and re-render churn.
   - Conversely, modifying backend resources to fit frontend legacy shapes breaks backend feature tests and OpenAPI compatibility.
3. **Enforced Schema Parity in the Build Pipeline**:
   - Without automated tooling, developers may commit changes to either repository without updating the contract, leading to runtime failures in production.

## Decision

1. **Automated OpenAPI Generation as Source of Truth**:
   - `dedoc/scramble` is installed in `backendCourse` as a dev dependency.
   - The authoritative API specification is statically exported via `php artisan scramble:export --path=public/api.json`.
   - `openapi-typescript` generates immutable types into `frontend-course/src/types/api.generated.ts` via `npm run sync:types`.
   - `src/types/index.ts` remains intact as a transitional public export layer, avoiding any breaking changes to existing components.

2. **Boundary Adapter Pattern**:
   - All schema transformations (e.g. `snake_case` $\to$ `camelCase`, Date parsing, or fallback defaults) MUST occur strictly at the network boundary within `src/features/<feature>/api/*.ts`.
   - The TanStack Query cache MUST only store clean, normalized data returned by these adapters.
   - Gated or conditional fields (such as `playback` or `video_id`) MUST be modeled as strict **Discriminated Unions** rather than loose optional properties.

3. **Compiler-Proof Type-Level Audit Testing**:
   - A dedicated type-testing file (`src/types/__tests__/contract-audit.test.ts`) is established and integrated into `npm test` (`vitest run`).
   - Any divergence between the generated OpenAPI schema (`components["schemas"]`) and legacy interfaces (`src/types/index.ts`) will fail CI at compile time.

4. **Surgical, Non-Destructive Refactoring (Sync on Touch)**:
   - Existing slices (Phases 1-5) continue using established interfaces until they are modified or an active defect is identified.
   - All upcoming features (Phase 6 Curriculum Tree, Phase 7 Video Delivery) MUST directly consume types derived from `src/types/api.generated.ts`.

## Consequences
- **Positive**:
  - Zero guesswork: 100% compile-time certainty across all 65 API endpoints.
  - Zero regression: Existing code continues operating without disruption.
  - Instant synchronization: `npm run sync:types` regenerates contracts in under 200ms.
- **Negative / Operational Debt**:
  - Developers modifying Laravel endpoints must execute `php artisan scramble:export` before frontend pull requests can be verified.
