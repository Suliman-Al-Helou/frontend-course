# 03: Smart Diffing, Activity Recording & Cache Invalidation Hook

**What to build:** The core business service logic in `CourseService::updateEducationalMetadata` that inspects updated educational attributes against the current course state. Normalizes JSON arrays to compute exact value diffs. If no values genuinely changed, log creation is suppressed. If changes occurred, executes a database transaction to update the course, insert a `CourseActivityLog` record containing the exact before/after diff with acting user and IP address, and flush the public course cache via `ContentCache::forgetCourses()`.

**Blocked by:** 01 (Audit Logging Foundation), 02 (Educational Mutation Boundary)

**Status:** completed

- [x] Implement `updateEducationalMetadata(Course $course, array $validated, ?User $user = null, ?string $ipAddress = null): Course` in `App\Services\CourseService`.
- [x] Implement smart diff algorithm that compares old vs new values and normalizes arrays (`array_values`).
- [x] Suppress activity log generation when diff is empty.
- [x] Persist `CourseActivityLog` inside a database transaction alongside the course update.
- [x] Invalidate course cache using `ContentCache::forgetCourses()`.
- [x] Wire `InstructorCourseController::update` to delegate to `CourseService::updateEducationalMetadata`.
