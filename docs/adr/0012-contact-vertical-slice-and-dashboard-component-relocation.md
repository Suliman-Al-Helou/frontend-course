# ADR 0012: Contact Vertical Slice Establishment and Dashboard Component Relocation

## Status
Accepted

## Context
Prior to this architectural migration:
1. Contact functionality was fragmented across multiple locations:
   - Form submission state duplicated between `src/components/contact/useContactForm.ts` (consumed by landing FAQ section) and `src/app/(public)/contact/_hooks/useContact.ts` (consumed by public contact route).
   - Domain constants (`WHATSAPP_URL`, `SUPPORT_EMAIL`, `FORMSPREE_URL`) lived in `src/lib/contact.ts`, violating lib purity.
   - Dead commented-out code remained in `src/app/(public)/contact/_components/ContactFAQ.tsx`.
2. The legacy `src/components/dashboard/` directory contained:
   - `DashboardSidebar.tsx`: consumed solely by `src/app/(student)/StudentLayoutClient.tsx`.
   - `CourseFilterDropdown.tsx`: consumed by student tasks and videos pages, which implemented an antipattern (`useEffect` fetching `/my-courses` directly via axios into local `useState`, bypassing the TanStack Query cache).

## Decision
1. **Established `src/features/contact/` Vertical Slice**:
   - Encapsulated canonical constants in `constants.ts`.
   - Extracted pure HTTP post in `api/index.ts`.
   - Unified `useContactForm` hook with concurrency double-submission lock (`isSubmittingRef = useRef(false)`).
   - Provided semantic design-token-compliant `ContactForm` and `ContactInfo` components.
   - Completely deleted `src/components/contact/`, `src/lib/contact.ts`, `src/app/(public)/contact/_components/`, and `src/app/(public)/contact/_hooks/`.
2. **Relocated Dashboard Components & Purified Queries**:
   - Migrated `CourseFilterDropdown` into `src/features/student-courses/components/CourseFilterDropdown.tsx`.
   - Refactored `useEnrolledCourses` to share the primary query cache via `useQuery({ ...studentCourseQueries.enrolled(), select: ... })`, completely eliminating `useEffect` + `useState` + direct axios requests.
   - Relocated `DashboardSidebar` directly into `src/app/(student)/_components/DashboardSidebar.tsx`.
   - Completely removed `src/components/dashboard/`.

## Consequences
- **Positive**:
  - `src/components/` now holds strictly generic design system / layout presentations (`landing/`, `shared/`, `ui/`).
  - `src/lib/` contains zero feature or domain specific constants.
  - Double submit prevention across all contact forms.
  - Zero duplicate network queries for enrolled courses when students filter lessons and tasks.
  - 100% test coverage maintained (61/61 Vitest tests passing).
