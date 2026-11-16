# ADR 0013: Curriculum YouTube Playlist Picker and Batch Hydration Architecture

## Status
Accepted

## Context
Administrators curating course curriculums need to attach YouTube videos to individual lessons. Previously:
1. Lesson creation in `SectionAccordion.tsx` relied on manual copy-pasting of YouTube video URLs or raw video IDs, or a basic `<select>` referencing locally uploaded `VideoAsset` records.
2. Ingesting videos already organized on YouTube required manually creating each lesson, guessing durations, and typing titles.
3. YouTube Data API v3 enforces a daily quota (10,000 units). Fetching playlist items (`playlistItems.list`) provides video IDs and titles, but lacks duration details. Fetching durations individually per video would rapidly exhaust the daily quota.
4. When a course has no playlist attached, previous UI provided no immediate remediation path, forcing users away to YouTube or course edit forms.

## Decision
1. **Backend Batch Hydration Endpoint**:
   - Provide `GET /api/admin/courses/{course}/youtube-videos` in `backendCourse`.
   - Implement `YouTubeService::getPlaylistVideos` which uses a 2-stage batch query:
     - `playlistItems.list` (up to 50 items) = 1 quota unit.
     - `videos.list` with comma-separated IDs (batch of up to 50) = 1 quota unit.
     - Total: exactly 2 units per 50 videos.
   - Parse ISO 8601 duration (`PT14M35S`) into both formatted string (`14:35`) and rounded minutes (`15`) for seamless compatibility with the database schema.
   - Cache results server-side for 10 minutes, with optional `?refresh=1` bypass.
   - Compare playlist video IDs against existing course lessons to flag `is_already_added`.
2. **On-Demand Playlist Provisioning**:
   - Provide `POST /api/admin/courses/{course}/youtube-playlist` to create an unlisted playlist on YouTube in one click using `createCoursePlaylist`.
   - Allow updating `youtube_playlist_id` in course update requests.
3. **Curriculum Video Picker (Option A)**:
   - Provide `CurriculumVideoPickerModal.tsx` in `src/features/admin-courses/components/sections/`.
   - Render video cards with thumbnail, title, formatted duration (`mm:ss`), and published date.
   - Apply `Assigned Video Marker` (de-emphasized style and badge) to videos already added as lessons.
   - Clicking an available video automatically populates lesson title, video ID, and rounded duration, then smoothly closes the modal.
   - For courses without playlists, present a clean empty state with one-click automatic playlist creation and a manual playlist ID linking field.

## Consequences
- **Positive**:
  - Zero quota wastage (2 API units per 50 videos).
  - Rapid lesson creation workflow without manual typing or tab switching.
  - Zero disruption to existing `lessons` table schema (duration remains integer minutes).
  - High resilience: zero dead-end states when a course playlist is missing.
