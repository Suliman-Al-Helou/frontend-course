"use client";

import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type AvatarShape = "circle" | "square" | "card";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string | null;
  /** Image alternative text */
  alt?: string;
  /** Full user or instructor name for automatic initials generation */
  name?: string;
  /** Custom fallback element when image is missing or failed */
  fallback?: React.ReactNode;
  /** Avatar size preset (defaults to "md") */
  size?: AvatarSize;
  /** Avatar border-radius shape preset (defaults to "circle") */
  shape?: AvatarShape;
  /** Whether to show a subtle structural border (defaults to true) */
  bordered?: boolean;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-14 h-14 text-lg",
  "2xl": "w-20 h-20 text-2xl",
  "3xl": "w-28 h-28 text-3xl sm:w-36 sm:h-36 sm:text-4xl",
};

const shapeClasses: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-xl",
  card: "rounded-2xl",
};

/**
 * Safely extracts up to 2 initials from Arabic, English, or composite names.
 * Uses Array.from to respect multibyte unicode characters safely.
 */
export function getAvatarInitials(name?: string): string {
  if (!name || !name.trim()) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) {
    return Array.from(parts[0])[0].toUpperCase();
  }
  const first = Array.from(parts[0])[0];
  const last = Array.from(parts[parts.length - 1])[0];
  return `${first}${last}`.toUpperCase();
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      fallback,
      size = "md",
      shape = "circle",
      bordered = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [imageFailed, setImageFailed] = React.useState(false);

    // Reset error state when src prop changes
    React.useEffect(() => {
      setImageFailed(false);
    }, [src]);

    const initials = React.useMemo(() => getAvatarInitials(name), [name]);
    const showImage = Boolean(src && !imageFailed);
    const accessibleAlt = alt || name || "صورة المستخدم";

    return (
      <div
        ref={ref}
        role="img"
        aria-label={accessibleAlt}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden font-bold select-none",
          "bg-primary/10 text-primary transition-colors motion-reduce:transition-none",
          sizeClasses[size],
          shapeClasses[shape],
          bordered && "border border-border/70",
          className,
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src!}
            alt={accessibleAlt}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : fallback ? (
          fallback
        ) : initials ? (
          <span aria-hidden="true" className="tracking-wider">
            {initials}
          </span>
        ) : (
          <User aria-hidden="true" className="w-1/2 h-1/2 text-primary/70 shrink-0" />
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
