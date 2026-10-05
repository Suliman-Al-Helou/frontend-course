export const LEVELS = ["الكل", "beginner", "intermediate", "advanced"] as const;
export const LEVEL_LABELS: Record<string, string> = {
  beginner: "مبتدئ",       // TODO: translate
  intermediate: "متوسط",   // TODO: translate
  advanced: "متقدم",       // TODO: translate
};

export const LEVEL_STYLES: Record<string, string> = {
  beginner: "bg-success/15 text-success",
  intermediate: "bg-primary/15 text-primary",
  advanced: "bg-warning/15 text-warning",
};