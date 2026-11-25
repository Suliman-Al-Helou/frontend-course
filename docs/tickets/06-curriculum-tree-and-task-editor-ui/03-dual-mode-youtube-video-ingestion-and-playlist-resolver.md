# 03: Dual-Mode YouTube Video Ingestion & Playlist Resolver

**What to build:**
Build `InstructorCurriculumVideoPickerModal.tsx` providing dual-mode video attachment for lessons. Mode 1 accepts any unlisted YouTube URL and extracts the 11-character video ID with regex validation. Mode 2 fetches videos from the course's linked YouTube playlist via `GET /api/instructor/courses/{course}/youtube-videos` in the backend, falling back seamlessly to Mode 1 when no playlist is linked.

**Blocked by:** 02: Curriculum Tree Sections, Lessons & Directional Arrow Ordering

**Status:** completed

- [x] Backend implements `YouTubeService::getPlaylistVideos` and registers `GET /api/instructor/courses/{course}/youtube-videos`.
- [x] `InstructorCurriculumVideoPickerModal.tsx` supports direct YouTube URL entry with instant 11-char ID extraction.
- [x] Modal displays selectable video cards when a course YouTube playlist is connected.
- [x] Fallback gracefully activates when playlist is unlinked or channel is not authenticated.
- [x] Tests verify video ID regex extraction and backend playlist route authorization.
