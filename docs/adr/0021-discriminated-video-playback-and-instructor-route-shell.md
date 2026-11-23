# ADR 0021: Discriminated Video Playback Contract, Secure Delivery Gating, and Instructor Route Shell

## Status
Accepted

## Context
As the platform establishes the academic instructor portal (Phase 5) and prepares for secure multi-provider video streaming transitioning from YouTube to encrypted HLS (e.g. Bunny.net Stream), three critical architectural challenges were identified during `/grill-with-docs` review:

1. **Information Leakage via Curriculum Inspection**:
   - `CourseDetailResource` eager-loads `SectionResource` and `LessonResource` to present the course syllabus to prospective students and visitors.
   - If `LessonResource` indiscriminately includes signed streaming URLs or sensitive video sources in `playback` for every lesson, unauthorized viewers can scrape complete video libraries without enrolling or purchasing the course.
2. **Behavioral Divergence in Lesson Detail Resolution**:
   - `LessonController::show` (`GET /api/lessons/{lesson}`) previously returned an ad-hoc, hardcoded JSON array omitting `playback`, `video_provider`, and `is_published`.
   - Consequently, the student lesson viewing page could not access the polymorphic `VideoPlaybackPayload` contract.
   - Furthermore, draft lessons (`is_published = false`) were not guarded at the individual retrieval endpoint, creating an IDOR risk where students could view draft content if they guessed or knew the lesson ID.
3. **Cross-Role Routing & Portal Isolation**:
   - Authenticated faculty accounts (`role = 'instructor'`) require a dedicated operational workspace (`(instructor)`) segregated from platform administration (`(admin)`) and general student navigation (`(student)`).
   - Server-side route guards must prevent role misdirection: an instructor visiting `/admin` should be cleanly bounced to `/instructor`, while students attempting to access instructor tools must be redirected to `/dashboard`.

## Decision

1. **Discriminated `VideoPlaybackPayload` Contract**:
   - The frontend and backend adhere to a strict discriminated union:
     ```typescript
     export type VideoPlaybackPayload =
       | {
           provider: "youtube";
           source: string; // YouTube Video ID
           expires_at: null;
         }
       | {
           provider: "hls";
           url: string; // Signed HLS .m3u8 stream URL
           expires_at: string; // ISO 8601 expiry timestamp
         };
     ```
2. **Authorized Playback Gate (`VideoDeliveryManager`)**:
   - `VideoDeliveryManager` encapsulates playback resolution:
     - Priority: `$lesson->video_provider` (per-lesson column) > `config('services.video.default')` > `'youtube'`.
     - Security Gate: `playback` is resolved and populated **only** if:
       a) The lesson is explicitly marked as preview (`is_preview = true`), OR
       b) The current authenticated user is authorized to watch the lesson (enrolled student, course author/instructor, or platform administrator).
     - In general syllabus/curriculum listings where the viewer is unauthorized, `playback` evaluates to `null`.
3. **Unification of `LessonController::show` and Draft 404 Guard**:
   - `LessonController::show` returns `new LessonResource($lesson)` to eliminate serialization drift.
   - If `$lesson->is_published === false`, the endpoint strictly aborts with `404 Not Found` unless the viewer is an administrator or the assigned instructor.
4. **Unified Frontend Video Player Switcher**:
   - `VideoPlayer.tsx` accepts `playback: VideoPlaybackPayload | null` (with `videoId` retained for backward compatibility).
   - In parent pages, `<VideoPlayer key={lesson.id} ... />` is mounted with a unique key per lesson to force full React unmounting/remounting on lesson transitions, eliminating state leaks across lessons.
   - Inside `VideoPlayer`, `lesson.id` / `playback` is the primary dependency in `useEffect` utilizing an `isCancelled` guard for asynchronous player teardown and initialization.
   - When `playback === null` and no fallback video ID exists, it displays an informative, accessible placeholder indicating the video is processing or being uploaded.
   - For `youtube`: Dynamically loads `react-youtube`.
   - For `hls`: Renders an accessible HTML5 `<video>` container and dynamically attaches `hls.js` when necessary (for non-Safari browsers) via lazy-loading to preserve bundle performance.
   - HLS Mid-Stream Expiry: If the signed stream expires mid-watch resulting in HTTP 403, the player automatically triggers a query invalidation to fetch a fresh signed URL and resumes from `last_position`.
   - On engine transition or unmount, resources are deterministically released (`hls.destroy()`, player iframe teardown) to eliminate memory leaks and zombie audio.
   - The dynamic **Forensic Watermark** is rendered uniformly as an overlay container across both streaming engines.
5. **Role Hierarchy and Route Shell Guards**:
   - `User.role` extended to `"admin" | "student" | "instructor"`.
   - `(instructor)/layout.tsx` enforces:
     - Unauthenticated $\rightarrow$ `/login?redirect=/instructor`
     - If `session.user.role === 'student'`, perform a server-side session revalidation check against `/api/auth/me` to handle real-time role promotion before bouncing to `/dashboard`.
     - Instructor / Admin $\rightarrow$ Allowed
   - `(admin)/layout.tsx` updated:
     - If `user.role === "instructor"` $\rightarrow$ redirect to `/instructor`
     - If `user.role === "student"` $\rightarrow$ redirect to `/dashboard`
   - `(student)/layout.tsx`:
     - Allows instructors who are enrolled as learners, while post-login redirection for instructors defaults to `/instructor`.


## Consequences
- **Positive**:
  - Zero media leakage: video playback streams are strictly guarded by authorization checks.
  - Future-proof streaming: platform can switch between YouTube and Bunny.net HLS seamlessly without frontend code modifications.
  - Clean separation of administrative concerns: instructors have a dedicated, branded workspace adhering to `DESIGN.md`.
  - Type-safe contracts across the entire stack.
- **Negative**:
  - Requires maintaining `hls.js` integration in the frontend for desktop Chrome/Firefox HLS playback.
