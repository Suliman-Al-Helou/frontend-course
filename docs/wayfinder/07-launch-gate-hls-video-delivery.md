# Ticket 07: Phase 7 — Launch Gate: HLS Video Delivery & Production Release Checklist

**Tracker Label**: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/docs/wayfinder/map.md)  
**Status**: Ready for Launch Gate (Code Complete - Pending Keys)  
**Assignee**: Unassigned  
**Blocked by**: [Ticket 06: Phase 6 — Isolated Curriculum Tree & Auto-Graded Task Editor UI](file:///home/suliman/Documents/courses/docs/wayfinder/06-curriculum-tree-and-task-editor-ui.md)  

## Question

How do we satisfy the mandatory Launch Gate requirements by implementing a private HLS video delivery provider (e.g., Bunny.net Stream or Cloudflare Stream) with signed tokens, and executing the production go/no-go checklist before onboarding paying students?

## Acceptance Criteria

1. **HLS Provider Implementation & Signed Token Generation:**
   - Create `App\Services\Video\HlsDeliveryService.php` implementing `VideoDeliveryInterface`.
   - When generating playback payload for paid lessons:
     - Verify student has an `approved` enrollment on `$lesson->getCourse()`.
     - Generate a signed HLS `.m3u8` URL with an explicit TTL (Time-To-Live = 2 hours, bound to user IP / token hash).
     - Return:
       ```json
       "playback": {
         "provider": "hls",
         "url": "https://video.platform.com/b39d10e/playlist.m3u8?token=xyz&expires=1700000000",
         "expires_at": "2026-11-18T18:00:00Z"
       }
       ```
2. **Server-Side Authorization & Anti-Leech Protection:**
   - The token generation endpoint verifies `Gate::authorize('watchLesson', [$course, $lesson])`.
   - Direct requests to `.m3u8` or video chunks without a valid signed token return `403 Forbidden` from the CDN edge.
3. **Migration Path for Development YouTube Lessons:**
   - Artisan command `php artisan videos:audit-providers` auditing all lessons in the database.
   - Script / toolchain to ingest and transcode existing development YouTube videos into HLS video library IDs.
   - Fallback: Previews (`is_preview === true`) may optionally remain on YouTube if configured, while all paid course content is 100% migrated to HLS.
4. **Production Go/No-Go Checklist (Mandatory Sign-off):**
   - [ ] Zero unlisted YouTube video IDs are delivered for paid lessons in production environment (`APP_ENV=production`).
   - [ ] Expired HLS signed tokens (older than 2 hours) fail cleanly with token renewal prompts.
   - [ ] Student screen watermark with dynamic floating coordinates renders correctly over the HLS player.
   - [ ] End-to-end load test verifies CDN handles concurrent stream initialization without backend database spikes.
   - [ ] Formal Launch Gate approval signed off prior to accepting first student payment.
