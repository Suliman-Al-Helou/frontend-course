# 02: Dynamic Full-Schema Questionnaire Validation & Zero-Index Option Guard

**What to build:** Comprehensive request validation in `SubmitTaskRequest` that dynamically reads the target lesson's task questions, verifies that every question has an answer, guards option index `0` against PHP falsy evaluation, and rejects missing questions with `422 Unprocessable Content`.

**Blocked by:** 01: Decouple Task Access & Eliminate Progression Deadlock

**Status:** ready-for-agent

- [ ] In `SubmitTaskRequest`, implement dynamic `withValidator` inspecting `$this->route('lesson')->task->questions`.
- [ ] Verify that `answers` contains an entry for every question ID defined in the questionnaire.
- [ ] Apply strict numeric validation (`is_numeric($val) && !is_null($val)`) so option index `0` is recognized as a valid response.
- [ ] Reject incomplete or blank submissions with `422 Unprocessable Content` and Arabic message `"يجب الإجابة على جميع الأسئلة لتسليم المهمة"`.
- [ ] Verify that zero attempts are logged in the database on validation failure.
