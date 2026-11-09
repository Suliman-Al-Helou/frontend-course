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

