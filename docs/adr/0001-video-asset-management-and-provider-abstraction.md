# 0001. Video Asset Management and Provider Abstraction

## Context
Lessons currently couple curriculum structure directly to YouTube by storing a naked `video_id` on the lesson record. The platform requires ingesting post-meeting Zoom recordings and local screen recordings into courses, starting with YouTube for zero-cost hosting during validation, while planning a seamless transition to secure paid hosting (e.g., Bunny Stream / DRM tokenization) without rewriting curriculum data or client-side progress tracking.

## Decision
We decouple video media from lessons by introducing a centralized `VideoAsset` entity (`id`, `title`, `provider`, `provider_playback_id`, `duration`) and an extensible frontend `ProviderAdapter` architecture. 

1. **Curriculum Decoupling**: Lessons reference `video_asset_id` (or polymorphic provider metadata) rather than vendor-specific identifiers.
2. **Pluggable Playback**: The player UI utilizes a `ProviderAdapter` pattern. The initial YouTube adapter incorporates a click-jacking interaction shield and dynamic forensic watermarking (student identity overlay) to mitigate link leakage.
3. **Frictionless Migration**: Upgrading to a paid provider later requires only registering the new provider adapter and switching the asset's provider type, leaving course models, syllabus hierarchies, and student completion hooks 100% untouched.

