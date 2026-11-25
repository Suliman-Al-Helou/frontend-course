# Launch Gate: HLS Video Delivery & Production Release Spec

**Triage Label**: `ready-for-agent`  
**Related Ticket**: [Ticket 07: Phase 7 — Launch Gate: HLS Video Delivery & Production Release Checklist](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/07-launch-gate-hls-video-delivery.md)  
**Related ADR**: [ADR 0024: Launch Gate HLS Video Delivery](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0024-launch-gate-hls-video-delivery.md)

---

## Problem Statement

Paying students and platform operators face security, reliability, and operational blockers before launch:
1. **Unprotected & Fragile HLS Signing**: Signing only `playlist.m3u8` leaves nested quality playlists and `.ts`/`.m4s` media chunks either unprotected or rejected with `403 Forbidden` at the CDN edge. Binding tokens to client IP addresses breaks playback on mobile networks (4G/5G CGNAT) and SSR/BFF requests.
2. **Production Leak Exposure**: The backend currently allows a 4-hour TTL and does not fail-closed when a paid lesson in production still references an unlisted YouTube ID.
3. **Broken Mid-Stream Token Renewal**: When a signed stream expires or is rejected early, the frontend player resets the student's timestamp to `0:00`, lacks an infinite-retry loop guard, and fails to detect early CDN rejection on Safari native `<video>`.
4. **Missing Migration & Audit Gate**: Operators lack a reliable toolchain to migrate existing development YouTube lessons into Bunny.net Stream HLS assets and enforce a strict CI/CD Launch Gate before accepting student payments.

## Solution

Deliver an end-to-end, production-hardened HLS delivery pipeline backed by Bunny.net Stream:
- **Backend**: Refactor the Pluggable Video Delivery Driver into `VideoDeliveryInterface` (`HlsDeliveryService` with 2-hour TTL + Path-Based Stream Token `token_path=/{videoId}/` without IP binding, and `YoutubeDeliveryService`), enforce a fail-closed production guard for paid lessons, and provide `videos:import-hls` and `videos:audit-providers` Artisan commands.
- **Frontend**: Upgrade the unified player to preserve resume position across token renewals, perform a single Silent Stream Renewal (including Safari native `<video>` error fallback) with a clean manual-renewal prompt on repeated failure, and maintain the dynamic Forensic Watermark.
- **Verification**: Validate end-to-end authorization, CDN edge delivery, shared-cache isolation, and concurrent load performance before Launch Gate sign-off.

## User Stories

1. As a paying student, I want my enrolled lesson video to stream via a signed HLS playlist and chunks, so that course content loads reliably without unauthorized public access.
2. As a paying student on mobile data (4G/5G), I want my stream token not to break when my network IP rotates mid-lesson, so that my learning session is uninterrupted.
3. As a paying student watching a long lesson (> 2 hours), I want the player to silently renew my expired Path-Based Stream Token once and resume from my exact timestamp, so that I am not bounced back to `0:00`.
4. As a paying student on Safari (macOS/iOS), I want native HLS playback errors caused by early token rejection or clock skew to trigger the same Silent Stream Renewal, so that Safari behaves identically to Chrome/Firefox.
5. As a student whose session or repeated renewal fails, I want to see a clear renewal prompt with a manual refresh button instead of a frozen black screen or infinite request loop, so that I can recover cleanly.
6. As a prospective visitor, I want free preview lessons (`is_preview = true`) to remain playable (including on YouTube if configured), while paid lessons never leak video URLs in public syllabus listings.
7. As a platform administrator, I want `APP_ENV=production` to fail-closed if any paid lesson is still configured with YouTube, so that unlisted YouTube IDs are never delivered to paying students.
8. As a platform administrator, I want an Artisan command (`videos:import-hls`) to upload local MP4 directories to Bunny.net Stream or apply a JSON/CSV `youtube_id -> bunny_guid` mapping, so that development lessons can be migrated reliably without fragile YouTube scraping.
9. As a release engineer, I want an automated CI/CD Launch Gate command (`videos:audit-providers`) that fails with Exit Code 1 if any published paid lesson lacks HLS, while allowing preview exceptions and drafts, so that production deploys are gated automatically.
10. As a platform owner, I want load testing to confirm concurrent lesson authorization and Bunny CDN edge streaming cause no backend database spikes or shared-cache leaks, so that I can sign off the Launch Gate before accepting payments.

## Implementation Decisions

### Part 1: Backend Video Delivery Strategy & Production Guard
- **Driver Abstraction**: Introduce `VideoDeliveryInterface` implemented by `HlsDeliveryService` and `YoutubeDeliveryService`, orchestrated by `VideoDeliveryManager` (preserving `LessonResource` integration).
- **Bunny Path-Based Stream Token**: `HlsDeliveryService` signs tokens with **2-hour TTL** (`expires = now + 2h`) scoped to `token_path=/{videoId}/` (URL-encoded path parameter + SHA-256 base64url signature) and **omits IP binding**.
- **Fail-Closed Production Guard**: When `APP_ENV=production`, `VideoDeliveryManager` refuses to deliver non-HLS playback for paid lessons (`!is_preview`), returning `null` and logging a critical alert (`Log::critical`). Publishing a paid lesson without an HLS provider in production is blocked.
- **Authorization Gate**: Retain `Gate::authorize('watchLesson', [$course, $lesson])` on the single-lesson playback endpoint, ensuring `approved` enrollment and lesson unlock checks execute before issuing signed tokens, with no shared-cache storage of signed URLs.

### Part 2: Migration & CI/CD Launch Gate Commands
- **Ingestion Command (`videos:import-hls`)**: Accepts either a local MP4 directory (creates video objects via Bunny Stream API, uploads files, updates lesson `video_provider = 'hls'` and `video_id = <bunnyGuid>`) or a JSON/CSV mapping file (`youtube_id -> bunny_guid`) for batch database updates.
- **Audit Gate Command (`videos:audit-providers`)**: Audits all lessons and outputs status tables:
  - Published paid lessons (`is_published && !is_preview`) without `hls` (or missing `video_id`) → `FAIL` (causes **Exit Code 1**).
  - Free preview lessons (`is_preview = true`) on YouTube → `ALLOWED/WARN` (does not fail).
  - Unpublished drafts (`!is_published`) → `INFO` (does not fail).

### Part 3: Frontend Player Resilience & Renewal UX
- **Resume Position Preservation**: Decouple `savedTimeRef` reset from `activeTarget` updates; reset `savedTimeRef` strictly when `lessonId` changes so token renewal restores exact playback position via `loadedmetadata`.
- **Single-Retry Loop Guard**: Track renewal attempts per expiration cycle (`max 1 retry`). On first expiration (`403` in `hls.js`, or `MEDIA_ERR_NETWORK` / `MEDIA_ERR_SRC_NOT_SUPPORTED` in Safari native `<video>`), trigger Silent Stream Renewal.
- **Manual Renewal Prompt**: If the single silent renewal fails or a second error occurs, halt playback and display an accessible in-player prompt (*"انتهت صلاحية جلسة الفيديو"*) with a manual **"تحديث رابط التشغيل"** action that resets the retry guard and re-fetches the lesson.

### Part 4: Pre-Launch Verification & Load Testing
- Execute end-to-end verification in staging/production-like environment:
  - Confirm direct `.m3u8` and `.ts`/`.m4s` requests without valid `token` + `token_path` return `403 Forbidden` from Bunny CDN Edge.
  - Confirm Forensic Watermark renders and moves across corners over the HLS player.
  - Run concurrent load test on `GET /api/lessons/{lesson}` + Bunny CDN edge playback, verifying zero shared-cache leakage and stable database latency.

## Testing Decisions

Good tests assert external behavior through the highest practical seam without coupling to internal helper methods or private state:
1. **Backend HTTP & Artisan Seams (Prior Art: `LessonPlaybackDeliveryTest`, `LessonProgressionGatingTest`)**:
   - Test `GET /api/lessons/{lesson}` as enrolled vs unenrolled vs preview vs production-YouTube-paid scenarios, asserting HTTP status, `playback.provider`, `token_path`, 2-hour `expires_at` window, and `null` fail-closed behavior in production.
   - Test `videos:audit-providers` and `videos:import-hls` via Laravel's `artisan()` test seam with `Http::fake()` for Bunny Stream API calls, asserting exit codes and database state.
2. **Frontend Player Component Seam (Prior Art: `VideoPlayer.edge.test.tsx`)**:
   - Render `VideoPlayer` with `hls.js` and native Safari `<video>` mocks; assert that:
     - Token renewal preserves `currentTime` instead of resetting to `0`.
     - `403` / Safari `MEDIA_ERR_NETWORK` triggers `onTokenExpired` at most once automatically.
     - Repeated failure renders the renewal prompt and manual retry button.

## Out of Scope

- Server-side `yt-dlp` scraping of YouTube videos.
- IP-bound CDN tokens or backend HLS segment proxying.
- DRM (Widevine/FairPlay) licensing server integration (deferred post-launch).

## Further Notes

- Ticket 07 remains blocked by Ticket 06 completion in the Wayfinder tracker until UI curriculum integration is finalized, though backend Parts 1–2 and frontend Part 3 can be implemented in clean, isolated PRs.
