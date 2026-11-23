import type { User } from "@/types";

export type InstructorAccessDecision =
  | { status: "allow"; role: User["role"] }
  | { status: "redirect"; target: string };

/**
 * Evaluates access for the (instructor) route group.
 * Handles unauthenticated guests, live role promotion for students, and role restrictions.
 */
export function evaluateInstructorAccess(
  user: User | null | undefined,
  liveRole?: User["role"] | null,
): InstructorAccessDecision {
  if (!user) {
    return { status: "redirect", target: "/login?redirect=/instructor" };
  }

  const effectiveRole = liveRole ?? user.role;

  if (effectiveRole === "instructor" || effectiveRole === "admin") {
    return { status: "allow", role: effectiveRole };
  }

  return { status: "redirect", target: "/dashboard" };
}

/**
 * Resolves the target destination URL after successful authentication.
 * Prevents Open Redirect attacks by validating that redirect starts with a single '/'.
 */
export function resolvePostLoginRedirect(
  redirectParam: string | null | undefined,
  user: Pick<User, "role">,
): string {
  if (
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//") &&
    !redirectParam.startsWith("/\\")
  ) {
    return redirectParam;
  }

  if (user.role === "admin") {
    return "/admin";
  }
  if (user.role === "instructor") {
    return "/instructor";
  }
  return "/dashboard";
}

/**
 * Resolves the primary dashboard route for a given user role.
 */
export function getDashboardHrefForRole(role?: User["role"] | null): string {
  if (role === "admin") {
    return "/admin";
  }
  if (role === "instructor") {
    return "/instructor";
  }
  return "/dashboard";
}

/**
 * Evaluates whether an incoming HTTP response requires deterministic
 * session purge and cookie eviction (ADR 0003 Edge Session Guard).
 */
export function shouldEvictSession(status: number): boolean {
  return status === 401;
}

/**
 * Extracts updated user data from a profile update response for session resealing.
 */
export function extractUpdatedProfile(rawBody: string): Partial<User> | null {
  try {
    const parsed = JSON.parse(rawBody);
    if (parsed && typeof parsed === "object" && parsed.user) {
      return {
        id: parsed.user.id,
        name: parsed.user.name,
        email: parsed.user.email,
        role: parsed.user.role,
      };
    }
  } catch {
    // Malformed JSON
  }
  return null;
}
