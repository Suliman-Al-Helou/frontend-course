'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import type { Instructor, Course } from '@/types';

interface Props {
  instructor?: Instructor | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InstructorFormModal({ instructor, onClose, onSuccess }: Props) {
  const isEdit = !!instructor;
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name:             instructor?.name             ?? '',
    title:            instructor?.title            ?? '',
    bio:              instructor?.bio              ?? '',
    avatar_url:       instructor?.avatar_url       ?? '',
    cover_url:        instructor?.cover_url        ?? '',
    specializations:  instructor?.specializations  ?? '',
    years_experience: instructor?.years_experience?.toString() ?? '',
    rating:           instructor?.rating?.toString()           ?? '4.5',
    total_reviews:    instructor?.total_reviews?.toString()    ?? '0',
    students_count:   instructor?.students_count?.toString()   ?? '0',
    twitter:          instructor?.twitter          ?? '',
    linkedin:         instructor?.linkedin         ?? '',
    youtube:          instructor?.youtube          ?? '',
  });

  const [achievements, setAchievements] = useState<string[]>(
    instructor?.achievements ?? []
  );
  const [newAchievement, setNewAchievement] = useState('');

  // Courses state
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>(
    instructor?.courses ?? []
  );
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const res = await api.get('/admin/courses');
        setAllCourses(res.data.data ?? res.data ?? []);
      } catch {
        // silently fail — list stays empty
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        set('avatar_url', reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    setAchievements(p => [...p, newAchievement.trim()]);
    setNewAchievement('');
  };

  const removeAchievement = (i: number) => {
    setAchievements(p => p.filter((_, idx) => idx !== i));
  };

  const toggleCourse = (id: number) => {
    setSelectedCourseIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        name:             form.name,
        title:            form.title,
        bio:              form.bio,
        avatar_url:       form.avatar_url,
        cover_url:        form.cover_url,
        specializations:  form.specializations,
        years_experience: Number(form.years_experience) || 0,
        rating:           Number(form.rating)           || 4.5,
        total_reviews:    Number(form.total_reviews)    || 0,
        students_count:   Number(form.students_count)   || 0,
        twitter:          form.twitter,
        linkedin:         form.linkedin,
        youtube:          form.youtube,
        achievements,
        courses:          selectedCourseIds,
      };
      if (isEdit) {
        await api.put(`/admin/instructors/${instructor!.id}`, data);
      } else {
        await api.post('/admin/instructors', data);
      }
      onSuccess();
    } catch {
      setError('حدث خطأ، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-bold text-foreground text-base">{isEdit ? 'تعديل المدرب' : 'إضافة مدرب جديد'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          {/* صورة المدرب */}
          <div className="space-y-2">
            <Label>صورة المدرب</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border text-sm hover:bg-muted transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  رفع صورة
                </button>
                <Input placeholder="أو أدخل رابط الصورة مباشرة"
                  value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          </div>

          {/* معلومات أساسية */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label>اسم المدرب *</Label>
              <Input placeholder="أ. محمد الشمري" value={form.name}
                onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>المسمى الوظيفي *</Label>
              <Input placeholder="مهندس برمجيات متقدم" value={form.title}
                onChange={e => set('title', e.target.value)} required />
            </div>
          </div>

          {/* النبذة */}
          <div className="space-y-1.5">
            <Label>النبذة الشخصية</Label>
            <textarea placeholder="اكتب نبذة مختصرة عن المدرب..." value={form.bio}
              onChange={e => set('bio', e.target.value)} rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
          </div>

          {/* التخصصات + الخبرة + رابط الغلاف */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label>التخصصات (مفصولة بفاصلة)</Label>
              <Input placeholder="Python, Machine Learning, Flask" value={form.specializations}
                onChange={e => set('specializations', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>سنوات الخبرة</Label>
              <Input type="number" placeholder="10" value={form.years_experience}
                onChange={e => set('years_experience', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>رابط الغلاف (cover)</Label>
              <Input placeholder="https://..." value={form.cover_url}
                onChange={e => set('cover_url', e.target.value)} />
            </div>
          </div>

          {/* إحصائيات */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>التقييم (من 5)</Label>
              <Input type="number" step="0.1" min="0" max="5" placeholder="4.5" value={form.rating}
                onChange={e => set('rating', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>عدد التقييمات</Label>
              <Input type="number" placeholder="1240" value={form.total_reviews}
                onChange={e => set('total_reviews', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>عدد الطلاب</Label>
              <Input type="number" placeholder="5840" value={form.students_count}
                onChange={e => set('students_count', e.target.value)} />
            </div>
          </div>

          {/* الإنجازات */}
          <div className="space-y-2">
            <Label>الإنجازات</Label>
            <div className="space-y-2">
              {achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                  <span className="flex-1 text-sm text-foreground">{a}</span>
                  <button type="button" onClick={() => removeAchievement(i)}
                    className="text-destructive hover:opacity-70 flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input placeholder="أضف إنجازاً..." value={newAchievement}
                  onChange={e => setNewAchievement(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAchievement())} />
                <button type="button" onClick={addAchievement}
                  className="h-9 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* الكورسات */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              الكورسات المرتبطة
            </Label>

            {/* Selected badges */}
            {selectedCourseIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {allCourses
                  .filter(c => selectedCourseIds.includes(c.id))
                  .map(c => (
                    <span key={c.id}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-lg">
                      {c.title}
                      <button type="button" onClick={() => toggleCourse(c.id)}
                        className="hover:opacity-70 mr-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
              </div>
            )}

            {/* Dropdown toggle */}
            <button
              type="button"
              onClick={() => setCoursesOpen(o => !o)}
              className="w-full flex items-center justify-between h-9 px-3 rounded-xl border border-border text-sm hover:bg-muted transition-colors text-right"
            >
              <span className="text-muted-foreground">
                {selectedCourseIds.length === 0
                  ? 'اختر كورساً أو أكثر...'
                  : `${selectedCourseIds.length} كورس محدد`}
              </span>
              <span className="text-muted-foreground text-xs">{coursesOpen ? '▲' : '▼'}</span>
            </button>

            {/* Dropdown list */}
            {coursesOpen && (
              <div className="border border-border rounded-xl overflow-hidden bg-card shadow-lg max-h-48 overflow-y-auto">
                {coursesLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : allCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">لا توجد كورسات متاحة</p>
                ) : (
                  allCourses.map(course => {
                    const checked = selectedCourseIds.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 cursor-pointer transition-colors border-b border-border/50 last:border-0"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCourse(course.id)}
                          className="w-4 h-4 accent-primary flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                          {course.level && (
                            <p className="text-xs text-muted-foreground">
                              {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                            </p>
                          )}
                        </div>
                        {checked && <span className="text-primary text-xs flex-shrink-0">✓</span>}
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* السوشيال */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>تويتر</Label>
              <Input placeholder="https://..." value={form.twitter} onChange={e => set('twitter', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>لينكدإن</Label>
              <Input placeholder="https://..." value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>يوتيوب</Label>
              <Input placeholder="https://..." value={form.youtube} onChange={e => set('youtube', e.target.value)} />
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>إلغاء</Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl" disabled={loading}>
              {loading ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المدرب'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}