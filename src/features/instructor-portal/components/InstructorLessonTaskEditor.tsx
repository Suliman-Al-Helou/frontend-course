"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Save,
  Check,
  X,
  FileQuestion,
} from "lucide-react";
import { toast } from "sonner";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfirmModal from "@/components/shared/ConfirmModal";
import {
  instructorPortalQueries,
  instructorPortalKeys,
} from "../queries/instructor-portal.queries";
import { saveInstructorLessonTask, deleteInstructorLessonTask } from "../api";
import { validateTaskQuestion } from "../utils";
import type { TaskQuestion, InstructorTask } from "../types";

interface InstructorLessonTaskEditorProps {
  lessonId: number | string;
  lessonTitle: string;
  courseId: number | string;
  isOpen: boolean;
  onClose: () => void;
}

export function InstructorLessonTaskEditor({
  lessonId,
  lessonTitle,
  courseId,
  isOpen,
  onClose,
}: InstructorLessonTaskEditorProps) {
  const queryClient = useQueryClient();

  const [passPercentage, setPassPercentage] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [questions, setQuestions] = useState<TaskQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const isSubmittingRef = useRef(false);

  // Load existing task
  const {
    data: existingTask,
    isLoading,
    isError,
  } = useQuery({
    ...instructorPortalQueries.task(lessonId),
    enabled: isOpen,
    retry: false,
  });

  // Hydrate form when existing task is loaded
  useEffect(() => {
    if (existingTask) {
      setPassPercentage(existingTask.pass_percentage ?? 70);
      setMaxAttempts(existingTask.max_attempts ?? 3);
      setQuestions(Array.isArray(existingTask.questions) ? existingTask.questions : []);
    } else {
      // Default empty state for new task
      setPassPercentage(70);
      setMaxAttempts(3);
      setQuestions([]);
    }
  }, [existingTask, isOpen]);

  const handleAddQuestion = (type: "mcq" | "true_false") => {
    const newQuestion: TaskQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      question: "",
      options: type === "true_false" ? ["صح", "خطأ"] : ["الخيار الأول", "الخيار الثاني"],
      correct_answer: 0,
      explanation: "",
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, question: text } : q)));
  };

  const handleExplanationChange = (index: number, text: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, explanation: text } : q)));
  };

  const handleCorrectAnswerChange = (qIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, correct_answer: optionIndex } : q)),
    );
  };

  const handleOptionTextChange = (qIndex: number, optionIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = [...q.options];
        newOptions[optionIndex] = text;
        return { ...q, options: newOptions };
      }),
    );
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex || q.type !== "mcq") return q;
        if (q.options.length >= 6) {
          toast.error("الحد الأقصى للخيارات هو 6");
          return q;
        }
        return { ...q, options: [...q.options, `خيار ${q.options.length + 1}`] };
      }),
    );
  };

  const handleRemoveOption = (qIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex || q.type !== "mcq") return q;
        if (q.options.length <= 2) {
          toast.error("يجب الإبقاء على خيارين على الأقل");
          return q;
        }
        const newOptions = q.options.filter((_, optIdx) => optIdx !== optionIndex);
        let newCorrect = q.correct_answer;
        if (newCorrect >= newOptions.length) {
          newCorrect = 0;
        }
        return { ...q, options: newOptions, correct_answer: newCorrect };
      }),
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (questions.length === 0) {
      toast.error("يجب إضافة سؤال واحد على الأقل في المهمة");
      return;
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const validation = validateTaskQuestion(q);
      if (!validation.isValid) {
        toast.error(`السؤال رقم ${i + 1}: ${validation.error}`);
        return;
      }
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await saveInstructorLessonTask(lessonId, {
        pass_percentage: Number(passPercentage),
        max_attempts: Number(maxAttempts),
        questions,
      });

      // Invalidate relevant queries
      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.task(lessonId),
      });
      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });

      toast.success("تم حفظ مهمة الدرس التفاعلية بنجاح");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل حفظ المهمة");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = () => {
    if (isSubmittingRef.current) return;
    setIsDeleteConfirmOpen(true);
  };

  const executeDeleteTask = async () => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsDeleting(true);

    try {
      await deleteInstructorLessonTask(lessonId);
      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.task(lessonId),
      });
      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });

      toast.success("تم حذف المهمة من الدرس بنجاح");
      setIsDeleteConfirmOpen(false);
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "فشل حذف المهمة (قد تحتوي محاولات سابقة للطلاب)",
      );
    } finally {
      isSubmittingRef.current = false;
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalHeader
          title={`محرر المهمة التفاعلية: ${lessonTitle}`}
          description="إعداد الأسئلة التقييمية ونسب النجاح لاجتياز الدرس (عقد TaskQuestion)"
        />

        <ModalBody className="space-y-6 max-h-[75vh] overflow-y-auto pe-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs">جاري تحميل بيانات المهمة والأسئلة...</p>
            </div>
          ) : (
            <form id="task-editor-form" onSubmit={handleSave} className="space-y-6">
              {/* Task Integrity Notice Banner */}
              {existingTask && (existingTask.attempts_count ?? 0) > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">تنبيه النزاهة التعليمية (Task Integrity Notice)</p>
                    <p>
                      أجرى الطلاب {existingTask.attempts_count} محاولة سابقة على هذه المهمة. التعديل
                      سيسري على المحاولات المستقبلية فقط ولن يغير الدرجات والمحاولات السابقة المسجلة
                      للطلاب.
                    </p>
                  </div>
                </div>
              )}

              {/* Task Meta Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/60 border border-border">
                <div className="space-y-2">
                  <Label htmlFor="pass-percentage" className="text-xs font-bold text-foreground">
                    نسبة النجاح المطلوبة (%) *
                  </Label>
                  <Input
                    id="pass-percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={passPercentage}
                    onChange={(e) => setPassPercentage(Number(e.target.value) || 70)}
                    className="min-h-[44px]"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    الافتراضي: 70%. الحد الأدنى لاجتياز المهمة بنجاح.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-attempts" className="text-xs font-bold text-foreground">
                    الحد الأقصى للمحاولات المتاحة *
                  </Label>
                  <Input
                    id="max-attempts"
                    type="number"
                    min="1"
                    max="50"
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(Number(e.target.value) || 3)}
                    className="min-h-[44px]"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    الافتراضي: 3 محاولات لكل طالب لتعزيز التعلم الذاتي.
                  </p>
                </div>
              </div>

              {/* Questions List Header */}
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <FileQuestion className="w-4 h-4 text-primary" />
                    <span>أسئلة التقييم ({questions.length})</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    يدعم العقد أسئلة الاختيار من متعدد وأسئلة الصح والخطأ.
                  </p>
                </div>

                {/* Add Question Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddQuestion("mcq")}
                    className="min-h-[38px] text-xs font-bold gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ اختيار من متعدد</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddQuestion("true_false")}
                    className="min-h-[38px] text-xs font-bold gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ صح / خطأ</span>
                  </Button>
                </div>
              </div>

              {/* Questions Empty State */}
              {questions.length === 0 ? (
                <div className="py-8 text-center rounded-xl border border-dashed border-border p-6 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">لا توجد أسئلة مضافة بعد</p>
                    <p className="text-xs text-muted-foreground">
                      أضف سؤال اختيار من متعدد أو صح/خطأ لإنشاء المهمة التفاعلية.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {questions.map((q, qIndex) => (
                    <div
                      key={q.id || qIndex}
                      className="p-4 rounded-xl border border-border/80 bg-card space-y-4 relative group"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {qIndex + 1}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            {q.type === "mcq" ? "اختيار من متعدد" : "صح / خطأ"}
                          </span>
                        </div>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          className="w-8 h-8 text-muted-foreground hover:text-destructive"
                          title="حذف هذا السؤال"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Question Text */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-foreground">نص السؤال *</Label>
                        <Input
                          type="text"
                          placeholder="اكتب نص السؤال هنا..."
                          value={q.question}
                          onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                          className="min-h-[44px]"
                          required
                        />
                      </div>

                      {/* Options Area */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-foreground flex items-center justify-between">
                          <span>الخيارات (حدد الدائرة بجانب الإجابة الصحيحة) *</span>
                          {q.type === "mcq" && (
                            <button
                              type="button"
                              onClick={() => handleAddOption(qIndex)}
                              className="text-[11px] text-primary hover:underline font-bold inline-flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>إضافة خيار</span>
                            </button>
                          )}
                        </Label>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = q.correct_answer === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`flex items-center gap-2.5 p-2 rounded-lg border transition-colors ${
                                  isCorrect
                                    ? "border-primary/50 bg-primary/5"
                                    : "border-border/60 bg-muted/30"
                                }`}
                              >
                                <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                  <input
                                    type="radio"
                                    name={`correct_${q.id || qIndex}`}
                                    checked={isCorrect}
                                    onChange={() => handleCorrectAnswerChange(qIndex, optIdx)}
                                    className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                                  />
                                  <span className="text-xs font-bold text-muted-foreground">
                                    {q.type === "true_false" ? opt : `الخيار ${optIdx + 1}`}
                                  </span>
                                </label>

                                {q.type === "mcq" ? (
                                  <Input
                                    type="text"
                                    value={opt}
                                    onChange={(e) =>
                                      handleOptionTextChange(qIndex, optIdx, e.target.value)
                                    }
                                    className="min-h-[38px] text-xs flex-1 bg-background"
                                    required
                                  />
                                ) : (
                                  <span className="text-xs font-medium text-foreground flex-1">
                                    {opt}
                                  </span>
                                )}

                                {q.type === "mcq" && q.options.length > 2 && (
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleRemoveOption(qIndex, optIdx)}
                                    className="w-7 h-7 text-muted-foreground hover:text-destructive shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">
                          تفسير الإجابة (يظهر للطالب بعد تسليم المهمة لتعزيز الفهم)
                        </Label>
                        <textarea
                          placeholder="اشرح لماذا هذه هي الإجابة الصحيحة..."
                          value={q.explanation || ""}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleExplanationChange(qIndex, e.target.value)
                          }
                          rows={2}
                          className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          )}
        </ModalBody>

        <ModalFooter className="flex items-center justify-between">
          <div>
            {existingTask?.id && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDeleteTask}
                disabled={isDeleting || isSubmitting}
                className="min-h-[44px] text-xs font-bold gap-1.5"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>حذف المهمة</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isDeleting}
              className="min-h-[44px]"
            >
              إلغاء
            </Button>

            <Button
              type="submit"
              form="task-editor-form"
              disabled={isSubmitting || isDeleting || questions.length === 0}
              className="min-h-[44px] gap-2 font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ المهمة التفاعلية</span>
                </>
              )}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          if (!isDeleting) setIsDeleteConfirmOpen(false);
        }}
        onConfirm={executeDeleteTask}
        title="حذف المهمة التفاعلية"
        description="هل أنت متأكد من حذف هذه المهمة بالكامل من الدرس؟"
        isLoading={isDeleting}
      />
    </>
  );
}
