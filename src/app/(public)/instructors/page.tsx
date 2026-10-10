"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Users, BookOpen, Award, MessageSquare } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import api from "@/lib/api";

interface Instructor {
  id: number;
  name: string;
  title?: string;
  avatar_url?: string;
  specializations?: string;
  years_experience?: number;
  rating?: number;
  total_reviews?: number;
  courses_count?: number;
  students_count?: number;
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="bg-muted/30 p-6 pb-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted mx-auto mb-3" />
        <div className="h-4 bg-muted rounded w-32 mx-auto mb-2" />
        <div className="h-3 bg-muted rounded w-24 mx-auto mt-1" />
        <div className="h-3 bg-muted rounded w-16 mx-auto mt-2" />
      </div>
      <div className="px-6 pb-4">
        <div className="flex gap-1.5 mb-4">
          {[1, 2, 3].map(i => <div key={i} className="h-6 w-16 bg-muted rounded-lg" />)}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map(i => <div key={i} className="h-16 bg-muted rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}

function InstructorCard({ ins, index }: { ins: Instructor; index: number }) {
  const specs = ins.specializations
    ? ins.specializations.split(",").map(s => s.trim()).slice(0, 3)
    : [];

  const rating = Number(ins.rating ?? 4.5);

  const fmt = (n?: number) =>
    !n ? "0" : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link href={`/instructors/${ins.id}`} className="group block h-full">
        <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all h-full flex flex-col">

          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 pb-4 text-center">
            {ins.avatar_url ? (
              <img
                src={ins.avatar_url}
                alt={ins.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 border-4 border-background shadow-md group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 border-4 border-background">
                <Users className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
            )}
            <h3 className="font-bold text-foreground text-base">{ins.name}</h3>
            {ins.title && <p className="text-muted-foreground text-xs mt-1">{ins.title}</p>}

            {/* Rating + reviews */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
              {ins.total_reviews ? (
                <span className="text-xs text-muted-foreground">({fmt(ins.total_reviews)} تقييم)</span>
              ) : null}
            </div>
          </div>

          <div className="px-6 pb-4 flex-1 flex flex-col">
            {/* Specializations */}
            {specs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {specs.map(s => (
                  <span key={s} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-lg font-medium">{s}</span>
                ))}
              </div>
            )}

            {/* Stats — 2 cols */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <div className="bg-muted rounded-xl p-2.5 text-center">
                <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs font-bold text-foreground">{fmt(ins.students_count)}</p>
                <p className="text-xs text-muted-foreground">طالب</p>
              </div>
              <div className="bg-muted rounded-xl p-2.5 text-center">
                <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs font-bold text-foreground">{ins.courses_count ?? 0}</p>
                <p className="text-xs text-muted-foreground">كورسات</p>
              </div>
              <div className="bg-muted rounded-xl p-2.5 text-center">
                <Award className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs font-bold text-foreground">{ins.years_experience ?? 0}</p>
                <p className="text-xs text-muted-foreground">سنوات خبرة</p>
              </div>
              <div className="bg-muted rounded-xl p-2.5 text-center">
                <MessageSquare className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs font-bold text-foreground">{fmt(ins.total_reviews)}</p>
                <p className="text-xs text-muted-foreground">تقييم</p>
              </div>
            </div>

            <div className="mt-4 py-3 border-t border-border text-center">
              <span className="text-primary text-sm font-medium group-hover:underline">
                عرض الملف الشخصي ←
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/instructors")
      .then(res => setInstructors(res.data.data ?? res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/90 to-primary/60 pt-28 pb-16 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">تعرّف على مدربينا</h1>
          <p className="text-white/70 text-lg">خبراء ومتخصصون يجمعهم شغف التعليم وبناء الجيل التقني العربي</p>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>لا يوجد مدربون بعد</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((ins, i) => (
              <InstructorCard key={ins.id} ins={ins} index={i} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}