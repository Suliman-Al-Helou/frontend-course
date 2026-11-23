# 03: Zero-Index Option Guard & Type Defense

**What to build:** Protect option index `0` from PHP falsy evaluation in `SubmitTaskRequest` using `is_numeric` and `!is_null`, ensuring valid first-choice options are accepted and not misclassified as omitted answers.

**Blocked by:** 02: Dynamic Full-Schema Questionnaire Validation

**Status:** completed

- [x] Apply strict numeric validation (`is_numeric($val) && !is_null($val)`) on each answer value.
- [x] Verify that answer values are valid option indices for each question.
- [x] Ensure selecting option `0` passes validation with `200 OK` rather than failing with `422`.
