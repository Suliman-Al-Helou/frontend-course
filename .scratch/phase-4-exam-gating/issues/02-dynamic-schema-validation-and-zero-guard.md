# 02: Dynamic Full-Schema Questionnaire Validation

**What to build:** Comprehensive request validation in `SubmitTaskRequest` that dynamically reads the target lesson's task questions, verifies that every question has an answer, and rejects missing or blank answers with `422 Unprocessable Content`.

**Blocked by:** 01: Decouple Task Access & Eliminate Deadlock

**Status:** completed

- [x] In `SubmitTaskRequest`, implement dynamic `withValidator` inspecting `$this->route('lesson')->task->questions`.
- [x] Verify that `answers` contains an entry for every question ID defined in the questionnaire.
- [x] Reject incomplete or empty submissions with `422 Unprocessable Content` and Arabic message `"يجب الإجابة على جميع الأسئلة لتسليم المهمة"`.
- [x] Verify that zero attempts are logged in the database on validation failure.
