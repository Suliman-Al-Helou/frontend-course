# Ticket 05: Phase 5 — Frontend Shell, Role Guards & VideoDelivery Playback Contract

**Tracker Label**: `wayfinder:task`  
**Parent**: [Wayfinder Map](file:///home/suliman/Documents/courses/docs/wayfinder/map.md)  
**Status**: Open (Blocked by Ticket 04)  
**Assignee**: Unassigned  
**Blocked by**: [Ticket 04: Phase 4 — Server-Side Exam Gating & Atomic Progress Completion](file:///home/suliman/Documents/courses/docs/wayfinder/04-exam-gating-and-atomic-completion.md)  

## Question

How do we establish the `(instructor)` Next.js route shell, extend the frontend user role system, and implement the discriminated `VideoPlaybackPayload` contract distinguishing YouTube `source` from HLS `url` across backend resources and the student video player?

## Acceptance Criteria

1. **Discriminated Playback Contract (`frontend-course/src/types/index.ts`):**
   - Document and export discriminated union:
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
       duration: number | null;
       order: number;
       is_preview: boolean;
       task?: Task;
     }
     ```
2. **Backend API Playback Serialization:**
   - In `app/Http/Controllers/Api/LessonController.php` & `LessonResource.php`:
     - Replace raw `video_id` with `playback`:
       ```php
       'playback' => $lesson->video_id ? [
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
