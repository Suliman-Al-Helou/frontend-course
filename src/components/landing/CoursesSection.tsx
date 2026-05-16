"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Users, Star, BookOpen, ArrowLeft, Zap } from "lucide-react";
import {
  useCoursesSection,
  useLevelStyle,
  CourseCard,
} from "@/components/landing/_hooks/Usecoursessection";
import Image from "next/image";
interface CourseCardProps {
  course: CourseCard;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function CourseCardItem({ course }: CourseCardProps) {
  const { color, label } = useLevelStyle(course.level);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={course.cover_image ?? ""}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {course.hot && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" /> الأكثر طلباً
          </div>
        )}
        <div
          className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${color}`}
        >
          {label}
        </div>
      </div>

      {/* باقي الكود كما هو */}
      <div className="p-5">{/* ... */}</div>
    </motion.div>
  );
}
export default function CoursesSection() {
  const courses = useCoursesSection();

  return (
    <section id="courses" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4" />
            الكورسات المتاحة
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            ابدأ مساركَ التقني
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            كل كورس مُصمَّم بعناية ليضمن فهمك العميق وتطبيقك العملي — ليس مجرد
            مشاهدة
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course) => (
            <CourseCardItem key={course.id} course={course} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 hover:border-primary text-primary hover:bg-primary/5 px-10 py-3 text-base font-medium transition-colors"
          >
            عرض جميع الكورسات
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
