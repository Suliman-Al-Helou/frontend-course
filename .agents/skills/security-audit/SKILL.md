---
name: security-audit
description: "Audits frontend and full-stack security across Next.js 16 and client interactions. Use before finalizing any PR or feature involving authentication, role guards, video playback, form mutations, or sensitive user actions."
---

# Security Audit Skill

## Purpose
Hardens the frontend application against OWASP Top 10 client risks, IDOR vulnerabilities, media scraping, and concurrency race conditions.

## When to Use
- Before completing any feature or pull request.
- Whenever implementing or altering video playback, stream tokens, or forensic watermarks.
- Whenever building or modifying forms and mutation buttons.
- Whenever configuring auth sessions, cookies, or role guards.

## Core Security Invariants

### 1. Concurrency & Double-Submit Guard
- Every mutation action (saving quiz, submitting task, updating profile, checkout) MUST use an atomic `useRef(false)` concurrency lock alongside TanStack Mutation `isPending`.
- Disable submit buttons immediately upon click to prevent double network dispatches.

### 2. Video Playback & Media Protection
- Never expose unauthenticated, raw MP4/HLS URLs in client components.
- HLS streams MUST use time-bounded signed tokens or signed cookies with strict TTL.
- Forensic Watermarking (student ID, email, IP) must be rendered in canvas/DOM with mutation-observer protection against trivial deletion in Developer Tools.
- High-frequency media events (`timeupdate`) must be throttled to at most once every 5 seconds when saving watch progress to prevent DDoS on the backend.

### 3. Cookie & Session Purity
- Never store auth tokens in `localStorage` or `sessionStorage` (XSS vulnerability).
- Auth sessions MUST rely on `HttpOnly`, `SameSite=Lax`, and `Secure` cookies.
- Server Components (`layout.tsx`, `page.tsx`) must never mutate cookies (`cookies().set()`). Mutations belong strictly in Server Actions or Route Handlers.

### 4. Client Role Guard Defense
- Frontend role checks (e.g. `user.role === 'admin'`) are purely for UI ergonomics and NEVER for security.
- The server (Laravel API and Next.js Server Components) MUST enforce independent, authoritative authorization on every request.
