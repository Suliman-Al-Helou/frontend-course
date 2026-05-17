'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, ChevronDown, ChevronUp, CheckCircle2, XCircle, RefreshCw, ChevronLeft } from 'lucide-react';
import api, { lessonApi } from '@/lib/api';
import type { Task, TaskResult } from '@/types';

interface TaskItem {
  id: number;
  questions: any[];
  pass_percentage: number;
  max_attempts: number;
  lesson: { id: number; title: string };
  course: { id: number; title: string };
}

export default function TasksPage() {
  const [tasks,   setTasks]   = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId,  setOpenId]  = useState<number | null>(null);

useEffect(() => {
  api.get('/my-courses').then(async res => {
    const approved = res.data.filter((e: any) => e.status === 'approved');

    // جيب كل الكورسات بالـ parallel
    const courses = await Promise.all(
      approved.map((e: any) => api.get(`/courses/${e.course.id}`).then(r => r.data))
    );

    const allLessons = courses.flatMap(course =>
      (course.sections ?? []).flatMap((s: any) =>
        (s.lessons ?? []).map((l: any) => ({ ...l, course }))
      )
    );

    // جيب كل الـ progress بالـ parallel
    const progressResults = await Promise.allSettled(
      allLessons.map(l => api.get(`/lessons/${l.id}/progress`))
    );

    const completedLessons = allLessons.filter((_, i) => {
      const r = progressResults[i];
      return r.status === 'fulfilled' && r.value.data.completed;
    });

    // جيب كل المهام بالـ parallel
    const taskResults = await Promise.allSettled(
      completedLessons.map(l => api.get(`/lessons/${l.id}/task`))
    );

    const result: TaskItem[] = [];
    taskResults.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        result.push({ ...r.value.data, lesson: completedLessons[i], course: completedLessons[i].course });
      }
    });

    setTasks(result);
  }).finally(() => setLoading(false));
}, []);

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-card rounded-2xl h-16 border border-border animate-pulse" />
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">المهام</h1>

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">لا توجد مهام بعد — أكمل دروسك أولاً</p>
        </div>
      ) : (
        <div className="space-y-3">
{tasks.map((task, i) => (
  <div key={`${task.id}-${task.lesson.id}`} className="bg-card border border-border rounded-2xl overflow-hidden">
    {/* Header */}
    <button
      onClick={() => setOpenId(openId === i ? null : i)}
      className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors text-right"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <ClipboardList className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{task.lesson.title}</p>
        <p className="text-xs text-muted-foreground">{task.course.title}</p>
      </div>
      {openId === i
        ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
    </button>

    {openId === i && (
      <div className="border-t border-border p-4">
        <InlineTask task={task} />
      </div>
    )}
  </div>
))}
        </div>
      )}
    </div>
  );
}

/* ── Inline Task Component ── */
function InlineTask({ task }: { task: TaskItem }) {
  const [answers,  setAnswers]  = useState<Record<string, string>>({});
  const [result,   setResult]   = useState<TaskResult | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [attempts, setAttempts] = useState(0);

  const allAnswered = task.questions.every((q: any) => answers[q.id]);

  const handleSubmit = async () => {
    if (!allAnswered) return;
    try {
      setLoading(true);
      const res = await lessonApi.submitTask(task.lesson.id, answers);
      setResult(res.data);
      setAttempts(prev => prev + 1);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers({});
  };

  /* النتيجة */
  if (result) return (
    <div className="space-y-4">
      <div className={`rounded-xl p-4 flex items-center gap-3 ${
        result.passed ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
      }`}>
        {result.passed
          ? <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
          : <XCircle      className="w-8 h-8 text-red-400 flex-shrink-0"   />}
        <div>
          <p className={`font-bold ${result.passed ? 'text-green-500' : 'text-red-400'}`}>
            {result.passed ? 'أحسنت! اجتزت المهمة 🎉' : 'لم تجتز المهمة'}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            نتيجتك: <span className="font-bold">{result.score}%</span> — المطلوب: {task.pass_percentage}%
          </p>
        </div>
      </div>

      {/* التغذية الراجعة */}
      <div className="space-y-3">
        {task.questions.map((q: any, i: number) => {
          const fb = result.results?.[q.id];
          return (
            <div key={q.id} className={`rounded-xl p-3 border text-sm ${
              fb?.correct ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'
            }`}>
              <p className="font-medium text-foreground">{i + 1}. {q.text}</p>
              <p className="text-xs text-muted-foreground mt-1">
                إجابتك: <span className={fb?.correct ? 'text-green-500' : 'text-red-400'}>{answers[q.id]}</span>
              </p>
              {!fb?.correct && <p className="text-xs text-green-500 mt-0.5">الصحيح: {fb?.correct_answer}</p>}
              {fb?.explanation && <p className="text-xs text-muted-foreground mt-1 pt-1 border-t border-border">{fb.explanation}</p>}
            </div>
          );
        })}
      </div>

      {!result.passed && attempts < task.max_attempts && (
        <button onClick={handleRetry}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
          <RefreshCw className="w-4 h-4" />
          حاول مرة أخرى ({task.max_attempts - attempts} محاولة متبقية)
        </button>
      )}
    </div>
  );

  /* الأسئلة */
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">أجب على جميع الأسئلة — المطلوب {task.pass_percentage}% للنجاح</p>

      {task.questions.map((q: any, i: number) => (
        <div key={q.id} className="space-y-2">
          <p className="text-sm font-medium text-foreground">{i + 1}. {q.text}</p>

          {q.type === 'mcq' && q.options && (
            <div className="space-y-2">
              {q.options.map((opt: string) => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  answers[q.id] === opt ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-muted'
                }`}>
                  <input type="radio" name={q.id} value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className="accent-primary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'true_false' && (
            <div className="flex gap-2">
              {['صح', 'خطأ'].map(opt => (
                <label key={opt} className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-colors ${
                  answers[q.id] === opt ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border hover:bg-muted'
                }`}>
                  <input type="radio" name={q.id} value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className="hidden" />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {q.type === 'open' && (
            <textarea rows={3} value={answers[q.id] ?? ''}
              onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="اكتب إجابتك هنا..."
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          )}
        </div>
      ))}

      <button onClick={handleSubmit} disabled={!allAnswered || loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'جاري التصحيح...' : 'تسليم المهمة'}
        {!loading && <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}