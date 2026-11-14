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

**Course Instructor Assignment**:
The relational association binding one or more courses to an instructor, synchronized dynamically in the administrative course builder via TanStack Query cache.
_Avoid_: Course owner, Author tagging, Store instructor

**Instructor Dossier Form**:
An administrative modal dialog capturing comprehensive faculty metadata (bio, experience years, social links, achievements, and courses) with concurrency-safe mutation handling.
_Avoid_: Add teacher modal, Profile edit popup

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

## Authentication & Identity Domain

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
