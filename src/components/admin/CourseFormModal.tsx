"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import api from "@/lib/api";
import type { Course } from "@/types";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const LEVEL_LABELS: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

interface Props {
  course?: Course | null;
  onClose: () => void;
  onSuccess: () => void;
}

const toArray = (val: any): string[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [val];
    } catch {
      return val.split('\n').filter(Boolean);
    }
  }
  return [];
};

export default function CourseFormModal({ course, onClose, onSuccess }: Props) {
  const isEdit = !!course;
  const [form, setForm] = useState({
    title: course?.title ?? "",
    description: course?.description ?? "",
    cover_image: course?.cover_image ?? "",
    level: course?.level ?? "beginner",
    status: (course as any)?.status ?? "published",
    instructor_name:
      (course as any)?.instructor_name ?? (course as any)?.instructor ?? "",
    rating: (course as any)?.rating ?? 4.5,
    is_popular: (course as any)?.is_popular ?? course?.hot ?? false,
    total_duration: course?.total_duration ?? 0,
    price: (course as any)?.price ?? 0,
    is_public:course?.is_public ?? false
  });

  const [whatYouLearn, setWhatYouLearn] = useState<string[]>(
    toArray((course as any)?.what_you_learn)
  );

  const [requirements, setRequirements] = useState<string[]>(
    toArray((course as any)?.requirements)
  );

  const [targetAudience, setTargetAudience] = useState<string[]>(
    toArray((course as any)?.target_audience)
  );

  const [newLearn, setNewLearn] = useState('');
  const [newReq, setNewReq] = useState('');
  const [newTarget, setNewTarget] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const addToList = (
    list: string[],
    setList: (v: string[]) => void,
    value: string,
    setValue: (v: string) => void
  ) => {
    if (!value.trim()) return;
    setList([...list, value.trim()]);
    setValue('');
  };

  const removeFromList = (
    list: string[],
    setList: (v: string[]) => void,
    i: number
  ) => {
    setList(list.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = {
        ...form,
        what_you_learn: whatYouLearn,
        requirements: requirements,
        target_audience: targetAudience,
      };
      if (isEdit) {
        await api.put(`/admin/courses/${course!.id}`, data);
      } else {
        await api.post("/admin/courses", data);
      }
      onSuccess();
    } catch {
      setError("حدث خطأ، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-foreground text-base">
            {isEdit ? "تعديل الكورس" : "إضافة كورس جديد"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* عنوان الكورس */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">عنوان الكورس *</label>
            <input
              placeholder="Python من الصفر إلى الاحتراف"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* اسم المدرب */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">اسم المدرب *</label>
            <input
              placeholder="أ. أحمد المطيري"
              value={form.instructor_name}
              onChange={(e) => set("instructor_name", e.target.value)}
              required
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* المستوى + الحالة */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">المستوى *</label>
              <select
                value={form.level}
                onChange={(e) => set("level", e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {LEVEL_LABELS[l]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">الحالة</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none"
              >
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
                <option value="coming_soon">قريباً</option>
              </select>
            </div>
          </div>

          {/* التقييم + السعر */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">التقييم (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => set("rating", parseFloat(e.target.value) || 0)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">السعر ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* المدة */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">المدة (بالثواني)</label>
            <input
              type="number"
              min="0"
              value={form.total_duration}
              onChange={(e) => set("total_duration", parseInt(e.target.value) || 0)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none"
            />
          </div>

          {/* رابط صورة الغلاف */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">رابط صورة الغلاف</label>
            <input
              placeholder="https://images.unsplash.com/..."
              value={form.cover_image}
              onChange={(e) => set("cover_image", e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none"
            />
            {form.cover_image && (
              <img
                src={form.cover_image}
                alt="preview"
                className="w-full h-32 object-cover rounded-lg mt-1"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>

          {/* وصف الكورس */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">وصف الكورس</label>
            <textarea
              placeholder="اكتب وصفاً مختصراً للكورس..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none resize-none"
            />
          </div>

          {/* ستتعلم في هذا الكورس */}
          <div className="space-y-2">
            <label className="text-sm font-medium">ستتعلم في هذا الكورس</label>
            <div className="space-y-2">
              {whatYouLearn.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                  <span className="flex-1 text-sm">✅ {item}</span>
                  <button type="button" onClick={() => removeFromList(whatYouLearn, setWhatYouLearn, i)}
                    className="text-destructive hover:opacity-70">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  placeholder="مثال: بناء REST API باستخدام Laravel"
                  value={newLearn}
                  onChange={e => setNewLearn(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList(whatYouLearn, setWhatYouLearn, newLearn, setNewLearn))}
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none"
                />
                <button type="button"
                  onClick={() => addToList(whatYouLearn, setWhatYouLearn, newLearn, setNewLearn)}
                  className="h-9 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* المتطلبات */}
          <div className="space-y-2">
            <label className="text-sm font-medium">المتطلبات</label>
            <div className="space-y-2">
              {requirements.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                  <span className="flex-1 text-sm">📌 {item}</span>
                  <button type="button" onClick={() => removeFromList(requirements, setRequirements, i)}
                    className="text-destructive hover:opacity-70">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  placeholder="مثال: معرفة أساسيات البرمجة"
                  value={newReq}
                  onChange={e => setNewReq(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList(requirements, setRequirements, newReq, setNewReq))}
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none"
                />
                <button type="button"
                  onClick={() => addToList(requirements, setRequirements, newReq, setNewReq)}
                  className="h-9 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* الجمهور المستهدف */}
          <div className="space-y-2">
            <label className="text-sm font-medium">هذا الكورس لك إذا كنت...</label>
            <div className="space-y-2">
              {targetAudience.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                  <span className="flex-1 text-sm">🎯 {item}</span>
                  <button type="button" onClick={() => removeFromList(targetAudience, setTargetAudience, i)}
                    className="text-destructive hover:opacity-70">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  placeholder="مثال: مبتدئ يريد تعلم البرمجة"
                  value={newTarget}
                  onChange={e => setNewTarget(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToList(targetAudience, setTargetAudience, newTarget, setNewTarget))}
                  className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none"
                />
                <button type="button"
                  onClick={() => addToList(targetAudience, setTargetAudience, newTarget, setNewTarget)}
                  className="h-9 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* الأكثر طلباً */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <input
              type="checkbox"
              id="is_popular"
              checked={form.is_popular}
              onChange={(e) => set("is_popular", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="is_popular" className="text-sm font-medium cursor-pointer">
              🔥 الأكثر طلباً
            </label>
          </div>


          {/* مجاني  */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <input
              type="checkbox"
              id="is_public"
              checked={form.is_public}
              onChange={(e) => set("is_public", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="is_public" className="text-sm font-medium cursor-pointer">
               مجاني
            </label>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-input text-sm font-medium hover:bg-muted transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {loading ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة الكورس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}