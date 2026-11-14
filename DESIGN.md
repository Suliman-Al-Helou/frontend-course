---
name: Future House Academy
description: المنصة العربية المتخصصة في تعليم هندسة البرمجيات والتقنية الحديثة
colors:
  primary: "#6d5ef0"
  primary-hover: "#5d4fe0"
  primary-foreground: "#ffffff"
  background: "#0c0f18"
  foreground: "#eff2f5"
  card: "#10141e"
  card-foreground: "#eff2f5"
  muted: "#161b27"
  muted-foreground: "#98a3b3"
  border: "#222939"
  ring: "#8b7cf6"
  success: "#1d8778"
  warning: "#dc8f09"
  destructive: "#dc2828"
  blue-deep: "#0d1b2a"
  blue-mid: "#2563eb"
  blue-light: "#60a5fa"
typography:
  display:
    fontFamily: "IBM Plex Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "IBM Plex Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "IBM Plex Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "IBM Plex Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  input-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "0 16px"
    height: "44px"
  card-surface:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: Future House Academy

## Overview

**Creative North Star: "The Modern Developer Sanctuary" (محراب المبرمج الحديث)**

منظومة بصرية هندسية صُممت لتقديم تجربة تعليمية برمجية رفيعة المستوى. تستلهم هويتها من واجهات بيئات التطوير المتكاملة (IDE Aesthetics) والأدوات الاحترافية للمطورين: سكون داكن مريح للعينين، إيقاع منتظم للمسافات، ونغمات أرجوانية وزرقاء (Electric Indigo & Cyber Blue) تُشير إلى التفاعل والإنجاز دون تشويش بصري.

يرتكز النظام على توفير بيئة خالية من التشتيت (Zero Visual Clutter) تتيح للطالب الاستغراق في كتابة الأكواد وفهم المفاهيم المعمارية المعقدة لساعات طويلة دون إجهاد بصري، مع الحفاظ على لغة عربية تقنية واثقة وأصيلة.

**Key Characteristics:**

- **IDE Atmosphere:** خلفيات عميقة مستوحاة من شاشات الأكواد الليلية مع تباين طبقي ناعم.
- **RTL-First Engineering:** خصائص هندسية منطقية (`ps/pe`, `start/end`) تحترم تدفق القراءة العربي وتدعم حقول الأكواد والبريد اللاتينية بسلاسة.
- **Purposeful Color Economy:** استخدام مقنن للألوان؛ اللون الأرجواني الأساسي يخدم المهام التفاعلية فقط ولا يستهلك الواجهة كخلفيات زخرفية مبتذلة.

---

## Colors

لوحة ألوان متزنة تجمع بين درجات الرمادي الداكن المطفأ (Obsidian) ونغمات النيلي الفضائي، مصممة لتحقيق تباين WCAG AA في جميع الحالات.

### Primary

- **Electric Indigo** (`#6d5ef0` بالوضع الفاتح / `#8b7cf6` بالوضع المظلم): اللون الأساسي للأزرار الرئيسية، وحلقات التركيز (Focus Rings)، والروابط النشطة.
- **Deep Hover Indigo** (`#5d4fe0` / `#7a6aee`): حالة التحويم (Hover State) لعناصر التفاعل الأولية.

### Secondary & Brand Accents

- **Cyber Blue Mid** (`#2563eb` / `hsl(var(--blue-mid))`): لون العلامة التجارية التكميلي المستخدم في بطاقات الأكواد وشارات الـ Terminal.
- **Glacier Blue Light** (`#60a5fa` / `hsl(var(--blue-light))`): تدرج مكمل لأيقونات الهوية وشعارات المسارات.

### Neutral

- **Obsidian Canvas** (`#ffffff` بالوضع الفاتح / `#0c0f18` بالوضع المظلم): خلفية التطبيق الكلية.
- **Elevated Slate** (`#ffffff` / `#10141e`): أسطح البطاقات والحاويات العائمة.
- **Subtle Stroke** (`#dfe4ec` / `#222939`): حدود الفواصل وإطارات الحقول بوزن 1px.
- **High-Contrast Text** (`#11192c` / `#eff2f5`): نصوص العناوين والمحتوى الأساسي.
- **Muted Steel** (`#546178` / `#98a3b3`): النصوص التوضيحية والتسميات الثانوية.

### Named Rules

**The 10% Indigo Rule.** اللون الأساسي (`primary`) لا يغطي أكثر من 10% من مساحة أي شاشة معروضة؛ تفرده وندرته هي مصدر جاذبيته وقوته التوجيهية لنظر الطالب.

---

## Typography

**Display & Body Font:** `IBM Plex Sans Arabic` (مع بدائل: `ui-sans-serif, system-ui, sans-serif`).
**Character:** خط هندسي حديث، يجمع بين وضوح الخط الطباعي الكوفي ورصانة واجهات الأنظمة التقنية المعاصرة.

### Hierarchy

- **Display** (Bold 700, `2.5rem` / 40px, Line-height: 1.2): عناوين صفحات الهبوط والشاشات الترحيبية الكبرى.
- **Headline** (Bold 700, `1.75rem` / 28px, Line-height: 1.3): عناوين الأقسام الرئيسية ولوحات التحكم.
- **Title** (Semibold 600, `1.25rem` / 20px, Line-height: 1.4): عناوين الكروت والدروس والوحدات التعليمية.
- **Body** (Regular 400, `0.9375rem` / 15px, Line-height: 1.6): نصوص المقالات والوصف وشروحات المسارات (بمقياس قراءة 65-75 حرفاً لكل سطر).
- **Label** (Medium 500, `0.875rem` / 14px, Line-height: 1.4): تسميات حقول الإدخال، الأزرار، والروابط.

### Named Rules

**The Two-Weights Rule.** لا تدمج أكثر من وزنين طباعيين (Regular و Bold/Semibold) في نفس شاشة التفاعل لحفظ التماسك البصري.

---

## Layout

- **Container Scale:** الحاوية العامة للصفحات لا تتجاوز `max-w-7xl` (1280px) مع هوامش جانبية متجاوبة (`px-4 sm:px-6 lg:px-8`).
- **Vertical Rhythm:** التباعد العمودي بين الأقسام الرئيسية هو `py-12` (48px) أو `py-16` (64px).
- **RTL Fluid Grid:** شبكة تعتمد التباعد المنطقي؛ المسافات الأفقية تستخدم دائماً الفئات المنطقية (`ps-4`, `pe-4`, `ms-2`, `me-2`) لتجنب أخطاء تداخل الأيقونات.

---

## Elevation & Depth

يعتمد النظام على **الطبقات اللونية الناعمة (Tonal Layering)** بدلاً من الظلال الكثيفة أو الزخرفية:

- الأسطح في وضع السكون مسطحة مع تحديد بحدود رقيقة `1px border-border`.
- الظلال تظهر فقط استجابة لحالات التفاعل (Hover على بطاقات الكورسات) كظل ناعم منتشر (`shadow-md`).

### Shadow Vocabulary

- **Rest Surface:** لا يوجد ظل (`shadow-none`)، والعمق يتحقق بالفارق اللوني بين `--background` و `--card` مع حدود `--border`.
- **Active / Hover Card:** `box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08)` (أو `rgba(0, 0, 0, 0.35)` في الوضع المظلم).

### Named Rules

**The Ambient Depth Rule.** الظلال وظيفية وليست ديكوراً؛ لا تستخدم ظلالاً ملونة (Colored Halos) أو ظلالاً صلبة (Hard 4px offset shadows).

---

## Shapes

- **Corner Radius:**
  - العناصر التفاعلية الصغيرة (Badges, Chips): `rounded-sm` (6px).
  - الأزرار وحقول الإدخال (Buttons & Inputs): `rounded-lg` (12px) أو `rounded-xl` (12px/14px).
  - البطاقات والحاويات الرئيسية (Cards & Modals): `rounded-2xl` (16px).
- **Borders:** سمك الحدود ثابت دائماً عند `1px`؛ لا تستخدم حدوداً سميكة ملونة لتمييز البطاقات.

---

## Components

### Buttons

- **Shape:** زوايا دائرية بـ `rounded-xl` بارتفاع موحد `h-11` (44px).
- **Primary:** خلفية `bg-primary`، نص `text-primary-foreground`، ووزن `font-semibold`.
- **States:**
  - التحويم: `hover:bg-primary/90` مع انتقال سلس `duration-200`.
  - الضغط: `active:scale-[0.99]`.
  - التحميل: استبدال المحتوى بـ `<Loader2 className="animate-spin" />` مع `aria-busy="true"`.
  - التركيز: `focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2`.

### Inputs / Form Fields

- **Shape:** ارتفاع `h-11` (44px) بـ `rounded-xl` وخلفية `bg-background` وحدود `border-border`.
- **Focus:** `focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none`.
- **BiDi Support:** حقول الإيميل والرموز البرمجية تُعطى صراحة `dir="ltr"` و `text-left placeholder:text-right`.
- **Error State:** حدود بلون الخطأ `border-destructive` وتنبيه صوتي `role="alert"`.

### Cards & Surfaces

- **Style:** خلفية `bg-card`، حدود `border border-border`، وزوايا `rounded-2xl` بتبطين داخلي `p-6` أو `p-8`.

---

## Do's and Don'ts

### Do:

- **Do** استخدام الخصائص المنطقية للاتجاهات (`start`, `end`, `ps`, `pe`, `ms`, `me`) لضمان صحة الاتجاه في الواجهة العربية.
- **Do** استخدام `text-primary-foreground` مع أي عنصر يحمل خلفية `bg-primary` لمنع فشل التباين في الوضع المظلم.
- **Do** إعطاء الأزرار وحقول الإدخال ارتفاعاً لا يقل عن `44px` لضمان ملاءمتها للمس على الهواتف.
- **Do** تزويد أيقونات التفاعل وأزرار الإغلاق/الكشف بوسوم `aria-label` واضحة.

### Don't:

- **Don't** استخدام تدرجات لونية للنصوص (Gradient Text) تحت أي ظرف.
- **Don't** استخدام ألوان خام أو ثوابت مثل `text-gray-500` أو `bg-blue-600`؛ التزم بالتوكنز الدلالية (`text-muted-foreground`, `bg-primary`).
- **Don't** وضع عناصر تفاعلية (`<a>` أو `<button>`) داخل وسم `<label>`.
- **Don't** استخدام تأثيرات الزجاج المبالغ فيها (Heavy Glassmorphism) أو الظلال النيونية التي تشتت تجربة القراءة والتعلم.
