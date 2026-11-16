import { test, expect } from "@playwright/test";
import { loginViaUI } from "./helpers/auth";

test.describe("Flow 5: Security Negative Flow (Unenrolled Access Blocked -> 403 Forbidden)", () => {
  test("unenrolled user/intruder cannot access protected paid lesson directly", async ({
    page,
  }) => {
    // 1. Login as intruder student
    await loginViaUI(page, "intruder@e2e.test", "Password123!");
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    // 2. Discover the paid course and its protected lesson via authenticated API context
    const coursesRes = await page.request.get("/api/courses");
    expect(coursesRes.ok()).toBeTruthy();
    const coursesData = await coursesRes.json();
    const coursesList = Array.isArray(coursesData) ? coursesData : coursesData.data || [];
    const paidCourse = coursesList.find((c: any) =>
      c.title?.includes("كورس مدفوع محمي E2E")
    );
    expect(paidCourse).toBeDefined();

    // Fetch full course details to get the protected lesson ID
    const courseDetailRes = await page.request.get(`/api/courses/${paidCourse.id}`);
    expect(courseDetailRes.ok()).toBeTruthy();
    const courseDetailJson = await courseDetailRes.json();
    const courseDetail = courseDetailJson.data || courseDetailJson;
    const protectedLesson = courseDetail.sections?.[0]?.lessons?.[0];
    expect(protectedLesson).toBeDefined();
    expect(protectedLesson.is_preview).toBe(false);

    // 3. Attempt direct API access to protected lesson with intruder credentials
    // Must return 403 Forbidden (OWASP BOLA / Unauthorized Access Guard)
    const directApiRes = await page.request.get(`/api/lessons/${protectedLesson.id}`);
    expect(directApiRes.status()).toBe(403);

    // 4. Attempt direct navigation to lesson page via browser UI
    // Intercept lesson API to verify the browser receives 403
    const lessonApiResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(`/api/lessons/${protectedLesson.id}`) &&
        response.status() === 403,
      { timeout: 15000 }
    );

    await page.goto(`/courses/${paidCourse.id}/lessons/${protectedLesson.id}`);

    // Wait for the 403 response
    await lessonApiResponsePromise;

    // 5. Verify the UI blocks video playback and displays Access Denied message
    const errorHeading = page.locator("text=لا تملك صلاحية مشاهدة هذا الدرس").first();
    await expect(errorHeading).toBeVisible({ timeout: 10000 });

    // Verify video player iframe is NOT rendered
    const videoIframe = page.locator("iframe");
    expect(await videoIframe.count()).toBe(0);

    // Verify the call-to-action button to return/subscribe is present
    const ctaBtn = page.getByRole("link", { name: "العودة لصفحة الكورس للاشتراك" });
    await expect(ctaBtn).toBeVisible({ timeout: 5000 });
  });
});
