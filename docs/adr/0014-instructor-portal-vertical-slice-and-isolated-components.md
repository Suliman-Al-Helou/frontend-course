# ADR 0014: Instructor Portal Vertical Slice and Isolated Role Components Architecture

## Status
Accepted

## Context
The platform is introducing a dedicated interface for instructors to manage courses assigned to them by administrators. During architectural planning, two approaches were considered for the frontend interface:
1. **Shared Compound Components**: Reusing existing administrative components (`ManageCoursesTab`, `CourseFormModal`, `CourseSectionsModal`) by introducing conditional authorization flags (e.g., `role="instructor"`, `canDelete={false}`, `canEditPrice={false}`).
2. **Isolated Vertical Slice with Dedicated Role Components**: Establishing an isolated vertical slice `src/features/instructor-portal/` that consumes shared atomic design system primitives (`@/components/ui/*`) but maintains independent composite components tailored to the instructor's exact permissions.

Coupling the Admin and Instructor portals through shared composite components introduces severe architectural risks:
- Leaky abstractions and props explosion (`isAdmin`, `hideYouTubeSync`, `disablePricing`).
- High regression risk: modifying admin features could inadvertently break instructor views or leak elevated administrative controls (e.g., deleting courses, editing prices, managing YouTube channels).
- Violation of the project's Domain Segregation Rule and Vertical Slice Architecture guidelines.

## Decision
1. **Isolated Vertical Slice (`src/features/instructor-portal/`)**:
   - Create a dedicated domain slice with its own `api/`, `queries/`, `components/`, and `types/` layers, anchored by `ai-context.md`.
   - Dedicated BFF endpoints: `GET /instructor/courses` and `PUT /instructor/courses/{id}` tailored strictly to instructor permissions.
2. **Component Separation Policy**:
   - **Shared Primitives (Design System)**: Buttons, inputs, modals, cards, badges, and layout primitives in `@/components/ui/*` remain universally shared across all roles.
   - **Isolated Composite Components**: High-level business components (`InstructorCourseCard`, `InstructorCourseContentEditor`, `InstructorCurriculumEditor`) must be implemented independently inside `src/features/instructor-portal/components/`.
   - Never share composite business components across different user roles.
3. **Instructor MVP Permissions Boundary**:
   - **Allowed**: Update course informational metadata (title, description, cover image, requirements, learning outcomes), add/edit curriculum sections, lessons, and lesson tasks (missions).
   - **Disallowed**: Course deletion, changing course pricing, toggling public publishing status, and platform YouTube OAuth channel linking.

## Consequences
- **Positive**:
  - **Zero Permission Leakage**: Administrative actions (deletion, pricing, YouTube OAuth) are physically absent from instructor bundle and DOM tree.
  - **Independent Velocity**: Admin and Instructor portals can evolve and be refactored independently without fear of cross-role regressions.
  - **Clean Codebase**: Completely avoids bloated conditional branching (`if (role === 'admin')`) within components.
- **Negative**:
  - Requires writing separate composite form and card components for the instructor slice, which duplicates some structural HTML markup, but conforms strictly to Vertical Slice Architecture best practices.
