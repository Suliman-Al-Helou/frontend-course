'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Users, BookOpen, Clock, Award, Twitter, Linkedin, Youtube, CheckCircle, Zap } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Image from 'next/image';
const instructorsData: Record<string, any> = {
  1: {
    id: 1,
    name: 'أ. محمد الشمري',
    title: 'مهندس برمجيات متقدم',
    bio: 'مهندس برمجيات بخبرة تزيد على ١٠ سنوات عمل في شركات عالمية كـ Google و Amazon. متخصص في Python وتعلم الآلة وتطوير الأنظمة الضخمة. قدّم أكثر من ٢٠٠ محاضرة ودورة تدريبية للمطورين العرب حول العالم.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&h=300&fit=crop',
    specializations: ['Python', 'Machine Learning', 'APIs', 'Flask', 'Data Science'],
    totalStudents: 5840, totalCourses: 4, rating: 4.9, totalReviews: 1240, yearsExperience: 10,
    socials: { twitter: '#', linkedin: '#', youtube: '#' },
    achievements: ['حاصل على شهادة AWS Solutions Architect', 'مساهم في مشاريع مفتوحة المصدر', 'متحدث في مؤتمرات تقنية دولية', 'مؤلف كتاب "Python للعرب"'],
    courses: [
      { id: 1, title: 'Python من الصفر إلى الاحتراف', level: 'مبتدئ', duration: '٤٠ ساعة', students: '٣,٢٤٠', rating: '٤.٩', lessons: 62, image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=220&fit=crop', hot: true },
      { id: 3, title: 'الذكاء الاصطناعي وتعلم الآلة', level: 'متقدم', duration: '٧٠ ساعة', students: '١,٨٥٠', rating: '٤.٩', lessons: 95, image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop', hot: true },
      { id: 7, title: 'Flask لبناء تطبيقات الويب', level: 'متوسط', duration: '٣٥ ساعة', students: '٧٥٠', rating: '٤.٨', lessons: 48, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=220&fit=crop', hot: false },
    ],
  },
  2: {
    id: 2,
    name: 'أ. سارة العمري',
    title: 'مطورة واجهات أمامية متقدمة',
    bio: 'مطورة Frontend بخبرة ٧ سنوات، متخصصة في React وNext.js وتصميم تجربة المستخدم. تؤمن بأن الكود الجميل والتصميم الجذاب لا يُفرَّق بينهما. ساعدت مئات الطلاب على الانتقال من مجالات أخرى إلى عالم تطوير الويب.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=300&fit=crop',
    specializations: ['React', 'Next.js', 'TypeScript', 'CSS', 'UI/UX'],
    totalStudents: 3100, totalCourses: 3, rating: 4.8, totalReviews: 870, yearsExperience: 7,
    socials: { twitter: '#', linkedin: '#', youtube: '#' },
    achievements: ['مساهمة في مكتبات React مفتوحة المصدر', 'مدربة معتمدة من Meta', 'حاصلة على جائزة أفضل مطورة عربية ٢٠٢٤'],
    courses: [
      { id: 2, title: 'تطوير الويب بـ React وNext.js', level: 'متوسط', duration: '٥٥ ساعة', students: '٢,١٠٠', rating: '٤.٨', lessons: 84, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=220&fit=crop', hot: false },
      { id: 8, title: 'TypeScript من البداية', level: 'مبتدئ', duration: '٢٥ ساعة', students: '١,٠٠٠', rating: '٤.٧', lessons: 40, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=220&fit=crop', hot: false },
    ],
  },
  3: {
    id: 3,
    name: 'د. خالد البكر',
    title: 'باحث في الذكاء الاصطناعي',
    bio: 'دكتوراه في علوم الحاسب من جامعة KAUST، باحث في الذكاء الاصطناعي وتعلم الآلة. نشر أكثر من ٣٠ ورقة بحثية في مجلات دولية محكّمة. يسعى لجعل الذكاء الاصطناعي متاحاً وممتعاً لكل مبرمج عربي.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=300&fit=crop',
    specializations: ['AI', 'Deep Learning', 'NLP', 'Computer Vision', 'PyTorch'],
    totalStudents: 2600, totalCourses: 2, rating: 4.9, totalReviews: 640, yearsExperience: 12,
    socials: { twitter: '#', linkedin: '#', youtube: '#' },
    achievements: ['دكتوراه من KAUST في علوم الحاسب', '٣٠+ ورقة بحثية منشورة دولياً', 'مستشار تقني في عدة شركات ناشئة'],
    courses: [
      { id: 3, title: 'الذكاء الاصطناعي وتعلم الآلة', level: 'متقدم', duration: '٧٠ ساعة', students: '١,٨٥٠', rating: '٤.٩', lessons: 95, image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop', hot: true },
    ],
  },
};

const levelColors: Record<string, string> = {
  'مبتدئ': 'bg-green-100 text-green-700',
  'متوسط': 'bg-blue-100 text-blue-700',
  'متقدم': 'bg-purple-100 text-purple-700',
};

export default function InstructorProfile() {
  const params = useParams();
  const id = params?.id as string;
  const instructor = instructorsData[id] ?? instructorsData[1];

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <Navbar />

{/* Cover */}
<div className="relative pt-16">
  {/* الصورة الخلفية */}
  <div className="h-56 sm:h-72 w-full overflow-hidden relative">
    <Image src={instructor.cover} alt="cover" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
  </div>

  {/* Profile Info — تحت الصورة مش فوقها */}
  <div className="bg-white dark:bg-background border-b border-border">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end gap-5 py-12 -mt-16 sm:-mt-20">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={instructor.avatar}
          alt={instructor.name}
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-white shadow-xl object-cover flex-shrink-0 relative z-10"
        />
        <div className="flex-1 sm:pb-2 relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{instructor.name}</h1>
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">مدرب معتمد</span>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">{instructor.title}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{instructor.rating} ({instructor.totalReviews} تقييم)</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4 text-primary" />{instructor.totalStudents.toLocaleString()} طالب</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-primary" />{instructor.totalCourses} كورسات</span>
              <span className="flex items-center gap-1"><Award className="w-4 h-4 text-primary" />{instructor.yearsExperience} سنوات خبرة</span>
            </div>
          </motion.div>
        </div>
        <div className="flex items-center gap-2 sm:pb-2 relative z-10">
          {instructor.socials.twitter && <a href={instructor.socials.twitter} className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"><Twitter className="w-4 h-4 text-foreground" /></a>}
          {instructor.socials.linkedin && <a href={instructor.socials.linkedin} className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"><Linkedin className="w-4 h-4 text-foreground" /></a>}
          {instructor.socials.youtube && <a href={instructor.socials.youtube} className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"><Youtube className="w-4 h-4 text-foreground" /></a>}
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left Column */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-foreground mb-3">عن المدرب</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{instructor.bio}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-foreground mb-3">التخصصات</h2>
              <div className="flex flex-wrap gap-2">
                {instructor.specializations.map((s: string) => (
                  <span key={s} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-xl">{s}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-foreground mb-3">الإنجازات</h2>
              <ul className="space-y-2.5">
                {instructor.achievements.map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-blue-deep to-blue-mid rounded-2xl p-6 text-white">
              <h2 className="text-base font-bold mb-4">إحصائيات</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: 'إجمالي الطلاب', value: instructor.totalStudents.toLocaleString() },
                  { icon: BookOpen, label: 'عدد الكورسات', value: instructor.totalCourses },
                  { icon: Star, label: 'متوسط التقييم', value: instructor.rating },
                  { icon: Award, label: 'سنوات الخبرة', value: instructor.yearsExperience },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                    <stat.icon className="w-5 h-5 text-white/70 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-white/60 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <h2 className="text-xl font-bold text-foreground mb-5">كورسات المدرب ({instructor.courses.length})</h2>
              <div className="space-y-5">
                {instructor.courses.map((course: any, i: number) => (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Link href={`/courses/${course.id}`} className="group block">
                      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative sm:w-52 h-40 sm:h-auto flex-shrink-0">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            {course.hot && (
                              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Zap className="w-3 h-3" /> الأكثر طلباً
                              </div>
                            )}
                            <div className={`absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${levelColors[course.level]}`}>
                              {course.level}
                            </div>
                          </div>
                          <div className="flex-1 p-5">
                            <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors leading-snug">{course.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-3">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.lessons} درس</span>
                              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{course.rating}</span>
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students} طالب</span>
                            </div>
                            <div className="mt-4">
                              <button className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs px-5 h-8 transition-colors">
                                عرض الكورس
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}