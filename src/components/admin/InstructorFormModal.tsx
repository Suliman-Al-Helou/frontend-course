'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import type { Instructor } from '@/types';

interface Props {
  instructor?: Instructor | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InstructorFormModal({ instructor, onClose, onSuccess }: Props) {
  const isEdit = !!instructor;
  const [form, setForm] = useState({
    name:             instructor?.name             ?? '',
    title:            instructor?.title            ?? '',
    bio:              instructor?.bio              ?? '',
    avatar_url:       instructor?.avatar_url       ?? '',
    specializations:  instructor?.specializations  ?? '',
    years_experience: instructor?.years_experience?.toString() ?? '',
    twitter:          instructor?.twitter          ?? '',
    linkedin:         instructor?.linkedin         ?? '',
    youtube:          instructor?.youtube          ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = { ...form, years_experience: Number(form.years_experience) };
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
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-foreground text-base">{isEdit ? 'تعديل المدرب' : 'إضافة مدرب جديد'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>اسم المدرب *</Label>
            <Input placeholder="أ. محمد الشمري" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label>المسمى الوظيفي *</Label>
            <Input placeholder="مهندس برمجيات متقدم" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label>رابط الصورة الشخصية</Label>
            <Input placeholder="https://..." value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>التخصصات (مفصولة بفاصلة)</Label>
            <Input placeholder="Python, Machine Learning, Flask" value={form.specializations} onChange={e => set('specializations', e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>سنوات الخبرة</Label>
            <Input type="number" placeholder="5" value={form.years_experience} onChange={e => set('years_experience', e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>النبذة الشخصية</Label>
            <textarea
              placeholder="اكتب نبذة مختصرة عن المدرب..."
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

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