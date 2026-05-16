'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Pencil, Check, ClipboardList } from 'lucide-react';
import api from '@/lib/api';
import type { Course } from '@/types';

/* ─── Types ─────────────────────────────────────────────── */
interface Lesson {
  id: number;
  title: string;
  video_id: string | null;
  duration: number;
  order: number;
  is_preview: boolean;
}

interface Section {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Question {
  id: string;
  type: 'mcq' | 'true_false' | 'open';
  text: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
}

interface Props {
  course: Course;
  onClose: () => void;
}

const inputCls =
  'w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring';

/* ═══════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════ */
export default function CourseSectionsModal({ course, onClose }: Props) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading]   = useState(true);
  const [openIdx, setOpenIdx]   = useState<number | null>(0);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [addingSection, setAddingSection]     = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/courses/${course.id}/sections`);
      setSections(data.sections ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSections(); }, []);

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    setAddingSection(true);
    try {
      await api.post(`/admin/courses/${course.id}/sections`, {
        title: newSectionTitle.trim(),
        order: sections.length,
      });
      setNewSectionTitle('');
      await fetchSections();
      setOpenIdx(sections.length);
    } catch (e) { console.error(e); }
    finally { setAddingSection(false); }
  };

  const handleDeleteSection = async (sectionId: number) => {
    if (!confirm('حذف القسم وجميع دروسه؟')) return;
    try {
      await api.delete(`/admin/sections/${sectionId}`);
      await fetchSections();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div>
            <h2 className="font-bold text-foreground text-base">إدارة محتوى الكورس</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{course.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {sections.map((section, idx) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  isOpen={openIdx === idx}
                  onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
                  onDeleteSection={() => handleDeleteSection(section.id)}
                  onRefresh={fetchSections}
                />
              ))}
              {sections.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">لا يوجد أقسام بعد، أضف أول قسم</p>
              )}
            </>
          )}

          <div className="flex gap-2 pt-2">
            <input
              value={newSectionTitle}
              onChange={e => setNewSectionTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSection()}
              placeholder="عنوان القسم الجديد..."
              className={inputCls}
            />
            <button
              onClick={handleAddSection}
              disabled={addingSection || !newSectionTitle.trim()}
              className="h-9 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" /> إضافة قسم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SectionCard
═══════════════════════════════════════════════════════════ */
function SectionCard({ section, isOpen, onToggle, onDeleteSection, onRefresh }: {
  section: Section; isOpen: boolean; onToggle: () => void;
  onDeleteSection: () => void; onRefresh: () => void;
}) {
  const [newLesson, setNewLesson] = useState({ title: '', video_id: '', duration: '' });
  const [adding, setAdding]       = useState(false);
  const [showForm, setShowForm]   = useState(false);

  const handleAddLesson = async () => {
    if (!newLesson.title.trim()) return;
    setAdding(true);
    try {
      await api.post(`/admin/sections/${section.id}/lessons`, {
        title:    newLesson.title.trim(),
        video_id: newLesson.video_id.trim() || null,
        duration: newLesson.duration ? parseInt(newLesson.duration) * 60 : 0,
        order:    section.lessons.length,
      });
      setNewLesson({ title: '', video_id: '', duration: '' });
      setShowForm(false);
      onRefresh();
    } catch (e) { console.error(e); }
    finally { setAdding(false); }
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-muted/40">
        <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
        <button onClick={onToggle} className="flex-1 flex items-center gap-2 text-right">
          <span className="font-semibold text-sm text-foreground">{section.title}</span>
          <span className="text-xs text-muted-foreground">({section.lessons.length} دروس)</span>
          {isOpen
            ? <ChevronUp className="w-4 h-4 text-muted-foreground mr-auto" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground mr-auto" />}
        </button>
        <button onClick={onDeleteSection} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {isOpen && (
        <div className="divide-y divide-border">
          {section.lessons.map(lesson => (
            <LessonRow key={lesson.id} lesson={lesson} onRefresh={onRefresh} />
          ))}

          <div className="p-3">
            {!showForm ? (
              <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                <Plus className="w-3.5 h-3.5" /> إضافة درس
              </button>
            ) : (
              <div className="space-y-2">
                <input placeholder="عنوان الدرس *" value={newLesson.title}
                  onChange={e => setNewLesson(p => ({ ...p, title: e.target.value }))} className={inputCls} />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="YouTube ID (مثال: dQw4w9WgXcQ)" value={newLesson.video_id}
                    onChange={e => setNewLesson(p => ({ ...p, video_id: e.target.value }))} className={inputCls} />
                  <input type="number" placeholder="المدة (دقيقة)" value={newLesson.duration}
                    onChange={e => setNewLesson(p => ({ ...p, duration: e.target.value }))} className={inputCls} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 h-8 rounded-lg border border-input text-xs hover:bg-muted transition-colors">إلغاء</button>
                  <button onClick={handleAddLesson} disabled={adding || !newLesson.title.trim()}
                    className="flex-1 h-8 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
                    {adding ? 'جارٍ الإضافة...' : 'إضافة'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LessonRow
═══════════════════════════════════════════════════════════ */
function LessonRow({ lesson, onRefresh }: { lesson: Lesson; onRefresh: () => void }) {
  const [editing, setEditing]       = useState(false);
  const [showTask, setShowTask]     = useState(false);
  const [form, setForm]             = useState({
    title:    lesson.title,
    video_id: lesson.video_id ?? '',
    duration: lesson.duration ? String(Math.round(lesson.duration / 60)) : '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/lessons/${lesson.id}`, {
        title:    form.title.trim(),
        video_id: form.video_id.trim() || null,
        duration: form.duration ? parseInt(form.duration) * 60 : 0,
      });
      setEditing(false);
      onRefresh();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('حذف الدرس؟')) return;
    try {
      await api.delete(`/admin/lessons/${lesson.id}`);
      onRefresh();
    } catch (e) { console.error(e); }
  };

  if (showTask) {
    return <TaskManager lessonId={lesson.id} lessonTitle={lesson.title} onClose={() => setShowTask(false)} onRefresh={onRefresh} />;
  }

  if (editing) {
    return (
      <div className="p-3 space-y-2 bg-muted/20">
        <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="YouTube ID" value={form.video_id}
            onChange={e => setForm(p => ({ ...p, video_id: e.target.value }))} className={inputCls} />
          <input type="number" placeholder="المدة (دقيقة)" value={form.duration}
            onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} className={inputCls} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(false)} className="flex-1 h-8 rounded-lg border border-input text-xs hover:bg-muted transition-colors">إلغاء</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 h-8 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5" />
            {saving ? 'حفظ...' : 'حفظ'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/20 transition-colors group">
      <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{lesson.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {lesson.video_id
            ? <span className="text-xs text-success">✓ فيديو مرتبط</span>
            : <span className="text-xs text-muted-foreground">لا يوجد فيديو</span>}
          {lesson.duration > 0 && (
            <span className="text-xs text-muted-foreground">· {Math.round(lesson.duration / 60)} د</span>
          )}
        </div>
      </div>
     <div className="flex gap-1">
        <button onClick={() => setShowTask(true)}
          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="إدارة المهمة">
          <ClipboardList className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleDelete}
          className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TaskManager — إدارة مهمة الدرس
═══════════════════════════════════════════════════════════ */
function TaskManager({ lessonId, lessonTitle, onClose, onRefresh }: {
  lessonId: number; lessonTitle: string; onClose: () => void; onRefresh: () => void;
}) {
  const [questions, setQuestions]         = useState<Question[]>([]);
  const [passPercentage, setPassPercentage] = useState(70);
  const [maxAttempts, setMaxAttempts]     = useState(3);
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [hasTask, setHasTask]             = useState(false);

  useEffect(() => {
    api.get(`/admin/lessons/${lessonId}/task`).then(res => {
      setQuestions(res.data.questions ?? []);
      setPassPercentage(res.data.pass_percentage ?? 70);
      setMaxAttempts(res.data.max_attempts ?? 3);
      setHasTask(true);
    }).catch(() => {
      setQuestions([]);
      setHasTask(false);
    }).finally(() => setLoading(false));
  }, [lessonId]);

  const addQuestion = (type: Question['type']) => {
    const id = `q${Date.now()}`;
    const base = { id, type, text: '', explanation: '' };
    if (type === 'mcq') {
      setQuestions(p => [...p, { ...base, options: ['', '', '', ''], correct_answer: '' }]);
    } else if (type === 'true_false') {
      setQuestions(p => [...p, { ...base, correct_answer: 'صح' }]);
    } else {
      setQuestions(p => [...p, base]);
    }
  };

  const updateQ = (id: string, field: string, value: any) => {
    setQuestions(p => p.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId: string, idx: number, value: string) => {
    setQuestions(p => p.map(q => {
      if (q.id !== qId) return q;
      const opts = [...(q.options ?? [])];
      opts[idx] = value;
      return { ...q, options: opts };
    }));
  };

  const removeQuestion = (id: string) => {
    setQuestions(p => p.filter(q => q.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { questions, pass_percentage: passPercentage, max_attempts: maxAttempts };
      if (hasTask) {
        await api.put(`/admin/lessons/${lessonId}/task`, payload);
      } else {
        await api.post(`/admin/lessons/${lessonId}/task`, payload);
        setHasTask(true);
      }
      onRefresh();
      onClose();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="p-4 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 bg-muted/10 border-t border-border space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">مهمة الدرس</p>
          <p className="text-xs text-muted-foreground truncate">{lessonTitle}</p>
        </div>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">رجوع</button>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">نسبة النجاح %</label>
          <input type="number" min={1} max={100} value={passPercentage}
            onChange={e => setPassPercentage(Number(e.target.value))} className={inputCls} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">عدد المحاولات</label>
          <input type="number" min={1} max={10} value={maxAttempts}
            onChange={e => setMaxAttempts(Number(e.target.value))} className={inputCls} />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary">
                {q.type === 'mcq' ? 'اختيار متعدد' : q.type === 'true_false' ? 'صح/خطأ' : 'مفتوح'}
              </span>
              <button onClick={() => removeQuestion(q.id)} className="text-destructive hover:opacity-70">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <input placeholder={`السؤال ${i + 1}`} value={q.text}
              onChange={e => updateQ(q.id, 'text', e.target.value)} className={inputCls} />

            {q.type === 'mcq' && (
              <div className="space-y-1.5">
                {q.options?.map((opt, oi) => (
                  <div key={oi} className="flex gap-2">
                    <input placeholder={`خيار ${oi + 1}`} value={opt}
                      onChange={e => updateOption(q.id, oi, e.target.value)}
                      className="flex-1 h-8 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                    <button
                      onClick={() => updateQ(q.id, 'correct_answer', opt)}
                      className={`px-2 h-8 rounded-md text-xs font-medium transition-colors ${
                        q.correct_answer === opt
                          ? 'bg-success text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {q.correct_answer === opt ? '✓' : 'صح'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {q.type === 'true_false' && (
              <div className="flex gap-2">
                {['صح', 'خطأ'].map(opt => (
                  <button key={opt} onClick={() => updateQ(q.id, 'correct_answer', opt)}
                    className={`flex-1 h-8 rounded-md text-xs font-medium transition-colors ${
                      q.correct_answer === opt
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <input placeholder="شرح الإجابة (اختياري)" value={q.explanation ?? ''}
              onChange={e => updateQ(q.id, 'explanation', e.target.value)}
              className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
        ))}
      </div>

      {/* Add question buttons */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => addQuestion('mcq')}
          className="h-8 px-3 rounded-lg border border-border text-xs hover:bg-muted transition-colors flex items-center gap-1">
          <Plus className="w-3 h-3" /> اختيار متعدد
        </button>
        <button onClick={() => addQuestion('true_false')}
          className="h-8 px-3 rounded-lg border border-border text-xs hover:bg-muted transition-colors flex items-center gap-1">
          <Plus className="w-3 h-3" /> صح/خطأ
        </button>
        <button onClick={() => addQuestion('open')}
          className="h-8 px-3 rounded-lg border border-border text-xs hover:bg-muted transition-colors flex items-center gap-1">
          <Plus className="w-3 h-3" /> سؤال مفتوح
        </button>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving || questions.length === 0}
        className="w-full h-9 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
        {saving ? 'جارٍ الحفظ...' : hasTask ? 'تحديث المهمة' : 'حفظ المهمة'}
      </button>
    </div>
  );
}