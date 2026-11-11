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


