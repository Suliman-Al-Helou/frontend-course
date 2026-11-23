# Spec: Phase 5 — Frontend Shell, Role Guards & VideoDelivery Playback Contract

**Status**: Ready for Implementation  
**Triage Label**: `ready-for-agent`  
**Parent Roadmap**: [Wayfinder Map](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/map.md)  
**Associated Ticket**: [Ticket 05: Phase 5](file:///home/suliman/Documents/courses/frontend-course/docs/wayfinder/05-frontend-shell-and-playback-contract.md)  
**Governing Architectural Decisions**:
- [ADR 0016: Instructor CoursePolicy and IDOR Prevention](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0016-instructor-course-policy-and-idor-prevention.md)
- [ADR 0017: Pluggable Video Delivery Driver](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0017-video-provider-driver-and-curriculum-publication-contract.md)
- [ADR 0021: Discriminated Video Playback Contract, Secure Delivery Gating, and Instructor Route Shell](file:///home/suliman/Documents/courses/frontend-course/docs/adr/0021-discriminated-video-playback-and-instructor-route-shell.md)

---

## Problem Statement

As the platform scales to support multi-provider video delivery (migrating from embedded YouTube videos to signed, encrypted HLS streaming) and introduces dedicated faculty access for instructors:

1. **Information Leakage via Public Curriculum Queries**:
   - `CourseDetailResource` serializes the full course syllabus for prospective students and visitors.
   - Without an **Authorized Playback Gate**, private or signed video sources risk being leaked to unauthorized users inspecting the API payload before enrollment or purchase.
2. **Behavioral Inconsistency in Lesson Details**:
   - `GET /api/lessons/{lesson}` (`LessonController::show`) historically returns a raw, ad-hoc JSON array instead of the canonical `LessonResource`.
   - Consequently, the student player cannot consume the polymorphic `playback` payload, and draft lessons (`is_published = false`) are not shielded by an explicit 404 gate.
3. **Rigid YouTube-Coupled Frontend Player**:
   - The frontend `VideoPlayer.tsx` is hardcoded to `react-youtube`, incapable of rendering `.m3u8` HLS streams.
   - When switching between lessons, internal player state and watch percentages leak into subsequent lessons.
   - Crucial security layers (dynamic Forensic Watermark) and progress tracking are not unified across streaming providers.
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
   - Return `playback: null` in curriculum listings unless the lesson is a preview (`is_preview = true`). Full playback payloads are delivered JIT via `GET /api/lessons/{lesson}` to authorized students, course instructors, or administrators.
3. **Canonical Serialization & Draft Guard**:
   - Refactor `LessonController::show` to return `new LessonResource($lesson)`.
   - Enforce that `is_published = false` triggers `404 Not Found` for unprivileged learners.
4. **Dual-Engine Video Player (`VideoPlayer.tsx`) & Edge-Case Defenses**:
   - Support `playback: VideoPlaybackPayload | null` with fallback `videoId`.
   - Mount with `key={lesson.id}` in parent page ensuring complete React unmounting and state reset across lessons.
   - Use `lesson.id` / `playback` as primary dependency in `useEffect` with an `isCancelled` lifecycle guard.
   - Automatic recovery for HLS token expiration mid-stream via query cache invalidation.
   - Deterministic resource teardown (`hls.destroy()`, player cleanup).
   - Uniform forensic watermark overlay and accessible processing/upload placeholder.
5. **Server-Side Instructor Route Guard & Client Shell**:
   - Extend `User.role` in `src/types/index.ts` to `"admin" | "student" | "instructor"`.
   - Update `src/lib/auth-helpers.ts` to redirect `instructor` to `/instructor`.
   - Update `src/app/(admin)/layout.tsx` to redirect `instructor` to `/instructor`.
   - Create `src/app/(instructor)/layout.tsx` with server-side `getIronSessionData()` guard and live session revalidation.
   - Build `src/app/(instructor)/InstructorLayoutClient.tsx` and `src/app/(instructor)/page.tsx` adhering to `DESIGN.md` tokens.

---

## User Stories

1. As an enrolled student, I want to watch lessons hosted on either YouTube or HLS seamlessly, so that my learning experience is uninterrupted by technical distribution changes.
2. As a platform visitor browsing a course catalog, I want to watch free preview lessons directly from the curriculum view, so that I can evaluate course quality before enrolling.
3. As a course creator, I want my premium locked lesson videos protected from scraping in public syllabus responses, so that unauthorized users cannot download my intellectual property.
4. As an enrolled student, I want my personal identity (name, email) displayed in an animated watermark over active video playback, so that intellectual property rights are protected and screen recording is deterred.
5. As an enrolled student navigating between consecutive lessons, I want the player progress and completion status to reset completely for each new lesson, so that I never receive false premature completion credit.
6. As an enrolled student watching a long lecture on HLS, I want the player to automatically recover and refresh its stream if the signed URL expires while paused, so that I don't lose my place in the lesson.
7. As an enrolled student, I want to see an informative and clear placeholder if a lesson video is currently uploading or processing, so that I understand why playback is temporarily unavailable.
8. As an enrolled student, I want draft lessons created by instructors to be completely hidden from my curriculum, so that I am not confused by unfinished content.
9. As an unprivileged student guessing a lesson ID of a draft lesson, I want the server to return 404 Not Found, so that I cannot inspect or access unreleased course content.
10. As an authenticated instructor, I want to view my draft lessons in the curriculum with a draft indicator, so that I can preview and test content before public release.
11. As an authenticated instructor logging in, I want to be redirected automatically to `/instructor`, so that I immediately access my teaching workspace.
12. As an authenticated instructor, I want a dedicated sidebar with links to my Dashboard, Assigned Courses, and Support, so that I can manage my academic duties efficiently.
13. As an instructor newly promoted by an administrator, I want my active session recognized when I visit `/instructor` without having to manually log out and log back in, so that onboarding is frictionless.
14. As an instructor accidentally navigating to `/admin`, I want to be redirected cleanly to `/instructor`, so that I am not stranded on an unauthorized error page.
15. As an administrator navigating to `/instructor`, I want full access to view and supervise the instructor portal, so that I can assist faculty and verify layout health.
16. As a student attempting to access `/instructor`, I want to be bounced safely back to `/dashboard`, so that platform role security is maintained.
17. As an instructor with no currently assigned courses, I want to see a welcoming and encouraging empty state with guidance to contact support, so that I know what next steps to take.
18. As an instructor accessing the portal on a smartphone, I want a responsive slide-out drawer from the right with scroll-locking, so that mobile navigation matches native RTL expectations.

---

## Implementation Decisions

### 1. Discriminated Union & Schema Definition
The playback payload contract is modeled as a discriminated union:
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
- `Lesson` and `LessonDetail` interfaces in `src/types/index.ts` include `playback: VideoPlaybackPayload | null`, `video_provider: "youtube" | "hls"`, and `is_published: boolean`.
- `User.role` is extended from `"admin" | "student"` to `"admin" | "student" | "instructor"`.

### 2. Backend Authorized Playback Gate & Strategy Pattern
- Service `App\Services\Video\VideoDeliveryManager` resolves playback for a lesson:
  - Checks `$lesson->video_provider` first, falling back to `config('services.video.default') ?? 'youtube'`.
  - Determines authorization: `playback` is populated if `$lesson->is_preview === true`, or if the viewer is authenticated and enrolled, the course instructor, or an admin.
  - In general curriculum serialization (`SectionResource`), non-preview lessons evaluate `playback => null`.
- `LessonController::show` is refactored from an ad-hoc array response to `new LessonResource($lesson)`.
- If `$lesson->is_published === false`, the endpoint throws an `abort(404)` unless the user can manage the course as an instructor or admin.

### 3. Dual-Engine Video Player Architecture
- `VideoPlayer.tsx` implements:
  - If `playback?.provider === "youtube"`: renders dynamic `react-youtube`.
  - If `playback?.provider === "hls"`: renders `<video controls playsInline className="...">` and lazily imports `hls.js` when native HLS is unsupported (Chrome/Firefox Desktop/Android).
  - If `playback === null` and no fallback `videoId`: renders an accessible placeholder with `role="status"` indicating video processing.
  - Parent page mounts with `<VideoPlayer key={numericLessonId} ... />` ensuring fresh state per lesson.
  - Inner `useEffect` uses an `isCancelled` flag and cleans up player instances on unmount.
  - Watermark overlay is rendered uniformly over both video engines.

### 4. Server-Side Route Guard Matrix
- `src/app/(instructor)/layout.tsx`:
  - If no session token: redirect to `/login?redirect=/instructor`.
  - If `session.user.role === "student"`, revalidates session via `/api/auth/me`. If still student, redirects to `/dashboard`.
  - If `session.user.role === "instructor"` or `"admin"`: renders layout.
- `src/app/(admin)/layout.tsx`:
  - If `user.role === "instructor"`: redirect to `/instructor`.
  - If `user.role === "student"`: redirect to `/dashboard`.
- `src/lib/auth-helpers.ts`:
  - `resolvePostLoginRedirect` returns `"/instructor"` if `user.role === "instructor"` and no explicit redirect is supplied.

### 5. Instructor Shell UI
- `src/app/(instructor)/InstructorLayoutClient.tsx` implements:
  - Top header with logo, instructor profile name, theme toggle, and logout button.
  - Sidebar navigation links: `/instructor`, `/instructor/courses`, `/instructor/support`.
  - Mobile slide-out drawer from right (RTL) with backdrop and body scroll-lock.
  - Color palette, typography, and spacing adhering strictly to `DESIGN.md` (10% Indigo Rule, Two-Weights Rule).

---

## Testing Decisions

- **Approach**: Tests target external behavioral seams rather than implementation details.
- **Seams**:
  1. *Type & Utility Seam*: Vitest tests verifying `resolvePostLoginRedirect` with roles and open-redirect boundary attacks.
  2. *Backend HTTP Seam*: Laravel Feature tests (`tests/Feature/LessonPlaybackDeliveryTest.php`) executing full HTTP requests against:
     - Public curriculum: asserts non-preview lessons have `playback: null`, preview lessons have `playback.provider`.
     - Student single lesson view: asserts enrolled student receives `playback` payload.
     - Draft lesson: asserts guest/student receives 404, while assigned instructor receives 200.
  3. *Frontend Component Seam*: Vitest component tests verifying `VideoPlayer` rendering modes, watermark presence, and placeholder states.
- **Prior Art**:
  - `tests/Feature/LessonProgressionGatingTest.php` in backend.
  - `src/features/instructors/__tests__/` and `src/lib/__tests__/` in frontend.

---

## Out of Scope

- Cloud video transcoding, S3/Bunny webhook processors, and video file chunked uploaders (owned by Phase 7 Launch Gate).
- Curriculum lesson CRUD editor and assessment question editor for instructors (owned by Phase 6).
- Student gradebook and assignment submission evaluation inside instructor dashboard (owned by Phase 6).

---

## Further Notes

- The `hls.js` package will be loaded dynamically via `import("hls.js")` so that bundle size for YouTube-only viewing remains unaffected.
- Parent page `key={lesson.id}` pattern prevents subtle React reconciliation bugs across consecutive video playbacks.
