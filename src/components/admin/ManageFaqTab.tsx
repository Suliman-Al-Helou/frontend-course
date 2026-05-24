'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2, Save } from 'lucide-react';
import api from '@/lib/api';

interface Faq {
  id: number;
  question: string;
  answer: string;
  order?: number;
}

export default function ManageFaqTab() {
  const [faqs, setFaqs]       = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  // فورم إضافة سؤال جديد
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchFaqs = () => {
    setLoading(true);
    api.get('/admin/faqs')
      .then(res => setFaqs(res.data.data ?? res.data))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleAdd = async () => {
    if (!newQ.trim() || !newA.trim()) return;
    setAdding(true);
    try {
      await api.post('/admin/faqs', { question: newQ.trim(), answer: newA.trim() });
      setNewQ('');
      setNewA('');
      fetchFaqs();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (faq: Faq) => {
    setSaving(faq.id);
    try {
      await api.put(`/admin/faqs/${faq.id}`, { question: faq.question, answer: faq.answer });
      fetchFaqs();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/faqs/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const updateLocal = (id: number, field: 'question' | 'answer', val: string) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));
  };

  return (
    <div className="space-y-6">

      {/* إضافة سؤال جديد */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          إضافة سؤال جديد
        </h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">السؤال *</label>
            <input
              value={newQ}
              onChange={e => setNewQ(e.target.value)}
              placeholder="ما هي متطلبات الالتحاق بالكورس؟"
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">الجواب *</label>
            <textarea
              value={newA}
              onChange={e => setNewA(e.target.value)}
              placeholder="اكتب الجواب هنا..."
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={adding || !newQ.trim() || !newA.trim()}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            إضافة السؤال
          </button>
        </div>
      </div>

      {/* قائمة الأسئلة */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
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
                className="p-4"
              >
                {/* Header السؤال */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                    className="flex-1 flex items-center justify-between text-right group"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {faq.question || 'سؤال بدون عنوان'}
                    </span>
                    {expanded === faq.id
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    }
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    disabled={deleting === faq.id}
                    className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                  >
                    {deleting === faq.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                  </button>
                </div>

                {/* تعديل السؤال */}
                {expanded === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-3"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">السؤال</label>
                      <input
                        value={faq.question}
                        onChange={e => updateLocal(faq.id, 'question', e.target.value)}
                        className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">الجواب</label>
                      <textarea
                        value={faq.answer}
                        onChange={e => updateLocal(faq.id, 'answer', e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                      />
                    </div>
                    <button
                      onClick={() => handleUpdate(faq)}
                      disabled={saving === faq.id}
                      className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                    >
                      {saving === faq.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Save className="w-4 h-4" />
                      }
                      حفظ التعديلات
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}