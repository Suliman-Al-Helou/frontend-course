import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const savedTheme = typeof window !== 'undefined'
  ? (localStorage.getItem('theme-storage') ? 
      JSON.parse(localStorage.getItem('theme-storage')!).state?.theme 
      : 'dark')
  : 'dark';

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: savedTheme,
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: next });
        document.documentElement.classList.toggle('dark', next === 'dark');
      },
    }),
    { name: 'theme-storage' }
  )
);
