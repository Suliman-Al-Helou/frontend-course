# 0003. Automated YouTube Playlist & Chunked Video Ingestion Pipeline

## Context
Video lessons and session recordings were previously manual or limited to entering pre-existing YouTube IDs. Users need to drag-and-drop large video files (100MB–1.5GB) directly into the admin platform, have the system upload them to their YouTube channel, automatically organize them into a course-specific YouTube Playlist, and expose those videos directly inside the course curriculum builder to convert into lessons with a single click.

## Decision
We implement a three-stage automated video ingestion architecture:

1. **Chunked Resumable Ingestion**: The client slices large video files into 5MB chunks and uploads them to a dedicated backend chunk endpoint (`POST /api/admin/video-assets/upload-chunk`) with a live progress bar. This prevents memory leaks, HTTP timeouts, and connection drop failures.
2. **Asynchronous YouTube Pipeline**: Once assembled, a queued background job (`UploadVideoToYouTubeJob`) authenticates via stored Google OAuth credentials, streams the file to YouTube as an unlisted video, and adds the new video to the course's dedicated YouTube Playlist (`youtube_playlist_id`).
3. **Curriculum Binding**: Courses store a `youtube_playlist_id`. In the course curriculum builder, uploaded course videos are displayed as ready-to-assign assets that can be converted into section lessons with a single click without manual ID copying.
