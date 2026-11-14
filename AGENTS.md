<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

---

# 🧭 GENERAL AGENT EXECUTION RULES (قواعد تشغيلية إجبارية في كل جلسة)

1. **فحص الـ Skills المتاحة أولاً واقتراحها للمهمة:**
   - يجب في بداية كل مهمة فحص مجلد الـ Skills (`.agents/skills/`) واقتراح واستدعاء الـ Skill المناسبة فوراً لمنع التشتت والهلوسة والدخول في حلقات مفرغة (Loops).
2. **منع الافتراضات والتخمين تماماً والاعتماد على البحث الحي في الويب:**
   - يُمنع منعاً باتاً افتراض حلول أو واجهات برمجية أو قيود تقنية دون فحص مباشر وبحث دقيق ومحدث في الويب لأحدث التوثيقات والممارسات.
3. **البحث المعماري عن أفضل الممارسات المتبعة (Industry Best Practices):**
   - قبل تصميم أو بناء أي Feature، يجب البحث عن أفضل الطرق الهندسية القياسية عالمياً لبنائها بأبسط شكل ممكن وأعلى جودة.
4. **البدء بالحد الأدنى الصارم للمكون (Minimalist Surface Rule):**
   - ابدأ دائماً بأبسط وأقل شكل ممكن للمكون (Minimalist Surface). يُمنع منعاً باتاً ابتكار شارات إضافية، أو نصوص زائدة، أو تفاصيل فرعية مشتتة لم تنص عليها المتطلبات الصريحة بدقة.

---

# 🛡️ THE IMPECCABLE 4-STEP ATOMIC GOVERNANCE PROTOCOL

> **قواعد تشغيلية صارمة لحوكمة واجهات المستخدم (Frontend/UI) — ملزمة في كل جلسة جديدة**

كل تعديل يخص واجهات المستخدم في المشروع يجب أن يخضع بالكامل وبدون أي استثناء للقواعد التالية:

### 1. قاعدة العزل الذري الصارم (Atomic Isolation Rule):

- يتم التعديل في **أقل جزء ممكن (مكون واحد أو صفحة واحدة فقط)** لتسهيل احتواء التعديلات والتراجع الفوري في حال الفشل.
- يُحظر تماماً التعديل في عدة ملفات دفعة واحدة.

### 2. منع الافتراضات والتخمين (Zero-Assumption Guard):

- يُمنع منعاً باتاً كتابة أي سطر كود تعديلي قبل اكتمال مرحلة الفحص والتشخيص الأولى وعرض نتائجها على المستخدم وأخذ موافقته.

### 3. دورة الحياة الرباعية الإلزامية (The 4-Step Lifecycle):

- **الخطوة 1: فحص وتشخيص (`/impeccable critique` + الكاشف الآلي):**
  - فحص عيوب الواجهة ومعايير نيلسن الـ 10 (Nielsen Heuristics) بدرجات من 40.
  - فحص شجرة الـ DOM، التباين، وعيوب الـ RTL وحقول الـ BiDi ورصد أي كود عشوائي أو AI Slop.
  - رصد وتصنيف المشاكل بدقة: [P0] حرجة، [P1] جسيمة، [P2] تحسينية.
  - **شرط إلزامي:** توثيق كل مرحلة والتحقق من حفظها داخل ملف رسمي في:
    `frontend-course/.impeccable/critique/<timestamp>__<slug>.md`
  - **Git Commit:** `git commit -m "critique(<target>): diagnose heuristics & priority issues"`

- **الخطوة 2: الصقل ومطابقة نظام التصميم (`/impeccable polish`):**
  - إلزام الواجهة بتوكنز `DESIGN.md`.
  - تطبيق قاعدة 10% Indigo Rule، وقاعدة الخطين Two-Weights Rule.
  - معالجة كافة مشاكل الأولوية (P0 و P1).
  - **Git Commit:** `git commit -m "polish(<target>): enforce DESIGN.md tokens & resolve P0/P1"`

- **الخطوة 3: التحصين والتأمين الفني (`/impeccable harden`):**
  - منع الإرسال المزدوج (Double-submit lock عبر `useRef`).
  - دعم تفضيلات تقليل الحركة (`prefers-reduced-motion`).
  - تحصين حقول الـ BiDi وضبط هياكل التحميل (Suspense Skeletons) لمنع اهتزاز الشاشة (CLS).
  - تأمين أهداف اللمس (Touch Targets >= 44x44px).
  - **Git Commit:** `git commit -m "harden(<target>): add concurrency lock, reduced-motion & a11y"`

- **الخطوة 4: تنظيف الكود والتقييم النهائي (`Hygiene & Audit`):**
  - حذف الكود الميت، الدوال غير المستخدمة، والمكونات الوهمية.
  - تشغيل الفحص التقني بالأبعاد الخمسة وإصدار بطاقة التقييم النهائية (Audit Score /20).
  - تحديث ملف الـ critique في `.impeccable/critique/` وتعيين `closed: true`.
  - **Git Commit:** `git commit -m "audit(<target>): clean dead code & score technical audit"`

---

# ⚡ THE TANSTACK QUERY V5 & VERTICAL SLICE ARCHITECTURE PROTOCOL

> **بروتوكول إدارة البيانات والـ State الصارم لمشاريع Next.js 16 + TanStack Query v5**

يجب على أي Agent يعمل على المشروع الالتزام التام والقطعي بالقواعد الهندسية التالية:

### 1. قاعدة فصل النطاقات الصارم (Domain Segregation Rule):

- يُحظر تماماً جمع كل ما يحمل نفس الاسم في مجلد Feature واحد إذا اختلفت الصلاحيات ونية الاستخدام.
- الكورسات مفصولة قطيعاً إلى 3 مجالات معزولة:
  1. `src/features/courses/`: الكتالوج العام، واللاندينغ، وتفاصيل الكورس للزوار فقط.
  2. `src/features/student-courses/`: لوحة تحكم الطالب، الدروس المسجلة، مشغل الفيديو وتتبع التقدم.
  3. `src/features/admin-courses/`: عمليات CRUD ومودالات الإدارة للأدمن فقط.

### 2. قاعدة مصنع الاستعلامات الإلزامي (The `queryOptions` Factory Rule):

- يُمنع منعاً باتاً كتابة مفاتيح كاش عشوائية داخل المكونات (مثل `queryKey: ["courses"]`).
- يجب تعريف جميع الاستعلامات داخل `src/features/<feature>/queries/*.queries.ts` باستخدام دالة `queryOptions` الرسمية من `@tanstack/react-query`.
- هذا يضمن استخدام نفس المفتاح ودالة الجلب في السيرفر (RSC Prefetching) وفي العميل (`useQuery`) بتطابق تام في الأنواع (100% Type-safe).

### 3. بنية الطبقات الثلاث الصارمة (Strict 3-Layer Feature Pattern):

داخل كل Feature:

- `api/`: دوال جلب نقية فقط عبر Axios (تتصل بنقاط نهاية الـ API وترجع بيانات نظيفة).
- `queries/`: مصانع `queryOptions` التي تدمج المفاتيح مع دوال الـ API وتحدد الـ `staleTime`.
- `components/`: مكونات العرض فقط؛ تستهلك الكاش عبر `useQuery(featureQueries.xxx)`.
- **ممنوع منعاً باتاً:** استخدام `useState` + `useEffect` لجلب بيانات السيرفر في أي مكون.

### 4. قاعدة مشاركة الكاش عبر `select` (Memory Cache Sharing):

- عند حاجة أي جزء من التطبيق إلى نسخة جزئية أو مقتطعة من البيانات (مثل الـ 5 كورسات في الفوتر، أو شارة Hot في اللاندينغ):
  - **يُحظر** إرسال طلب شبكة جديد أو استخدام مفتاح كاش منفصل.
  - **يجب** استخدام نفس الاستعلام الأساسي مع خاصية `select`:
    ```ts
    useQuery({
      ...courseQueries.list(),
      select: (data) => transform(data),
    });
    ```

### 5. منع تكرار الحالة (No Derived State in useState):

- يُمنع تخزين البيانات المفلترة أو المشتقة من الكاش داخل `useState` إضافي.
- يجب استخدام `useMemo` نقي للحسابات المحلية (مثل البحث والفلترة) لمنع الـ Cascading Re-renders.

### 6. قاعدة الحذف الفوري للجسور والمخلفات (No Lingering Bridges):

- عند نقل أو إعادة هيكلة أي مكونات إلى `src/features/`:
  - يجب تحديث جميع الاستيرادات في الصفحات فوراً.
  - يجب حذف الملفات والمجلدات القديمة نهائياً فور اكتمال النقل (يُمنع ترك ملفات مكررة أو جسور Re-export دائمة).

### 7. التوثيق الثابت لكل ميزة (Immutable `ai-context.md` Anchor):

- كل مجلد Feature يجب أن يحتوي على ملف `ai-context.md` يحدد بدقة:
  - حدود الميزة ونطاقها (In-Scope vs Out-of-Scope).
  - عقود البيانات مع الـ Backend (Endpoints & Types).
  - القواعد الصارمة والديون الفنية المعروفة (Known Debts).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
