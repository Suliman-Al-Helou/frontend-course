import type { User } from "@/types";

/**
 * Resolves the target destination URL after successful authentication.
 * Prevents Open Redirect attacks by validating that redirect starts with a single '/'.
 */
export function resolvePostLoginRedirect(
  redirectParam: string | null | undefined,
  user: Pick<User, "role">
): string {
  if (
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//") &&
    !redirectParam.startsWith("/\\")
  ) {
    return redirectParam;
  }

  return user.role === "admin" ? "/admin" : "/dashboard";
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
export function extractUpdatedProfile(
  rawBody: string
): Partial<User> | null {
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
