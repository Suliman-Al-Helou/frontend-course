"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { YouTubeProps } from "react-youtube";
import { useAuthStore } from "@/store/authStore";

const YouTube = dynamic(() => import("react-youtube").then((mod) => mod.default) as any, {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-label="جارٍ تجهيز مشغل الفيديو"
      className="w-full aspect-video bg-muted animate-pulse rounded-2xl flex items-center justify-center text-muted-foreground text-sm"
    >
      <span>جارٍ تشغيل الدرس...</span>
    </div>
  ),
}) as React.ComponentType<YouTubeProps>;

export interface VideoPlayerProps {
  videoId: string;
  onProgress?: (percent: number, position: number) => void;
  onComplete?: () => void;
  completionThreshold?: number; // Default 80%
}

export function VideoPlayer({
  videoId,
  onProgress,
  onComplete,
  completionThreshold = 80,
}: VideoPlayerProps) {
  const { user } = useAuthStore();
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const watchedMaxRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);

  // تنظيف الـ interval عند إلغاء تركيب المكون لمنع تسريب الذاكرة
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, []);

  const startTracking = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(async () => {
      const player = playerRef.current;
      if (!player) return;

      try {
        const currentTime = await player.getCurrentTime();
        const duration = await player.getDuration();
        if (!duration) return;

        const percent = Math.round((currentTime / duration) * 100);
        watchedMaxRef.current = Math.max(watchedMaxRef.current, percent);

        onProgress?.(watchedMaxRef.current, Math.round(currentTime));

        if (percent >= completionThreshold && !completedRef.current) {
          completedRef.current = true;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
          }
          onComplete?.();
        }
      } catch {
        // تجاهل أخطاء الـ API المؤقتة
      }
    }, 5000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-border">
      <YouTube
        videoId={videoId}
        className="w-full h-full"
        iframeClassName="w-full h-full"
        opts={{
          width: "100%",
          height: "100%",
          playerVars: { rel: 0, modestbranding: 1 },
        }}
        onReady={(e) => {
          playerRef.current = e.target;
        }}
        onPlay={startTracking}
        onPause={stopTracking}
        onEnd={() => {
          stopTracking();
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete?.();
          }
        }}
      />

      {/* العلامة المائية لحماية الملكية الفكرية */}
      {user && (
        <div className="absolute top-4 start-4 pointer-events-none select-none z-10 bg-black/50 text-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10 shadow-xs">
          <p className="text-xs font-mono font-medium tracking-tight">
            {user.name} • {user.email}
          </p>
        </div>
      )}
    </div>
  );
}
