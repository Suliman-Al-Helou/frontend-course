# FAQs Feature (`src/features/faqs/`)

## 1. Domain Scope & Boundaries

### In-Scope:
- **Public FAQ Ingestion & Presentation**: Shared TanStack Query cache powering public landing page accordion questions.
- **Admin FAQ CRUD**: Inline editing, reordering, creation, and deletion of FAQ pairs in the admin panel.
- **Cache Synchronization**: Automatic cache invalidation ensuring changes in the admin tab update the landing page accordion immediately.

### Out-of-Scope:
- **Student Support Tickets / Inquiries**: Handled via direct messaging or contact forms.
- **Course-Specific FAQs**: Currently mapped within general platform FAQs.

---

## 2. Backend Contracts & Endpoints

| Method | Endpoint | Description | Payload / Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/faqs` | Public listing of published FAQs | `FaqItem[]` |
| `GET` | `/admin/faqs` | Administrative list of all FAQs | `FaqItem[]` |
| `POST` | `/admin/faqs` | Create new FAQ pair | `FaqFormData` -> `FaqItem` |
| `PUT` | `/admin/faqs/:id` | Update FAQ question/answer | `Partial<FaqFormData>` -> `FaqItem` |
| `DELETE`| `/admin/faqs/:id` | Delete FAQ item | `void` |

---

## 3. Strict Rules & Architectural Guidelines

1. **Strict 3-Layer Pattern**: Always query through `faqQueries.list()` or `faqQueries.adminList()`.
2. **Concurrency Locks**: Guard mutations with `useRef(false)` locks.
3. **No Lingering Bridges**: Replaces legacy `src/components/admin/ManageFaqTab.tsx` and legacy lib endpoints.
