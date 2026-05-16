import { useEffect, useRef, useCallback } from 'react';
import { lessonApi } from '@/lib/api';

interface UseVideoProgressOptions {
  lessonId:        number;
  onCompleted:     () => void;
  completionThreshold?: number; // افتراضي 80%
}

export function useVideoProgress({
  lessonId,
  onCompleted,
  completionThreshold = 80,
}: UseVideoProgressOptions) {
  const playerRef        = useRef<HTMLIFrameElement>(null);
  const intervalRef      = useRef<NodeJS.Timeout | null>(null);
  const completedRef     = useRef(false);
  const lastPositionRef  = useRef(0);
  const watchedRef       = useRef(0);

  const saveProgress = useCallback(async (percent: number, position: number) => {
    try {
      await lessonApi.saveProgress(lessonId, {
        watched_percent: Math.round(percent),
        last_position:   Math.round(position),
      });
      if (percent >= completionThreshold && !completedRef.current) {
        completedRef.current = true;
        onCompleted();
      }
    } catch {
      // تجاهل أخطاء الحفظ الصامتة
    }
  }, [lessonId, completionThreshold, onCompleted]);

  // YouTube iframe API
  useEffect(() => {
    // نستخدم postMessage مع YouTube
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'infoDelivery' && data.info) {
          const { currentTime, duration, playerState } = data.info;
          if (duration && currentTime) {
            const percent = (currentTime / duration) * 100;
            lastPositionRef.current = currentTime;
            watchedRef.current      = Math.max(watchedRef.current, percent);
          }
          // playerState 1 = playing
          if (playerState === 1) {
            if (!intervalRef.current) {
              intervalRef.current = setInterval(() => {
                saveProgress(watchedRef.current, lastPositionRef.current);
              }, 10000); // كل 10 ثوانٍ
            }
          } else {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              saveProgress(watchedRef.current, lastPositionRef.current);
            }
          }
        }
      } catch { /* ignore */ }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [saveProgress]);

  return { playerRef };
}