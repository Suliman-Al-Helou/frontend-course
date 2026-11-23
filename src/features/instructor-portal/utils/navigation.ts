/**
 * Instructor Portal Navigation & Role Switching Helpers (Phase 5.3 / TB 09)
 */

import type { User } from "@/types";

export interface InstructorNavItem {
  label: string;
  href: string;
  iconName: "LayoutDashboard" | "BookOpen" | "LifeBuoy";
}

export const INSTRUCTOR_NAV_ITEMS: readonly InstructorNavItem[] = [
  { label: "الرئيسية", href: "/instructor", iconName: "LayoutDashboard" },
  { label: "كورساتي الموكلة", href: "/instructor/courses", iconName: "BookOpen" },
  { label: "الدعم والمساعدة", href: "/instructor/support", iconName: "LifeBuoy" },
] as const;

export function isInstructorNavActive(itemHref: string, currentPathname: string): boolean {
  if (itemHref === "/instructor") {
    return currentPathname === "/instructor";
  }
  return currentPathname.startsWith(itemHref);
}

export function shouldShowInstructorPortalSwitch(role?: User["role"] | null): boolean {
  return role === "instructor";
}
