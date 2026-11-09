"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Check, X, Award, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { adminCourseQueries } from "../../queries/adminCourses.queries";
import { useSaveTaskMutation } from "../../queries/adminCourses.mutations";
import type { AdminQuestion, AdminTaskPayload } from "../../types";

interface Props {
  lessonId: number;
  lessonTitle: string;
  onClose: () => void;
}

export default function LessonTaskEditor({ lessonId, lessonTitle, onClose }: Props) {
  const isSavingRef = useRef(false);

  const { data: initialTask, isLoading } = useQuery(adminCourseQueries.task(lessonId));
  const saveMutation = useSaveTaskMutation(lessonId);

  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [passPercentage, setPassPercentage] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [hasExistingTask, setHasExistingTask] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (initialTask) {
      setQuestions(initialTask.questions ?? []);
      setPassPercentage(initialTask.pass_percentage ?? 70);
      setMaxAttempts(initialTask.max_attempts ?? 3);
      setHasExistingTask(true);
    }
  }, [initialTask]);

  const addQuestion = (type: AdminQuestion["type"]) => {
    const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const base: AdminQuestion = { id, type, text: "", explanation: "" };

    if (type === "mcq") {
      setQuestions((prev) => [
        ...prev,
        { ...base, options: ["", "", "", ""], correct_answer: "" },
      ]);
    } else if (type === "true_false") {
      setQuestions((prev) => [...prev, { ...base, correct_answer: "صح" }]);
    } else {
      setQuestions((prev) => [...prev, base]);
    }
  };

  const updateQuestion = (id: string, field: keyof AdminQuestion, value: unknown) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qId: string, optIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const opts = [...(q.options ?? [])];
        opts[optIndex] = text;
        return { ...q, options: opts };
      })
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSave = async () => {
    if (isSavingRef.current || saveMutation.isPending) return;

    // التحقق من صحة الأسئلة
    if (questions.length === 0) {
      setSaveError("يرجى إضافة سؤال واحد على الأقل قبل الحفظ.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        setSaveError(`السؤال رقم ${i + 1} لا يحتوي على نص.`);
        return;
      }
    }

    setSaveError("");
    isSavingRef.current = true;

    try {
      const payload: AdminTaskPayload = {
        questions,
        pass_percentage: passPercentage,
        max_attempts: maxAttempts,
      };

      await saveMutation.mutateAsync({
        payload,
        isUpdate: hasExistingTask,
      });

      onClose();
    } catch (err) {
      console.error("فشل حفظ مهمة الدرس:", err);
      setSaveError("تعذر حفظ المهمة. يرجى مراجعة البيانات والمحاولة مجدداً.");
    } finally {
      isSavingRef.current = false;
    }
  };

  return (
    <div className="bg-muted/30 border border-border rounded-2xl p-5 my-4 space-y-5 animate-in fade-in-0 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h4 className="font-bold text-foreground text-sm">مهمة / اختبار الدرس</h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{lessonTitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Settings */}
          <div className="grid sm:grid-cols-2 gap-4 bg-card p-4 rounded-xl border border-border">
            <div className="space-y-1.5">
              <label htmlFor="task-pass-percentage" className="text-xs font-semibold text-foreground">
                نسبة النجاح المطلوبة (%)
              </label>
              <input
                id="task-pass-percentage"
                type="number"
                min="10"
                max="100"
                value={passPercentage}
                onChange={(e) => setPassPercentage(Number.parseInt(e.target.value, 10) || 70)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="task-max-attempts" className="text-xs font-semibold text-foreground">
                الحد الأقصى للمحاولات
              </label>
              <input
                id="task-max-attempts"
                type="number"
                min="1"
                max="10"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number.parseInt(e.target.value, 10) || 3)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-foreground">
                الأسئلة ({questions.length})
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-8 text-xs font-medium"
                  onClick={() => addQuestion("mcq")}
                >
                  <Plus className="w-3.5 h-3.5 ml-1" /> خيارات متعددة
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-8 text-xs font-medium"
                  onClick={() => addQuestion("true_false")}
                >
                  <Plus className="w-3.5 h-3.5 ml-1" /> صح / خطأ
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-8 text-xs font-medium"
                  onClick={() => addQuestion("open")}
                >
                  <Plus className="w-3.5 h-3.5 ml-1" /> سؤال مقالي
                </Button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 bg-card border border-dashed border-border rounded-xl p-4">
                <HelpCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  لا توجد أسئلة مضافة بعد. اختر نوع السؤال من الأعلى لإضافته.
                </p>
              </div>
            ) : (
              questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-card border border-border rounded-xl p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      سؤال {idx + 1} ({q.type === "mcq" ? "خيارات متعددة" : q.type === "true_false" ? "صح أو خطأ" : "سؤال مقالي"})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      className="text-destructive hover:bg-destructive/10 p-1 rounded-lg transition-colors"
                      aria-label="حذف السؤال"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question Text */}
                  <input
                    placeholder="اكتب نص السؤال هنا..."
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  {/* MCQ Options */}
                  {q.type === "mcq" && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        الخيارات (اختر الإجابة الصحيحة عبر النقر على الدائرة):
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {(q.options ?? ["", "", "", ""]).map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuestion(q.id, "correct_answer", opt)}
                              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                q.correct_answer === opt && opt.trim()
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-input bg-background"
                              }`}
                              title="تحديد كإجابة صحيحة"
                            >
                              {q.correct_answer === opt && opt.trim() && (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                            </button>
                            <input
                              placeholder={`الخيار ${optIdx + 1}`}
                              value={opt}
                              onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                              className="flex-1 h-8 rounded-lg border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* True / False Options */}
                  {q.type === "true_false" && (
                    <div className="flex items-center gap-4 pt-1">
                      <span className="text-xs text-muted-foreground">الإجابة الصحيحة:</span>
                      {(["صح", "خطأ"] as const).map((choice) => (
                        <label
                          key={choice}
                          className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`tf_${q.id}`}
                            checked={q.correct_answer === choice}
                            onChange={() => updateQuestion(q.id, "correct_answer", choice)}
                            className="text-primary focus:ring-primary"
                          />
                          {choice}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="pt-1">
                    <input
                      placeholder="تفسير أو شرح الإجابة الصحيحة (يظهر للطالب بعد التسليم)..."
                      value={q.explanation ?? ""}
                      onChange={(e) => updateQuestion(q.id, "explanation", e.target.value)}
                      className="w-full h-8 rounded-lg border border-input bg-muted/40 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {saveError && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg">
              {saveError}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={saveMutation.isPending}
              className="rounded-xl h-9"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => void handleSave()}
              disabled={saveMutation.isPending}
              className="rounded-xl h-9 px-5 bg-primary text-primary-foreground font-medium"
            >
              {saveMutation.isPending ? "جارٍ الحفظ..." : "حفظ مهمة الدرس"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

