# AGENTS.md - STRICT UI & PERFORMANCE RULES - NEVER VIOLATE

You are a Senior Frontend Engineer. Before writing ANY component, you MUST read and obey these rules. If you violate them, your output will be rejected.

## 1. Colors (STRICT)
- ALLOWED TOKENS ONLY: bg-background, text-foreground, bg-muted, text-muted-foreground, border-border, bg-primary, text-primary-foreground, bg-success.
- FORBIDDEN: Any hex (#), rgb(), bg-[#xxx], bg-blue-500, text-gray-600, gradients, glassmorphism, shadows, neon.
- Primary (blue) = actions ONLY. bg-success = progress/completed ONLY.

## 2. Components
- Use @/components/ui ONLY. Check /components folder before creating a new one.
- Icons: lucide-react, size 16 or 20 ONLY.
- Button: look=variant, size=size, className=layout only (w-full, ms-auto). FORBIDDEN: bg-*, text-*, rounded-*, h-* in className on Button.

## 3. Layout & Spacing
- Spacing scale: 1,2,3,4,6,8,12,16 ONLY.
- Page container ALWAYS: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Section spacing: py-12 or py-16 (landing: py-16 md:py-24)
- Cards: rounded-md border border-border bg-background, NO shadow. shadow-sm only on hover.

## 4. RTL & Performance (HIGHEST PRIORITY)
- Logical properties ONLY: ms/me/ps/pe. FORBIDDEN: ml/mr/pl/pr/left/right.
- Server Components by default. "use client" ONLY for interactivity.
- next/image ONLY with width/height. next/font ONLY.
- FORBIDDEN: backdrop-blur, large shadows, animated gradients, filters.
- Mobile First: Base classes = 375px. sm:/lg: only to enhance. Decorative images: hidden lg:block. Never priority on hidden images.



# STATE & QUERY RULES (STRICT — never violate)

## Source of Truth
- ERROR_CODES in src/lib/errors/codes.ts is the ONLY source of truth. Never create error strings inline.
- ERROR_MESSAGES_AR must have a message for every ErrorCode. Record<ErrorCode, string> will fail build if missing.
- Never write catch(() => {}) or empty catch. Every error must be mapped via mapApiError().

## Data Fetching - FORBIDDEN PATTERNS
- FORBIDDEN: useState + useEffect for server data. This is legacy and banned.
  BAD: const [data, setData] = useState(); useEffect(() => { api.get() }, [])
  GOOD: useQuery({ queryKey: [...], queryFn: ... })

- FORBIDDEN: useState for loading/error for server data.
  BAD: const [loading, setLoading] = useState(true); const [error, setError] = useState(null)
  GOOD: const query = useQuery(...); query.isPending, query.isError

- FORBIDDEN: Swallowing errors with .catch(()=>{}) - this hides 404/500 from user.

## Data Fetching - REQUIRED PATTERNS
- Every server-data hook MUST return UseQueryResult<T>, not { data, loading, error }.
  Example:
  export function useCourseDetail(id: number) {
    return useQuery({
      queryKey: ['course', id],
      queryFn: async () => { const {data} = await api.get(...); return transform(data) },
      enabled: Number.isInteger(id) && id > 0
    })
  }

- Transform logic (toArray, formatDuration) MUST be in pure function outside queryFn, not inside component.

- enrollment, progress, stats MUST be separate useQuery hooks, never useEffect inside page.

## QueryState - REQUIRED for every page
- Every page that fetches data MUST use <QueryState> component.
- FORBIDDEN: if (loading) return <Skeleton />; if (error) return <p>Error</p>
- REQUIRED:
  <QueryState query={courseQuery} skeleton={<SkeletonCard />} isEmpty={(d)=> d.length===0}>
    {(data) => <View data={data} />}
  </QueryState>

- QueryState MUST handle: 
  isPending -> skeleton
  isError && data===undefined + mapApiError() -> 404=NotFoundState, 401=AUTH_SESSION_EXPIRED + login button, else ErrorState + retry
  isEmpty -> EmptyState
  success -> children(data)

- Rule: Keep old data on background refetch failure. Check isError && data===undefined, not just isError.

## Error Mapping - REQUIRED
- All Axios errors MUST go through mapApiError() in QueryState, never show error.response.data.message directly.
- 401 handling:
  if request url includes /login or /auth -> AUTH_INVALID_CREDENTIALS
  else -> AUTH_SESSION_EXPIRED
- 403 -> SYS_FORBIDDEN, 404 -> SYS_NOT_FOUND, 5xx -> SYS_UNKNOWN, no network -> SYS_SERVER_DOWN
- 422 with fieldErrors -> SYS_VALIDATION and keep fieldErrors for form display

## State Management Separation
- Zustand: ONLY for client state (authStore, theme, ui state, accordion open). Never for server data.
- TanStack Query: ONLY for server data (courses, lessons, enrollment, stats).
- Never mix: Don't put server data in Zustand store.

## Performance
- Use enabled: flag to prevent invalid requests (id > 0, isAuthenticated, etc)
- Use retry: false for enrollment/auth checks where 401 is expected, not an error
- Use queryKey as ['entity', id] pattern, never random strings