# Instructors Feature (`src/features/instructors/`)

## 1. Domain Scope & Boundaries

### In-Scope:
- **Faculty Directory & Profiles**: Public listing of instructors and dedicated instructor detail profiles (`/instructors` and `/instructors/[id]`).
- **Instructor CRUD & Administration**: Administrative management of faculty credentials, avatars, bios, and social links.
- **Relational Course Assignment**: Assigning course IDs to instructors and selecting instructors in course forms via memory cache sharing (`instructorQueries.list()`).
- **Zustand Elimination**: Complete eradication of client-side ad-hoc stores (`instructorsStore.ts`) in favor of TanStack Query v5 declarative queries.

### Out-of-Scope:
- **Course Content & Syllabus Editing**: Handled inside `src/features/admin-courses/`.
- **Student Enrollments & Attendance**: Handled inside `src/features/admin-users/` and `src/features/media-pipeline/`.

---

## 2. Backend Contracts & Endpoints

| Method | Endpoint | Description | Payload / Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/instructors` | Public listing of instructors | `InstructorWithCoursesCount[]` |
| `GET` | `/instructors/:id` | Single instructor detailed dossier | `InstructorDetail` |
| `GET` | `/admin/instructors` | Administrative list of instructors | `Instructor[]` |
| `POST` | `/admin/instructors` | Create instructor | `InstructorFormData` -> `Instructor` |
| `PUT` | `/admin/instructors/:id` | Update instructor | `Partial<InstructorFormData>` -> `Instructor` |
| `DELETE`| `/admin/instructors/:id` | Delete instructor | `void` |

---

## 3. Strict Rules & Architectural Guidelines

1. **Strict 3-Layer Pattern**: All data fetching must use `instructorQueries.list()`, `detail(id)`, or `adminList()`. Never write `useState + useEffect` fetch logic.
2. **Cache Invalidation**: Mutations automatically invalidate `instructorKeys.all`.
3. **Double-submit Concurrency Locks**: Modals and forms must guard async actions with `useRef(false)` locks.
