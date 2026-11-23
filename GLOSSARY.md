# Frontend Platform & Learning Domain Glossary

Canonical domain terminology and architectural definitions governing media management, curriculum structuring, and course streaming across the frontend platform.

## Media & Video Domain

**Video Asset**:
A standalone, ingested audiovisual media item in the platform repository, decoupled from specific courses until explicitly assigned to a lesson.
_Avoid_: Lesson video, YouTube link, Video upload, Attachment

**Video Provider**:
The underlying streaming infrastructure and distribution network (e.g., YouTube, Bunny Stream, Cloudflare) responsible for video storage and playback delivery.
_Avoid_: Video host, Player type, Video server

**Session Recording**:
An archived audiovisual capture of a completed live Zoom meeting or local screen capture, ingested into the Video Asset catalog for student review and lesson assembly.
_Avoid_: Zoom call, Meeting replay, Live video

**Forensic Watermark**:
A dynamic, semi-transparent animated overlay rendered continuously over active playback displaying the authenticated student's identity (email, user ID, timestamp) to deter unauthorized screen capture and distribution.
_Avoid_: Logo, Brand stamp, Static watermark

**Provider Adapter**:
An abstraction layer within the player architecture that normalizes events, progress tracking, and security controls across heterogeneous video streaming providers without coupling the curriculum domain.
_Avoid_: Player wrapper, Embed component, Iframe hook

**Segmented Pipeline View**:
A clean, dual-view navigation control dividing administrative media workflows between live interactive conferences (Zoom) and asynchronous media assets (Video Bank), adhering to the minimalist surface rule.
_Avoid_: Tab soup, Double page, Mega view

**YouTube Integration Status Indicator**:
A compact, non-intrusive status pill embedded directly within the video bank header conveying live OAuth connection state, channel identity, and re-authentication triggers.
_Avoid_: Big banner, OAuth card, Promo box

**Attendance Roster Drawer**:
An on-demand expandable panel revealing verified participant attendance timestamps and student identities for an active or concluded live meeting.
_Avoid_: Attendance table, Zoom popup, Log viewer

## Meetings & Live Interaction Domain

**Live Meeting**:
A time-bounded, scheduled interactive video conference event conducted via Zoom with an associated live link and student attendance tracking.
_Avoid_: Class, Lecture, Webinar, Zoom call

**Video Bank**:
The administrative catalog of all uploaded and verified media assets, categorized by course association and available for curriculum assignment or recording review.
_Avoid_: Upload list, Media folder, Videos page

## Ingestion & Pipeline Domain

**Chunked Upload**:
The process of dividing a large video file into small sequential chunks in the browser and uploading them progressively to ensure fault tolerance and prevent network timeouts.
_Avoid_: Direct upload, Multipart form, File streaming

**Course YouTube Playlist**:
An unlisted playlist generated automatically on the platform's connected YouTube channel for each course, housing its video assets in sequence.
_Avoid_: Video folder, YouTube list, Channel category

**Curriculum Asset Binding**:
The single-click operation of converting an uploaded course video asset into a structured lesson within a designated course section.
_Avoid_: Link pasting, Lesson attachment, Manual entry

## Instructors & Academic Faculty Domain

**Instructor Profile**:
A dedicated academic faculty entity representing an instructor's public biography, teaching credentials, student ratings, and catalog of assigned courses.
_Avoid_: Teacher card, Coach info, Tutor account

**Display-Only Instructor Profile**:
A public faculty entity created for catalog presentation, guest lecturers, or marketing purposes without an authenticated system login account (`user_id = NULL`), whose courses are directly stewarded by platform administrators.
_Avoid_: Fake instructor, Dummy profile, Ghost account, Unlinked teacher

**Managed Instructor Profile**:
An active faculty profile linked deterministically in a strict 1-to-1 relationship to an authenticated user account (`user_id != NULL` and unique), granting that user exclusive access to the instructor workspace to manage assigned curriculum and teaching media.
_Avoid_: Real instructor, Linked user, Active teacher, Multi-profile user

**Admin Fallback Custody**:
The default administrative ownership state assumed over a course when its assigned instructor profile is unlinked or deleted, ensuring uninterrupted operational continuity without orphan course state.
_Avoid_: Orphan course, Unassigned lock, Dead course

**Course Instructor Assignment**:
The relational association binding one or more courses to an instructor, synchronized dynamically in the administrative course builder via TanStack Query cache.
_Avoid_: Course owner, Author tagging, Store instructor

**Self-Service Instructor Profile Workspace**:
The dedicated frontend settings tab within the instructor portal allowing authenticated faculty to independently author, customize, and maintain their public academic dossier (bio, specializations, avatar, social handles, achievements) without requiring administrative intervention or micromanagement.
_Avoid_: Admin teacher edit, Profile popup, User form

**Skeleton Profile Bootstrap**:
The automated backend process that instantiates a minimal instructor record (`name = user.name`, `user_id = user.id`) upon role promotion, ensuring foreign-key integrity for immediate course assignments and eliminating unlinked instructor states.
_Avoid_: Ghost init, Empty user create, Dummy profile seed

**Instructor Dossier Form**:
An administrative modal dialog capturing comprehensive faculty metadata (bio, experience years, social links, achievements, and courses) with concurrency-safe mutation handling.
_Avoid_: Add teacher modal, Profile edit popup

**Assigned Course**:
A course entity explicitly associated with an instructor, granting permissions to view and update course content, syllabus structure, and lesson tasks, while strictly withholding course deletion, pricing changes, and platform YouTube channel integration.
_Avoid_: My course, Instructor course, Owned course

**Course Content Editor**:
The instructor-facing dedicated workspace permitting updates to course informational metadata (title, description, cover image, learning outcomes, requirements) and syllabus curriculum (sections, lessons, tasks) without administrative pricing, publishing approval, or deletion controls.
_Avoid_: Admin modal, Course form, Course settings

**Lesson Mission (Task)**:
An interactive questionnaire or evaluation task attached directly to a specific lesson to verify student comprehension before advancing.
_Avoid_: Homework, Test, Quiz card

**Course Media Workspace**:
The instructor workspace tab dedicated to ingesting and managing raw video assets into an assigned course's playlist prior to curriculum assignment.
_Avoid_: Upload page, Media center, File manager

**Two-Way Video Ingestion**:
The dual-path video workflow enabling instructors to either stage raw video files into the course playlist for later use or attach an existing playlist video directly to an active lesson.
_Avoid_: Double upload, Mixed upload, Split video

**Prohibited Attribute Guard**:
A defensive validation constraint (`'attribute' => ['prohibited']`) implemented in instructor mutation requests that strictly forbids tampering with administrative fields (e.g., pricing, publishing status, YouTube playlist keys, instructor reassignment), terminating malicious payloads with an immediate `422 Unprocessable Entity`.
_Avoid_: Backend strip, Unset attribute, Ignored key

**Curriculum Deletion Integrity Guard**:
A backend domain barrier that blocks deletion requests (`DELETE /api/instructor/sections/{id}` or `lessons/{id}`) with HTTP `422 Unprocessable Entity` whenever students have existing completed progress records (`completed = true`), preventing accidental data loss, curriculum corruption, and skewed completion percentages.
_Avoid_: Force delete, Cascade lesson wipe, Direct delete

**Parent Traversal Authorization**:
The architectural pattern of evaluating permissions on child curriculum components (sections, lessons) by resolving and authorizing their parent course entity directly through `CoursePolicy::manageAsInstructor`, guaranteeing unified authorization rules and preventing IDOR vulnerabilities without fragmenting policy logic across multiple classes.
_Avoid_: Section policy, Lesson policy, Sub-item authorization

**Instructor Dashboard Metrics**:
The high-level aggregated performance indicators displayed on the instructor dashboard (total assigned courses, total enrolled students taught, and average course completion rate).
_Avoid_: Teacher stats, Profile counts, Quick numbers

## Student Learning Dashboard Domain

**Student Home Stats**:
The real-time aggregated metrics representing an active student's learning progress (enrolled courses, completed lessons, accumulated learning hours, and certificates).
_Avoid_: Dashboard numbers, Student metrics, User counts

**Monthly Zoom Schedule**:
The temporal aggregation of live conference sessions scheduled across visible months in the student dashboard interactive calendar.
_Avoid_: Meeting list, Zoom calendar data, Session slots

## Frequently Asked Questions (FAQ) Domain

**FAQ Pair**:
A structured informational entry comprising a canonical user query and an authoritative editorial response, rendered across public landing accordions and maintained via administrative CRUD.
_Avoid_: Help item, Accordion text, Question box

**FAQ Ordering**:
The deterministic sequence index governing the display order of FAQ pairs on the public landing page.
_Avoid_: Priority, Rank, Position number

## Contact & Support Inquiries Domain

**Inquiry Dispatch**:
The secure, concurrency-guarded transmission of a visitor or student support message via the platform's external gateway or direct WhatsApp communication link.
_Avoid_: Contact post, Feedback send, Form submit

**Enrolled Course Selector**:
A reactive dropdown component dynamically populated from the active student's approved enrollments cache (`studentCourseQueries.enrolled()`) via query selection, avoiding redundant network round-trips.
_Avoid_: Course picker, Filter select, Course list box

## Feedback & Notifications Domain

**Feedback Notification (Toast)**:
A transient, non-modal status message presented to the user to acknowledge asynchronous mutations, API outcomes, or system alerts without interrupting page navigation.
_Avoid_: Popup, Alert dialog, Banner, Custom flash message

**Notification Viewport (Toaster)**:
The single root container mounted in the root layout responsible for stacking, positioning, theme synchronizing, and auto-dismissing active feedback notifications.
_Avoid_: Toast container, Alert box, Toast wrapper

**Domain Feedback Code**:
A typed error or success code emitted by the backend or business logic that maps deterministically to a localized Arabic message in the application's translation dictionary.
_Avoid_: Hardcoded string, Raw API error, Backend message

## Curriculum & Course Administration Domain

**Curriculum Video Picker**:
An interactive, search-enabled modal dialog within the lesson creation workflow allowing administrators to preview, filter, and select videos directly from the course's synchronized YouTube playlist, automatically populating the lesson's title, video ID, and duration.
_Avoid_: Video dropdown, YouTube selector, Lesson modal iframe

**Task Question Contract**:
The canonical, strictly typed JSON data structure governing auto-graded Multiple Choice (MCQ) and True/False questions within `tasks.questions`, defining `id`, `type`, `question`, `options`, zero-based `correct_answer` index, and optional `explanation`.
_Avoid_: Freeform questions, Custom quiz JSON, Untyped task blob

**Lesson Publication State**:
The binary lifecycle status of a curriculum lesson (`is_published`, defaulting to true upon creation) determining student catalog visibility and playback access, permitting instructors to draft lessons prior to finalizing media.
_Avoid_: Hidden lesson, Course status, Lesson flag

**Video Delivery Driver**:
A pluggable backend abstraction implementing the Strategy/Manager pattern that resolves playback payloads and signed streaming URLs according to the environment default provider (YouTube during MVP, switching to Bunny.net HLS at the Launch Gate without code changes).
_Avoid_: Player component, Hardcoded embed, YouTube switch

**Ghost Reference Guard**:
An automated lifecycle protection mechanism executed during user soft-deletion or role demotion that disassociates `user_id` on linked instructor profiles to `NULL`, preventing orphan references to defunct user accounts.
_Avoid_: Orphan cleanup, Manual unlink, Broken relation

**Bidirectional Role Invariant**:
The architectural guarantee that a user holds the `instructor` role if and only if they are actively linked to an instructor profile, enforced automatically by both profile mutations and direct user role modifications.
_Avoid_: Loose role, Dangling permission, Unsynchronized role

**Assigned Video Marker**:
A contextual status badge and muted visual style applied to videos within the Curriculum Video Picker that are already assigned to existing lessons in the course, preventing duplicate lesson creation while preserving a complete overview of the playlist.
_Avoid_: Used badge, Disabled row, Grey card

**Educational Metadata**:
The subset of pedagogical and informational course properties (title, description, cover image, difficulty level, learning outcomes, requirements, target audience) authored and updated by instructors in real time, segregated from administrative and financial parameters.
_Avoid_: Course details, Course settings, Course config

**Commercial Course Attributes**:
Protected financial, publication, and administrative course properties (`price`, `status`, `is_public`, `instructor_id`, `rating`, `is_popular`, `youtube_playlist_id`) governed exclusively by platform administrators and strictly immune to instructor mutation.
_Avoid_: Course money, Course state, Admin flags

**Course Activity Log**:
An append-only, immutable historical audit trail recording discrete educational and structural modifications to a course, capturing before-and-after attribute diffs, acting user identity, timestamps, and network IP addresses for forensic accountability.
_Avoid_: System log, Error log, History table, Course tracking

**Silent Attribute Stripping**:
A defensive API security pattern wherein incoming unauthorized, commercial, or privileged fields in mutation payloads are silently discarded by the validation whitelist without returning error statuses, preventing attacker probing while fulfilling legitimate educational updates.
_Avoid_: Silent fail, Hidden error, Ignored input

**Playlist Batch Hydration**:
A backend aggregation pattern that fetches playlist items and executes a single batched `videos:list` call for up to 50 video IDs, minimizing YouTube Data API v3 quota consumption to exactly 2 units while resolving full content details and ISO 8601 durations.
_Avoid_: Loop fetch, Single video API call, Direct frontend API call

**Authenticated Session**:
A server-minted, cryptographically sealed state housed within an HttpOnly cookie and synchronized in the client via TanStack Query (`authQueries.user()`).
_Avoid_: LocalStorage token, User store, Client session, Zustand auth

**Session Hydration**:
The zero-latency transfer of authenticated user identity from Server Components (Root Layout) into the client TanStack Query cache without triggering client-side network round-trips or layout shifts.
_Avoid_: Auth bootstrap, User fetching, Page load check

**Encrypted Session Cookie**:
An AES-GCM encrypted HTTP-only cookie payload containing the backend bearer token and minimal user claims, impenetrable to client-side JavaScript execution to mitigate XSS attacks.
_Avoid_: JWT in localStorage, Raw token cookie, Frontend auth header

**Post-Login Redirection Target**:
A strictly sanitized relative URL resolving the post-authentication destination based on user role and query parameters, guarded against open-redirect vulnerabilities.
_Avoid_: Callback URL, Absolute redirect, Return url

## Admin Users & Students Domain

**Student Profile Dossier**:
A unified administrative modal presenting a student's personal details, registration metadata, and a comprehensive breakdown of all associated course enrollments with real-time revocation controls.
_Avoid_: Student popup, User edit form, Details view

**Enrollment Revocation**:
The administrative action of revoking a student's access to a course by toggling enrollment status to `rejected` and disabling payment confirmation, preserving the audit trail without hard-deleting database records.
_Avoid_: Course delete, Remove student, Unenroll

**Dynamic Verification Challenge**:
A strict confirmation requirement (such as explicitly typing the student's email/name or an on-screen code) that an administrator must satisfy before executing high-risk destructive mutations, modeled after GitHub repository deletion safety.
_Avoid_: Admin PIN, Password prompt, Native confirm dialog

**Self-Action Guard**:
A programmatic barrier preventing the actively authenticated administrator from deleting their own account or modifying their own administrative privileges.
_Avoid_: Self-delete check, Admin lock

## Progression & Assessment Domain

**Dual-Requirement Progression**:
An educational progression rule where lessons with attached tasks require satisfying both watch threshold ($\ge 80\%$) and full task submission before marking the lesson complete and unlocking subsequent syllabus items.
_Avoid_: Simple watch completion, Quiz skip, Video-only progress

**Formative Task Completion**:
Advancing student progression upon full and valid submission of all task questions, leaving subsequent attempts to the student to improve diagnostic mastery without stalling course momentum.
_Avoid_: Pass-or-blocked, Hard exam gate, Summative lockout

**Task Unlock Gate**:
The intermediate threshold ($\ge 80\%$ video watch) that permits an enrolled student to view and submit the lesson's task without prematurely unlocking subsequent lessons in the curriculum.
_Avoid_: Lesson unlock, Video pass, Quiz reveal

**Zero-Index Option Guard**:
A strict numeric and type validation pattern preventing PHP falsy evaluations of option index `0` from misclassifying first-option answers as missing or blank submissions.
_Avoid_: Empty check, Truthy check, Loose null check

## Delivery, Roles & Faculty Shell Domain

**Video Playback Payload**:
A discriminated union contract (`provider: 'youtube' | 'hls'`) providing secure, driver-resolved streaming parameters (`source` or `url`) and temporal validity bounds (`expires_at`), preventing leakage of raw cloud storage assets.
_Avoid_: Video link, Stream object, Video info

**Authorized Playback Gate**:
A security boundary within the video delivery layer ensuring that full streaming playback payloads are never exposed to public curriculum viewers or unauthorized learners, restricting payload resolution strictly to authorized lesson viewing sessions or preview lessons.
_Avoid_: Public video leak, Global stream url, Open playback

**Instructor Route Shell**:
The dedicated Next.js layout and navigation structure (`(instructor)`) isolating authenticated faculty workflows (dashboard, assigned courses, support) behind server-side role verification.
_Avoid_: Teacher tab, Admin subpage, Faculty view

**Pluggable Video Delivery Driver**:
A backend strategy pattern decoupling lesson entities from specific streaming infrastructure, dynamically resolving YouTube or signed HLS URLs based on lesson configuration with a global environment fallback.
_Avoid_: Hardcoded player, YouTube helper, Video switch
