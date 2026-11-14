"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, Save, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notify } from "@/components/ui/sonner";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { faqQueries } from "../queries/faq.queries";
import { useFaqMutations } from "../queries/faq.mutations";
import type { FaqItem } from "../types";

function formatFaqsCount(count: number): string {
  if (count === 0) return "لا توجد أسئلة شائعة";
  if (count === 1) return "سؤال واحد";
  if (count === 2) return "سؤالان";
  if (count >= 3 && count <= 10) return `${count} أسئلة`;
  return `${count} سؤالاً`;
}

export default function ManageFaqTab() {
  const { data: rawFaqs = [], isLoading } = useQuery(faqQueries.adminList());
  const { createFaq, updateFaq, deleteFaq } = useFaqMutations();

  const faqs = Array.isArray(rawFaqs) ? rawFaqs : [];

  // Local draft state for inline editing
  const [drafts, setDrafts] = useState<Record<number, { question: string; answer: string }>>({});
  const [expanded, setExpanded] = useState<number | null>(null);

  // New question form
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Deletion confirm modal
  const [deletingFaq, setDeletingFaq] = useState<FaqItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeletingRef = useRef(false);

  // Concurrency locks
  const isAddingRef = useRef(false);
  const savingIdRef = useRef<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const getFaqValues = (faq: FaqItem) => {
    return drafts[faq.id] ?? { question: faq.question, answer: faq.answer };
  };

  const updateDraft = (id: number, field: "question" | "answer", val: string) => {
    setDrafts((prev) => {
      const current = prev[id] ?? {
        question: faqs.find((f) => f.id === id)?.question ?? "",
        answer: faqs.find((f) => f.id === id)?.answer ?? "",
      };
      return {
        ...prev,
        [id]: { ...current, [field]: val },
      };
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim() || isAddingRef.current) return;

    isAddingRef.current = true;
    try {
      await createFaq.mutateAsync({ question: newQ.trim(), answer: newA.trim() });
      notify.success("تمت إضافة السؤال بنجاح");
      setNewQ("");
      setNewA("");
      setShowAddForm(false);
    } catch {
      notify.error("تعذر إضافة السؤال، يرجى المحاولة مجدداً");
    } finally {
      isAddingRef.current = false;
    }
  };

  const handleUpdate = async (faq: FaqItem) => {
    if (savingIdRef.current === faq.id) return;
    const current = getFaqValues(faq);

    if (!current.question.trim() || !current.answer.trim()) {
      notify.error("لا يمكن حفظ سؤال أو إجابة فارغة");
      return;
    }

    savingIdRef.current = faq.id;
    setSavingId(faq.id);
    try {
      await updateFaq.mutateAsync({
        id: faq.id,
        data: { question: current.question.trim(), answer: current.answer.trim() },
      });
      notify.success("تم حفظ تعديلات السؤال بنجاح");
      // Clean draft
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[faq.id];
        return next;
      });
    } catch {
      notify.error("تعذر حفظ التعديلات، يرجى المحاولة مجدداً");
    } finally {
      savingIdRef.current = null;
      setSavingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingFaq || isDeletingRef.current) return;
    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      await deleteFaq.mutateAsync(deletingFaq.id);
      notify.success("تم حذف السؤال بنجاح");
      setDeletingFaq(null);
    } catch {
      notify.error("تعذر حذف السؤال، يرجى المحاولة لاحقاً");
    } finally {
      setIsDeleting(false);
      isDeletingRef.current = false;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Top Header ─────────────────────────────────────────── */}
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span>إدارة الأسئلة الشائعة (FAQs)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatFaqsCount(faqs.length)} منشور في قسم الأسئلة بالصفحة الرئيسية
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          className="rounded-xl h-10 px-4 gap-2 text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "إغلاق النموذج" : "+ إضافة سؤال جديد"}</span>
        </Button>
      </Card>

      {/* ─── Add New Question Form ──────────────────────────────── */}
      {showAddForm && (
        <Card className="p-5 border-primary/30 space-y-4 animate-in fade-in-0 duration-200">
          <h3 className="text-sm font-bold text-foreground">إضافة سؤال شائع جديد</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label
                  htmlFor="new-faq-q"
                  className="text-xs font-semibold text-foreground"
                >
                  نص السؤال *
                </Label>
                <Input
                  id="new-faq-q"
                  type="text"
                  value={newQ}
                  onChange={(e) => setNewQ(e.target.value)}
                  placeholder="مثال: كيف أتمكن من استرداد رسوم الكورس؟"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="new-faq-a"
                  className="text-xs font-semibold text-foreground"
                >
                  الإجابة النموذجية *
                </Label>
                <textarea
                  id="new-faq-a"
                  rows={3}
                  value={newA}
                  onChange={(e) => setNewA(e.target.value)}
                  placeholder="اكتب الإجابة بوضوح ودقة للزوار..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 resize-none transition-colors motion-reduce:transition-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="rounded-xl h-9 text-xs"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={createFaq.isPending}
                className="rounded-xl h-9 text-xs font-semibold"
              >
                حفظ السؤال
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ─── List of FAQs ───────────────────────────────────────── */}
      {isLoading ? (
        <Card className="flex flex-col items-center justify-center p-12 space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">جارٍ تحميل الأسئلة الشائعة...</p>
        </Card>
      ) : faqs.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">لا توجد أسئلة شائعة بعد</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            أضف أول سؤال وجواب ليظهر مباشرة في قسم الأسئلة الشائعة بالصفحة الرئيسية.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isExpanded = expanded === faq.id;
            const values = getFaqValues(faq);
            const isSaving = savingId === faq.id;
            const hasDraft = Boolean(drafts[faq.id]);

            return (
              <Card
                key={faq.id}
                className="overflow-hidden hover:border-primary/30 transition-colors"
              >
                {/* Collapsed Header */}
                <div className="flex items-center justify-between p-4 gap-3 bg-card">
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : faq.id)}
                    className="flex-1 flex items-center justify-between text-right text-sm font-bold text-foreground gap-3 hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                    aria-expanded={isExpanded}
                  >
                    <span className="truncate">{faq.question || "سؤال بدون عنوان"}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingFaq(faq)}
                      className="w-8 h-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      aria-label="حذف السؤال"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Inline Edit Body */}
                {isExpanded && (
                  <div className="p-4 border-t border-border bg-muted/20 space-y-3 animate-in fade-in-0 duration-150">
                    <div className="space-y-1">
                      <Label
                        htmlFor={`faq-edit-q-${faq.id}`}
                        className="text-xs font-semibold text-foreground"
                      >
                        السؤال:
                      </Label>
                      <Input
                        id={`faq-edit-q-${faq.id}`}
                        type="text"
                        value={values.question}
                        onChange={(e) => updateDraft(faq.id, "question", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor={`faq-edit-a-${faq.id}`}
                        className="text-xs font-semibold text-foreground"
                      >
                        الإجابة:
                      </Label>
                      <textarea
                        id={`faq-edit-a-${faq.id}`}
                        rows={3}
                        value={values.answer}
                        onChange={(e) => updateDraft(faq.id, "answer", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 resize-none transition-colors motion-reduce:transition-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-muted-foreground">
                        {hasDraft ? "يوجد تعديلات غير محفوظة" : "البيانات مطابقة للسيرفر"}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleUpdate(faq)}
                        disabled={isSaving}
                        loading={isSaving}
                        className="rounded-xl h-9 px-4 text-xs font-semibold"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>حفظ التعديلات</span>
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingFaq)}
        title="تأكيد حذف السؤال"
        description={`هل أنت متأكد من رغبتك في حذف السؤال "${deletingFaq?.question}"؟ سيتم إزالته فوراً من الصفحة الرئيسية.`}
        confirmText="نعم، احذف السؤال"
        cancelText="إلغاء"
        variant="destructive"
        isLoading={isDeleting}
        onClose={() => setDeletingFaq(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
