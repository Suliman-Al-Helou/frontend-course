"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import type { YouTubeProps } from "react-youtube";
import { Loader2, RefreshCw } from "lucide-react";
import { useCurrentUser } from "@/features/auth";
import type { VideoPlaybackPayload } from "@/types";
import {
  resolvePlaybackTarget,
  isStreamExpired,
  shouldThrottleProgressReport,
  formatWatermarkText,
} from "./video-player-helpers";
import { UnifiedPlayerControls } from "./UnifiedPlayerControls";

const WATERMARK_POSITIONS = [
  "top-4 start-4",
  "bottom-16 start-4",
  "top-4 end-4",
  "bottom-16 end-4",
];

const YouTube = dynamic<YouTubeProps>(() => import("react-youtube").then((mod) => mod.default), {
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
});

export interface VideoPlayerProps {
  lessonId?: string | number;
  playback?: VideoPlaybackPayload | null;
  videoId?: string;
  onProgress?: (percent: number, position: number) => void;
  onComplete?: () => void;
  onTokenExpired?: () => void;
  completionThreshold?: number; // Default 80%
}

export function VideoPlayer({
  lessonId,
  playback,
  videoId,
  onProgress,
  onComplete,
  onTokenExpired,
  completionThreshold = 80,
}: VideoPlayerProps) {
  const { user } = useCurrentUser();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<any>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const watchedMaxRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);
  const savedTimeRef = useRef<number>(0);
  const lastReportedTimeRef = useRef<number>(0);
  const attemptedErrorRecoveryRef = useRef<number>(0);
  const renewalAttemptedRef = useRef<boolean>(false);
  const onTokenExpiredRef = useRef(onTokenExpired);
  useEffect(() => {
    onTokenExpiredRef.current = onTokenExpired;
  }, [onTokenExpired]);

  const [watermarkPos, setWatermarkPos] = useState<number>(0);
  const [isTokenRenewalRequired, setIsTokenRenewalRequired] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);

  const activeTarget = useMemo(() => resolvePlaybackTarget(playback, videoId), [playback, videoId]);

  const targetIdentity = useMemo(() => {
    if (lessonId !== undefined && lessonId !== null) {
      return `lesson:${String(lessonId)}`;
    }
    if (!activeTarget) return "none";
    if (activeTarget.provider === "youtube") {
      return `yt:${activeTarget.source}`;
    }
    return `hls:${activeTarget.url.split("?")[0]}`;
  }, [lessonId, activeTarget]);

  const triggerTokenRenewal = useCallback(() => {
    if (videoRef.current && videoRef.current.currentTime > 0) {
      savedTimeRef.current = videoRef.current.currentTime;
    }

    if (renewalAttemptedRef.current) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      setIsTokenRenewalRequired(true);
      return;
    }

    renewalAttemptedRef.current = true;
    onTokenExpiredRef.current?.();
  }, []);

  const handleManualTokenRenewal = useCallback(() => {
    renewalAttemptedRef.current = false;
    setIsTokenRenewalRequired(false);
    onTokenExpiredRef.current?.();
  }, []);

  // تحديث موقع العلامة المائية دورياً بين أركان الإطار لحماية المحتوى
  useEffect(() => {
    const wmInterval = setInterval(() => {
      setWatermarkPos((prev) => (prev + 1) % WATERMARK_POSITIONS.length);
    }, 25000);
    return () => clearInterval(wmInterval);
  }, []);

  // تصفير موضع المشاهدة وحالة التقدم فقط عند الانتقال لدرس مختلف (وليس عند تجديد التوكن)
  useEffect(() => {
    watchedMaxRef.current = 0;
    completedRef.current = false;
    lastReportedTimeRef.current = 0;
    savedTimeRef.current = 0;
    attemptedErrorRecoveryRef.current = 0;
    renewalAttemptedRef.current = false;
    setIsTokenRenewalRequired(false);
  }, [targetIdentity]);

  // إدارة دورة حياة المشغل وتصفير المؤقتات والمراجع بأمان عند تغيير الرابط
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
              if (!data.fatal) return;

              switch (data.type) {
                case Hls.ErrorTypes.MEDIA_ERROR: {
                  const now = Date.now();
                  if (now - attemptedErrorRecoveryRef.current >= 5000) {
                    attemptedErrorRecoveryRef.current = now;
                    hls.recoverMediaError();
                  }
                  break;
                }
                case Hls.ErrorTypes.NETWORK_ERROR:
                  if (data.response?.code === 403 || isStreamExpired(activeTarget.expires_at)) {
                    triggerTokenRenewal();
                  }
                  break;
                default:
                  hls.destroy();
                  break;
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

    const now = Date.now();
    // تقنين الإرسال كل 5 ثوانٍ لحماية السيرفر من فيضان الطلبات المتكررة
    if (!shouldThrottleProgressReport(lastReportedTimeRef.current, now, 5000)) {
      lastReportedTimeRef.current = now;
      onProgress?.(watchedMaxRef.current, Math.round(video.currentTime));
    }

    if (percent >= completionThreshold && !completedRef.current) {
      completedRef.current = true;
      lastReportedTimeRef.current = now;
      onProgress?.(watchedMaxRef.current, Math.round(video.currentTime));
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
    if (activeTarget?.provider !== "hls") return;

    const mediaErrorCode = videoRef.current?.error?.code;
    const isNativeMediaNetworkOrSourceError = mediaErrorCode === 2 || mediaErrorCode === 4;

    if (isStreamExpired(activeTarget.expires_at) || isNativeMediaNetworkOrSourceError) {
      triggerTokenRenewal();
    }
  };

  const handleHlsLoadedMetadata = () => {
    renewalAttemptedRef.current = false;
    setIsTokenRenewalRequired(false);
    if (videoRef.current) {
      if (Number.isFinite(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
      if (savedTimeRef.current > 0) {
        videoRef.current.currentTime = savedTimeRef.current;
        savedTimeRef.current = 0;
      }
    }
  };

  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true);
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    } else {
      resetHideTimer();
    }
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [isPlaying, resetHideTimer]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    if (activeTarget?.provider !== "youtube" || !isPlaying) return;
    const uiTimer = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const t = p.getCurrentTime?.();
      const d = p.getDuration?.();
      if (typeof t === "number" && Number.isFinite(t)) setCurrentTime(t);
      if (typeof d === "number" && Number.isFinite(d) && d > 0) setDuration(d);
    }, 250);
    return () => clearInterval(uiTimer);
  }, [activeTarget?.provider, isPlaying]);

  const handleTogglePlay = useCallback(() => {
    if (activeTarget?.provider === "youtube") {
      const p = playerRef.current;
      if (!p) return;
      if (isPlaying) p.pauseVideo?.();
      else p.playVideo?.();
    } else if (videoRef.current) {
      if (videoRef.current.paused) void videoRef.current.play();
      else videoRef.current.pause();
    }
  }, [activeTarget?.provider, isPlaying]);

  const handleSeek = useCallback(
    (seconds: number) => {
      setCurrentTime(seconds);
      if (activeTarget?.provider === "youtube") {
        playerRef.current?.seekTo?.(seconds, true);
      } else if (videoRef.current) {
        videoRef.current.currentTime = seconds;
      }
      resetHideTimer();
    },
    [activeTarget?.provider, resetHideTimer],
  );

  const handleVolumeChange = useCallback(
    (nextVol: number) => {
      setVolume(nextVol);
      const muted = nextVol === 0;
      setIsMuted(muted);
      if (activeTarget?.provider === "youtube") {
        playerRef.current?.setVolume?.(nextVol);
        if (muted) playerRef.current?.mute?.();
        else playerRef.current?.unMute?.();
      } else if (videoRef.current) {
        videoRef.current.volume = nextVol / 100;
        videoRef.current.muted = muted;
      }
      resetHideTimer();
    },
    [activeTarget?.provider, resetHideTimer],
  );

  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (activeTarget?.provider === "youtube") {
      if (nextMuted) playerRef.current?.mute?.();
      else playerRef.current?.unMute?.();
    } else if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    resetHideTimer();
  }, [activeTarget?.provider, isMuted, resetHideTimer]);

  const handleToggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
    } else {
      void el.requestFullscreen?.();
    }
    resetHideTimer();
  }, [resetHideTimer]);

  const handleSurfaceClick = useCallback(
    (e: React.MouseEvent | React.PointerEvent) => {
      if ("pointerType" in e && e.pointerType === "touch" && !controlsVisible) {
        resetHideTimer();
        return;
      }
      handleTogglePlay();
      resetHideTimer();
    },
    [controlsVisible, handleTogglePlay, resetHideTimer],
  );

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
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => {
        if (isPlaying) setControlsVisible(false);
      }}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-border"
    >
      {activeTarget.provider === "youtube" ? (
        <>
          <YouTube
            videoId={activeTarget.source}
            className="w-full h-full"
            iframeClassName="w-full h-full pointer-events-none"
            opts={{
              width: "100%",
              height: "100%",
              playerVars: { controls: 0, rel: 0, modestbranding: 1, disablekb: 1 },
            }}
            onReady={(e) => {
              playerRef.current = e.target;
              const d = e.target.getDuration?.();
              if (typeof d === "number" && Number.isFinite(d) && d > 0) setDuration(d);
            }}
            onPlay={() => {
              setIsPlaying(true);
              startTracking();
            }}
            onPause={() => {
              setIsPlaying(false);
              stopTracking();
            }}
            onEnd={() => {
              setIsPlaying(false);
              stopTracking();
              if (!completedRef.current) {
                completedRef.current = true;
                onComplete?.();
              }
            }}
          />
          {/* طبقة الحماية الشفافة لمنع النقر المباشر على روابط يوتيوب أو القائمة السياقية */}
          <div
            data-testid="youtube-click-shield"
            onClick={handleSurfaceClick}
            onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 z-10 cursor-pointer"
          />
        </>
      ) : (
        <video
          ref={videoRef}
          playsInline
          onClick={handleSurfaceClick}
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full object-contain cursor-pointer"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => {
            setCurrentTime(e.currentTarget.currentTime);
            handleHlsTimeUpdate();
          }}
          onEnded={() => {
            setIsPlaying(false);
            handleHlsEnded();
          }}
          onError={handleHlsError}
          onLoadedMetadata={handleHlsLoadedMetadata}
        />
      )}

      {!isTokenRenewalRequired && (
        <UnifiedPlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          visible={controlsVisible}
          onTogglePlay={handleTogglePlay}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onToggleFullscreen={handleToggleFullscreen}
        />
      )}

      {/* واجهة تنبيه انتهاء صلاحية جلسة الفيديو عند تعذر التجديد التلقائي */}
      {isTokenRenewalRequired && (
        <div
          role="alert"
          className="absolute inset-0 z-20 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center gap-4 p-6 text-center text-white"
        >
          <p className="text-base font-bold">انتهت صلاحية جلسة الفيديو</p>
          <p className="text-xs text-white/75 max-w-sm">
            يرجى تحديث رابط التشغيل لاستئناف المشاهدة من نفس الموضع.
          </p>
          <button
            type="button"
            onClick={handleManualTokenRenewal}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>تحديث رابط التشغيل</span>
          </button>
        </div>
      )}

      {/* العلامة المائية الجنائية الموحدة لحماية الملكية الفكرية */}
      {user && formatWatermarkText(user) && (
        <div
          role="presentation"
          aria-hidden="true"
          className={`absolute ${WATERMARK_POSITIONS[watermarkPos]} pointer-events-none select-none z-10 bg-black/40 text-white/70 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10 shadow-xs transition-all duration-700 motion-reduce:transition-none`}
        >
          <p className="text-xs font-mono font-normal tracking-tight">
            {formatWatermarkText(user)}
          </p>
        </div>
      )}
    </div>
  );
}
