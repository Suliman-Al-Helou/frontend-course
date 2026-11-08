# UI Rules (STRICT — never violate)

## Colors
- Use ONLY semantic tokens: bg-background, text-foreground, bg-muted,
  text-muted-foreground, border-border, bg-primary, text-primary-foreground.
- FORBIDDEN: hex values, rgb(), arbitrary values like bg-[#xxx],
  and Tailwind palette colors (bg-blue-500, text-gray-600...).
- FORBIDDEN: gradients, glassmorphism, heavy shadows, neon colors.

## Components
- Use components from @/components/ui (shadcn) ONLY. Never rebuild
  Button, Card, Input, Dialog, Tabs, Badge.
- Before creating a new component, check if one exists in /components.
- Icons: lucide-react only, size 16 or 20.

## Layout & Spacing
- Spacing scale: 1,2,3,4,6,8,12,16 only. No arbitrary values (p-[13px]).
- Page container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8.
- Section vertical spacing: py-12 or py-16.
- Cards: rounded-md border border-border bg-background, no shadow
  (shadow-sm only on hover).

## Typography
- Only the 6 defined text styles. No custom font sizes.
- Max 2 font weights per screen (font-normal, font-semibold).

## RTL / i18n
- Logical properties ONLY (ms/me/ps/pe/start/end). Never ml/mr/pl/pr/left/right.
- No hardcoded strings. Use useTranslations().

## States (every interactive component MUST have)
- hover, focus-visible ring, disabled, loading, empty, error.

## Motion
- Only transition-colors / transition-opacity, duration-150.
- No decorative animations.

## Accessibility
- Contrast AA minimum, all inputs have labels, all icon buttons have aria-label.

- Primary (blue) = actions and active states ONLY. Never decorative.
- bg-success = progress bars, completed lessons, success badges ONLY.
- Never use two saturated colors adjacent in the same component.
- Never write dark: variants for colors. Tokens switch automatically.


## Performance (STRICT)
- Server Components by default. "use client" only for interactivity.
- Images: next/image only, with width/height or fill+sizes. priority only for hero.
- Fonts: next/font only, display: "swap", subset what is needed.
- FORBIDDEN: backdrop-blur, large box-shadows, animated gradients, filters on large areas.
- No animation library for simple effects. CSS transitions only.
- Lazy load below-the-fold heavy components with next/dynamic.
- Lists with 20+ items: paginate or virtualize.




## Marketing pages (landing only)
- Larger scale allowed ONLY here: Hero H1 text-4xl lg:text-6xl font-bold; section H2 text-3xl font-bold. App screens keep the normal scale.
- Section spacing: py-16 md:py-24.
- Code: font-mono (system monospace stack, no webfont). Colors from tokens only: keywords text-primary, strings text-success, numbers text-warning, comments text-muted-foreground.
- Product preview = static HTML composed from real components (LessonRow, Progress, Badge). No images, no JS.
- Course covers: real next/image from API. Never text on top of a cover.
- Every number on the page comes from the API. No invented stats.
- Still forbidden: gradients, glass, blur, glow, shadows, emoji, stock illustrations.

## Mobile First (STRICT — highest priority)
- Mobile is the primary screen. Design and review at 375px first, then scale up.
- Base classes (no prefix) = mobile. Add sm: / md: / lg: only to enhance larger screens.
- Mobile layout may differ from desktop, not just shrink. Landing sections on mobile:
  single column, content centered (text-center, items-center), CTAs stacked full width.
  From lg: text-start and side-by-side layout.
- Decorative/secondary images are hidden on mobile (hidden lg:block). Never use `priority`
  on an image that is hidden on mobile (CSS-hidden images still download).
- Text scales by breakpoint (text-4xl lg:text-5xl). No fixed pixel widths on text
  containers: use max-w-lg / max-w-xl from the scale.

  ## Button usage
- look = variant, size = size, className = layout only (flex-1, w-full, mt-*, ms-auto).
- FORBIDDEN in className on <Button>: bg-*, border-*, text-* (color/size), rounded-*, h-*, px-*.
- Need a new look? Add a variant in button.tsx. Never style at the call site.