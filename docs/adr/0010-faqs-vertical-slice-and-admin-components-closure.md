# 0010. FAQs Vertical Slice and Full Closure of Legacy Admin Components

## Context

The administrative FAQ interface remained the final file residing inside the legacy `src/components/admin/` folder (`ManageFaqTab.tsx`). It relied on unmanaged `useState + useEffect` fetch loops, ad-hoc state mutations, and lacked declarative TanStack Query caching. Simultaneously, the public landing page (`FAQSection.tsx`) fetched `/faqs` via raw `useEffect` instead of unified cache queries.

This was the final barrier to eradicating the legacy `src/components/admin/` directory.

## Decision

We establish an encapsulated micro-slice: `src/features/faqs/`.

1. **Encapsulated 3-Layer Pattern**:
   - `types/`: Canonical `FaqItem` and `FaqFormData` contracts.
   - `api/`: Pure Axios functions for `/faqs` and `/admin/faqs` CRUD operations.
   - `queries/`: `faqQueries.list()` (public, staleTime 2h) and `faqQueries.adminList()` (admin, staleTime 5m) + `useFaqMutations()`.
   - `components/`: `ManageFaqTab.tsx` with accessible expanding panels, inline editing, and concurrency locks (`useRef(false)`).
2. **Elimination of Raw Fetching**:
   - `FAQSection.tsx` consumes `faqQueries.list()` with TanStack Query declarative data selection.
   - `ManageFaqTab.tsx` consumes `faqQueries.adminList()` with zero `useEffect` fetching.
3. **Complete Elimination of `src/components/admin/`**:
   - Re-route `/admin?tab=faqs` to `src/features/faqs`.
   - Delete `src/components/admin/ManageFaqTab.tsx`, `src/lib/api/faq.ts`, and `src/lib/queries/faq.queries.ts`.
   - Remove the empty `src/components/admin/` folder forever.

## Consequences

- **Pros**:
  - Complete architectural consistency across 100% of admin tabs.
  - Zero remaining legacy components in `src/components/admin/`.
  - Shared memory cache between landing page and admin mutations.
- **Cons**:
  - None.
