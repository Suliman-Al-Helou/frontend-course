"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Trash2, Upload, Loader2, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminCourseQueries } from "@/features/admin-courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import type { Instructor, InstructorFormData } from "../types";

interface Props {
  instructor?: Instructor | null;
  onClose: () => void;
  onSave: (data: InstructorFormData) => Promise<unknown>;
}

export default function InstructorFormModal({ instructor, onClose, onSave }: Props) {
  const isEdit = !!instructor;
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: instructor?.name ?? "",
    title: instructor?.title ?? "",
    bio: instructor?.bio ?? "",
    avatar_url: instructor?.avatar_url ?? "",
    cover_url: instructor?.cover_url ?? "",
    specializations: instructor?.specializations ?? "",
    years_experience: instructor?.years_experience?.toString() ?? "",
    rating: instructor?.rating?.toString() ?? "4.5",
    total_reviews: instructor?.total_reviews?.toString() ?? "0",
    students_count: instructor?.students_count?.toString() ?? "0",
    twitter: instructor?.twitter ?? "",
    linkedin: instructor?.linkedin ?? "",
    youtube: instructor?.youtube ?? "",
  });

  const [achievements, setAchievements] = useState<string[]>(instructor?.achievements ?? []);
  const [newAchievement, setNewAchievement] = useState("");

  // Courses from TanStack Query unified cache
  const { data: allCourses = [], isLoading: coursesLoading } = useQuery(adminCourseQueries.list());
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>(
    Array.isArray(instructor?.courses) ? instructor.courses : [],
  );
  const [coursesOpen, setCoursesOpen] = useState(false);

  const isSubmittingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, onClose]);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      set("avatar_url", reader.result as string);
      setUploading(false);
    };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    setAchievements((p) => [...p, newAchievement.trim()]);
    setNewAchievement("");
  };

  const removeAchievement = (i: number) => setAchievements((p) => p.filter((_, idx) => idx !== i));

  const toggleCourse = (id: number) =>
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || loading) return;

    if (!form.name.trim()) {
      setError("اسم المدرب مطلوب");
      return;
    }

    isSubmittingRef.current = true;
    setError("");
    setLoading(true);
    try {
      const data: InstructorFormData = {
        name: form.name.trim(),
        title: form.title.trim() || undefined,
        bio: form.bio.trim() || undefined,
        avatar_url: form.avatar_url || undefined,
        cover_url: form.cover_url || undefined,
        specializations: form.specializations.trim() || undefined,
        years_experience: Number(form.years_experience) || 0,
        rating: Number(form.rating) || 4.5,
        total_reviews: Number(form.total_reviews) || 0,
        students_count: Number(form.students_count) || 0,
        twitter: form.twitter.trim() || undefined,
        linkedin: form.linkedin.trim() || undefined,
        youtube: form.youtube.trim() || undefined,
        achievements,
        courses: selectedCourseIds,
      };

      await onSave(data);
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; error?: string } } };
      const serverMsg = e.response?.data?.message ?? e.response?.data?.error;
      setError(serverMsg ? `خطأ: ${serverMsg}` : "حدث خطأ أثناء حفظ بيانات المدرب.");
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructor-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-muted/20">
          <div>
            <h2 id="instructor-modal-title" className="text-base font-bold text-foreground">
              {isEdit ? "تعديل بيانات المدرب" : "إضافة مدرب جديد"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              بيانات المدرب وخبراته وروابط حساباته والكورسات المسندة إليه
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          {/* الصورة الشخصية */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/60">
            <Avatar src={form.avatar_url} name={form.name || "م"} size="lg" shape="square" />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-foreground">الصورة الشخصية</p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading || loading}
                  className="rounded-xl h-8 px-3 text-xs gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع صورة</span>
                </Button>
                {form.avatar_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => set("avatar_url", "")}
                    disabled={loading}
                    className="rounded-xl h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                  >
                    إزالة
                  </Button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* الاسم والمسمى الوظيفي */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inst-name" className="text-xs font-semibold">
                الاسم الكامل *
              </Label>
              <Input
                id="inst-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="مثال: د. عبد الرحمن الحلو"
                disabled={loading}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inst-title" className="text-xs font-semibold">
                المسمى الوظيفي / التخصص
              </Label>
              <Input
                id="inst-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="مثال: كبير مهندسي الحلول السحابية"
                disabled={loading}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* النبذة التعريفية */}
          <div className="space-y-1.5">
            <Label htmlFor="inst-bio" className="text-xs font-semibold">
              النبذة التعريفية (Bio)
            </Label>
            <textarea
              id="inst-bio"
              rows={3}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="اكتب نبذة عن مسيرة المدرب وخبراته الأكاديمية والعملية..."
              disabled={loading}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* المجالات وسنوات الخبرة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inst-specs" className="text-xs font-semibold">
                المجالات (مفصولة بفواصل)
              </Label>
              <Input
                id="inst-specs"
                value={form.specializations}
                onChange={(e) => set("specializations", e.target.value)}
                placeholder="AWS, Python, الأمن السيبراني"
                disabled={loading}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inst-exp" className="text-xs font-semibold">
                سنوات الخبرة
              </Label>
              <Input
                id="inst-exp"
                type="number"
                min={0}
                value={form.years_experience}
                onChange={(e) => set("years_experience", e.target.value)}
                disabled={loading}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* روابط التواصل */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="inst-linkedin" className="text-xs font-semibold">
                LinkedIn
              </Label>
              <Input
                id="inst-linkedin"
                value={form.linkedin}
                onChange={(e) => set("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                disabled={loading}
                dir="ltr"
                className="rounded-xl text-left"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inst-twitter" className="text-xs font-semibold">
                X / Twitter
              </Label>
              <Input
                id="inst-twitter"
                value={form.twitter}
                onChange={(e) => set("twitter", e.target.value)}
                placeholder="https://x.com/..."
                disabled={loading}
                dir="ltr"
                className="rounded-xl text-left"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inst-youtube" className="text-xs font-semibold">
                YouTube
              </Label>
              <Input
                id="inst-youtube"
                value={form.youtube}
                onChange={(e) => set("youtube", e.target.value)}
                placeholder="https://youtube.com/@..."
                disabled={loading}
                dir="ltr"
                className="rounded-xl text-left"
              />
            </div>
          </div>

          {/* الإنجازات الأكاديمية والمهنية */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">الإنجازات والشهادات</Label>
            <div className="flex gap-2">
              <Input
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAchievement();
                  }
                }}
                placeholder="مثال: معتمد كـ AWS Solutions Architect Professional"
                disabled={loading}
                className="rounded-xl"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addAchievement}
                disabled={loading || !newAchievement.trim()}
                className="rounded-xl px-3 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {achievements.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {achievements.map((ach, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                  >
                    <span>{ach}</span>
                    <button
                      type="button"
                      onClick={() => removeAchievement(idx)}
                      className="text-primary/70 hover:text-destructive transition-colors"
                      aria-label="إزالة الإنجاز"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* الكورسات المسندة للمدرب */}
          <div className="space-y-2 p-3.5 rounded-xl bg-muted/20 border border-border">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>الكورسات المسندة ({selectedCourseIds.length})</span>
              </Label>
              <button
                type="button"
                onClick={() => setCoursesOpen(!coursesOpen)}
                className="text-xs text-primary hover:underline font-medium"
              >
                {coursesOpen ? "طي القائمة" : "تعديل الكورسات المسندة"}
              </button>
            </div>

            {coursesOpen && (
              <div className="max-h-48 overflow-y-auto space-y-1.5 pt-2 border-t border-border mt-2">
                {coursesLoading ? (
                  <p className="text-xs text-muted-foreground p-2">جارٍ جلب الكورسات...</p>
                ) : allCourses.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-2">لا توجد كورسات مضافة بالمنصة.</p>
                ) : (
                  allCourses.map((c) => {
                    const isSelected = selectedCourseIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCourse(c.id)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="truncate">{c.title}</span>
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl h-10 px-4 text-xs font-medium"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl h-10 px-5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEdit ? "حفظ التعديلات" : "إضافة المدرب"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
