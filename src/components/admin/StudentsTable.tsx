'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notify } from '@/components/ui/sonner';
import ConfirmModal from '@/components/shared/ConfirmModal';
import api from '@/lib/api';
import type { AdminUser, Enrollment } from '@/types';

interface Props {
  users: AdminUser[];
  enrollments: Enrollment[];
  onRefresh: () => void;
}

export default function StudentsTable({ users, enrollments, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [deletingStudent, setDeletingStudent] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeletingRef = useRef(false);

  const students = users.filter(u => u.role !== 'admin');

  const filtered = students.filter(u =>
    u.name?.includes(search) || u.email?.includes(search)
  );

  const getEnrollmentCount = (userId: number) =>
    enrollments.filter(e => e.user_id === userId && e.status === 'approved').length;

  const confirmDelete = async () => {
    if (!deletingStudent || isDeletingRef.current) return;
    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/users/${deletingStudent.id}`);
      notify.success(`تم حذف حساب الطالب "${deletingStudent.name || deletingStudent.email}" بنجاح`);
      setDeletingStudent(null);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || 'تعذر حذف حساب الطالب، يرجى المحاولة لاحقاً';
      notify.error(msg);
    } finally {
      setIsDeleting(false);
      isDeletingRef.current = false;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">قائمة الطلاب</h2>
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="ابحث بالاسم أو البريد الإلكتروني..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pr-10 h-11 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 text-right">
              <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">الطالب</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">البريد</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">الكورسات المفعّلة</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">تاريخ التسجيل</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                  لا يوجد طلاب مطابقون لبحثك
                </td>
              </tr>
            ) : (
              filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-muted/30 transition-colors motion-reduce:transition-none motion-reduce:transform-none"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {(user.name || user.email || '?')[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground text-sm">{user.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground dir-ltr text-right">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      {getEnrollmentCount(user.id)} كورس
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('ar-SA')
                      : '—'}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 h-10 w-10 min-h-[44px] min-w-[44px] p-0 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-destructive"
                      onClick={() => setDeletingStudent(user)}
                      aria-label={`حذف حساب الطالب ${user.name || user.email}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* مودال تأكيد حذف الطالب المشترك الموحد */}
      <ConfirmModal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={confirmDelete}
        title="تأكيد حذف حساب الطالب"
        description={
          deletingStudent ? (
            <div className="space-y-2">
              <p>
                هل أنت متأكد من رغبتك في حذف حساب الطالب <strong className="text-foreground">{deletingStudent.name || deletingStudent.email}</strong>؟
              </p>
              {getEnrollmentCount(deletingStudent.id) > 0 && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive text-right leading-relaxed">
                  تنبيه: الطالب مسجل حالياً في <strong>{getEnrollmentCount(deletingStudent.id)} كورس</strong>. سيؤدي الحذف إلى إلغاء كافة اشتراكاته وحذف تقدمه الدراسي نهائياً.
                </div>
              )}
            </div>
          ) : ''
        }
        isLoading={isDeleting}
      />
    </div>
  );
}
