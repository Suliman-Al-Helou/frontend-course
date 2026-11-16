import { test, expect } from "@playwright/test";
import { loginViaUI } from "./helpers/auth";

test.describe("Flow 2: Student Core Value (Enroll -> Open Lesson -> Video Player)", () => {
  test("student should be able to view course, access lesson and see video player", async ({
    page,
  }) => {
    // 1. Login as student
    await loginViaUI(page, "student@e2e.test", "Password123!");
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    // 2. Navigate to public courses catalog
    await page.goto("/courses");
    await page.waitForLoadState("domcontentloaded");

    // Expect the seeded course to be visible in catalog
    const courseCard = page.locator("text=كورس مجاني تجريبي E2E").first();
    await expect(courseCard).toBeVisible({ timeout: 10000 });

    // Click on the course card to open course details
    await courseCard.click();
    await page.waitForURL(/\/courses\/\d+/, { timeout: 10000 });

    // 3. Verify Course Detail Page
    await expect(page.locator("h1")).toContainText("كورس مجاني تجريبي E2E");

    // Click enroll / start learning button ("ابدأ التعلم الآن" or "الانتقال إلى محتوى الكورس")
    const actionBtn = page
      .locator(
        'a:has-text("ابدأ التعلم"), a:has-text("الانتقال إلى محتوى الكورس"), button:has-text("ابدأ التعلم"), a:has-text("مشاهدة")',
      )
      .first();

    await expect(actionBtn).toBeVisible({ timeout: 10000 });
    await actionBtn.click();

    // 4. Verify Lesson Page and Video Player
    await page.waitForURL(/\/courses\/\d+\/lessons\/\d+/, { timeout: 15000 });

    // Verify lesson title
    await expect(page.locator("h1")).toBeVisible();

    // Verify Video Player container is rendered
    const videoContainer = page.locator(".aspect-video").first();
    await expect(videoContainer).toBeVisible({ timeout: 10000 });

    // Verify Lesson Sidebar is present
    const lessonNav = page.locator("nav, aside, [aria-label*='فهرس']").first();
    await expect(lessonNav).toBeVisible();
  });
});
