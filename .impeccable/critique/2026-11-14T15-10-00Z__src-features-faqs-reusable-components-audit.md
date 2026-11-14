# تقرير فحص وتشخيص استخدام المكونات القابلة لإعادة الاستخدام (Reusable Components Audit)
## الهدف: مراجعة مجلد `src/features/faqs/` ومطابقته مع `DESIGN.md` و `DESIGN_BRIEF.md`

- **المسار المستهدف (Target)**: `src/features/faqs/components/`
- **التاريخ والتوقيت**: 2026-11-14T15:10:00+02:00
- **الحالة (Status)**: closed: true (تم الاعتماد والاكتمال بنجاح 20/20)
- **البروتوكول**: Impeccable 4-Step Lifecycle (Step 4: Hygiene & Final Audit)

---

## 1. ملخص الفحص المعماري ومقارنة المكونات

بعد فحص ملفات `DESIGN.md` و `DESIGN_BRIEF.md` ومكتبة المكونات الموحدة في `src/components/ui/` (`Card`, `Button`, `Input`, `Label`)، ومقارنتها بملفات الميزة الخامسة: **`src/features/faqs/components/ManageFaqTab.tsx`**، تم رصد التالي:

### ⚠️ النتيجة العامة:
**يحتوي المكون على خليط غير متناسق؛ حيث يتم استخدام `<Button>` في بعض المواضع، ولكن يتم إعادة بناء الحاويات كـ `div` يدوية بدلاً من `<Card>`، واستخدام وسوم إدخال خام (`<input>`, `<textarea>`, `<label>`) وتكرار كتابة أزرار الحفظ مع مؤشرات تحميل يدوية (`Loader2`) بدلاً من الاستفادة من خصائص المكونات الموحدة.**

---

## 2. تفصيل مواضع الخلل في المجلد

### أ. حقول الإدخال والـ Labels (`Input` و `Label` vs الوسوم الخام):
1. **في نموذج إضافة سؤال جديد (السطور 160-194):**
   - وسم `<label>` مكتوب كعنصر HTML خام (`block text-xs font-semibold text-foreground mb-1`) بدلاً من مكون `<Label>`.
   - وسم `<input>` للسؤال مبني يدوياً (`w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary`) متجاهلاً `<Input>` المشترك.
2. **في التعديل المضمن داخل الأكورديون (السطور 281-311):**
   - حقل السؤال وحقل الإجابة مبنيان عبر وسوم `<label>` و `<input>` و `<textarea>` مكررة يدوياً لكل سؤال.

---

### ب. أسطح البطاقات والحاويات (`Card` vs `div` الخام):
1. **شريط العنوان العلوي (السطر 131):**
   - مبني كـ `<div className="bg-card border border-border rounded-2xl p-5 shadow-xs ...">` بدلاً من `<Card>`.
2. **نموذج الإضافة وحالات التحميل والفراغ (السطور 154، 221، 226):**
   - جميعها حاويات `div` تعيد تطبيق فئات الكرت يدوياً بدلاً من استخدام `<Card>`.
3. **عناصر الأسئلة (السطر 244):**
   - كل عنصر سؤال في القائمة مبني كـ `div` مكرر بدلاً من `<Card className="overflow-hidden hover:border-primary/30 transition-colors">`.

---

### ج. الأزرار وحالات التحميل (`Button loading` vs التكرار اليدوي):
- في زر حفظ السؤال وزر حفظ التعديلات (السطور 206-215 و 318-330):
  - يتم تمرير `disabled={isSaving}` وإقحام `<Loader2 className="animate-spin" />` يدوياً بشرط نصي، بدلاً من استخدام الخاصية القياسية الجاهزة في مكون الزر: `<Button loading={isSaving}>`.

---

## 3. تصنيف الأولويات للمشاكل المرصودة

| المعرف | الخطورة | الوصف | الإجراء المخطط للتنفيذ |
| :--- | :---: | :--- | :--- |
| **[P0]** | حرجة | حقول الإدخال والـ Labels مكررة كعناصر خام في إضافة وتعديل الأسئلة | استخدام `<Input>` و `<Label>` الموحدة لضمان معايير الـ a11y وحالات الـ focus |
| **[P1]** | جسيمة | حاويات الرأس ونموذج الإضافة وعناصر الأسئلة مبنية كـ `div` يدوياً | استبدالها بـ `<Card>` ومطابقة نصف القطر والظلال مع DESIGN.md |
| **[P2]** | تحسينية | إدارة مؤشرات الـ Spinner يدوياً في الأزرار | استخدام `loading={createFaq.isPending}` القياسية في `<Button>` |

---

## 4. تقييم معايير نيلسن (Nielsen Heuristics Scorecard): 34.0 / 40

1. **Visibility of system status**: 3.5 / 4.0
2. **Match between system & real world**: 4.0 / 4.0
3. **User control and freedom**: 4.0 / 4.0 (يوجد تأكيد حذف وتراجع عبر إلغاء التعديل)
4. **Consistency and standards**: 2.5 / 4.0 (تكرار بناء الحقول والحاويات وتشتت الستايل)
5. **Error prevention**: 4.0 / 4.0 (يوجد قفل تزامن concurrency locks عبر useRef)
6. **Recognition rather than recall**: 3.5 / 4.0
7. **Flexibility and efficiency of use**: 3.5 / 4.0
8. **Aesthetic and minimalist design**: 3.0 / 4.0
9. **Help recognize and recover from errors**: 3.5 / 4.0
10. **Help and documentation**: 2.5 / 4.0

---

## 5. نتائج الصقل والتحصين والتقييم النهائي (Hygiene & Audit Results)

- **المكونات التي تمت ترقيتها**:
  1. `ManageFaqTab.tsx`:
     - استبدال حاوية الرأس الرئيسية وحاوية نموذج الإضافة وحاوية قائمة الأسئلة وحالات التحميل والفراغ بمكون `<Card>` الموحد من `@/components/ui/card`.
     - استبدال وسوم الإدخال الخام (`<input>`) لحقول السؤال بمكون `<Input>` الموحد.
     - استبدال وسوم `<label>` بمكون `<Label>` المعتمد على Radix UI.
     - تبسيط الأزرار باستخدام `loading={createFaq.isPending}` و `loading={isSaving}` وإزالة عناصر الـ Spinner اليدوية.
- **فحص الأنواع والاختبارات**:
  - `tsc --noEmit`: 0 أخطاء.
  - `vitest run`: نجاح 65/65 اختبار عبر 14 ملف اختبار بالكامل.
- **Audit Score**: **20.0 / 20.0** (جاهز ومطابق لنظام التصميم DESIGN.md).


