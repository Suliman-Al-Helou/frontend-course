'use client';

// src/app/(public)/instructors/page.tsx

// 1. Imports
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Users, BookOpen, Award } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Image from 'next/image';
// 2. Types & Data
interface Instructor {
  id:               number;
  name:             string;
  title:            string;
  avatar:           string;
  specializations:  string[];
  totalStudents:    number;
  totalCourses:     number;
  rating:           number;
  yearsExperience:  number;
}

const INSTRUCTORS: Instructor[] = [
  { id: 1, name: 'أ. محمد الشمري',  title: 'مهندس برمجيات متقدم',         avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', specializations: ['Python', 'ML', 'Flask'],          totalStudents: 5840, totalCourses: 4, rating: 4.9, yearsExperience: 10 },
  { id: 2, name: 'أ. سارة العمري',   title: 'مطورة واجهات أمامية متقدمة',  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face', specializations: ['React', 'Next.js', 'TypeScript'], totalStudents: 3100, totalCourses: 3, rating: 4.8, yearsExperience: 7  },
  { id: 3, name: 'د. خالد البكر',    title: 'باحث في الذكاء الاصطناعي',    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', specializations: ['AI', 'Deep Learning', 'NLP'],    totalStudents: 2600, totalCourses: 2, rating: 4.9, yearsExperience: 12 },
  { id: 4, name: 'أ. فيصل الدوسري', title: 'مهندس قواعد بيانات',           avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face', specializations: ['SQL', 'NoSQL', 'PostgreSQL'],     totalStudents: 1800, totalCourses: 2, rating: 4.7, yearsExperience: 8  },
  { id: 5, name: 'أ. نورة القحطاني', title: 'مطورة تطبيقات جوال',          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', specializations: ['Flutter', 'Dart', 'Firebase'],   totalStudents:  980, totalCourses: 1, rating: 4.8, yearsExperience: 5  },
  { id: 6, name: 'أ. عمر الشهري',    title: 'خبير أمن معلومات',            avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face', specializations: ['Security', 'Ethical Hacking', 'Network'], totalStudents: 760, totalCourses: 1, rating: 4.9, yearsExperience: 9 },
];

// 3. Sub Components
function InstructorCard({ ins, index }: { ins: Instructor; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link href={`/instructors/${ins.id}`} className="group block h-full">
        <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all h-full flex flex-col">

          {/* Avatar */}
          <div className="bg-gradient-to-br from-blue-deep/10 to-primary/5 p-6 pb-4 text-center">
            <Image
              src={ins.avatar} alt={ins.name}
              className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 border-4 border-background shadow-md group-hover:scale-105 transition-transform"
            />
            <h3 className="font-bold text-foreground text-base">{ins.name}</h3>
            <p className="text-muted-foreground text-xs mt-1">{ins.title}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-foreground">{ins.rating}</span>
            </div>
          </div>

          <div className="px-6 pb-4 flex-1 flex flex-col">
            {/* Specializations */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {ins.specializations.map(s => (
                <span key={s} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-lg font-medium">{s}</span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-auto">
              {[
                { icon: Users,    value: ins.totalStudents.toLocaleString(), label: 'طالب'    },
                { icon: BookOpen, value: ins.totalCourses,                   label: 'كورسات'  },
                { icon: Award,    value: ins.yearsExperience,                label: 'سنوات'   },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-muted rounded-xl p-2.5 text-center">
                  <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xs font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
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

// 4. Main Component
export default function InstructorsPage() {
  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-deep to-blue-mid pt-28 pb-16 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Award className="w-4 h-4" /> فريق المدربين
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">تعرّف على مدربينا</h1>
          <p className="text-white/70 text-lg">خبراء ومتخصصون يجمعهم شغف التعليم وبناء الجيل التقني العربي</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSTRUCTORS.map((ins, i) => (
            <InstructorCard key={ins.id} ins={ins} index={i} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}