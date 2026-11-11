'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notify } from '@/components/ui/sonner';
import api from '@/lib/api';

interface Faq {
  id: number;
  question: string;
  answer: string;
  order?: number;
}

export default function ManageFaqTab() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [deletingFaq, setDeletingFaq] = useState<Faq | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  // فورم إضافة سؤال جديد
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [adding, setAdding] = useState(false);

  const isAddingRef = useRef(false);
  const isSavingRef = useRef(false);
  const isDeletingRef = useRef(false);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/faqs');
      setFaqs(res.data.data ?? res.data ?? []);
    } catch (err) {
      console.error(err);
      notify.error('فشل تحميل قائمة الأسئلة الشائعة');
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAdd = async () => {
    if (!newQ.trim() || !newA.trim() || isAddingRef.current) return;
    isAddingRef.current = true;
    setAdding(true);
    try {
      await api.post('/admin/faqs', { question: newQ.trim(), answer: newA.trim() });
      notify.success('تمت إضافة السؤال بنجاح');
      setNewQ('');
      setNewA('');
      fetchFaqs();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || 'تعذر إضافة السؤال، يرجى المحاولة مجدداً';
      notify.error(msg);
    } finally {
      setAdding(false);
      isAddingRef.current = false;
    }
  };

  const handleUpdate = async (faq: Faq) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setSaving(faq.id);
    try {
      await api.put(`/admin/faqs/${faq.id}`, { question: faq.question, answer: faq.answer });
      notify.success('تم حفظ تعديلات السؤال بنجاح');
      fetchFaqs();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || 'تعذر حفظ التعديلات، يرجى المحاولة مجدداً';
      notify.error(msg);
    } finally {
      setSaving(null);
      isSavingRef.current = false;
    }
  };

  const confirmDelete = async () => {
    if (!deletingFaq || isDeletingRef.current) return;
    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/faqs/${deletingFaq.id}`);
      notify.success('تم حذف السؤال بنجاح');
      setDeletingFaq(null);
      fetchFaqs();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || 'تعذر حذف السؤال، يرجى المحاولة لاحقاً';
      notify.error(msg);
    } finally {
      setIsDeleting(false);
      isDeletingRef.current = false;
    }
  };

  const updateLocal = (id: number, field: 'question' | 'answer', val: string) => {
    setFaqs(prev => prev.map(f => (f.id === id ? { ...f, [field]: val } : f)));
  };

  return (
    <div className="space-y-6">
      {/* إضافة سؤال جديد */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          إضافة سؤال جديد
        </h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">السؤال *</label>
            <input
              value={newQ}
              onChange={e => setNewQ(e.target.value)}
              placeholder="ما هي متطلبات الالتحاق بالكورس؟"
              className="w-full h-11 rounded-xl border border-input bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">الجواب *</label>
            <textarea
              value={newA}
              onChange={e => setNewA(e.target.value)}
              placeholder="اكتب الجواب هنا بشكل واضح وشامل..."
              rows={3}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none leading-relaxed"
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={adding || !newQ.trim() || !newA.trim()}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 h-11 min-h-[44px] rounded-xl text-sm font-semibold transition-colors"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            إضافة السؤال
          </Button>
        </div>
      </div>

      {/* قائمة الأسئلة */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-base font-bold text-foreground">
            الأسئلة الشائعة ({faqs.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            لا توجد أسئلة بعد — أضف سؤالاً من الأعلى
          </div>
        ) : (
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 motion-reduce:transition-none motion-reduce:transform-none"
              >
                {/* Header السؤال */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                    className="flex-1 flex items-center justify-between text-right group py-1"
                    aria-expanded={expanded === faq.id}
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {faq.question || 'سؤال بدون عنوان'}
                    </span>
                    {expanded === faq.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mr-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mr-2" />
                    )}
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeletingFaq(faq)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 h-10 w-10 min-h-[44px] min-w-[44px] p-0 rounded-xl transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-destructive"
                    aria-label={`حذف السؤال: ${faq.question || 'بدون عنوان'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* تعديل السؤال */}
                {expanded === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-3 pt-3 border-t border-border/50 motion-reduce:transition-none"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">السؤال</label>
                      <input
                        value={faq.question}
                        onChange={e => updateLocal(faq.id, 'question', e.target.value)}
                        className="w-full h-11 rounded-xl border border-input bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">الجواب</label>
                      <textarea
                        value={faq.answer}
                        onChange={e => updateLocal(faq.id, 'answer', e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none leading-relaxed"
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdate(faq)}
                      disabled={saving === faq.id}
                      className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary h-11 min-h-[44px] px-5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
                    >
                      {saving === faq.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      حفظ التعديلات
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* مودال تأكيد حذف السؤال الآمن */}
      {deletingFaq && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-faq-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          dir="rtl"
        >
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 id="delete-faq-title" className="text-base font-bold text-foreground">
                تأكيد حذف السؤال
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                هل أنت متأكد من رغبتك في حذف السؤال التالي؟
              </p>
              <div className="p-3 bg-muted/60 border border-border rounded-xl text-xs font-medium text-foreground text-right">
                {deletingFaq.question || 'سؤال بدون عنوان'}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11 min-h-[44px]"
                disabled={isDeleting}
                onClick={() => setDeletingFaq(null)}
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl h-11 min-h-[44px] bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold flex items-center justify-center gap-2"
                disabled={isDeleting}
                onClick={confirmDelete}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isDeleting ? 'جارٍ الحذف...' : 'تأكيد الحذف'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
