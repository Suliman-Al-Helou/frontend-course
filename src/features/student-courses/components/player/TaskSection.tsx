"use client";

import { useState, useRef } from "react";
import { CheckCircle2, XCircle, RefreshCw, Send, HelpCircle, Loader2 } from "lucide-react";
import { notify } from "@/components/ui/sonner";
import { submitLessonTask } from "../../api";
import type { Task, TaskResult } from "../../types";

export interface TaskSectionProps {
  task: Task;
  lessonId: number | string;
  onPassed?: () => void;
}

export function TaskSection({ task, lessonId, onPassed }: TaskSectionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<TaskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // قفل التزامن لمنع الإرسال المزدوج
  const isSubmittingRef = useRef<boolean>(false);

  const allAnswered = task.questions.length > 0 && task.questions.every((q) => !!answers[q.id]);

  const handleSubmit = async () => {
    if (isSubmittingRef.current || !allAnswered) return;
    try {
      isSubmittingRef.current = true;
      setLoading(true);

      const res = await submitLessonTask(lessonId, answers);
      setResult(res);
      setAttempts((prev) => prev + 1);

      if (res.passed) {
        onPassed?.();
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "تعذر إرسال إجابات المهمة، يرجى المحاولة مرة أخرى.";
      notify.error(message);
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers({});
  };

  // ── عرض نتيجة الاختبار ──────────────────────────────────────────
  if (result) {
    const isPassed = result.passed;
    const canRetry = attempts < task.max_attempts;

    return (
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6">
        {/* النتيجة الإجمالية */}
        <div
          role="alert"
          aria-live="polite"
          className={`rounded-2xl p-5 sm:p-6 flex items-center gap-4 border ${
            isPassed
              ? "bg-success/10 border-success/30 text-success"
              : "bg-destructive/10 border-destructive/30 text-destructive"
          }`}
        >
          {isPassed ? (
            <CheckCircle2 className="w-10 h-10 flex-shrink-0" aria-hidden="true" />
          ) : (
            <XCircle className="w-10 h-10 flex-shrink-0" aria-hidden="true" />
          )}
          <div>
            <h3 className="text-xl font-bold leading-tight">
              {isPassed ? "أحسنت! لقد اجتزت المهمة بنجاح 🎉" : "للأسف، لم تجتز المهمة هذه المرة"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5">
              نتيجتك: <span className="font-bold text-foreground">{result.score}%</span> — درجة
              النجاح المطلوبة: {task.pass_percentage}%
            </p>
          </div>
        </div>

        {/* مراجعة الإجابات والتغذية الراجعة */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground text-sm">مراجعة الإجابات:</h4>
          {task.questions.map((q, i) => {
            const fb = result.results?.[q.id];
            const isCorrect = fb?.correct;

            return (
              <div
                key={q.id}
                className={`rounded-xl p-4 sm:p-5 border transition-colors ${
                  isCorrect
                    ? "border-success/30 bg-success/5"
                    : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {i + 1}. {q.text}
                </p>
                <div className="mt-2.5 text-xs space-y-1">
                  <p className="text-muted-foreground">
                    إجابتك:{" "}
                    <span
                      className={`font-semibold ${isCorrect ? "text-success" : "text-destructive"}`}
                    >
                      {answers[q.id] || "لم تجب"}
                    </span>
                  </p>
                  {!isCorrect && fb?.correct_answer && (
                    <p className="text-success font-semibold">
                      الإجابة الصحيحة: {fb.correct_answer}
                    </p>
                  )}
                  {fb?.explanation && (
                    <p className="text-muted-foreground pt-2 mt-2 border-t border-border/50">
                      💡 {fb.explanation}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* أزرار الإجراءات بعد النتيجة */}
        <div className="pt-2 flex items-center justify-between border-t border-border">
          <span className="text-xs text-muted-foreground">
            المحاولات: {attempts} من {task.max_attempts}
          </span>

          {!isPassed && canRetry && (
            <button
              type="button"
              onClick={handleRetry}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:bg-muted/50 active:scale-[0.99] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>إعادة المحاولة</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── نموذج الإجابة عن الأسئلة ──────────────────────────────────
  return (
    <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">مهمة الدرس التطبيقية</h3>
          <p className="text-xs text-muted-foreground mt-1">
            أجب عن الأسئلة التالية لتثبيت معلوماتك واجتياز الدرس
          </p>
        </div>
        <div className="text-xs text-muted-foreground text-end">
          <span className="font-semibold text-foreground">نسبة النجاح:</span> {task.pass_percentage}
          %
        </div>
      </div>

      <div className="space-y-6">
        {task.questions.map((q, idx) => (
          <fieldset key={q.id} className="space-y-3">
            <legend className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
              <span>
                {idx + 1}. {q.text}
              </span>
            </legend>

            <div className="space-y-2">
              {q.options?.map((option, optIdx) => {
                const isSelected = answers[q.id] === option;
                return (
                  <label
                    key={optIdx}
                    className={`min-h-[44px] flex items-center gap-3 px-4 py-3 rounded-xl border text-sm cursor-pointer transition-colors motion-reduce:transition-none focus-within:ring-2 focus-within:ring-primary/40 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-background hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      checked={isSelected}
                      onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: option }))}
                      className="w-4 h-4 accent-primary focus:ring-primary/30"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {Object.keys(answers).length} من {task.questions.length} أسئلة مجاب عنها
        </span>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAnswered || loading}
          aria-busy={loading}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>جارٍ التحقق...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>إرسال الإجابات</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
