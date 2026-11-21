# Spec: Phase 1 — User ID Migration & Admin Instructor Linking

**Status**: Ready for Implementation  
**Triage Label**: `ready-for-agent`  
**Parent Roadmap**: [Wayfinder Map](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/map.md)  
**Associated Ticket**: [Ticket 01: Phase 1](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/01-user-id-admin-linking.md)  
**Governing Architectural Decisions**:
- [ADR 0014: Instructor Portal Vertical Slice and Isolated Components](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0014-instructor-portal-vertical-slice-and-isolated-components.md)
- [ADR 0015: Strict 1-to-1 Instructor Identity Linkage with Display-Only Profile Support](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0015-decoupled-instructor-identity-and-display-profiles.md)

---

## Problem Statement

Currently, platform authentication accounts (`users`) and academic faculty profiles (`instructors`) exist in disconnected states. Platform administrators have no deterministic way to associate an instructor profile with a real user login, nor can they designate guest lecturers as display-only catalog entries. This creates ambiguity around identity ownership, risks unauthenticated faculty claiming administrative privileges, and complicates course assignment workflows.

## Solution

Establish a deterministic 1-to-1 identity linkage between authenticated user accounts and instructor profiles via a nullable, unique foreign key on the faculty table. This enables two distinct faculty types:
1. **Managed Instructor Profiles**: Directly linked to an authenticated user account, automatically granting them the `instructor` role to access instructor management capabilities.
2. **Display-Only Instructor Profiles**: Unlinked public profiles (`user_id = NULL`) for guest lecturers or catalog marketing, stewarded directly under Admin Fallback Custody.

Administrators are provided with a dedicated user-linking interface within the Instructor Dossier Form, complete with debounced candidate user lookup, profile status badges, and automated role lifecycle cleanup.

## User Stories

1. As a platform administrator, I want to link a candidate user account to an instructor profile during creation, so that the user is authorized to manage their assigned academic profile.
2. As a platform administrator, I want to create a display-only instructor profile without assigning a user account, so that guest lecturers and conference speakers can appear in the catalog without platform login credentials.
3. As a platform administrator, I want to search for candidate users via a debounced autocomplete field in the instructor modal, so that I can quickly find and link students to faculty profiles.
4. As a platform administrator, I want candidate user search queries to be strictly capped to 5 results per request, so that query payloads remain fast and protected against resource exhaustion.
5. As a platform administrator, I want to unlink an existing instructor profile from its user account, so that the profile converts into a display-only profile without deleting public course metadata.
6. As a platform administrator, I want the system to reject linking an administrator account to an instructor profile, so that administrative separation of duty is strictly preserved.
7. As a platform administrator, I want the system to reject assigning an already-linked user account to another instructor profile, so that the strict 1-to-1 profile integrity rule is enforced without collisions.
8. As a platform administrator, I want the system to reject linking non-existent or soft-deleted user accounts, so that orphan or corrupted profile states cannot be introduced.
9. As a platform administrator, I want to see distinct visual badges ("حساب مربوط" vs "بروفايل للعرض فقط") on faculty cards, so that I can immediately identify which profiles have active logins.
10. As a platform administrator, I want assigned courses to be preserved under Admin Fallback Custody when an instructor profile is deleted or unlinked, so that course continuity and student enrollments are never disrupted.
11. As a platform administrator, I want form submissions and deletion actions to be guarded with concurrency locks, so that double-submits and race conditions are eliminated.
12. As a candidate user, I want to receive the `instructor` role automatically when an administrator links my account to an instructor profile, so that I gain access to instructor workspaces without manual permission toggling.
13. As a candidate user, I want my role to safely revert to `student` when my instructor profile is unlinked or deleted, so that faculty access is revoked upon contract termination.
14. As an administrative user who also has an instructor profile, I want my `admin` role preserved if my instructor profile is ever unlinked, so that I am not accidentally locked out of platform administration.
15. As a student or public visitor, I want to browse instructor profiles without sensitive internal user IDs or email addresses exposed in the response, so that user privacy and data security are maintained.
16. As a student or public visitor, I want to view display-only and managed instructor dossiers identically in public catalog pages, so that guest speaker credentials appear professional and unified.
17. As an API client, I want `GET /api/admin/users` pagination to enforce an upper limit of 20 items per page, so that heavy payloads and denial-of-service risks are prevented.

## Implementation Decisions

- **Strict 1-to-1 Schema Relationship (ADR 0015)**: The database schema introduces a nullable, unique `user_id` foreign key with `nullOnDelete()` cascading behavior on the faculty table.
- **Bi-directional Model Linkage**: 
  - User model declares a `hasOne` relationship to the instructor profile and a helper to evaluate instructor role status.
  - Instructor model declares a `belongsTo` relationship to the user model and a helper (`isDisplayOnly()`) to verify if the profile lacks an associated user account.
- **Admin Candidate Search Upper Bounds**: The administrative user listing endpoint strictly caps query limits at 20 users per page to comply with security standards.
- **Atomic Role Synchronization Service**: The instructor management domain service encapsulates role transitions:
  - Grants the Spatie `instructor` role upon linking a user.
  - Automatically reverts the user's role to `student` upon unlinking or deleting the profile, with an explicit exception guarding existing `admin` users against demotion.
- **Public vs Administrative Serialization Isolation**: Resource transformers explicitly sanitize the output:
  - Public and student catalog endpoints (`/api/instructors` and `/api/instructors/{id}`) omit `user_id` and nested `user` objects.
  - Administrative endpoints (`/api/admin/instructors/*`) include `user_id` and basic linked user summaries (`id`, `name`, `email`).
- **Admin Fallback Custody for Courses**: Course relationships to instructors retain referential stability; unlinking an instructor transfers stewardship directly to platform administrators.
- **Searchable User Picker in Instructor Dossier Modal**: The frontend form integrates a server-side debounced search input (300ms delay) requesting at most 5 candidate users from the administration query factory.
- **Visual Presentation Badges**: The administrative faculty roster displays contextual badges: primary badge for linked profiles showing the user's name, and muted badge for display-only profiles.
- **Atomic Concurrency Guards**: All modal saves and deletion confirmations enforce reference locks (`useRef(false)`) preventing duplicate network requests.

## Testing Decisions

- **Testing Philosophy**: Tests must exercise external HTTP contracts and user-facing interactions without asserting internal Eloquent event hooks or implementation details.
- **Modules Tested**:
  - Administrative Instructor HTTP Controller and Validation Form Requests (`/api/admin/instructors`).
  - Administrative User Search and Pagination Endpoint (`/api/admin/users`).
  - Public Instructor Catalog Endpoints (`/api/instructors`).
  - Frontend Instructor Form Modal and Administrative Roster components.
  - TanStack Query cache invalidation policies for faculty keys.
- **Prior Art**:
  - Backend feature tests: `tests/Feature/Admin/AdminRefactorTest.php` and `tests/Feature/Admin/InstructorUserLinkingTest.php`.
  - Frontend query test suite: `src/features/instructors/__tests__/instructor-queries.test.ts`.

## Out of Scope

- Multi-persona faculty profiles (a single user account owning multiple instructor identities) — explicitly rejected for MVP in ADR 0015.
- Self-service instructor onboarding or registration — linking is exclusively performed by administrators.
- Course curriculum, syllabus, and video management — partitioned into separate vertical slices.
- HLS signed URL delivery and token authentication — deferred to Launch Gate (Phase 7).

## Further Notes

- Resolves Ticket 01 of the Wayfinder Map.
- Prerequisite for Phase 2: CoursePolicy & IDOR Prevention Tests.
