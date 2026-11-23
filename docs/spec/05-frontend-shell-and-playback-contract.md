# Spec: Phase 5 — Frontend Shell, Role Guards & VideoDelivery Playback Contract

**Status**: Ready for Implementation  
**Triage Label**: `ready-for-agent`  
**Parent Roadmap**: [Wayfinder Map](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/map.md)  
**Associated Ticket**: [Ticket 05: Phase 5](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/05-frontend-shell-and-playback-contract.md)  
**Governing Architectural Decisions**:
- [ADR 0016: Instructor CoursePolicy, IDOR Prevention Boundary, and Centralized Parent Traversal](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0016-instructor-course-policy-and-idor-prevention.md)
- [ADR 0017: Video Provider Driver and Curriculum Publication Contract](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0017-video-provider-driver-and-curriculum-publication-contract.md)
- [ADR 0021: Discriminated Video Playback Contract, Secure Delivery Gating, and Instructor Route Shell](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0021-discriminated-video-playback-and-instructor-route-shell.md)

---

## Problem Statement

As the platform expands to support multiple user roles and prepares for secure streaming video distribution (transitioning from YouTube embeds to encrypted HLS streaming):

1. **Information Leakage via Public Curriculum Queries**:
   - `CourseDetailResource` serializes the full syllabus for public visitors and enrolled students alike.
   - Without an **Authorized Playback Gate**, private or signed video sources risk being leaked to unauthorized users inspecting the API payload before purchase.
2. **Behavioral Inconsistency in Lesson Details**:
   - `GET /api/lessons/{lesson}` (`LessonController::show`) historically returns a raw, ad-hoc JSON array instead of the canonical `LessonResource`.
   - Consequently, the student player cannot consume the polymorphic `playback` payload, and draft lessons (`is_published = false`) are not shielded by an explicit 404 gate.
3. **Rigid YouTube-Coupled Frontend Player**:
   - The frontend `VideoPlayer.tsx` is hardcoded to `react-youtube`, incapable of rendering `.m3u8` HLS streams.
   - Crucial security layers (dynamic Forensic Watermark) and progress tracking must be decoupled so they function consistently regardless of the underlying streaming provider.
4. **Missing Instructor Route Shell & Role Segregation**:
   - The frontend lacks an isolated `(instructor)` route group with server-side authorization.
   - Users with role `instructor` lack dedicated sidebar navigation (Dashboard, Assigned Courses, Support) and suffer from broken or confusing redirects when attempting to access `/admin`.

---

## Solution

1. **Discriminated `VideoPlaybackPayload` Contract**:
   - Define and export the `VideoPlaybackPayload` union in `frontend-course/src/types/index.ts`:
     - Provider `"youtube"`: `{ provider: "youtube", source: string, expires_at: null }`
     - Provider `"hls"`: `{ provider: "hls", url: string, expires_at: string }`
   - Extend `Lesson` and `LessonDetail` with `playback: VideoPlaybackPayload | null`, `video_provider`, and `is_published`.
2. **Authorized Playback Gate in `VideoDeliveryManager`**:
   - Implement `App\Services\Video\VideoDeliveryManager` in the backend.
   - Priority: `$lesson->video_provider` > `config('services.video.default')` > `'youtube'`.
   - Return `playback: null` unless the viewer is authorized (lesson `is_preview = true` OR viewer is enrolled student, assigned instructor, or admin).
3. **Canonical Serialization & Draft Guard**:
   - Refactor `LessonController::show` to return `new LessonResource($lesson)`.
   - Enforce that `is_published = false` triggers `404 Not Found` for unprivileged learners.
4. **Dual-Engine Video Player (`VideoPlayer.tsx`) & Edge Case Defense**:
   - Support `playback: VideoPlaybackPayload | null` with fallback `videoId`.
   - **Lesson Transition Isolation**: Mount with `key={lesson.id}` in parent page (`/courses/[courseId]/lessons/[lessonId]/page.tsx`) ensuring full React unmounting and resetting of progress timers, references, and completion flags.
   - **Async Lifecycle Guard**: `lesson.id` / `playback` serves as primary dependency in `useEffect` equipped with an `isCancelled` flag to guard against stale async player callbacks.
   - **HLS Token Expiry Recovery**: When HLS encounters 403 / non-fatal playback stalls, automatically invalidate the lesson query cache and fetch a refreshed signed manifest while resuming from `last_position`.
   - **Teardown Cleanup**: Call `hls.destroy()` and clean up iframe references upon player switching to prevent background zombie audio and memory leaks.
   - When `playback === null`, render an accessible processing/upload placeholder adhering to `DESIGN.md`.
   - Wrap both engines with the uniform, animated **Forensic Watermark** and unified progress tracking.
5. **Server-Side Instructor Route Guard & Client Shell**:
   - Extend `User.role` in `src/types/index.ts` to `"admin" | "student" | "instructor"`.
   - Update `src/lib/auth-helpers.ts` to redirect `instructor` to `/instructor`.
   - Update `src/app/(admin)/layout.tsx` to redirect `instructor` to `/instructor`.
   - Create `src/app/(instructor)/layout.tsx` with server-side `getIronSessionData()` guard:
     - Permits `instructor` and `admin`.
     - Revalidates stale session cookies against `/api/auth/me` if role is `student` before redirecting to `/dashboard`.
     - Redirects guest to `/login?redirect=/instructor`.
   - Build `src/app/(instructor)/InstructorLayoutClient.tsx` and `src/app/(instructor)/page.tsx` adhering to `DESIGN.md` tokens (10% Indigo rule, two-weights rule, clean sidebar, mobile RTL drawer with scroll-lock, and welcoming empty state).


---

## Tracer Bullets (Implementation Plan)

1. **TB 01: Types & Auth Contracts**:
   - Extend `src/types/index.ts` (`VideoPlaybackPayload`, `Lesson`, `User.role`).
   - Update `resolvePostLoginRedirect` in `src/lib/auth-helpers.ts`.
   - Add comprehensive unit tests in Vitest.
2. **TB 02: Backend Delivery Manager & Serialization**:
   - Implement `VideoDeliveryManager` with driver resolution and authorized playback gating.
   - Update `LessonResource.php` to serialize `playback` and `is_published`.
   - Refactor `LessonController::show` with `is_published` 404 guard.
   - Write Laravel Feature tests verifying secure gating and payload formats.
3. **TB 03: Unified Frontend Video Player**:
   - Refactor `VideoPlayer.tsx` to accept `playback` and support YouTube, HLS, and Upload Placeholder.
   - Standardize watermark overlay and progress tracking.
   - Add component tests in Vitest.
4. **TB 04: Server-Side Route Guard Matrix**:
   - Create `src/app/(instructor)/layout.tsx`.
   - Update `src/app/(admin)/layout.tsx` and `src/app/(student)/layout.tsx`.
   - Verify server-side redirect matrix.
5. **TB 05: Instructor Shell UI & Landing Dashboard**:
   - Create `InstructorLayoutClient.tsx` and `src/app/(instructor)/page.tsx`.
   - Enforce `DESIGN.md` tokens and RTL BiDi conformance.
