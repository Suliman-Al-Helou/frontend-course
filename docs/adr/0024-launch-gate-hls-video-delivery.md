# ADR 0024: Launch Gate HLS Video Delivery, Bunny Path-Based Token Auth, and Resilient Stream Renewal

## Status
Accepted

## Context
Before onboarding paying students (Ticket 07: Launch Gate), the platform must transition paid lesson video delivery from unlisted YouTube IDs to private, signed HLS streaming while eliminating edge-case playback failures and operational risks identified during `/grill-with-docs` review:

1. **HLS Chunk Authorization & IP Binding**: Signing only `playlist.m3u8` fails at the CDN edge because `hls.js` and Safari native `<video>` do not propagate query tokens to child variant playlists or `.ts`/`.m4s` chunks. Furthermore, binding tokens to a client IP breaks playback for students on mobile networks (4G/5G CGNAT IP rotation) and Next.js SSR/BFF requests.
2. **Production Leak Risk**: Existing `VideoDeliveryManager` used a 4-hour TTL and allowed YouTube fallback even for paid lessons in production.
3. **Token Renewal & Resume Position**: `VideoPlayer.tsx` wiped `savedTimeRef.current = 0` whenever `activeTarget` updated, resetting playback to `0:00` after token renewal, lacked a retry loop guard, and did not handle Safari native `<video>` errors when CDN clock skew rejects a token before client `expires_at`.
4. **YouTube Migration Reliability**: Server-side scraping of YouTube via `yt-dlp` is fragile due to cloud IP blocks and Bunny `/fetch` incompatibility with `youtube.com` URLs.

## Decision

1. **Bunny.net Stream with Path-Based Token Auth (No IP Binding)**:
   - Officially adopt **Bunny.net Stream** as the production HLS provider.
   - Sign directory-scoped tokens using `token_path=/{videoId}/` with an explicit **2-hour TTL** (`expires = now + 2h`) so child playlists and `.ts`/`.m4s` chunks are authorized at the CDN edge on both `hls.js` and Safari native `<video>` without a backend proxy.
   - **Explicitly omit IP binding** (`user_ip`) to prevent mid-stream `403` drops on mobile CGNAT and SSR/BFF requests; rely on `token_path`, 2-hour TTL, and the dynamic forensic watermark instead.

2. **Fail-Closed Production Guard & Strategy Refactor**:
   - Refactor `VideoDeliveryManager` to delegate to `VideoDeliveryInterface` drivers (`HlsDeliveryService` with 2-hour TTL and `YoutubeDeliveryService`), keeping `VideoDeliveryManager` as the single entry point for `LessonResource`.
   - In `APP_ENV=production`, enforce a fail-closed guard: paid non-preview lessons (`!is_preview`) without `hls` return `null` playback and log `Log::critical`, and publishing paid lessons without HLS is blocked. Free previews (`is_preview = true`) may optionally remain on YouTube.

3. **Resilient Frontend Renewal, Resume Fix & Safari Fallback**:
   - Reset `savedTimeRef.current` **only** when `lessonId` changes, never when `activeTarget` refreshes for the same lesson, preserving exact resume position across token renewals.
   - Apply a **max 1 retry** silent auto-renewal on expiration (`403` in `hls.js`, or `MEDIA_ERR_NETWORK` / `MEDIA_ERR_SRC_NOT_SUPPORTED` in Safari native `<video>` even if client `expires_at` has not elapsed). On repeated failure, stop playback and render a clean renewal prompt with a manual *"تحديث رابط التشغيل"* button.

4. **Migration & CI/CD Audit Gate**:
   - Implement `php artisan videos:import-hls` supporting both local MP4 directory upload to Bunny Stream and batch JSON/CSV mapping (`youtube_id -> bunny_guid`).
   - Implement `php artisan videos:audit-providers` as a CI/CD Launch Gate returning **Exit Code 1** if any published paid lesson (`is_published && !is_preview`) lacks `hls`, while reporting YouTube previews as `ALLOWED/WARN` and drafts as `INFO`.

5. **Load Test & Cache Isolation**:
   - Load testing covers concurrent `GET /api/lessons/{lesson}` authorization (`Gate::authorize('watchLesson', ...)`), direct Bunny CDN `.m3u8`/`.ts` edge delivery, and verification that signed URLs are never stored in any shared cache across students.
