# 05: Instructor Shell UI & Landing Dashboard

**What to build:** Construct the faculty client shell (`InstructorLayoutClient.tsx`) and the welcome dashboard overview (`/instructor/page.tsx`). Provide clean sidebar navigation for Dashboard, Assigned Courses, and Support, adhering to `DESIGN.md` tokens (10% Indigo Rule, Two-Weights Rule). Include an RTL mobile drawer with body scroll-lock and a welcoming empty state for instructors without assigned courses.

**Blocked by:** 04: Server Route Guard & Session Revalidation

**Status:** ready-for-agent

- [ ] Create `src/app/(instructor)/InstructorLayoutClient.tsx` with sidebar navigation (`/instructor`, `/instructor/courses`, `/instructor/support`).
- [ ] Implement mobile drawer menu with RTL slide-in animation, backdrop blur, and body scroll-lock.
- [ ] Implement header with instructor identity, theme switcher, and logout trigger.
- [ ] Create `src/app/(instructor)/page.tsx` displaying a faculty overview with quick statistics, recent courses, and a helpful empty state when no courses are assigned yet.
- [ ] Enforce `DESIGN.md` token compliance (borders, colors, typography, no arbitrary classes).
- [ ] Verify keyboard accessibility, focus rings, and contrast ratios.
