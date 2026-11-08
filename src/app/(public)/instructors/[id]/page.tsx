"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star, Users, BookOpen, Clock, Award,
  Twitter, Linkedin, Youtube, CheckCircle,
  Loader2, MessageSquare,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import api from "@/lib/api";

interface InstructorDetail {
  id: number;
  name: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  specializations?: string;
  years_experience?: number;
  rating?: number;
  total_reviews?: number;
  students_count?: number;
  achievements?: string[];
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  courses?: {
    id: number;
    title: string;
    cover_image?: string;
    level: string;
    total_duration: number;
    students_count: number;
    rating: number;
  }[];
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

const LEVEL_COLOR: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-600",
  intermediate: "bg-primary/10 text-primary",
  advanced: "bg-destructive/10 text-destructive",
};

function fmt(n?: number) {
  if (!n) return "0";
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString();
}

export default function InstructorProfile() {
  const params = useParams();
  const id = params?.id as string;
  const [instructor, setInstructor] = useState<InstructorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/instructors/${id}`)
      .then((res) => setInstructor(res.data))
      .catch(() => setError("المدرب غير موجود"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  if (error || !instructor)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="text-muted-foreground">{error}</p>
        <Link href="/instructors" className="text-primary hover:underline text-sm">
          العودة للمدربين
        </Link>
      </div>
    );

  const specs = instructor.specializations
    ? instructor.specializations.split(",").map((s) => s.trim())
    : [];

  const rating = Number(instructor.rating ?? 4.5);
  const totalReviews = instructor.total_reviews ?? 0;
  const studentsCount = instructor.students_count ?? 0;

  const stats = [
    { icon: Users,         label: "إجمالي الطلاب", value: fmt(studentsCount) },
    { icon: BookOpen,      label: "عدد الكورسات",  value: instructor.courses?.length ?? 0 },
    { icon: Star,          label: "متوسط التقييم", value: rating.toFixed(1) },
    { icon: MessageSquare, label: "عدد التقييمات", value: fmt(totalReviews) },
    { icon: Award,         label: "سنوات الخبرة",  value: instructor.years_experience ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <Navbar />

      {/* Cover */}
      <div className="relative pt-16">
        <div className="h-56 sm:h-72 w-full overflow-hidden relative">
          {instructor.cover_url ? (
            <img src={instructor.cover_url} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Profile strip */}
        <div className="bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 py-12 -mt-16 sm:-mt-20">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={
                  instructor.avatar_url ??
                  `https://ui-avatars.com/api/?name=${instructor.name}&background=0d2258&color=fff`
                }
                alt={instructor.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-background shadow-xl object-cover flex-shrink-0 relative z-10"
              />

              <div className="flex-1 sm:pb-2 relative z-10">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{instructor.name}</h1>
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      مدرب معتمد
                    </span>
                  </div>
                  {instructor.title && (
                    <p className="text-muted-foreground text-sm sm:text-base">{instructor.title}</p>
                  )}

                  {/* Quick stats row */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
                      {totalReviews > 0 && (
                        <span className="text-muted-foreground">({fmt(totalReviews)} تقييم)</span>
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-primary" />
                      {fmt(studentsCount)} طالب
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {instructor.courses?.length ?? 0} كورسات
                    </span>
                    {(instructor.years_experience ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-primary" />
                        {instructor.years_experience} سنوات خبرة
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2 sm:pb-2 relative z-10">
                {instructor.twitter && (
                  <a href={instructor.twitter} target="_blank" rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Twitter className="w-4 h-4 text-foreground" />
                  </a>
                )}
                {instructor.linkedin && (
                  <a href={instructor.linkedin} target="_blank" rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Linkedin className="w-4 h-4 text-foreground" />
                  </a>
                )}
                {instructor.youtube && (
                  <a href={instructor.youtube} target="_blank" rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Youtube className="w-4 h-4 text-foreground" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Sidebar */}
          <div className="space-y-6">
            {instructor.bio && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-base font-bold text-foreground mb-3">عن المدرب</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{instructor.bio}</p>
              </motion.div>
            )}

            {specs.length > 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-base font-bold text-foreground mb-3">التخصصات</h2>
                <div className="flex flex-wrap gap-2">
                  {specs.map(s => (
                    <span key={s} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-xl">{s}</span>
                  ))}
                </div>
              </motion.div>
            )}

            {instructor.achievements && instructor.achievements.length > 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-base font-bold text-foreground mb-3">الإنجازات</h2>
                <ul className="space-y-2.5">
                  {instructor.achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Stats card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-primary rounded-2xl p-6 text-white">
              <h2 className="text-base font-bold mb-4">إحصائيات</h2>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => (
                  <div key={i} className={`bg-white/10 rounded-xl p-3 text-center ${i === stats.length - 1 && stats.length % 2 !== 0 ? 'col-span-2' : ''}`}>
                    <stat.icon className="w-5 h-5 text-white/70 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-white/60 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Courses */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <h2 className="text-xl font-bold text-foreground mb-5">
                كورسات المدرب ({instructor.courses?.length ?? 0})
              </h2>

              {!instructor.courses?.length ? (
                <div className="text-center py-16 bg-card border border-border rounded-2xl text-muted-foreground">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>لا يوجد كورسات بعد</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {instructor.courses.map((course, i) => (
                    <motion.div key={course.id}
                      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <Link href={`/courses/${course.id}`} className="group block">
                      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all sm:h-40">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative sm:w-52 sm:h-40 h-40 flex-shrink-0 overflow-hidden">
                              {course.cover_image ? (
                                <img src={course.cover_image} alt={course.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                  <BookOpen className="w-10 h-10 text-primary/40" />
                                </div>
                              )}
                              <div className={`absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${LEVEL_COLOR[course.level] ?? "bg-muted text-muted-foreground"}`}>
                                {LEVEL_LABEL[course.level] ?? course.level}
                              </div>
                            </div>
                            <div className="flex-1 p-5">
                              <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors leading-snug">
                                {course.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-3">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {Math.round((course.total_duration ?? 0) / 60)} ساعة
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                  {(course.rating ?? 0).toFixed(1)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5" />
                                  {fmt(course.students_count)} طالب
                                </span>
                              </div>
                              <div className="mt-4">
                                <span className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs px-5 h-8 inline-flex items-center transition-colors">
                                  عرض الكورس
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}