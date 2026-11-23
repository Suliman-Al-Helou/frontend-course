# 06: Deterministic Auto-Grading Engine

**What to build:** Pure deterministic auto-grading in `TaskService::submitAttempt` comparing student option indices directly with `correct_answer` integers for MCQ and True/False questions, computing percentage scores and pass flags while removing deprecated open-ended logic.

**Blocked by:** 03: Zero-Index Option Guard & Type Defense

**Status:** completed

- [x] Compare `(int) $userAns === (int) $q['correct_answer']` strictly.
- [x] Calculate score based on total gradable questions.
- [x] Remove legacy `type: open` and pending state branches.
- [x] Return deterministic grading results with question feedback.
