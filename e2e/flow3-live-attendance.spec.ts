import { test, expect } from "@playwright/test";
import { loginViaUI } from "./helpers/auth";

test.describe("Flow 3: Live Attendance Interaction (Join Session -> Attendance Recorded)", () => {
  test("student can view active live session and record attendance", async ({
    page,
  }) => {
    // 1. Mock window.open to return a popup object so window.location is preserved
    await page.addInitScript(() => {
      window.open = () => ({ location: {}, opener: null } as any);
    });

    // 2. Login as student
    await loginViaUI(page, "student@e2e.test", "Password123!");
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    // 3. Locate the Zoom calendar / Live sessions section on dashboard
    await page.waitForSelector("text=جدول لقاءات Zoom", { timeout: 10000 });

    // 4. Switch view to Day View ("عرض اليوم")
    const selectTrigger = page.locator('button[aria-label="طريقة العرض"]');
    await selectTrigger.click();
    const dayOption = page.locator('div[role="option"]:has-text("عرض اليوم")');
    await dayOption.click();

    // 5. Locate the join / attend button ("دخول إلى لقاء Zoom")
    const joinButton = page.locator('button:has-text("دخول إلى لقاء Zoom")').first();
    await expect(joinButton).toBeVisible({ timeout: 10000 });

    // 6. Click join and verify attendance API response (200 OK + zoom_link)
    const [attendResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/attend") &&
          response.status() === 200,
        { timeout: 15000 }
      ),
      joinButton.click(),
    ]);

    const data = await attendResponse.json();
    expect(data).toHaveProperty("zoom_link");
    expect(data.zoom_link).toContain("zoom.us");
  });
});
