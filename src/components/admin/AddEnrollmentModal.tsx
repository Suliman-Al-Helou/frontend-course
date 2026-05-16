'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import type { Course } from '@/types';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEnrollmentModal({ onClose, onSuccess }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({ student_email: '', student_name: '', course_id: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/courses').then(res => {
      setCourses(res.data.data ?? res.data);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.course_id) { setError('اختر الكورس'); return; }
    setLoading(true);
    try {
      await api.post('/admin/enrollments', {
        ...form,
        course_id: Number(form.course_id),
        status: 'pending',
        payment_confirmed: false,
      });
      onSuccess();
    } catch {
      setError('حدث خطأ، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">إضافة تسجيل جديد</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>اسم الطالب</Label>
            <Input
              placeholder="محمد أحمد"
              value={form.student_name}
              onChange={e => setForm({ ...form, student_name: e.target.value })}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>البريد الإلكتروني *</Label>
            <Input
              type="email"
              placeholder="student@example.com"
              value={form.student_email}
              onChange={e => setForm({ ...form, student_email: e.target.value })}
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>الكورس *</Label>
            <select
              value={form.course_id}
              onChange={e => setForm({ ...form, course_id: e.target.value })}
              className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              required
            >
              <option value="">اختر الكورس...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl"
              disabled={loading}
            >
              {loading ? 'جارٍ الإضافة...' : 'إضافة الطلب'}
            </Button>
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}