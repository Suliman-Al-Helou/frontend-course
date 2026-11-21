# Wayfinder Map: Full-Stack Instructor Portal MVP & Security Architecture

**Tracker Label**: `wayfinder:map`  
**Status**: Active  

## Destination

Deliver an isolated, production-hardened full-stack Instructor Portal (`backendCourse` + `frontend-course`) where verified instructors manage assigned courses, curriculum, videos, and exams without administrative leakage, gated by a mandatory HLS security Launch Gate before commercial release.

## Notes

- **Domain**: Role-Based Access Control, Vertical Slice Architecture, Educational Content Management, Video Delivery Abstraction, Exam Progression.
- **Skills & Standards to Consult**:
  - `AGENTS.md`: Strict Tool-Gap Evaluator and 4-Step Impeccable UI Governance Protocol (`critique` -> `polish` -> `harden` -> `audit`).
  - [ADR 0012](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0012-contact-vertical-slice-and-dashboard-component-relocation.md): Vertical slice isolation, lib purity, and query cache unification.
  - [ADR 0014](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0014-instructor-portal-vertical-slice-and-isolated-components.md): Isolated role components architecture, zero cross-role composite component reuse.
- **Standing Invariants**:
  - **Zero IDOR**: Every `/api/instructor/*` route enforces `CoursePolicy::manageAsInstructor`.
  - **Launch Gate Invariant**: No paying students or public release until the HLS provider (with signed tokens) replaces the development YouTube driver.
  - **Double-Submit Protection**: All frontend forms and mutation handlers enforce atomic `useRef(false)` concurrency locks.

## Decisions so far

- [ADR 0015](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0015-decoupled-instructor-identity-and-display-profiles.md): Decoupled instructor identity, non-unique `user_id`, ghost/display profiles, and admin fallback custody.
- [ADR 0016](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0016-instructor-course-policy-and-idor-prevention.md): Instructor CoursePolicy, IDOR prevention boundary, and centralized parent traversal.
- [ADR 0017](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0017-video-provider-driver-and-curriculum-publication-contract.md): Pluggable video delivery driver, lesson publication state (`is_published`), and canonical `TaskQuestion` JSON contract.
- [ADR 0018](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0018-soft-delete-dissociation-and-curriculum-schema-readiness.md): Soft-delete dissociation guard, bidirectional role synchronization, and curriculum schema readiness.
- [ADR 0019](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0019-educational-metadata-updates-and-immutable-activity-audit.md): Educational metadata updates, silent commercial stripping, and immutable activity audit logging.

## Active Frontier & Ordered Tickets

1. [Phase 1: User ID Migration & Admin Instructor Linking](file:///home/suliman/Documents/courses/docs/wayfinder/01-user-id-admin-linking.md) (`wayfinder:task`, unblocked)
2. [Phase 2: CoursePolicy & IDOR Prevention Tests](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/02-course-policy-authorization.md) ([Spec](file:///home/suliman/Documents/courses/frontend-course/docs/spec/02-instructor-course-policy-and-idor-prevention.md)) (`wayfinder:task`, ready-for-agent)
3. [Phase 3: Educational Metadata Updates & Activity Audit Logging](file:///home/suliman/Documents/courses/docs/wayfinder/03-metadata-updates-activity-audit.md) (`wayfinder:task`, blocked by Phase 2)
4. [Phase 4: Server-Side Exam Gating & Atomic Progress Completion](file:///home/suliman/Documents/courses/docs/wayfinder/04-exam-gating-and-atomic-completion.md) (`wayfinder:task`, blocked by Phase 3)
5. [Phase 5: Frontend Shell, Role Guards & VideoDelivery Playback Contract](file:///home/suliman/Documents/courses/docs/wayfinder/05-frontend-shell-and-playback-contract.md) (`wayfinder:task`, blocked by Phase 4)
6. [Phase 6: Isolated Curriculum Tree & Auto-Graded Task Editor UI](file:///home/suliman/Documents/courses/docs/wayfinder/06-curriculum-tree-and-task-editor-ui.md) (`wayfinder:task`, blocked by Phase 5)
7. [Phase 7: Launch Gate — HLS Video Delivery & Production Release Checklist](file:///home/suliman/Documents/courses/docs/wayfinder/07-launch-gate-hls-video-delivery.md) (`wayfinder:task`, blocked by Phase 6)

## Not yet specified

- **AI-Powered Exam Generation**: Generating questions from video transcripts / PDFs (deferred from `01-plan.md`).
- **Instructor Revenue & Analytics Dashboard**: Commission splits, payouts, and financial reporting.
- **Student Exam Voice Submissions**: Reviewing MP3 audio answers in an instructor grading workspace.

## Out of scope

- **Direct Course Creation by Instructors**: Instructors only manage courses assigned by administrators. Self-service creation (`POST /instructor/courses`) is ruled out of MVP.
- **Server-Side Chunk Video Upload & Pruning**: Deferring local disk chunking in favor of direct browser-to-CDN uploads at the Launch Gate.
- **Open-Text Manual Grading Queue**: Kept out of MVP; initial release focuses exclusively on auto-graded MCQ and True/False questions.
