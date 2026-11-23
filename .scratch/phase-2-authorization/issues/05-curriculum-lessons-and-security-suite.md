# 05: Curriculum Lessons & Full Security Suite Slice

**What to build:** Lesson management for instructors (`POST /sections/{section}/lessons`, `PUT /lessons/{lesson}`, and `DELETE /lessons/{lesson}`) authorizing via parent course traversal (`$lesson->getCourse()`). Deleting a lesson with completed student progress is blocked with `422 Unprocessable Entity`. Completing this slice delivers the comprehensive automated security test suite `tests/Feature/Instructor/InstructorAuthorizationTest.php`, asserting all 11 IDOR, role hierarchy, deletion integrity, and parameter tampering invariants.

**Blocked by:** 04: Curriculum Sections & Integrity Guard Slice

**Status:** completed

- [x] Implement `InstructorLessonController@store` creating a lesson under an authorized section.
- [x] Implement `InstructorLessonController@update` authorizing via `$lesson->getCourse()` and updating lesson title, description, duration, and preview state.
- [x] Implement `InstructorLessonController@destroy` authorizing via `$lesson->getCourse()` and blocking deletion if student completion records exist (`422 Unprocessable Entity`).
- [x] Build comprehensive security test suite in `tests/Feature/Instructor/InstructorAuthorizationTest.php` covering the full matrix (Instructor A vs B, Admin override, Student/Guest rejection, prohibited fields, deletion integrity, and broken relation 404s).
- [x] Verify that all test cases pass cleanly with `php artisan test --filter=InstructorAuthorizationTest`.
