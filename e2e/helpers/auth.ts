import { expect, Page, BrowserContext } from "@playwright/test";

export const SESSION_COOKIE_NAME = "fh_session";

export async function loginViaUI(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.waitForLoadState("domcontentloaded");

  // Fill in email and password
  const emailInput = page.locator('input[id="email"], input[type="email"]');
  const passwordInput = page.locator('input[id="password"], input[type="password"]');
  const submitButton = page.getByRole("button", { name: "تسجيل الدخول", exact: true });

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await submitButton.click();
}

export async function registerViaUI(page: Page, name: string, email: string, password: string) {
  await page.goto("/register");
  await page.waitForLoadState("domcontentloaded");

  const nameInput = page.locator('input[id="name"]');
  const emailInput = page.locator('input[id="email"]');
  const passwordInput = page.locator('input[id="password"]');
  const confirmInput = page.locator('input[id="confirm"]');
  const submitButton = page.getByRole("button", { name: "إنشاء الحساب مجاناً", exact: true });

  await nameInput.fill(name);
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await confirmInput.fill(password);
  await submitButton.click();
}

export async function logoutViaUI(page: Page) {
  const logoutBtn = page
    .locator('aside button:has-text("تسجيل الخروج"), button:has-text("تسجيل الخروج")')
    .first();
  await logoutBtn.waitFor({ state: "attached", timeout: 15000 });
  await logoutBtn.dispatchEvent("click");
  await page.waitForURL(/\/login/, { timeout: 15000 });
}

export async function getSessionCookie(context: BrowserContext) {
  const cookies = await context.cookies();
  return cookies.find((c) => c.name === SESSION_COOKIE_NAME);
}

export async function verifySessionCookieExists(context: BrowserContext) {
  const cookie = await getSessionCookie(context);
  expect(cookie).toBeDefined();
  expect(cookie?.value).toBeTruthy();
  expect(cookie?.httpOnly).toBe(true);
}

export async function verifyNoSessionCookie(context: BrowserContext) {
  const cookie = await getSessionCookie(context);
  expect(cookie).toBeUndefined();
}
