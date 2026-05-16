export function useDashboardHeader() {
  const hour = new Date().getHours();
  
  const greeting = 
    hour < 12 ? 'صباح الخير' : 
    hour < 18 ? 'مساء الخير' : 
    'مساء النور';

  return { greeting };
}