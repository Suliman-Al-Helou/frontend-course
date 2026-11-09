// StudentHome.tsx  (Server Component: composition only)
import ExamResults from "./ExamResults";
import HomeHeader from "./HomeHeader";
import StatsCards from "./StatsCards";
import ZoomCalendar from "./zoom-calendar/ZoomCalendar";

export default function StudentHome() {
  return (
    <div className="space-y-12">
      <StatsCards />
      <HomeHeader />
      <ExamResults />
      <ZoomCalendar />
    </div>
  );
}
