import { test, expect } from "@playwright/test";
import { loginViaUI } from "./helpers/auth";

test.describe("Flow 4: Admin Core Flow (Create Course -> Section -> Lesson -> Video)", () => {
  const timestamp = Date.now();
  const courseTitle = `كورس تجريبي بواسطة الأدمن ${timestamp}`;
  const courseDescription = `هذا وصف مفصل لكورس التجربة الموجه للأدمن للاختبارات التلقائية ${timestamp}`;
  const sectionTitle = `الوحدة التأسيسية ${timestamp}`;
  const lessonTitle = `الدرس التأسيسي الأول ${timestamp}`;
  const videoId = `yt_${timestamp}`;

  test("admin should login, create a new course, add section, and attach video to lesson", async ({
    page,
  }) => {
    // 1. Login as Admin
    await loginViaUI(page, "admin@e2e.test", "Password123!");
    await page.waitForURL(/\/admin/, { timeout: 15000 });

    // 2. Switch to Courses tab
    await page.goto("/admin?tab=courses");
    await page.waitForLoadState("domcontentloaded");

    // 3. Click "إضافة كورس جديد" button
    const addCourseBtn = page.getByRole("button", { name: /إضافة كورس جديد/i });
    await expect(addCourseBtn).toBeVisible({ timeout: 10000 });
    await addCourseBtn.click();

    // 4. Fill Course Form Modal
    // Title
    const titleInput = page.locator("#course-title-field");
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill(courseTitle);

    // Description
    const descInput = page.locator("#course-desc-field");
    await expect(descInput).toBeVisible({ timeout: 10000 });
    await descInput.fill(courseDescription);

    // Instructor Select (Radix UI Select)
    const instructorTrigger = page.locator("#course-instructor-field");
    await expect(instructorTrigger).toBeVisible({ timeout: 10000 });
    await instructorTrigger.click();

    // Select first instructor option
    const instructorOption = page.locator('[role="option"]').first();
    await expect(instructorOption).toBeVisible({ timeout: 5000 });
    await instructorOption.click();

    // Submit Course Creation
    const submitBtn = page.getByRole("button", { name: "إضافة الكورس", exact: true });
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
    await submitBtn.click();

    // 5. Verify Course Card appears in list
    const manageContentBtn = page.locator(`button[aria-label="إدارة محتوى كورس ${courseTitle}"]`);
    await expect(manageContentBtn).toBeVisible({ timeout: 15000 });

    // 6. Open Content Modal
    await manageContentBtn.click();

    // 7. Add Section
    const sectionInput = page.locator('input[placeholder*="عنوان القسم الجديد"]');
    await expect(sectionInput).toBeVisible({ timeout: 10000 });
    await sectionInput.fill(sectionTitle);

    const addSectionBtn = page.getByRole("button", { name: /إضافة قسم/i });
    await addSectionBtn.click();

    // 8. Verify section is created and visible
    const sectionHeader = page.locator(`h3:has-text("${sectionTitle}")`);
    await expect(sectionHeader).toBeVisible({ timeout: 10000 });

    // Extract section ID from the DOM
    const sectionContent = page.locator('[id^="section-content-"]').first();
    await expect(sectionContent).toBeVisible({ timeout: 10000 });
    const contentId = await sectionContent.getAttribute("id");
    expect(contentId).toBeTruthy();
    const sectionId = contentId!.replace("section-content-", "");

    // 9. Add Lesson with Video attached to this section
    await page.evaluate(
      async ({ sectionId, lessonTitle, videoId }) => {
        const res = await fetch(`/api/admin/sections/${sectionId}/lessons`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            title: lessonTitle,
            video_id: videoId,
            duration: 15,
            order: 0,
            is_preview: false,
          }),
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Failed to create lesson: ${res.status} - ${body}`);
        }
        return res.json();
      },
      { sectionId, lessonTitle, videoId },
    );

    // 10. Reload courses tab to bust client cache & verify lesson with video appears in UI
    await page.goto("/admin?tab=courses");
    await page.waitForLoadState("domcontentloaded");

    const refreshContentBtn = page.locator(`button[aria-label="إدارة محتوى كورس ${courseTitle}"]`);
    await expect(refreshContentBtn).toBeVisible({ timeout: 15000 });
    await refreshContentBtn.click();

    await expect(sectionHeader).toBeVisible({ timeout: 10000 });

    // Verify Lesson and Video Badge are rendered
    await expect(page.locator(`text=${lessonTitle}`).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${videoId}`).first()).toBeVisible({ timeout: 10000 });
  });
});
