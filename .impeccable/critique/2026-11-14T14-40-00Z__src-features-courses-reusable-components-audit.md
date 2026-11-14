# تقرير فحص وتشخيص استخدام المكونات القابلة لإعادة الاستخدام (Reusable Components Audit)
## الهدف: مراجعة مجلد `src/features/courses/` ومطابقته مع `DESIGN.md` و `DESIGN_BRIEF.md`

- **المسار المستهدف (Target)**: `src/features/courses/components/`
- **التاريخ والتوقيت**: 2026-11-14T14:40:00+02:00
- **الحالة (Status)**: مفتوح للمراجعة والاعتماد (Pending User Approval)
- **البروتوكول**: Impeccable 4-Step Lifecycle (Step 1: Critique & Diagnosis)

---

## 1. ملخص الفحص المعماري ومقارنة المكونات

بعد فحص ملفات `DESIGN.md` و `DESIGN_BRIEF.md`، ومقارنة مكونات مكتبة النظام الموحدة في `src/components/ui/` (`Button`, `Card`, `Badge`, `Input`, `SearchInput`) والمكونات المشتركة في `src/components/shared/states/` (`EmptyState`) مع مكونات الميزة الأولى: **`src/features/courses/components/`**، تم رصد التالي:

### ⚠️ النتيجة العامة:
**يوجد مزيج غير متسق بين الاستخدام الجزئي للمكونات وبين إعادة اختراع عناصر بدائية (HTML Primitives) بستايلات مكررة يدوياً (Re-inventing the wheel)، بالإضافة إلى تمرير فئات Tailwind متضاربة تعيد كتابة ما يوفره المكون الجاهز بالفعل.**

---

## 2. تفصيل مواضع الخلل في المجلد (`src/features/courses/components/`)

### أ. زر النظام (`Button` vs `<button>` / `<Link>` اليدوي):
1. **`EnrollCard.tsx` (تكرار جسيم):**
   - تم بناء **4 أزرار روابط بدائية (`<Link>`) وزر إرسال بدائي (`<button>`)** وتكرار أكثر من 12 كلاس Tailwind يدوي لكل عنصر (`w-full min-h-[44px] mb-3 inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-base transition-colors focus-visible:...`).
   - تم استدعاء أيقونة التحميل `<Loader2 className="animate-spin" />` يدوياً داخل زر التسجيل بدلاً من تمرير خاصية `loading={loading}` المدعومة أصلاً وتلقائياً داخل مكون `<Button />`.
   - **الحل المقترح**: استبدال كافة أزرار وروابط بطاقة التسجيل بـ `<Button href="..." variant="default | outline">` و `<Button loading={loading}>`.
2. **`CourseBottomCta.tsx`:**
   - استخدام وسم `<button>` خام ووسم `<Link>` خام بستايلات مضاعفة يدوياً بدلاً من استخدام `<Button variant="...">` الجاهز.
3. **`CourseLevelFilters.tsx` و `CourseCard.tsx` و `CoursesEmptyState.tsx` (ازدواجية الستايل):**
   - يتم استدعاء مكون `<Button>` بالفعل، ولكن يتم حشوه بـ `className` يحتوي على فئات موجودة مسبقاً داخل `buttonVariants` (مثل `min-h-[44px] px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow-xs`). هذا يُضخم حجم الكود ويُلغي الفائدة الهندسية من المكون المركزي.

---

### ب. شارة النظام (`Badge` vs `<span className="...">` اليدوي):
1. **`CourseCard.tsx` (سطر 102):**
   - شارة "الأكثر طلباً" مبنية كـ `<span className="flex items-center gap-1 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 text-xs font-semibold">` بدلاً من استخدام `<Badge variant="hot">` الموحد في المنصة.
2. **`CourseLevelBadge.tsx`:**
   - تم بناء وسم `<span>` مخصص بقيم محلية بدلاً من الاستناد إلى مكون `<Badge />` المعتمد.
3. **`CourseHero.tsx` (سطر 70) و `CoursesHero.tsx` (سطر 24):**
   - كبسولات عائمة مبنية يدوياً بـ `inline-flex items-center gap-2 bg-white/10 text-white rounded-full`، مما يخالف القاعدة 3 في `DESIGN_BRIEF.md` (حظر الكبسولات العائمة فوق الهيرو) ويستبدل شارات النظام بعناصر مجهولة التبعية.
4. **`CourseCurriculum.tsx` (سطر 88):**
   - شارة "معاينة مجانية" مبنية كـ `span` يدوي بدلاً من `<Badge variant="primary" size="sm">`.

---

### ج. أسطح البطاقات (`Card` vs `<div className="bg-card ...">`):
1. **`EnrollCard.tsx`:**
   - السطح الخارجي للبطاقة عبارة عن `<div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">` مع `<div className="p-6">` بدلاً من استخدام `<Card>` و `<CardContent>` الرسميين من `@/components/ui/card`.
2. **`CourseCard.tsx`:**
   - البطاقة تستخدم `<motion.article>`، مع تكرار يدوي لخصائص الكارد (`border border-border bg-card p-3.5 shadow-sm hover:shadow-md`). يمكن توحيد السطح مع كلاسات أو استخدام نمط `Card`.

---

### د. حالات الشاشة الفارغة (`EmptyState` vs إعادة الاختراع):
1. **`CoursesEmptyState.tsx`:**
   - تم إنشاء وسم `<div role="status">` كامل مع أيقونة وعنوان ووصف بدلاً من استيراد المكون المشترك الحقيقي الموجود بالفعل في المشروع: `src/components/shared/states/EmptyState.tsx`.
   - استخدام المكون الجاهز سيختصر أكثر من 25 سطراً من الكود في هذا الملف وحده.

---

### هـ. مطابقة `DESIGN.md` و `DESIGN_BRIEF.md`:
1. **قاعدة الـ 10% للون الأساسي (The 10% Indigo Rule):**
   - مكون `CourseBottomCta.tsx` يكسر القاعدة عبر خلفية ممتدة صاخبة: `bg-gradient-to-br from-primary to-primary/85 rounded-3xl`. يجب تحويل الخلفية إلى سطح داكن ناعم (`bg-card` أو `bg-section`) مع جعل الزر وحده هو الحامل للون الـ Primary.
2. **هندسة الحواف الحادة (Crisp 8px Geometry):**
   - استخدام `rounded-3xl` في `CourseBottomCta` وبعض الأزرار يخالف مبدأ هندسة الحواف الموحدة بين 8px إلى 16px.

---

## 3. تصنيف الأولويات للمشاكل المرصودة

| المعرف | الخطورة | الوصف | الإجراء المطلوب للتخفيف وتقليص الكود |
| :--- | :---: | :--- | :--- |
| **[P0]** | حرجة | إنشاء أزرار وروابط بدائية في `EnrollCard` و `CourseBottomCta` وتكرار منطق الـ Loading | استبدالها بمكون `<Button>` الموحد وحذف كود الستايل اليدوي |
| **[P1]** | جسيمة | تكرار إنشاء شارات مخصصة (`span`) بدلاً من `<Badge>` وتخطي مكون `EmptyState` المشترك | استخدام `<Badge>` وتوظيف `EmptyState` لتقليص الأكواد المكررة |
| **[P1]** | جسيمة | انتهاك قاعدة 10% Indigo في `CourseBottomCta` والكبسولات العائمة في الهيرو | ضبط الألوان وفق `DESIGN_BRIEF.md` وحذف الكبسولات المخالفة |
| **[P2]** | تحسينية | حشو أزرار `<Button>` بفئات Tailwind مكررة موجودة أصلاً في `buttonVariants` | تنظيف الـ `className` والاعتماد على خصائص المكون الافتراضية |

---

## 4. تقييم معايير نيلسن للواجهة (Nielsen Heuristics Scorecard): 34.0 / 40

1. **Visibility of system status**: 3.5 / 4.0 (التحميل موجود ولكنه مكرر يدوياً)
2. **Match between system & real world**: 4.0 / 4.0 (الصياغة العربية ممتازة)
3. **User control and freedom**: 4.0 / 4.0
4. **Consistency and standards**: 2.5 / 4.0 (خلل واضح في عدم الاتساق بين المكونات الجاهزة والمكونات المكررة يدوياً)
5. **Error prevention**: 3.5 / 4.0
6. **Recognition rather than recall**: 3.5 / 4.0
7. **Flexibility and efficiency of use**: 3.5 / 4.0
8. **Aesthetic and minimalist design**: 3.0 / 4.0 (مخالفة قاعدة 10% في Bottom CTA وكبسولات الهيرو)
9. **Help recognize and recover from errors**: 3.5 / 4.0
10. **Help and documentation**: 3.0 / 4.0
