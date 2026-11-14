"use client";

import { useState, useMemo, Suspense } from "react";
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "@/features/courses";
import {
  studentCourseQueries,
  submitLessonTask,
  CourseFilterDropdown,
  useEnrolledCourses,
} from "@/features/student-courses";
import type { Task, TaskResult } from "@/features/student-courses";

function TasksContent() {
  const { courses, selectedId, isLoading: loadingCourses, selectCourse } = useEnrolledCourses();
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);

  const { data: course, isLoading: loadingCourse } = useQuery({
    ...courseQueries.detail(String(selectedId)),
    enabled: Boolean(selectedId),
  });

  const { data: summary, isLoading: loadingSummary } = useQuery({
    ...studentCourseQueries.courseSummary(String(selectedId)),
    enabled: Boolean(selectedId),
  });

  const loading = Boolean(selectedId) && (loadingCourse || loadingSummary);

  const completedLessons = useMemo(() => {
    if (!course?.sections) return [];
    const completedSet = new Set(summary?.completed_lesson_ids ?? []);
    return course.sections.flatMap((section) =>
      (section.lessons ?? [])
        .filter((lesson) => completedSet.has(lesson.id))
        .map((lesson) => ({
          ...lesson,
          course: { id: course.id, title: course.title },
          section: { id: section.id, title: section.title },
        })),
    );
  }, [course, summary]);

  if (loadingCourses) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-2xl h-16 border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">المهام التطبيقية</h1>

      {/* Course Dropdown */}
      <CourseFilterDropdown
        courses={courses}
        selectedId={selectedId}
        onSelect={selectCourse}
        hideIfSingle
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl h-16 border border-border animate-pulse" />
          ))}
        </div>
      ) : completedLessons.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            لا توجد مهام متاحة بعد — شاهد وأكمل دروسك أولاً لتفعيل المهام المرتبطة بها
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {completedLessons.map((lesson) => (
            <TaskAccordionItem
              key={lesson.id}
              lesson={lesson}
              isOpen={openLessonId === lesson.id}
              onToggle={() => setOpenLessonId(openLessonId === lesson.id ? null : lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Accordion Item with On-Demand Task Loading ── */
function TaskAccordionItem({
  lesson,
  isOpen,
  onToggle,
}: {
  lesson: {
    id: number;
    title: string;
    course: { id: number; title: string };
    section: { id: number; title: string };
  };
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { data: task, isLoading: loadingTask } = useQuery({
    ...studentCourseQueries.lessonTask(lesson.id),
    enabled: isOpen,
  });

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors text-right"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <ClipboardList className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{lesson.title}</p>
          <p className="text-xs text-muted-foreground">
            {lesson.course.title} • {lesson.section.title}
          </p>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-border p-4">
          {loadingTask ? (
            <div className="flex items-center gap-3 py-6 justify-center text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm">جارٍ تحميل المهمة...</span>
            </div>
          ) : !task ? (
            <div className="py-6 text-center text-muted-foreground text-sm">
              لا توجد مهمة تطبيقية مرفقة بهذا الدرس.
            </div>
          ) : (
            <InlineTask task={task} lessonId={lesson.id} />
          )}
        </div>
      )}
    </div>
  );
}

/* ── Inline Task Component ── */
function InlineTask({ task, lessonId }: { task: Task; lessonId: number }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<TaskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [_attempts, setAttempts] = useState(0);

  const questions = task.questions ?? [];
  const allAnswered = questions.length > 0 && questions.every((q) => answers[String(q.id)]);

  const handleSubmit = async () => {
    if (!allAnswered || loading) return;
    try {
      setLoading(true);
      const res = await submitLessonTask(lessonId, answers);
      setResult(res);
      setAttempts((prev) => prev + 1);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers({});
  };

  if (result) {
    const hasAttemptsRemaining = (result.attempts_remaining ?? 0) > 0;

    return (
      <div className="space-y-4">
        <div
          className={`rounded-xl p-4 flex items-center gap-3 ${
            result.passed
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}
        >
          {result.passed ? (
            <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
          )}
          <div>
            <p className={`font-bold ${result.passed ? "text-green-500" : "text-red-400"}`}>
              {result.passed ? "أحسنت! اجتزت المهمة 🎉" : "لم تجتز المهمة"}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              نتيجتك: <span className="font-bold">{result.score}%</span> — المطلوب:{" "}
              {task.pass_percentage ?? 70}%
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {questions.map((q, i) => {
            const fb =
              result.results?.[String(q.id)] || (result.results as Record<string, any>)?.[q.id];
            return (
              <div
                key={q.id}
                className={`rounded-xl p-3 border text-sm ${
                  fb?.correct
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <p className="font-medium text-foreground">
                  {i + 1}. {q.text || (q as Record<string, any>).question}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  إجابتك:{" "}
                  <span
                    className={
                      fb?.correct ? "text-green-500 font-medium" : "text-red-400 font-medium"
                    }
                  >
                    {answers[String(q.id)] || "—"}
                  </span>
                </p>
                {!fb?.correct && fb?.correct_answer && (
                  <p className="text-xs text-green-500 mt-0.5 font-medium">
                    الإجابة الصحيحة: {fb.correct_answer}
                  </p>
                )}
                {fb?.explanation && (
                  <p className="text-xs text-muted-foreground mt-1 pt-1 border-t border-border">
                    {fb.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {!result.passed && hasAttemptsRemaining && (
          <button
            type="button"
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            حاول مرة أخرى ({result.attempts_remaining} محاولة متبقية)
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        أجب على جميع الأسئلة — المطلوب {task.pass_percentage ?? 70}% للنجاح
      </p>
      {questions.map((q, i) => (
        <div key={q.id} className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {i + 1}. {q.text || (q as Record<string, any>).question}
          </p>
          {q.type === "mcq" && q.options && (
            <div className="space-y-2">
              {q.options.map((opt: string) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    answers[String(q.id)] === opt
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name={String(q.id)}
                    value={opt}
                    checked={answers[String(q.id)] === opt}
                    onChange={() => setAnswers((prev) => ({ ...prev, [String(q.id)]: opt }))}
                    className="accent-primary"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          )}
          {q.type === "true_false" && (
            <div className="flex gap-2">
              {["صح", "خطأ"].map((opt) => (
                <label
                  key={opt}
                  className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-colors ${
                    answers[String(q.id)] === opt
                      ? "border-primary bg-primary/5 text-primary font-medium"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name={String(q.id)}
                    value={opt}
                    checked={answers[String(q.id)] === opt}
                    onChange={() => setAnswers((prev) => ({ ...prev, [String(q.id)]: opt }))}
                    className="hidden"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          )}
          {q.type === "open" && (
            <textarea
              rows={3}
              value={answers[String(q.id)] ?? ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [String(q.id)]: e.target.value }))}
              placeholder="اكتب إجابتك هنا..."
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!allAnswered || loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "جاري التصحيح..." : "تسليم المهمة"}
        {!loading && <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl h-16 border border-border animate-pulse" />
          ))}
        </div>
      }
    >
      <TasksContent />
    </Suspense>
  );
}
