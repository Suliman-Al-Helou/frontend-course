// StudentHome.tsx  (Server Component: composition only)
import ExamResults from "./ExamResults";
import HomeHeader from "./HomeHeader";
import StatsCards from "./StatsCards";
import ZoomCalendar from "./zoom-calendar/ZoomCalendar";

export default function StudentHome() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <HomeHeader />
      <StatsCards />
      <ExamResults />
      <ZoomCalendar />
    </div>
  );
}
