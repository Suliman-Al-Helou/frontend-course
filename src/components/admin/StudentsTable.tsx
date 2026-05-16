'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import type { AdminUser, Enrollment } from '@/types';

interface Props {
  users: AdminUser[];
  enrollments: Enrollment[];
  onRefresh: () => void;
}

export default function StudentsTable({ users, enrollments, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const students = users.filter(u => u.role !== 'admin');

  const filtered = students.filter(u =>
    u.name?.includes(search) || u.email?.includes(search)
  );

  const getEnrollmentCount = (userId: number) =>
    enrollments.filter(e => e.user_id === userId && e.status === 'approved').length;

  const handleDelete = async (userId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;
    setDeleting(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">قائمة الطلاب</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو الإيميل..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pr-10 h-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 text-right">
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">الطالب</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">البريد</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">الكورسات المفعّلة</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">تاريخ التسجيل</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted-foreground text-sm">لا يوجد طلاب</td>
              </tr>
            ) : (
              filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {(user.name || user.email || '?')[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground text-sm">{user.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{user.email}</td>
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
                  <td className="px-5 py-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                      disabled={deleting === user.id}
                      onClick={() => handleDelete(user.id)}
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
    </div>
  );
}