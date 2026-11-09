# 0002. Dedicated Video Assets Persistence vs Zoom Meetings

## Context
The platform currently has a `zoom_meetings` table tracking live scheduled sessions and user attendance. We need to introduce recorded video uploads (session recordings and course videos) to be displayed in the Zoom section and subsequently linked to courses and lessons. We evaluated merging recordings directly into `zoom_meetings` (via a nullable `recording_url` column) versus creating a dedicated `video_assets` table.

## Decision
We establish a dedicated `video_assets` table with a nullable `zoom_meeting_id` foreign key instead of overloading `zoom_meetings`.

1. **Separation of Concerns**: `zoom_meetings` models live, scheduled calendar events with start times and student attendance rosters. `video_assets` models persisted audiovisual media (provider, duration, video ID, transcoding status) capable of outliving the live event and being assigned to course lessons.
2. **Reusability in Course Creation**: Decoupled video assets allow the course curriculum builder (`CourseSectionsModal`) to query a centralized catalog of ready-to-assign videos without depending on meeting schedules.
3. **Multi-Source Support**: Supports both post-Zoom recordings and arbitrary screen/lecture uploads uniformly under the same media entity.

