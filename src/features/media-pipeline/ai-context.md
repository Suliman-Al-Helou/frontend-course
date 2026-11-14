# Media Pipeline Feature (`src/features/media-pipeline/`)

## 1. Domain Scope & Boundaries

### In-Scope:
- **Live Zoom Meetings**: Scheduling, viewing, editing, deleting interactive Zoom meetings bound to specific courses, and fetching student attendance records.
- **Video Bank Assets**: Centralized administrative catalog of recorded lessons and Zoom session replays.
- **Streaming Provider Integration**: YouTube OAuth2 connection status, authorization flow, channel disconnect, and automated playlist creation.
- **Chunked File Ingestion**: Ingesting large video files (.mp4, .webm) via resilient client-side sliced chunk uploads to the platform API.
- **Minimalist Surface**: Dual-view segmented navigation isolating Live Meetings from Video Bank assets.

### Out-of-Scope:
- **Curriculum Lesson Tree Structuring**: Handled exclusively inside `src/features/admin-courses/`.
- **Student Playback & Forensic Watermarking**: Handled inside `src/features/student-courses/`.
- **User Authentication / Permissions Check**: Handled inside `src/features/auth/`.

---

## 2. Backend Contracts & Endpoints

| Method | Endpoint | Description | Payload / Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/zoom-meetings` | List scheduled Zoom meetings | `AdminZoomMeeting[]` |
| `POST` | `/admin/zoom-meetings` | Create a Zoom meeting | `ZoomMeetingFormData` -> `AdminZoomMeeting` |
| `PUT` | `/admin/zoom-meetings/:id` | Update meeting details | `Partial<ZoomMeetingFormData>` -> `AdminZoomMeeting` |
| `DELETE`| `/admin/zoom-meetings/:id` | Delete meeting permanently | `void` |
| `GET` | `/admin/zoom-meetings/:id/attendances` | Fetch meeting attendance roster | `AttendanceRecord[]` |
| `GET` | `/admin/video-assets` | List video assets (filterable) | `AdminVideoAsset[]` |
| `POST` | `/admin/video-assets` | Create video asset record | `VideoAssetFormData` -> `AdminVideoAsset` |
| `PUT` | `/admin/video-assets/:id` | Update video asset metadata | `Partial<VideoAssetFormData>` -> `AdminVideoAsset` |
| `DELETE`| `/admin/video-assets/:id` | Delete video asset | `void` |
| `GET` | `/admin/youtube/status` | Current YouTube OAuth status | `YouTubeStatus` |
| `GET` | `/admin/youtube/auth-url` | OAuth2 Google auth URL | `{ url: string }` |
| `POST` | `/admin/youtube/callback` | Exchange OAuth code | `{ code, state }` -> `{ status, channel_title }` |
| `POST` | `/admin/youtube/disconnect` | Revoke YouTube channel link | `{ status }` |
| `POST` | `/admin/video-assets/upload-chunk` | Sliced multipart chunk upload | `ChunkUploadParams` -> `ChunkUploadResponse` |

---

## 3. Strict Rules & Architectural Guidelines

1. **Query Factory Enforcement**: Never declare raw query keys inside components. Use `mediaPipelineQueries.zoomMeetings()` and `mediaPipelineQueries.videoAssets()`.
2. **Adaptive Polling**: When any video asset has `status === 'processing'` or `status === 'uploading'`, the query automatically polls every 5 seconds until ready.
3. **Concurrency Guards**: All mutation submissions enforce `useRef(false)` locks to prevent double-submits.
4. **Minimalist Surface**: Never render both full tables simultaneously on the screen. Users navigate between **اللقاءات (Meetings)** and **بنك الفيديوهات (Video Bank)** via the segmented control.
5. **Known Debts**: Future migration to non-YouTube providers (e.g. Bunny Stream or Cloudflare Stream) will introduce new provider adapters without touching curriculum models.
