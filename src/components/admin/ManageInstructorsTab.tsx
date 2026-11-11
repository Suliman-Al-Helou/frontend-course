'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notify } from '@/components/ui/sonner';
import ConfirmModal from '@/components/shared/ConfirmModal';
import api from '@/lib/api';
import InstructorFormModal from './InstructorFormModal';
import type { Instructor } from '@/types';

export default function ManageInstructorsTab() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [deletingInstructor, setDeletingInstructor] = useState<Instructor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeletingRef = useRef(false);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/instructors');
      setInstructors(res.data.data ?? res.data);
    } catch (err) {
      console.error(err);
      notify.error('فشل تحميل قائمة المدربين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const confirmDelete = async () => {
    if (!deletingInstructor || isDeletingRef.current) return;
    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/instructors/${deletingInstructor.id}`);
      notify.success(`تم حذف المدرب "${deletingInstructor.name}" بنجاح`);
      setDeletingInstructor(null);
      fetchInstructors();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || 'تعذر حذف المدرب، يرجى المحاولة لاحقاً';
      notify.error(msg);
    } finally {
      setIsDeleting(false);
      isDeletingRef.current = false;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">إدارة المدربين</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{instructors.length} مدرب مسجّل</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-4 font-medium min-h-[44px]"
          onClick={() => { setEditingInstructor(null); setShowModal(true); }}
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة مدرب
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : instructors.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">لا يوجد مدربون بعد، أضف أول مدرب</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {instructors.map((ins, i) => (
            <motion.div
              key={ins.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between motion-reduce:transition-none motion-reduce:transform-none"
            >
              <div>
                <div className="flex items-start gap-3 mb-3">
                  {ins.avatar_url ? (
                    <img
                      src={ins.avatar_url}
                      alt={ins.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-border"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm">{ins.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{ins.title}</p>
                    {ins.years_experience && ins.years_experience > 0 && (
                      <p className="text-xs text-primary mt-0.5">{ins.years_experience} سنوات خبرة</p>
                    )}
                  </div>
                </div>

                {ins.specializations && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {ins.specializations.split(',').slice(0, 3).map((s, j) => (
                      <span key={j} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-lg">{s.trim()}</span>
                    ))}
                  </div>
                )}

                {ins.bio && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{ins.bio}</p>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl h-11 min-h-[44px] text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => { setEditingInstructor(ins); setShowModal(true); }}
                  aria-label={`تعديل بيانات المدرب ${ins.name}`}
                >
                  <Pencil className="w-3.5 h-3.5 ml-1" /> تعديل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-11 min-h-[44px] px-3.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-destructive"
                  onClick={() => setDeletingInstructor(ins)}
                  aria-label={`حذف المدرب ${ins.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* مودال تأكيد الحذف المشترك الموحد */}
      <ConfirmModal
        isOpen={!!deletingInstructor}
        onClose={() => setDeletingInstructor(null)}
        onConfirm={confirmDelete}
        title="تأكيد حذف المدرب"
        description={
          deletingInstructor ? (
            <>
              هل أنت متأكد من رغبتك في حذف المدرب <strong className="text-foreground">{deletingInstructor.name}</strong>؟{' '}
              لا يمكن التراجع عن هذا الإجراء وسيتم إلغاء ربطه من كافة الكورسات المرتبطة.
            </>
          ) : ''
        }
        isLoading={isDeleting}
      />

      {showModal && (
        <InstructorFormModal
          instructor={editingInstructor}
          onClose={() => {
            setShowModal(false);
            setEditingInstructor(null);
          }}
          onSuccess={() => {
            const wasEditing = !!editingInstructor;
            setShowModal(false);
            setEditingInstructor(null);
            notify.success(wasEditing ? 'تم تحديث بيانات المدرب بنجاح' : 'تمت إضافة المدرب بنجاح');
            fetchInstructors();
          }}
        />
      )}
    </div>
  );
}
