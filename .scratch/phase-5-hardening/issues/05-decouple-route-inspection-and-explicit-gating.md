# 05: Decouple Route Inspection from LessonResource & Explicit Gating

**What to build:**
Decouple the backend `LessonResource` from framework router internals by making the gating decision explicit, preventing Feature Envy smell.

**Blocked by:** None (can start immediately).

**Status:** completed

- [x] In `LessonController.php`, explicitly inform `LessonResource` via parameter or resource wrapper that single lesson request is active.
- [x] In `LessonResource.php`, rely strictly on the passed parameter or explicit context rather than inspecting `$request->route('lesson')`.
- [x] Run full backend test suite (`php artisan test`) and verify 100% pass.
