# تقرير فحص وتشخيص استخدام المكونات القابلة لإعادة الاستخدام (Reusable Components Audit)
## الهدف: مراجعة مجلد `src/features/student-courses/` ومطابقته مع `DESIGN.md` و `DESIGN_BRIEF.md`

- **المسار المستهدف (Target)**: `src/features/student-courses/components/`
- **التاريخ والتوقيت**: 2026-11-14T15:25:00+02:00
- **الحالة (Status)**: مفتوح للمراجعة والاعتماد (Pending User Approval)
- **البروتوكول**: Impeccable 4-Step Lifecycle (Step 1: Critique & Diagnosis)

---

## 1. ملخص الفحص المعماري ومقارنة المكونات

بعد فحص ملفات `DESIGN.md` و `DESIGN_BRIEF.md` ومكتبة المكونات الموحدة في `src/components/ui/` (`Card`, `Badge`, `Button`, `Select`)، ومقارنتها بملفات الميزة الثامنة: **`src/features/student-courses/components/`** (`EnrolledCourseCard.tsx`, `EnrolledCoursesGrid.tsx`, `CourseFilterDropdown.tsx`, `player/TaskSection.tsx`, `player/LessonSidebar.tsx`)، تم رصد التالي:

### ⚠️ النتيجة العامة:
**يوجد تكرار لبناء بطاقات الكورسات وحاويات مهام الدروس والشاشات الفارغة كـ `div` خام بدلاً من استخدام `<Card>`، وبناء قائمة الفلترة المنسدلة يدوياً بدلاً من `<Select>`، وتكرار إنشاء الأزرار والشارات يدوياً بدلاً من `<Button>` و `<Badge>`.**

---

## 2. تفصيل مواضع الخلل في المجلد

### أ. أسطح البطاقات والحاويات (`Card` vs `div` الخام):
1. **`EnrolledCourseCard.tsx` (السطر 47):**
   - الحاوية الرئيسية مبنية كـ `div` مع كلاسات مكررة (`bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-md ...`) بدلاً من استخدام `<Card interactive className="overflow-hidden ...">`.
2. **`EnrolledCoursesGrid.tsx` (السطور 54 و 64):**
   - شاشة الفراغ (Empty State) وحاوية الخطأ مبنية كـ `div` بدلاً من `<Card>`.
3. **`player/TaskSection.tsx` (السطور 60 و 154):**
   - حاوية أسئلة المهمة وحاوية عرض النتائج مبنية كـ `div` تعيد تعريف كلاسات الكروت بدلاً من `<Card>`.

---

### ب. الأزرار ومؤشرات التحميل (`Button` vs `<button>` و `<Link>` الخام):
1. **في `EnrolledCourseCard.tsx` (السطر 97):**
   - زر متابعة التعلم مبني كـ `<Link>` يدوي مع كلاسات مطولة بدلاً من `<Button asChild className="w-full">`.
2. **في `EnrolledCoursesGrid.tsx` (السطر 72):**
   - زر "تصفح الكورسات المتاحة" مبني كـ `<Link>` مع فئات يدوية بدلاً من `<Button asChild>`.
3. **في `player/TaskSection.tsx` (السطور 138 و 212):**
   - زر "إعادة المحاولة" وزر "إرسال الإجابات" مبنيان كـ `<button>` خام مع إدارة مؤشر التحميل `<Loader2>` يدوياً بدلاً من `<Button variant="outline">` و `<Button loading={loading}>`.

---

### ج. القوائم المنسدلة وشارات الحالات (`Select` و `Badge` vs البناء اليدوي):
1. **في `CourseFilterDropdown.tsx` (السطور 55-100):**
   - يعيد بناء قائمة الـ Dropdown يدوياً عبر `useState(dropdownOpen)` وقائمة مخصصة بدلاً من استخدام مكون `<Select>` الموحد من `@/components/ui/select`.
2. **في `EnrolledCourseCard.tsx` (السطر 66):**
   - شارة "مسجل" مبنية كـ `<span>` يدوي بدلاً من `<Badge variant="outline">`.

---

## 3. تصنيف الأولويات للمشاكل المرصودة

| المعرف | الخطورة | الوصف | الإجراء المخطط للتنفيذ |
| :--- | :---: | :--- | :--- |
| **[P0]** | حرجة | إعادة بناء القائمة المنسدلة يدوياً في `CourseFilterDropdown` بدلاً من `<Select>` | استبدالها بمكون `<Select>` المعتمد على Radix UI |
| **[P1]** | جسيمة | أسطح كروت الكورسات المسجلة وحاويات المهام والشاشات الفارغة مبنية كـ `div` | تحويلها إلى `<Card>` لتوحيد الظلال والحدود مع DESIGN.md |
| **[P1]** | جسيمة | أزرار وشارات الكروت والمهام مبنية يدوياً | استخدام `<Button>` و `<Badge>` الموحدة |
| **[P2]** | تحسينية | إدارة التحميل اليدوي في زر إرسال المهمة | استخدام `loading={loading}` القياسية |

---

## 4. تقييم معايير نيلسن (Nielsen Heuristics Scorecard): 35.0 / 40

1. **Visibility of system status**: 4.0 / 4.0
2. **Match between system & real world**: 4.0 / 4.0
3. **User control and freedom**: 4.0 / 4.0
4. **Consistency and standards**: 2.5 / 4.0 (تكرار بناء البطاقات والأزرار والقوائم المنسدلة)
5. **Error prevention**: 4.0 / 4.0 (قفل التزامن عبر useRef محقق في تسليم المهام)
6. **Recognition rather than recall**: 4.0 / 4.0
7. **Flexibility and efficiency of use**: 3.5 / 4.0
8. **Aesthetic and minimalist design**: 3.5 / 4.0
9. **Help recognize and recover from errors**: 3.5 / 4.0
10. **Help and documentation**: 3.0 / 4.0

---

## 5. خطة التنفيذ بعد الموافقة:
1. ترقية `EnrolledCourseCard.tsx` لاستخدام `<Card interactive>`, `<Badge>`, `<Button asChild>`.
2. ترقية `EnrolledCoursesGrid.tsx` لاستخدام `<Card>`, `<Button asChild>`.
3. ترقية `CourseFilterDropdown.tsx` لتوحيد الاختيار عبر `<Select>`.
4. ترقية `player/TaskSection.tsx` لاستخدام `<Card>`, `<Button loading={loading}>`.
5. فحص الأنواع عبر `tsc --noEmit` واختبارات المشروع كاملة.
