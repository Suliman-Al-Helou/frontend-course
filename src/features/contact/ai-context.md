# Contact Vertical Slice (`src/features/contact/`)

## Architectural Anchor & Responsibility
This slice provides the unified public and in-app contact mechanisms, inquiry forms, and support communication channels across the platform.

## Directory Structure
```
src/features/contact/
├── api/
│   └── index.ts              # Pure fetch call to external message endpoint (Formspree)
├── constants.ts              # Canonical support channels (WhatsApp, email, form endpoints)
├── hooks/
│   └── useContactForm.ts     # Controlled form state with concurrency lock (useRef)
├── components/
│   ├── ContactForm.tsx       # Reusable, accessible inquiry form
│   └── ContactInfo.tsx       # Direct communication channels (WhatsApp, Email, Working hours)
├── types/
│   └── index.ts              # ContactFormState, ContactMessagePayload
└── index.ts                  # Public barrel export
```

## Boundaries & Rules
- **No Double Submits**: `useContactForm` enforces an atomic submit lock via `isSubmittingRef = useRef(false)`.
- **Pure Tokens**: All components utilize semantic design tokens (`bg-card`, `text-foreground`, `border-border`, etc.).
- **Zero Duplication**: Consumed by both the public `/contact` route and the student dashboard `/dashboard/contact` (via FAQSection).

