'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, ChevronLeft } from 'lucide-react';
import { lessonApi } from '@/lib/api';
import type { Task, TaskResult } from '@/types';

interface TaskSectionProps {
  task:     Task;
  lessonId: number;
  onPassed: () => void;
}

export default function TaskSection({ task, lessonId, onPassed }: TaskSectionProps) {
  const [answers,  setAnswers]  = useState<Record<string, string>>({});
  const [result,   setResult]   = useState<TaskResult | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [attempts, setAttempts] = useState(0);

  const allAnswered = task.questions.every(q => answers[q.id]);

  const handleSubmit = async () => {
    if (!allAnswered) return;
    try {
      setLoading(true);
      const res = await lessonApi.submitTask(lessonId, answers);
      setResult(res.data);
      setAttempts(prev => prev + 1);
      if (res.data.passed) onPassed();
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

  // ── عرض النتيجة ──────────────────────────────────────────
  if (result) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        {/* النتيجة */}
        <div className={`rounded-xl p-5 flex items-center gap-4 ${
          result.passed
            ? 'bg-green-500/10 border border-green-500/20'
            : 'bg-red-500/10 border border-red-500/20'
        }`}>
          {result.passed
            ? <CheckCircle2 className="w-10 h-10 text-green-500 flex-shrink-0" />
            : <XCircle      className="w-10 h-10 text-red-400 flex-shrink-0"   />}
          <div>
            <p className={`text-xl font-bold ${result.passed ? 'text-green-500' : 'text-red-400'}`}>
              {result.passed ? 'أحسنت! اجتزت المهمة 🎉' : 'لم تجتز المهمة'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              نتيجتك: <span className="font-bold">{result.score}%</span>
              {' '} — المطلوب: {task.pass_percentage}%
            </p>
          </div>
        </div>

        {/* التغذية الراجعة */}
        <div className="space-y-4">
          {task.questions.map((q, i) => {
            const fb = result.feedback.find(f => f.question_id === q.id);
            return (
              <div key={q.id} className={`rounded-xl p-4 border ${
                fb?.correct
                  ? 'border-green-500/20 bg-green-500/5'
                  : 'border-red-500/20 bg-red-500/5'
              }`}>
                <p className="text-sm font-medium text-foreground">
                  {i + 1}. {q.text}
                </p>
                <p className="text-xs mt-2 text-muted-foreground">
                  إجابتك:{' '}
                  <span className={fb?.correct ? 'text-green-500' : 'text-red-400'}>
                    {answers[q.id]}
                  </span>
                </p>
                {!fb?.correct && (
                  <p className="text-xs mt-1 text-green-500">
                    الصحيح: {fb?.correct_answer}
                  </p>
                )}
                {fb?.explanation && (
                  <p className="text-xs mt-2 text-muted-foreground border-t border-border pt-2">
                    {fb.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* زر المحاولة مجدداً */}
        {!result.passed && attempts < task.max_attempts && (
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            حاول مرة أخرى ({task.max_attempts - attempts} محاولة متبقية)
          </button>
        )}
      </div>
    );
  }

  // ── عرض الأسئلة ──────────────────────────────────────────
  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">مهمة الدرس</h3>
        <p className="text-sm text-muted-foreground mt-1">
          أجب على جميع الأسئلة — المطلوب {task.pass_percentage}% للنجاح
        </p>
      </div>

      <div className="space-y-6">
        {task.questions.map((q, i) => (
          <div key={q.id} className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {i + 1}. {q.text}
            </p>

            {/* MCQ */}
            {q.type === 'mcq' && q.options && (
              <div className="space-y-2">
                {q.options.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      answers[q.id] === opt
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      className="accent-primary"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* True/False */}
            {q.type === 'true_false' && (
              <div className="flex gap-3">
                {['صح', 'خطأ'].map(opt => (
                  <label
                    key={opt}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                      answers[q.id] === opt
                        ? 'border-primary bg-primary/5 text-primary font-medium'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      className="hidden"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {/* Open */}
            {q.type === 'open' && (
              <textarea
                rows={3}
                value={answers[q.id] ?? ''}
                onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                placeholder="اكتب إجابتك هنا..."
                className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'جاري التصحيح...' : 'تسليم المهمة'}
        {!loading && <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}