# Ticket 05: Phase 5 — Frontend Shell, Role Guards & VideoDelivery Playback Contract

**Tracker Label**: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/docs/wayfinder/map.md)  
**Status**: Ready for Implementation  
**Spec**: [Spec: Phase 5](file:///home/suliman/Documents/courses/frontend-course/docs/spec/05-frontend-shell-and-playback-contract.md)  
**Governing ADRs**:
- [ADR 0016: Instructor CoursePolicy and IDOR Prevention](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0016-instructor-course-policy-and-idor-prevention.md)
- [ADR 0017: Pluggable Video Delivery Driver](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0017-video-provider-driver-and-curriculum-publication-contract.md)
- [ADR 0021: Discriminated Video Playback Contract, Secure Delivery Gating, and Instructor Route Shell](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0021-discriminated-video-playback-and-instructor-route-shell.md)  
**Assignee**: Antigravity  
**Sub-Tickets (Tracer Bullets)**:
1. [01: Discriminated Playback & Lesson Schema Contract](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-5-frontend-shell/issues/01-discriminated-playback-and-lesson-schema.md) (`ready-for-agent`)
2. [02: Role Extension & Post-Login Redirection](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-5-frontend-shell/issues/02-role-extension-and-post-login-redirection.md) (`ready-for-agent`)
3. [03: Pluggable Video Delivery Driver & Authorized Gate](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-5-frontend-shell/issues/03-pluggable-video-delivery-driver-and-authorized-gate.md) (`ready-for-agent`)
4. [04: Canonical Lesson Detail Serialization & Draft 404 Guard](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-5-frontend-shell/issues/04-canonical-lesson-detail-and-draft-404-guard.md) (`ready-for-agent`)
5. [05: Video Player Lifecycle Isolation & State Reset Guard](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-5-frontend-shell/issues/05-player-lifecycle-isolation-and-state-reset.md) (`ready-for-agent`)
6. [06: Dual-Engine Streaming Switcher (YouTube & HLS)](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-5-frontend-shell/issues/06-dual-engine-streaming-switcher.md) (`ready-for-agent`)
7. [07: Uniform Forensic Watermark, Processing Placeholder & Expiry Recovery](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-5-frontend-shell/issues/07-forensic-watermark-placeholder-and-expiry-recovery.md) (`ready-for-agent`)
8. [08: Server-Side Instructor Route Guard & Cross-Role Redirection](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-5-frontend-shell/issues/08-server-route-guard-and-session-revalidation.md) (`ready-for-agent`)
9. [09: Instructor Client Shell Navigation & RTL Mobile Drawer](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-5-frontend-shell/issues/09-instructor-shell-navigation-and-mobile-drawer.md) (`ready-for-agent`)
10. [10: Instructor Dashboard Overview & Welcoming Empty State](file:///home/suliman/Documents/courses/frontend-course/.scratch/phase-5-frontend-shell/issues/10-instructor-dashboard-and-empty-state.md) (`ready-for-agent`)


  

## Question

How do we establish the `(instructor)` Next.js route shell, extend the frontend user role system, and implement the discriminated `VideoPlaybackPayload` contract distinguishing YouTube `source` from HLS `url` across backend resources and the student video player?

## Acceptance Criteria

1. **Discriminated Playback Contract & Lesson Schema (`frontend-course/src/types/index.ts`):**
   - Document and export discriminated union and lesson attributes (per ADR 0016):
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

     export interface Lesson {
       id: number;
       title: string;
       description: string | null;
       playback: VideoPlaybackPayload | null;
       video_provider: "youtube" | "hls";
       duration: number | null;
       order: number;
       is_preview: boolean;
       is_published: boolean;
       task?: Task;
     }
     ```
2. **Backend API Playback Serialization & Pluggable Driver (`LessonResource.php`):**
   - Use `VideoDeliveryManager` resolving the driver based on `lesson.video_provider` (defaulting to `VIDEO_DEFAULT_PROVIDER`):
     ```php
     'playback' => $lesson->video_id ? [
         'provider' => $lesson->video_provider ?? 'youtube',
         'source' => $lesson->video_id,
         'expires_at' => null,
     ] : null,
     'is_published' => (bool) ($lesson->is_published ?? true),
     ```
           'provider' => 'youtube',
           'source' => $lesson->video_id,
           'expires_at' => null,
       ] : null,
       ```
3. **Frontend Video Player Switcher ([VideoPlayer.tsx](file:///home/suliman/Documents/courses/frontend-course/src/features/student-courses/components/player/VideoPlayer.tsx)):**
   - Accept `playback: VideoPlaybackPayload | null` (retaining optional `videoId` for fallback).
   - If `playback?.provider === "youtube"`: Render dynamic `react-youtube` component using `videoId={playback.source}` with dynamic floating watermark.
   - If `playback?.provider === "hls"`: Render HTML5 video container prepared for `hls.js` using `src={playback.url}`.
4. **Role Extension & Server-Side Route Guard:**
   - In `frontend-course/src/types/index.ts`: Extend `User.role` to `"admin" | "student" | "instructor"`.
   - In `frontend-course/src/lib/auth-helpers.ts`:
     - Update `resolvePostLoginRedirect()`: If `user.role === "instructor"`, return `"/instructor"`.
   - Create route group `src/app/(instructor)/`:
     - Implement `src/app/(instructor)/layout.tsx` with server-side `getIronSessionData()` guard:
       - Permits `session.user.role === "instructor"` and `session.user.role === "admin"`.
       - Redirects `student` to `/dashboard`.
       - Redirects unauthenticated users to `/login?redirect=/instructor`.
5. **Instructor Shell Client Component:**
   - Create `src/app/(instructor)/InstructorLayoutClient.tsx` with sidebar navigation (Dashboard, Assigned Courses, Help/Support), adhering to `DESIGN.md` tokens.
