"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Upload, BookOpen, Search, UserCheck, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminCourseQueries } from "@/features/admin-courses";
import { adminUserQueries, type AdminUser } from "@/features/admin-users";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
    specializations: Array.isArray(instructor?.specializations)
      ? instructor.specializations.join(", ")
      : (instructor?.specializations ?? ""),
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

  // Linked user account state with server-side search
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(
    instructor?.user
      ? { id: instructor.user.id, name: instructor.user.name, email: instructor.user.email }
      : null,
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(instructor?.user_id ?? null);
  const [userSearch, setUserSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(userSearch.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearch]);

  const { data: searchResults = [], isLoading: isSearchingUsers } = useQuery(
    adminUserQueries.search(debouncedSearch, 5, true),
  );

  // Courses from TanStack Query unified cache
  const { data: allCourses = [], isLoading: coursesLoading } = useQuery(adminCourseQueries.list());
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>(
    Array.isArray(instructor?.courses) ? instructor.courses : [],
  );
  const [coursesOpen, setCoursesOpen] = useState(false);

  const isSubmittingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        user_id: selectedUserId,
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
      const e = err as {
        response?: {
          data?: {
            message?: string;
            error?: string;
            errors?: Record<string, string[]>;
          };
        };
      };
      const errBag = e.response?.data?.errors;
      const firstValidationErr = errBag ? Object.values(errBag)[0]?.[0] : null;
      const serverMsg = firstValidationErr ?? e.response?.data?.message ?? e.response?.data?.error;
      setError(serverMsg ? `خطأ: ${serverMsg}` : "حدث خطأ أثناء حفظ بيانات المدرب.");
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="lg">
      <ModalHeader
        title={isEdit ? "تعديل بيانات المدرب" : "إضافة مدرب جديد"}
        description="بيانات المدرب وخبراته وروابط حساباته والكورسات المسندة إليه"
      />

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        <ModalBody className="p-6 space-y-5">
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

          {/* ربط حساب المستخدم للدخول مع تأكيد الصلاحية والبحث الخادم */}
          <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-4">
            <Label className="text-xs font-semibold text-foreground">
              حساب المستخدم المرتبط (تسجيل الدخول)
            </Label>
            {selectedUser ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedUser.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedUserId(null);
                  }}
                  className="text-xs text-destructive hover:bg-destructive/10"
                >
                  إلغاء الربط
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute start-3 top-3 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="ابحث بالاسم أو البريد الإلكتروني لاختيار مستخدم (حرفان على الأقل)..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="ps-9 rounded-xl"
                  />
                </div>
                {isSearchingUsers && (
                  <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ البحث في الخادم عن المستخدمين...</span>
                  </div>
                )}
                {!isSearchingUsers && debouncedSearch.length >= 2 && (
                  <div className="border border-border rounded-xl divide-y divide-border bg-card overflow-hidden max-h-48 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <p className="p-3 text-xs text-muted-foreground text-center">
                        لا توجد حسابات مطابقة (حسابات المسؤولين مستثناة تلقائياً)
                      </p>
                    ) : (
                      searchResults.map((u: AdminUser) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setSelectedUser({ id: u.id, name: u.name, email: u.email });
                            setSelectedUserId(u.id);
                            setUserSearch("");
                          }}
                          className="w-full text-start p-2.5 text-xs hover:bg-muted/50 flex justify-between items-center transition-colors"
                        >
                          <span className="font-medium text-foreground">
                            {u.name} <span className="text-muted-foreground">({u.email})</span>
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {u.role}
                          </Badge>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            {selectedUserId && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-600 dark:text-amber-400">
                ⚠️ تنبيه: سيتم منح هذا الحساب صلاحية دور المدرب (Instructor) فور الحفظ، ليتمكن من
                الدخول إلى بوابة المدربين.
              </div>
            )}
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
                  <Badge key={idx} variant="primary" className="gap-1.5">
                    <span>{ach}</span>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={() => removeAchievement(idx)}
                      className="h-4 w-4 p-0 hover:bg-transparent hover:opacity-75 transition-opacity"
                      aria-label="إزالة الإنجاز"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
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
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setCoursesOpen(!coursesOpen)}
                className="h-auto p-0 text-xs font-medium text-primary hover:underline"
              >
                {coursesOpen ? "طي القائمة" : "تعديل الكورسات المسندة"}
              </Button>
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
        </ModalBody>

        <ModalFooter>
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
            loading={loading}
            className="rounded-xl h-10 px-5 text-xs font-semibold"
          >
            {isEdit ? "حفظ التعديلات" : "إضافة المدرب"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
