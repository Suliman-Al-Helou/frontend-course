import { useEffect, useState } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(true); // افتراضي dark

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === null ? true : saved === 'dark';
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  return { dark, toggle };
}