"use client";

import React from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { formatVideoTime } from "./video-player-helpers";

export interface UnifiedPlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  visible: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

export function UnifiedPlayerControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  visible,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
}: UnifiedPlayerControlsProps) {
  const safeDuration = duration > 0 ? duration : 0;
  const progressPercent = safeDuration > 0 ? Math.min(100, (currentTime / safeDuration) * 100) : 0;

  return (
    <div
      data-testid="unified-player-controls"
      className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-2.5 pt-8 transition-opacity duration-300 motion-reduce:transition-none ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* شريط التقدم (LTR دائماً) */}
      <div dir="ltr" className="mb-1.5 flex items-center">
        <input
          type="range"
          min={0}
          max={safeDuration || 100}
          step={0.1}
          value={safeDuration > 0 ? Math.min(currentTime, safeDuration) : 0}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="شريط تقدم الفيديو"
          style={{
            background: `linear-gradient(to right, var(--color-primary, #6366f1) ${progressPercent}%, rgba(255,255,255,0.28) ${progressPercent}%)`,
          }}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {/* أزرار التحكم */}
      <div className="flex items-center justify-between gap-2 text-white">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Play className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

          {/* مستوى الصوت */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted || volume === 0 ? "إلغاء كتم الصوت" : "كتم الصوت"}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Volume2 className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            <input
              dir="ltr"
              type="range"
              min={0}
              max={100}
              step={1}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              aria-label="مستوى الصوت"
              className="hidden sm:block h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/30 accent-white"
            />
          </div>

          <span dir="ltr" className="ms-2 text-xs font-mono tabular-nums text-white/90 select-none">
            {formatVideoTime(currentTime)} / {formatVideoTime(safeDuration)}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Maximize className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
