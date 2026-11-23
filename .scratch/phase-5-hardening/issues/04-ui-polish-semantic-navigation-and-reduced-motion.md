# 04: UI Polish, Semantic Navigation & Reduced-Motion Hardening

**What to build:**
Harden instructor shell and overview components against accessibility and design system violations by adding `prefers-reduced-motion` guards, semantic navigation links, and design system tokens.

**Blocked by:** 01: Secure RSC Session Guard & Role Synchronization

**Status:** completed

- [x] Add `motion-reduce:animate-none` and `motion-reduce:transform-none` to drawer and overview pages.
- [x] Replace `<button>` with semantic `<Link>` components in the mobile drawer.
- [x] Replace raw `bg-white` on logo with `bg-card border border-border`.
- [x] Streamline overview stats cards to match the spec's clean empty state.
