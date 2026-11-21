# 04: Direct Cover Image Upload & Local Pruning Pipeline

**What to build:** Support for uploading new course cover images directly from the instructor's device as files (`multipart/form-data`) or maintaining existing image URLs. In `CourseService`, when an uploaded file is detected, it is stored on the `public` disk under `courses/covers/`, the course's `cover_image` path is updated, any previously stored local cover image under `courses/covers/` is safely pruned, and the path change is recorded in the activity log.

**Blocked by:** 03 (Smart Diffing, Activity Recording & Cache Invalidation Hook)

**Status:** completed

- [x] Support `cover_image` validation for both `UploadedFile` (image, mimes: jpeg, png, jpg, webp, max: 2048) and valid string URLs.
- [x] In `CourseService::updateEducationalMetadata`, store uploaded cover files in `storage/app/public/courses/covers/`.
- [x] Safely prune previous local image file from disk when replaced by a new upload.
- [x] Ensure full multipart compatibility for `PUT`/`PATCH` semantics via `_method: 'PUT'`.
