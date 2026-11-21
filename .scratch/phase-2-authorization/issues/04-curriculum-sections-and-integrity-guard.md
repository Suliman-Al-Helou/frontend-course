# 04: Curriculum Sections & Integrity Guard Slice

**What to build:** Curriculum section management for instructors (`GET /courses/{course}/sections`, `POST /courses/{course}/sections`, `PUT /sections/{section}`, and `DELETE /sections/{section}`). All mutations authorize via parent course traversal (`$section->course`). The deletion endpoint enforces the **Curriculum Deletion Integrity Guard**: if any lesson within the section has completed student progress (`completed = true`), the request is rejected with `422 Unprocessable Entity`. Unstudied sections can be deleted cleanly with `204 No Content`.

**Blocked by:** 03: Course Mutation & Prohibited Attributes Guard Slice

**Status:** ready-for-agent

- [ ] Implement `InstructorSectionController@index` returning the curriculum sections and lessons tree for an authorized course.
- [ ] Implement `InstructorSectionController@store` creating a section under an authorized course.
- [ ] Implement `InstructorSectionController@update` authorizing via `$section->course` and updating title and order.
- [ ] Implement `InstructorSectionController@destroy` authorizing via `$section->course` and enforcing the Deletion Integrity Guard.
- [ ] Reject deletion requests with `422 Unprocessable Entity` if any lesson in the section has student completion records.
- [ ] Cross-tenant attempts to add, rename, or delete sections on another instructor's course return `403 Forbidden`.
- [ ] Feature test verifies section CRUD, parent traversal authorization, and progress integrity protection.
