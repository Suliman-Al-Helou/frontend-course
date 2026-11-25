"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Save, Star, Users, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { instructorPortalQueries } from "../queries/instructor-portal.queries";
import { useUpdateInstructorProfile } from "../queries/instructor-portal.mutations";

export function InstructorProfileView() {
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery(instructorPortalQueries.profile());
  const updateMutation = useUpdateInstructorProfile();
  const isSubmittingRef = useRef(false);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");
  const [achievementsText, setAchievementsText] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setTitle(profile.title ?? "");
    setBio(profile.bio ?? "");
    setSpecializations(profile.specializations ?? "");
    setYearsExperience(
      profile.years_experience !== null && profile.years_experience !== undefined
        ? String(profile.years_experience)
        : "",
    );
    setAvatarUrl(profile.avatar_url ?? "");
    setCoverUrl(profile.cover_url ?? "");
    setTwitter(profile.twitter ?? "");
    setLinkedin(profile.linkedin ?? "");
    setYoutube(profile.youtube ?? "");
    setAchievementsText(Array.isArray(profile.achievements) ? profile.achievements.join("\n") : "");
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || updateMutation.isPending) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("الاسم مطلوب");
      return;
    }

    isSubmittingRef.current = true;
    try {
      const achievements = achievementsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      await updateMutation.mutateAsync({
        name: trimmedName,
        title: title.trim() || null,
        bio: bio.trim() || null,
        specializations: specializations.trim() || null,
        years_experience: yearsExperience.trim() !== "" ? Number(yearsExperience) : null,
        avatar_url: avatarUrl.trim() || null,
        cover_url: coverUrl.trim() || null,
        twitter: twitter.trim() || null,
        linkedin: linkedin.trim() || null,
        youtube: youtube.trim() || null,
        achievements,
      });
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch {
      toast.error("تعذر حفظ التعديلات، يرجى المحاولة مرة أخرى");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive mx-auto" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">تعذر تحميل بيانات الملف الشخصي</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => void refetch()}
          className="min-h-[44px]"
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">الملف الشخصي للمدرب</h1>
        <p className="text-sm text-muted-foreground mt-1">
          تحديث بياناتك التعريفية الظاهرة للطلاب في صفحات الكورسات.
        </p>
      </div>

      {/* شارات الإحصائيات للقراءة فقط */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <Star className="w-5 h-5 text-amber-500" aria-hidden="true" />
          <div>
            <p className="text-xs text-muted-foreground">التقييم العام</p>
            <p className="text-lg font-bold text-foreground">{profile.rating ?? 0}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-primary" aria-hidden="true" />
          <div>
            <p className="text-xs text-muted-foreground">عدد التقييمات</p>
            <p className="text-lg font-bold text-foreground">{profile.total_reviews ?? 0}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <Users className="w-5 h-5 text-emerald-500" aria-hidden="true" />
          <div>
            <p className="text-xs text-muted-foreground">إجمالي الطلاب</p>
            <p className="text-lg font-bold text-foreground">{profile.students_count ?? 0}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-6 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="inst-name" className="text-sm font-medium text-foreground">
              الاسم الكامل
            </label>
            <input
              id="inst-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background px-3.5 text-sm text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="inst-title" className="text-sm font-medium text-foreground">
              المسمى الوظيفي / اللقب
            </label>
            <input
              id="inst-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background px-3.5 text-sm text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="inst-spec" className="text-sm font-medium text-foreground">
              التخصصات
            </label>
            <input
              id="inst-spec"
              type="text"
              value={specializations}
              onChange={(e) => setSpecializations(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background px-3.5 text-sm text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="inst-exp" className="text-sm font-medium text-foreground">
              سنوات الخبرة
            </label>
            <input
              id="inst-exp"
              type="number"
              min={0}
              max={100}
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background px-3.5 text-sm text-foreground"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="inst-bio" className="text-sm font-medium text-foreground">
            النبذة التعريفية
          </label>
          <textarea
            id="inst-bio"
            rows={4}
            maxLength={2000}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3.5 text-sm text-foreground"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="inst-avatar" className="text-sm font-medium text-foreground">
              رابط الصورة الشخصية
            </label>
            <input
              id="inst-avatar"
              type="url"
              dir="ltr"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background px-3.5 text-sm text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="inst-cover" className="text-sm font-medium text-foreground">
              رابط صورة الغلاف
            </label>
            <input
              id="inst-cover"
              type="url"
              dir="ltr"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background px-3.5 text-sm text-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="inst-twitter" className="text-sm font-medium text-foreground">
              Twitter / X
            </label>
            <input
              id="inst-twitter"
              type="text"
              dir="ltr"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background px-3.5 text-sm text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="inst-linkedin" className="text-sm font-medium text-foreground">
              LinkedIn
            </label>
            <input
              id="inst-linkedin"
              type="text"
              dir="ltr"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background px-3.5 text-sm text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="inst-youtube" className="text-sm font-medium text-foreground">
              YouTube
            </label>
            <input
              id="inst-youtube"
              type="text"
              dir="ltr"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-border bg-background px-3.5 text-sm text-foreground"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="inst-achievements" className="text-sm font-medium text-foreground">
            الإنجازات (كل إنجاز في سطر مستقل)
          </label>
          <textarea
            id="inst-achievements"
            rows={3}
            value={achievementsText}
            onChange={(e) => setAchievementsText(e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3.5 text-sm text-foreground"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="min-h-[44px] px-6 gap-2"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="w-4 h-4" aria-hidden="true" />
            )}
            <span>حفظ التعديلات</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
