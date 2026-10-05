import { LEVEL_LABELS, LEVEL_STYLES } from "./courseLevel";

export default function CourseLevelBadge({
  level,
  className = "",
}: {
  level?: string;
  className?: string;
}) {
  if (!level) return null;
  return (
    <span
      className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${
        LEVEL_STYLES[level] ?? "bg-muted text-muted-foreground"
      } ${className}`}
    >
      {LEVEL_LABELS[level] ?? level}
    </span>
  );
}