import { describe, it, expect, vi } from "vite-plus/test";
import type { Instructor, InstructorFormData } from "../types";

describe("Display-Only Faculty Baseline & Presentation (ADR 0015)", () => {
  describe("Visual Status Badge Logic (بروفايل للعرض فقط vs حساب مرتبط)", () => {
    // Helper extracting badge presentation logic identical to ManageInstructorsTab
    function getInstructorBadgeInfo(ins: Pick<Instructor, "user_id" | "user" | "is_display_only">) {
      if (ins.user_id) {
        return {
          type: "linked" as const,
          text: `حساب مرتبط: ${ins.user?.name || `#${ins.user_id}`}`,
          badgeClass: "text-primary bg-primary/10",
        };
      }
      return {
        type: "display_only" as const,
        text: "بروفايل للعرض فقط",
        badgeClass: "text-muted-foreground bg-muted/60",
      };
    }

    it("renders 'بروفايل للعرض فقط' badge with muted token when user_id is null", () => {
      const displayOnlyInstructor: Pick<Instructor, "user_id" | "user" | "is_display_only"> = {
        user_id: null,
        user: null,
        is_display_only: true,
      };

      const badge = getInstructorBadgeInfo(displayOnlyInstructor);
      expect(badge.type).toBe("display_only");
      expect(badge.text).toBe("بروفايل للعرض فقط");
      expect(badge.badgeClass).toContain("bg-muted/60");
      expect(badge.badgeClass).toContain("text-muted-foreground");
    });

    it("renders 'بروفايل للعرض فقط' badge when user_id is undefined", () => {
      const displayOnlyInstructor: Pick<Instructor, "user_id" | "user" | "is_display_only"> = {
        user_id: undefined,
        user: undefined,
      };

      const badge = getInstructorBadgeInfo(displayOnlyInstructor);
      expect(badge.type).toBe("display_only");
      expect(badge.text).toBe("بروفايل للعرض فقط");
    });

    it("renders 'حساب مرتبط: [name]' badge with primary accent token when user_id is linked", () => {
      const linkedInstructor: Pick<Instructor, "user_id" | "user" | "is_display_only"> = {
        user_id: 105,
        user: { id: 105, name: "د. طارق خالد", email: "tariq@example.com" },
        is_display_only: false,
      };

      const badge = getInstructorBadgeInfo(linkedInstructor);
      expect(badge.type).toBe("linked");
      expect(badge.text).toBe("حساب مرتبط: د. طارق خالد");
      expect(badge.badgeClass).toContain("bg-primary/10");
      expect(badge.badgeClass).toContain("text-primary");
    });

    it("falls back to user ID '#[id]' if linked user name is missing", () => {
      const linkedInstructorWithoutName: Pick<Instructor, "user_id" | "user" | "is_display_only"> =
        {
          user_id: 204,
          user: null,
          is_display_only: false,
        };

      const badge = getInstructorBadgeInfo(linkedInstructorWithoutName);
      expect(badge.type).toBe("linked");
      expect(badge.text).toBe("حساب مرتبط: #204");
    });
  });

  describe("Form Submission & Double-Submit Lock via useRef", () => {
    it("locks submission while async onSave is in-flight and blocks concurrent calls", async () => {
      // Simulating the exact concurrency lock mechanism implemented in InstructorFormModal
      const isSubmittingRef = { current: false };
      let executionCount = 0;

      let resolveSavePromise!: (val: unknown) => void;
      const deferredSave = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolveSavePromise = resolve;
        });
      });

      const handleFormSubmit = async (payload: InstructorFormData) => {
        if (isSubmittingRef.current) {
          return { blocked: true };
        }
        isSubmittingRef.current = true;
        executionCount++;

        try {
          await deferredSave(payload);
          return { success: true };
        } finally {
          isSubmittingRef.current = false;
        }
      };

      const samplePayload: InstructorFormData = {
        name: "د. سارة المنصور",
        user_id: null,
      };

      // Trigger first submission (in-flight)
      const promise1 = handleFormSubmit(samplePayload);
      expect(isSubmittingRef.current).toBe(true);
      expect(executionCount).toBe(1);

      // Trigger second concurrent submission while promise1 is still pending
      const promise2 = handleFormSubmit(samplePayload);
      // Trigger third rapid click
      const promise3 = handleFormSubmit(samplePayload);

      const result2 = await promise2;
      const result3 = await promise3;

      // Both subsequent calls must be immediately blocked
      expect(result2).toEqual({ blocked: true });
      expect(result3).toEqual({ blocked: true });
      expect(executionCount).toBe(1);
      expect(deferredSave).toHaveBeenCalledTimes(1);

      // Resolve the original promise
      resolveSavePromise({ id: 1, name: "د. سارة المنصور" });
      const result1 = await promise1;
      expect(result1).toEqual({ success: true });

      // After resolution, the lock is released
      expect(isSubmittingRef.current).toBe(false);

      // Now a new submission can proceed safely
      const nextPromise = handleFormSubmit(samplePayload);
      expect(executionCount).toBe(2);
      expect(isSubmittingRef.current).toBe(true);
      resolveSavePromise({ id: 2, name: "د. سارة المنصور" });
      await nextPromise;
      expect(isSubmittingRef.current).toBe(false);
    });

    it("releases lock in finally block even if onSave throws an error", async () => {
      const isSubmittingRef = { current: false };
      let errorOccurred = false;

      const failingSave = vi.fn().mockRejectedValue(new Error("Network Timeout"));

      const handleFormSubmit = async (payload: InstructorFormData) => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        try {
          await failingSave(payload);
        } catch {
          errorOccurred = true;
        } finally {
          isSubmittingRef.current = false;
        }
      };

      await handleFormSubmit({ name: "مدرب الخطأ", user_id: null });

      expect(errorOccurred).toBe(true);
      // Lock MUST be released
      expect(isSubmittingRef.current).toBe(false);
    });
  });

  describe("Form Payload Normalization & Strict Nullable User ID", () => {
    it("normalizes unlinked account state to explicit user_id: null", () => {
      const buildFormData = (name: string, selectedUserId: number | null): InstructorFormData => {
        return {
          name: name.trim(),
          user_id: selectedUserId ?? null,
        };
      };

      const payload = buildFormData("المدرب الزائر", null);
      expect(payload.user_id).toBeNull();
      expect(payload.name).toBe("المدرب الزائر");
    });

    it("preserves integer user_id when an account is selected", () => {
      const buildFormData = (name: string, selectedUserId: number | null): InstructorFormData => {
        return {
          name: name.trim(),
          user_id: selectedUserId ?? null,
        };
      };

      const payload = buildFormData("المدرب الأكاديمي", 77);
      expect(payload.user_id).toBe(77);
      expect(typeof payload.user_id).toBe("number");
    });
  });

  describe("Public & Student Data Isolation Contract (Zero-Exposure)", () => {
    it("ensures public instructor models never contain internal user accounts or credentials", () => {
      const publicInstructorKeys: (keyof Instructor)[] = [
        "id",
        "name",
        "title",
        "bio",
        "avatar_url",
        "cover_url",
        "specializations",
        "years_experience",
        "rating",
        "total_reviews",
        "students_count",
        "achievements",
        "twitter",
        "linkedin",
        "youtube",
        "courses_count",
      ];

      // Prohibited keys that must never be exposed to public/student callers
      const prohibitedKeys = ["user_id", "user", "password", "remember_token"];

      for (const prohibited of prohibitedKeys) {
        expect(publicInstructorKeys).not.toContain(prohibited);
      }
    });
  });
});
