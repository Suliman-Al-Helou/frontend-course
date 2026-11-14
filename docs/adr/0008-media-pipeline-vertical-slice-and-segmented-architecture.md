# 0008. Media Pipeline Vertical Slice and Segmented Architecture

## Context

The administrative live sessions and video assets were previously bundled inside `src/components/admin/ManageZoomTab.tsx` (~758 lines, 35KB) with sub-modals `VideoAssetModal.tsx` (~33KB) and `ZoomMeetingModal.tsx` (~13KB). Data queries and mutations were temporarily located inside `features/admin-courses/`.

This setup violated:
1. **The Domain Segregation Rule**: Conflating real-time synchronized video conferences (`live-meetings`) with persisted media uploads and YouTube playlist pipelines (`video-assets`).
2. **The Minimalist Surface Rule**: Displaying both full tables, an oversized YouTube OAuth banner, and modals all in a single cluttered page with endless vertical scrolling.
3. **The 3-Layer Feature Pattern**: Missing a dedicated vertical slice directory with encapsulated `api/`, `queries/`, and `components/`.

## Decision

We establish a unified, encapsulated vertical slice: `src/features/media-pipeline/`.

1. **Subdomain Encapsulation**:
   - `live-meetings/`: Scheduled Zoom conferences, meeting links, passcodes, duration, and attendance roster.
   - `video-assets/`: Media bank catalog, video transcoding status polling, YouTube OAuth status indicator, and chunked browser upload pipeline.
2. **Minimalist Segmented Control**:
   - Instead of a single vertical page overload, `MediaPipelineTab` provides a clean segmented toggle between **اللقاءات المباشرة (Zoom)** and **بنك الفيديوهات (Video Bank)**.
   - The YouTube integration banner is redesigned into a compact status pill placed neatly inside the Video Bank header.
3. **Query Factory (`mediaPipelineQueries`)**:
   - `mediaPipelineQueries.zoomMeetings()` for live meetings.
   - `mediaPipelineQueries.videoAssets(params)` with automatic adaptive polling for items in `status === 'processing'`.
   - `mediaPipelineQueries.youtubeStatus()` for OAuth status.
   - `mediaPipelineQueries.attendances(meetingId)` for student attendance verification.
4. **Concurrency Safety**:
   - All mutations in modals enforce `useRef(false)` locks to prevent duplicate submissions or race conditions.
   - Chunked uploads support graceful cancellation via `AbortController` and token locks.
5. **No Lingering Bridges**:
   - Re-route admin tab `zoom` in `src/app/(admin)/admin/page.tsx` to `MediaPipelineTab`.
   - Delete legacy files `ManageZoomTab.tsx`, `VideoAssetModal.tsx`, `ZoomMeetingModal.tsx`.

## Consequences

- **Pros**:
  - Full domain segregation cleanly decoupling curriculum authoring from media ingestion and live conferences.
  - Zero clutter: administrators focus on either live scheduling or video bank assets with high cognitive clarity.
  - Testable isolated components with automated coverage.
- **Cons**:
  - Legacy imports in other features must be updated or re-exported from `media-pipeline`.
