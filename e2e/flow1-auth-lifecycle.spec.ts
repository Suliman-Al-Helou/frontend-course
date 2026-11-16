import { test, expect } from "@playwright/test";
import {
  registerViaUI,
  loginViaUI,
  logoutViaUI,
  verifySessionCookieExists,
  verifyNoSessionCookie,
} from "./helpers/auth";

test.describe("Flow 1: Authentication Lifecycle (Register -> Login -> Session -> Logout)", () => {
  const timestamp = Date.now();
  const testUser = {
    name: `طالب تجريبي ${timestamp}`,
    email: `student_${timestamp}@e2e.test`,
    password: "Password123!",
  };

  test("should register a new account, login, verify session cookie, and logout", async ({
    page,
    context,
  }) => {
    // 1. Navigate to register and create new user
    await registerViaUI(page, testUser.name, testUser.email, testUser.password);

    // After registration, user is redirected to /dashboard
    await page.waitForURL(/\/(dashboard|login)/, { timeout: 15000 });

    // Verify session cookie exists after register
    await verifySessionCookieExists(context);

    // 2. Perform Logout
    await logoutViaUI(page);

    // Verify session cookie is deleted
    await verifyNoSessionCookie(context);

    // 3. Login with the newly registered user
    await loginViaUI(page, testUser.email, testUser.password);

    // Should redirect to dashboard upon successful login
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify session cookie is present and HttpOnly
    await verifySessionCookieExists(context);

    // 4. Logout again and verify complete session purge
    await logoutViaUI(page);

    // Verify redirection to login and cookie removal
    await verifyNoSessionCookie(context);
  });
});
