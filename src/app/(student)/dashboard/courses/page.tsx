import { EnrolledCoursesGrid } from "@/features/student-courses";

export const metadata = {
  title: "كورساتي | أكاديمية بيت المستقبل",
  description: "الكورسات والمسارات التعليمية المسجل بها الطالب ومتابعة تقدم التعلم",
};

export default function MyCoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">كورساتي</h1>
        <p className="text-sm text-muted-foreground mt-1">
          تابع تقدمك في المسارات التعليمية التي اشتركت بها واستكمل دروسك
        </p>
      </div>

      <EnrolledCoursesGrid />
    </div>
  );
}
