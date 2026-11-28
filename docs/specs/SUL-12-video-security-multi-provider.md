# [Phase 3] Video Security, Metadata Protection & Multi-Provider Architecture (SUL-12)

> **Status**: Completed (2026-11-28)

## Problem Statement
Raw video links and names are exposed in API responses and DOM/Network inspection, YouTube MVP videos lack sharing/downloading protections, and the platform needs to support switching between YouTube, Protected (HLS), or both per company/course.

## Solution
Serve protected streams through ephemeral signed proxy URLs with opaque lesson identifiers and hidden metadata, harden YouTube MVP embeds with privacy-enhanced mode and a Click-Shield overlay, and introduce a per-company video provider setting with optional per-course overrides.

## User Stories
1. As a platform owner, I want only the authenticated, enrolled student to access their own video stream, so that unauthorized users cannot watch or redistribute content.
2. As a platform owner, I want raw video URLs, filenames, and metadata hidden from DOM attributes and network responses, so that scraping and casual downloading are prevented.
3. As a platform owner, I want YouTube MVP embeds protected against casual sharing and downloading, so that MVP courses remain secure.
4. As an admin, I want to configure the video provider per company (YouTube-only, Protected/HLS-only, or both) with optional per-course overrides, so that different clients can use their preferred delivery mode.

## Implementation Decisions
- Stream & link security: Issue ephemeral signed proxy URLs (`/api/stream/{token}`) bound to the authenticated student session, and use opaque lesson IDs in the DOM.
- Metadata obfuscation: Return opaque titles/slugs in the API and omit raw filenames/URLs from DOM attributes.
- YouTube MVP protection: Use `youtube-nocookie.com` IFrame API with Click-Shield overlay, `disablekb`, and `modestbranding`.
- Multi-provider architecture: Store a per-company (tenant) video provider setting in the database (`youtube`, `protected`, or `both`) with an optional per-course override.

## Testing Decisions
- Test at the highest seams:
  - Backend API tests: Verify signed stream token generation, expiration, and rejection of unauthenticated/non-enrolled students, plus company/course provider resolution.
  - Frontend player tests: Verify YouTube vs Protected/HLS provider switching and absence of raw video URLs/filenames in rendered DOM.

## Out of Scope
- DRM (Widevine/FairPlay) hardware-level encryption.
- Lesson access gating (Phase 1 / SUL-10) and HLS.js buffering/caching (Phase 2 / SUL-11).
