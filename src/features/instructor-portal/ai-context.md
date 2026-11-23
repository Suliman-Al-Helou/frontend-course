# Instructor Portal Feature (`src/features/instructor-portal/`)

## 1. Domain Scope & Boundaries

### In-Scope:

- **Instructor Assigned Courses**: Fetching, viewing, and navigating courses strictly assigned to the authenticated faculty member via `GET /instructor/courses`.
- **Curriculum Management**: Dedicated faculty view for managing sections, lessons, and lesson tasks (per Phase 6 / ADR 0014).
- **Educational Metadata**: Updating course informational properties (title, description, learning outcomes, requirements) without sensitive commercial flags (price, public publish status, deletions).

### Out-of-Scope:

- **Commercial & Administrative Controls**: Price editing, public visibility toggle, Stripe/payment configuration, course deletion (strictly admin-only).
- **Global Faculty Management**: Handled in `src/features/instructors/` (Admin management of instructors).
- **Student Progress & Enrollments**: Handled in `src/features/student-courses/` and `src/features/media-pipeline/`.

---

## 2. Backend Contracts & Endpoints

| Method | Endpoint                  | Description                                                 | Payload / Response                                            |
| :----- | :------------------------ | :---------------------------------------------------------- | :------------------------------------------------------------ |
| `GET`  | `/instructor/courses`     | List courses assigned to authenticated instructor           | `{ data: InstructorCourse[], courses: InstructorCourse[] }`   |
| `GET`  | `/instructor/courses/:id` | Show single assigned course educational details             | `CourseInstructorResource`                                    |
| `PUT`  | `/instructor/courses/:id` | Update educational metadata (stripped of commercial fields) | `InstructorUpdateCourseRequest` -> `CourseInstructorResource` |

---

## 3. Strict Rules & Architectural Guidelines

1. **Vertical Slice Isolation**: Never import or reuse compound admin course components (`ManageCoursesTab`, `CourseFormModal`).
2. **TanStack Query v5 Factory**: All server state must be defined in `queries/instructor-portal.queries.ts` via `queryOptions`.
3. **No Direct `useState` Fetching**: Data fetching through `useQuery` exclusively.
4. **Design System Strictness**: Adhere to `DESIGN.md` (10% Indigo Rule, Two-Weights Rule, min 44x44px touch targets, RTL spacing).
