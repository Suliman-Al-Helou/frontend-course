"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { YouTubeProps } from "react-youtube";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/features/auth";
import type { VideoPlaybackPayload } from "@/types";
import { resolvePlaybackTarget, isStreamExpired } from "./video-player-helpers";

const WATERMARK_POSITIONS = [
  "top-4 start-4",
  "bottom-16 start-4",
  "top-4 end-4",
  "bottom-16 end-4",
];

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
  playback?: VideoPlaybackPayload | null;
  videoId?: string;
  onProgress?: (percent: number, position: number) => void;
  onComplete?: () => void;
  onTokenExpired?: () => void;
  completionThreshold?: number; // Default 80%
}

export function VideoPlayer({
  playback,
  videoId,
  onProgress,
  onComplete,
  onTokenExpired,
  completionThreshold = 80,
}: VideoPlayerProps) {
  const { user } = useCurrentUser();
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const watchedMaxRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);
  const savedTimeRef = useRef<number>(0);
  const onTokenExpiredRef = useRef(onTokenExpired);
  useEffect(() => {
    onTokenExpiredRef.current = onTokenExpired;
  }, [onTokenExpired]);

  const [watermarkPos, setWatermarkPos] = useState<number>(0);

  const activeTarget = useMemo(() => resolvePlaybackTarget(playback, videoId), [playback, videoId]);

  // تحديث موقع العلامة المائية دورياً بين أركان الإطار لحماية المحتوى
  useEffect(() => {
    const wmInterval = setInterval(() => {
      setWatermarkPos((prev) => (prev + 1) % WATERMARK_POSITIONS.length);
    }, 25000);
    return () => clearInterval(wmInterval);
  }, []);

  // إدارة دورة حياة المشغل وتصفير المؤقتات والمراجع بأمان عند تغيير الدرس
  useEffect(() => {
    let isCancelled = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    if (activeTarget?.provider === "hls" && videoRef.current) {
      const video = videoRef.current;

      // تحقق من المتصفحات التي تدعم HLS ذاتياً مثل Safari على Mac و iOS
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = activeTarget.url;
      } else {
        // تحميل ديناميكي كسول لمكتبة hls.js فقط عند الحاجة لتفادي تضخيم الـ bundle
        import("hls.js")
          .then(({ default: Hls }) => {
            if (isCancelled || !Hls.isSupported()) return;

            const hls = new Hls({ enableWorker: true });
            hlsRef.current = hls;
            hls.loadSource(activeTarget.url);
            hls.attachMedia(video);

            hls.on(Hls.Events.ERROR, (_event, data) => {
              if (data.fatal) {
                if (data.response?.code === 403 || isStreamExpired(activeTarget.expires_at)) {
                  if (videoRef.current) {
                    savedTimeRef.current = videoRef.current.currentTime;
                  }
                  onTokenExpiredRef.current?.();
                }
              }
            });
          })
          .catch(() => {
            // تجاهل خطأ استيراد المكتبة في بيئات الاختبار غير الداعمة
          });
      }
    }

    return () => {
      isCancelled = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [activeTarget]);

  // منطق تتبع التقدم لـ YouTube
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

  // منطق تتبع التقدم لـ HLS HTML5 Video
  const handleHlsTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = Math.round((video.currentTime / video.duration) * 100);
    watchedMaxRef.current = Math.max(watchedMaxRef.current, percent);

    onProgress?.(watchedMaxRef.current, Math.round(video.currentTime));

    if (percent >= completionThreshold && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  const handleHlsEnded = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  const handleHlsError = () => {
    if (activeTarget?.provider === "hls" && isStreamExpired(activeTarget.expires_at)) {
      if (videoRef.current) {
        savedTimeRef.current = videoRef.current.currentTime;
      }
      onTokenExpiredRef.current?.();
    }
  };

  const handleHlsLoadedMetadata = () => {
    if (savedTimeRef.current > 0 && videoRef.current) {
      videoRef.current.currentTime = savedTimeRef.current;
      savedTimeRef.current = 0;
    }
  };

  // إذا لم يتوفر أي فيديو أو كان قيد الرفع والمعالجة
  if (!activeTarget) {
    return (
      <div
        role="status"
        aria-label="الفيديو قيد الرفع والمعالجة"
        className="w-full aspect-video bg-muted/50 border border-border rounded-2xl flex flex-col items-center justify-center gap-3 p-6 text-center select-none shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
        </div>
        <p className="text-base font-bold text-foreground">الفيديو قيد الرفع والمعالجة</p>
        <p className="text-xs text-muted-foreground max-w-sm">
          يتم حالياً تجهيز وإعداد ملفات الدرس بأعلى دقة. يمكنك مراجعة المحتوى والمهام ريثما يكتمل
          الرفع.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-border">
      {activeTarget.provider === "youtube" ? (
        <YouTube
          videoId={activeTarget.source}
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
      ) : (
        <video
          ref={videoRef}
          controls
          playsInline
          className="w-full h-full object-contain"
          onTimeUpdate={handleHlsTimeUpdate}
          onEnded={handleHlsEnded}
          onError={handleHlsError}
          onLoadedMetadata={handleHlsLoadedMetadata}
        />
      )}

      {/* العلامة المائية الجنائية الموحدة لحماية الملكية الفكرية */}
      {user && (
        <div
          role="presentation"
          aria-hidden="true"
          className={`absolute ${WATERMARK_POSITIONS[watermarkPos]} pointer-events-none select-none z-10 bg-black/40 text-white/70 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10 shadow-xs transition-all duration-700 motion-reduce:transition-none`}
        >
          <p className="text-xs font-mono font-normal tracking-tight">
            {user.name} • {user.email}
          </p>
        </div>
      )}
    </div>
  );
}
