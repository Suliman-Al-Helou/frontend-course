"use client";

import { useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import dynamic from "next/dynamic";
import type { YouTubeProps } from "react-youtube";
import React from 'react';
// استبدل الـ dynamic كاملاً بهذا
const YouTube = dynamic(
  () => import('react-youtube').then(mod => mod.default) as any,
  {
    ssr: false,
    loading: () => <div className="w-full h-64 bg-muted animate-pulse rounded-xl" />,
  }
) as React.ComponentType<YouTubeProps>;

interface VideoPlayerProps {
  videoId: string;
  onProgress: (percent: number) => void;
  onComplete: () => void;
}

export default function VideoPlayer({
  videoId,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const { user } = useAuthStore();
  const playerRef = useRef<any>(null);
const intervalRef  = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const watchedRef = useRef(0);
  const completedRef = useRef(false);

  // ✅ تنظيف الـ interval لما الـ component يُحذف — يمنع memory leak
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

const startTracking = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(async () => {
      const player = playerRef.current;
      if (!player) return;
      const current  = await player.getCurrentTime();
      const duration = await player.getDuration();
      if (!duration) return;
      const percent = (current / duration) * 100;
      watchedRef.current = Math.max(watchedRef.current, percent);
      onProgress(Math.round(percent));

      if (percent >= 80 && !completedRef.current) {
        completedRef.current = true;
        clearInterval(intervalRef.current);
        intervalRef.current = undefined; // ✅ بدل null
        onComplete();
      }
    }, 5000);
  };

 const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined; // ✅ بدل null
    }
  };

  return (
    <div
      className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl"
      style={{ aspectRatio: "16/9" }}
    >
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
            onComplete();
          }
        }}
      />

      {user && (
        <div className="absolute bottom-12 left-4 pointer-events-none select-none z-10">
          <p className="text-white/30 text-xs">
            {user.name} • {user.email}
          </p>
        </div>
      )}
    </div>
  );
}
