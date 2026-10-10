'use client';
import { useEffect, useState, memo, useMemo } from 'react';

const SIMPLE_CODE = `const student = await futurehouse.join({
  course: "React",
  level: "beginner",
  price: 0, // free
});

student.watch(lessons);
student.joinLive(meeting);
`;

const COMPLEX_CODE = `// your progress, always in sight
async function trackProgress(userId: string) {
  const stats = await getStats(userId);

  return {
    lessons: stats.completed_lessons,
    streak: stats.streak,      // days in a row
    passRate: stats.pass_rate, // %
  };
}
`;

const SNIPPETS = [SIMPLE_CODE, COMPLEX_CODE];

function highlight(code: string) {
  const esc = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const slots: string[] = [];
  let h = esc;

  h = h.replace(/\/\/.*$/gm, (m) => {
    slots.push(`<span style="color:#7EC699;font-weight:600">${m}</span>`); // أخضر فاقع وواضح
    return `__S${slots.length - 1}__`;
  });

  h = h.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, (m) => {
    slots.push(`<span style="color:#E6C07B">${m}</span>`); // بيج فاقع
    return `__S${slots.length - 1}__`;
  });

  h = h.replace(/\b(async|await|function|const|let|var|return|if)\b/g,
    '<span style="color:#D49BFF;font-weight:600">$1</span>'); // بنفسجي فاقع

  h = h.replace(/\b(string|false|true|0)\b/g,
    '<span style="color:#7DD3FC">$1</span>');

  h = h.replace(/\b([a-zA-Z_]\w*)(?=\s*\(|\.init|\.findMany|\.map)/g,
    '<span style="color:#7CC8FF">$1</span>');

  slots.forEach((s, i) => {
    h = h.replace(`__S${i}__`, s);
  });

  return h;
}

export const AuthTerminal = memo(function AuthTerminal() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const fullText = SNIPPETS[index];

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (!deleting) {
      if (text.length < fullText.length) {
        t = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 18);
      } else {
        t = setTimeout(() => setDeleting(true), 2500);
      }
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(fullText.slice(0, text.length - 1)), 10);
      } else {
        setDeleting(false);
        setIndex((p) => (p + 1) % SNIPPETS.length);
      }
    }
    return () => clearTimeout(t);
  }, [text, deleting, fullText]);

  const colored = useMemo(() => highlight(text), [text]);

  return (
    <div className="w-full h- max-h- rounded-2xl bg-[#08080c]/90 backdrop-blur-2xl border border-white/10 flex flex-col overflow-hidden">
      <div className="h- shrink-0 flex items-center gap-1 justify-end py-2 px-5 border-b border-white/5 bg-white/[0.02]">
        <span className="ml-2 text- text-white/40 font-mono">futurehouse.ps</span>
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>
      <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
        <div className="text-right shrink-0" dir="rtl">
          <h2 className="text- font-bold text-white">منصة Future House</h2>
          <p className="mt-2 text- text-white/60 leading-6">ابدأ البرمجة من الصفر. بالعربية. <span className='text-green-300/80'>مجانًا</span>.<br/>لا تتعلّم وحدك: دروس مسجّلة ولقاءات مباشرة مع مدربك.. <br/>من الفيديو إلى اللقاء المباشر، مع مدرب يجيب عن أسئلتك.</p>
          <div className="mt-4 h-px bg-gradient-to-l from-white/10 to-transparent" />
        </div>
<div dir="ltr" className="flex-1 bg-[#0e0e14] rounded-xl p-4 border border-white/10 overflow-auto">
  <pre className="font-mono text- leading-6 whitespace-pre-wrap text-white">
            <code dangerouslySetInnerHTML={{ __html: colored }} />
            <span className="inline-block w- h- bg-white/80 ml-1 animate-[blink_1s_step-end_infinite] translate-y-" />
          </pre>
        </div>
      </div>
      <style>{`@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}`}</style>
    </div>
  );
});