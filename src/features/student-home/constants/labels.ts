// TODO: translate — move to messages/ar.json once NextIntlClientProvider wraps the app.
export const LABELS = {
  stats: {
    enrolled: "كورسات مسجّل فيها",
    lessons: "دروس مكتملة",
    hours: "ساعات تعلم",
    completed: "كورسات مكتملة",
  },
  exams: {
    title: "نتائج الامتحانات",
    passRate: "معدل النجاح الكلي",
    emptyTitle: "لا توجد نتائج امتحانات بعد",
    emptyDescription: "ستظهر نتائجك هنا بعد أن تحلّ أول مهمة في أحد الدروس.",
  },
  zoom: {
    title: "جدول لقاءات Zoom",
    subtitle: "تابع مواعيد اللقاءات وادخل إلى الاجتماع عندما يحين وقت الدخول.",
    attendanceRate: "نسبة الحضور",
    attendanceSummary: (attended: number, ended: number, missed: number) =>
      `حضرت ${attended} من ${ended} لقاءات منتهية · فاتك ${missed}`,
  },
} as const;
