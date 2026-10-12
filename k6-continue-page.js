// k6-continue-page.js
// الهدف: قياس تدفّق صفحة dashboard/continue (الكود الحالي) مقابل Endpoint مجمّع (بعد الإصلاح).
//
// التشغيل (الأمثلة بالأسفل). الاختبار يضرب Laravel مباشرة بـ Bearer token،
// أي أنه يقيس الـ Backend + القاعدة، ولا يمر عبر Next proxy.
//
// المتغيرات (كلها env):
//   BASE_URL        مثال: http://localhost:8000/api      (نفس قيمة LARAVEL_API_URL)
//   EMAIL, PASSWORD حساب طالب تجريبي (ليس حسابًا حقيقيًا)
//   SCENARIO        before | after | both   (الافتراضي: before)
//   PROFILE         smoke | load | stress   (الافتراضي: smoke)
//   AFTER_PATH      مسار الـ endpoint المجمّع بعد بنائه، مثل: /my-courses/continue
//                   (مطلوب فقط عند SCENARIO=after أو both)

import http from 'k6/http';
import { check, group, fail } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL;
const EMAIL = __ENV.EMAIL;
const PASSWORD = __ENV.PASSWORD;
const SCENARIO = __ENV.SCENARIO || 'before';
const PROFILE = __ENV.PROFILE || 'smoke';
const AFTER_PATH = __ENV.AFTER_PATH;

if (!BASE_URL || !EMAIL || !PASSWORD) {
  throw new Error('BASE_URL و EMAIL و PASSWORD مطلوبة');
}
if ((SCENARIO === 'after' || SCENARIO === 'both') && !AFTER_PATH) {
  throw new Error('AFTER_PATH مطلوب عند SCENARIO=after أو both');
}

// ───────── Metrics مخصّصة ─────────
// زمن "الصفحة كاملة" كما يشعر به المستخدم (مجموع الطلبات المتسلسلة)
const pageBefore = new Trend('page_continue_before_ms', true);
const pageAfter = new Trend('page_continue_after_ms', true);
// عدد الطلبات التي تحتاجها الصفحة الواحدة (يكشف N+1 بالرقم)
const reqsPerPage = new Trend('requests_per_page');
const failRate = new Rate('flow_failed');
const throttled = new Counter('http_429_count');

// ───────── Profiles تدريجية ─────────
const PROFILES = {
  // 1) تأكد أن السكربت نفسه يعمل (لا تقِس شيئًا هنا)
  smoke: [{ duration: '1m', target: 1 }],
  // 2) حمل واقعي متدرّج
  load: [
    { duration: '1m', target: 5 },
    { duration: '2m', target: 10 },
    { duration: '2m', target: 20 },
    { duration: '1m', target: 0 },
  ],
  // 3) ابحث عن نقطة الانهيار (لا تشغّله على production)
  stress: [
    { duration: '1m', target: 20 },
    { duration: '2m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 0 },
  ],
};

function scenarioConfig(execName) {
  return {
    executor: 'ramping-vus',
    // smoke: مستخدم واحد من الثانية 0 (مع startVUs=0 كان يظهر الـ VU في آخر المرحلة فقط)
    startVUs: PROFILE === 'smoke' ? 1 : 0,
    stages: PROFILES[PROFILE],
    gracefulRampDown: '10s',
    // الـ iteration الواحدة قد تحتوي عشرات الطلبات المتسلسلة، فلا نقطعها
    gracefulStop: '2m',
    exec: execName,
  };
}

const scenarios = {};
if (SCENARIO === 'before' || SCENARIO === 'both') scenarios.before = scenarioConfig('before');
if (SCENARIO === 'after' || SCENARIO === 'both') scenarios.after = scenarioConfig('after');

export const options = {
  scenarios,
  thresholds: {
    // أرقام البداية فقط: عدّلها بعد أن ترى خط الأساس الحقيقي
    flow_failed: [{ threshold: 'rate<0.05', abortOnFail: true, delayAbortEval: '20s' }],
    http_req_failed: ['rate<0.05'],
    'page_continue_before_ms': ['p(95)<3000'],
    // سطور العرض فقط (شرط دائمًا صحيح): تُظهر زمن كل endpoint على حدة في الملخص
    'http_req_duration{name:POST /auth/login}': ['max>=0'],
    'http_req_duration{name:GET /my-courses}': ['max>=0'],
    'http_req_duration{name:GET /courses/{id}}': ['max>=0'],
    'http_req_duration{name:GET /lessons/{id}/progress}': ['max>=0'],
    'page_continue_after_ms': ['p(95)<1000'],
  },
};

const jsonHeaders = (token) => ({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

// ───────── Setup: تسجيل دخول مرة واحدة ─────────
export function setup() {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: EMAIL, password: PASSWORD }),
    { ...jsonHeaders(), tags: { name: 'POST /auth/login' } },
  );
  const token = res.json('token');
  if (res.status !== 200 || !token) {
    fail(`فشل تسجيل الدخول: status=${res.status} body=${res.body}`);
  }
  return { token };
}

function get(path, token, name) {
  const res = http.get(`${BASE_URL}${path}`, { ...jsonHeaders(token), tags: { name } });
  if (res.status === 429) throttled.add(1);
  return res;
}

// ───────── BEFORE: يحاكي ContinuePage.tsx حرفيًا ─────────
// my-courses → لكل كورس approved: courses/{id} → لكل درس: lessons/{id}/progress (متسلسل)
export function before(data) {
  const token = data.token;
  let count = 0;
  const started = Date.now();
  let ok = true;

  group('continue_before', () => {
    const mine = get('/my-courses', token, 'GET /my-courses');
    count++;
    ok = check(mine, { 'my-courses 200': (r) => r.status === 200 }) && ok;
    if (mine.status !== 200) return;

    const approved = mine.json().filter((e) => e.status === 'approved');

    for (const enrollment of approved) {
      const courseRes = get(`/courses/${enrollment.course.id}`, token, 'GET /courses/{id}');
      count++;
      ok = check(courseRes, { 'course 200': (r) => r.status === 200 }) && ok;
      if (courseRes.status !== 200) continue;

      const sections = courseRes.json().sections || [];
      for (const section of sections) {
        for (const lesson of section.lessons || []) {
          // نفس سلوك الكود: خطأ واحد لا يوقف الصفحة (try/catch فارغ)
          get(`/lessons/${lesson.id}/progress`, token, 'GET /lessons/{id}/progress');
          count++;
        }
      }
    }
  });

  pageBefore.add(Date.now() - started);
  reqsPerPage.add(count, { variant: 'before' });
  failRate.add(!ok);
}

// ───────── AFTER: طلب واحد لـ endpoint مجمّع (يُبنى في الخطوة التالية) ─────────
export function after(data) {
  const started = Date.now();
  let ok = true;

  group('continue_after', () => {
    const res = get(AFTER_PATH, data.token, `GET ${AFTER_PATH}`);
    ok = check(res, { 'bulk 200': (r) => r.status === 200 }) && ok;
  });

  pageAfter.add(Date.now() - started);
  reqsPerPage.add(1, { variant: 'after' });
  failRate.add(!ok);
}