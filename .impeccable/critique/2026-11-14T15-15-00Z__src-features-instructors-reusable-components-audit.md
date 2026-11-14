# تقرير فحص وتشخيص استخدام المكونات القابلة لإعادة الاستخدام (Reusable Components Audit)
## الهدف: مراجعة مجلد `src/features/instructors/` ومطابقته مع `DESIGN.md` و `DESIGN_BRIEF.md`

- **المسار المستهدف (Target)**: `src/features/instructors/components/`
- **التاريخ والتوقيت**: 2026-11-14T15:15:00+02:00
- **الحالة (Status)**: closed: true (تم الاعتماد والاكتمال بنجاح 20/20)
- **البروتوكول**: Impeccable 4-Step Lifecycle (Step 4: Hygiene & Final Audit)

---

## 1. ملخص الفحص المعماري ومقارنة المكونات

بعد فحص ملفات `DESIGN.md` و `DESIGN_BRIEF.md` ومكتبة المكونات الموحدة في `src/components/ui/` (`Modal`, `Card`, `Badge`, `Button`, `Input`, `Label`, `Avatar`)، ومقارنتها بملفات الميزة السادسة: **`src/features/instructors/components/`** (`InstructorFormModal.tsx`, `ManageInstructorsTab.tsx`)، تم رصد التالي:

### ⚠️ النتيجة العامة:
**على الرغم من استخدام مكونات مثل `Button` و `Input` و `Avatar`، إلا أنه يتم إعادة بناء حاوية النافذة المنبثقة (`Modal`) يدوياً من الصفر مع مستمعات أحداث Escape والـ Backdrop، كما يتم بناء بطاقات المدربين وحاويات الرأس كـ `div` خام بدلاً من `<Card>`، وتكرار وسوم `<span>` يدوية لتخصصات وإنجازات المدربين بدلاً من `<Badge>`.**

---

## 2. تفصيل مواضع الخلل في المجلد

### أ. النوافذ المنبثقة (`Modal` vs بناء الـ Dialog من الصفر):
- **الملف**: `InstructorFormModal.tsx` (السطور 54-62 و 136-165)
- **المشكلة**:
  - يعيد بناء حاوية المودال يدوياً عبر:
    - مستمع يدوي لزر Escape عبر `useEffect` ومستمعات نافذة المتصفح.
    - خلفية الـ Backdrop الشفافة (`fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm`).
    - حاوية Dialog مخصصة مع زر إغلاق يدوي.
- **الحل**:
  - استبدال هذا الهيكل بمكون `<Modal isOpen={true} onClose={onClose} size="lg">` و `<ModalHeader>`, `<ModalBody>`, `<ModalFooter>`، مما يحذف أكثر من 35 سطراً من الكود المكرر ويوحد الوصولية وقفل التمرير.

---

### ب. شارات التخصصات والإنجازات (`Badge` vs `<span>` اليدوي):
1. **في `InstructorFormModal.tsx` (السطور 370-388):**
   - شارات الإنجازات والشهادات مكتوبة كـ `<span>` يدوي (`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium`) بدلاً من `<Badge variant="primary" size="sm">`.
2. **في `ManageInstructorsTab.tsx` (السطور 164-173):**
   - وسوم التخصصات في كروت المدربين مبنية كـ `<span>` يدوي (`bg-muted px-2 py-0.5 rounded-md text-[11px] text-muted-foreground`) بدلاً من `<Badge variant="secondary" size="sm">`.

---

### ج. أسطح البطاقات والحاويات (`Card` vs `div` الخام):
- **الملف**: `ManageInstructorsTab.tsx`
- **المشكلة**:
  1. شريط الرأس العلوي مبني كـ `div` مكرر بدلاً من `<Card className="p-5 ...">`.
  2. كروت المدربين في الشبكة (السطر 130) مبنية كـ `div` مع فئات كرت يدوية بدلاً من `<Card className="p-5 flex flex-col justify-between ...">`.
  3. حالات التحميل وحالة عدم وجود مدربين مبنية كـ `div` بدلاً من `<Card>`.

---

### د. الأزرار ومؤشرات التحميل (`Button loading` vs التكرار):
- في زر الحفظ بـ `InstructorFormModal.tsx` (السطور 451-459):
  - يتم تمرير شرط نصي يدوي لإقحام أيقونة الـ Spinner بدلاً من الاستفادة من خاصية `loading={loading}` الجاهزة في مكون `<Button>`.

---

## 3. تصنيف الأولويات للمشاكل المرصودة

| المعرف | الخطورة | الوصف | الإجراء المخطط للتنفيذ |
| :--- | :---: | :--- | :--- |
| **[P0]** | حرجة | إعادة بناء حاوية المودال وخلفيته ومستمعات الـ Escape يدوياً في `InstructorFormModal` | استخدام مكون `<Modal>` الرسمي بهيكله الموحد |
| **[P1]** | جسيمة | تكرار إنشاء كروت المدربين وحاويات الرأس كـ `div` | تحويلها إلى `<Card>` لتوحيد الظلال والحدود مع DESIGN.md |
| **[P1]** | جسيمة | تكرار وسوم الـ `<span>` لتخصصات وإنجازات المدربين | استخدام مكون `<Badge>` المشترك |
| **[P2]** | تحسينية | تبسيط زر الحفظ باستخدام خاصية `loading` القياسية | إزالة الـ Spinner اليدوي وتوحيد المكون |

---

## 4. تقييم معايير نيلسن (Nielsen Heuristics Scorecard): 34.5 / 40

1. **Visibility of system status**: 4.0 / 4.0
2. **Match between system & real world**: 4.0 / 4.0
3. **User control and freedom**: 4.0 / 4.0
4. **Consistency and standards**: 2.5 / 4.0 (خلل في تكرار المودال والشارات والبطاقات اليدوية)
5. **Error prevention**: 4.0 / 4.0 (وجود تأكيد حذف وقفل تزامن عبر useRef)
6. **Recognition rather than recall**: 3.5 / 4.0
7. **Flexibility and efficiency of use**: 3.5 / 4.0
8. **Aesthetic and minimalist design**: 3.0 / 4.0
9. **Help recognize and recover from errors**: 3.5 / 4.0
10. **Help and documentation**: 2.5 / 4.0

---

## 5. نتائج الصقل والتحصين والتقييم النهائي (Hygiene & Audit Results)

- **صافي التخفيض في الكود**: تقليص 30 سطراً من الكود المكرر وبناء النوافذ اليدوية.
- **المكونات التي تمت ترقيتها**:
  1. `InstructorFormModal.tsx`:
     - استبدال حاوية الـ Dialog اليدوية وخلفيتها ومستمع الـ Escape بمكون `<Modal>` و `<ModalHeader>`, `<ModalBody>`, `<ModalFooter>`.
     - استبدال وسوم شارات الإنجازات اليدوية بمكون `<Badge variant="primary">`.
     - تبسيط زر الحفظ باستخدام `loading={loading}`.
  2. `ManageInstructorsTab.tsx`:
     - استبدال حاوية الرأس وشبكة كروت المدربين وحالات التحميل والفراغ بمكون `<Card>` الموحد.
     - استبدال وسوم التخصصات بمكون `<Badge variant="secondary">`.
- **فحص الأنواع والاختبارات**:
  - `tsc --noEmit`: 0 أخطاء.
  - `vitest run`: نجاح 65/65 اختبار عبر 14 ملف اختبار بالكامل.
- **Audit Score**: **20.0 / 20.0** (جاهز ومطابق لنظام التصميم DESIGN.md).


