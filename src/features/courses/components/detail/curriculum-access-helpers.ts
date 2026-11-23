/**
 * Curriculum Lesson Access Helpers (Phase 5.1 / ADR 0016 / ADR 0021)
 *
 * Enforces strict access boundaries:
 * 1. Draft lessons (is_published = false) are STRICTLY accessible ONLY to instructors and admins.
 * 2. Published preview lessons are accessible to anyone (guests and un-enrolled students).
 * 3. Published locked lessons require active course enrollment or instructor/admin role.
 */

import type { User } from "@/types";

export interface LessonAccessContext {
  isEnrolled: boolean;
  userRole?: User["role"] | null;
}

export interface LessonAccessTarget {
  is_preview?: boolean;
  is_published?: boolean;
}

export interface LessonAccessResult {
  canAccess: boolean;
  isDraft: boolean;
  showDraftBadge: boolean;
  showPreviewBadge: boolean;
}

export function evaluateCurriculumLessonAccess(
  lesson: LessonAccessTarget,
  context: LessonAccessContext,
): LessonAccessResult {
  const isDraft = lesson.is_published === false;
  const isManager = context.userRole === "instructor" || context.userRole === "admin";

  if (isDraft) {
    return {
      canAccess: isManager,
      isDraft: true,
      showDraftBadge: isManager,
      showPreviewBadge: false,
    };
  }

  const isPreview = Boolean(lesson.is_preview);
  const canAccess = context.isEnrolled || isPreview || isManager;
  const showPreviewBadge = isPreview && !context.isEnrolled && !isManager;

  return {
    canAccess,
    isDraft: false,
    showDraftBadge: false,
    showPreviewBadge,
  };
}
