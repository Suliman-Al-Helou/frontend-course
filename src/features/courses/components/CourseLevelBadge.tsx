import { Badge, type BadgeProps } from "@/components/ui/badge";
import { LEVEL_LABELS } from "../utils/courseLevel";

const LEVEL_VARIANTS: Record<string, BadgeProps["variant"]> = {
  beginner: "success",
  intermediate: "primary",
  advanced: "warning",
};

export default function CourseLevelBadge({
  level,
  className = "",
}: {
  level?: string;
  className?: string;
}) {
  if (!level) return null;
  return (
    <Badge
      variant={LEVEL_VARIANTS[level] ?? "secondary"}
      shape="rounded"
      size="sm"
      className={className}
    >
      {LEVEL_LABELS[level] ?? level}
    </Badge>
  );
}
