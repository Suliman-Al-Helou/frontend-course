import { describe, it, expect } from "vite-plus/test";
import { evaluateInstructorAccess } from "../auth-helpers";
import type { User } from "@/types";

describe("Instructor Route Guard Logic (ADR 0021 / TB 08)", () => {
  it("redirects unauthenticated visitor to login with redirect parameter", () => {
    const decision = evaluateInstructorAccess(null);
    expect(decision).toEqual({
      status: "redirect",
      target: "/login?redirect=/instructor",
    });
  });

  it("permits users with instructor role", () => {
    const user: User = { id: 1, name: "Ali", email: "ali@test.com", role: "instructor" };
    const decision = evaluateInstructorAccess(user);
    expect(decision).toEqual({
      status: "allow",
      role: "instructor",
    });
  });

  it("permits users with admin role for supervision", () => {
    const user: User = { id: 2, name: "Admin", email: "admin@test.com", role: "admin" };
    const decision = evaluateInstructorAccess(user);
    expect(decision).toEqual({
      status: "allow",
      role: "admin",
    });
  });

  it("bounces students to /dashboard", () => {
    const user: User = { id: 3, name: "Student", email: "student@test.com", role: "student" };
    const decision = evaluateInstructorAccess(user);
    expect(decision).toEqual({
      status: "redirect",
      target: "/dashboard",
    });
  });

  it("promotes student to instructor if live role revalidation detects promotion", () => {
    const user: User = { id: 4, name: "Promoted", email: "promoted@test.com", role: "student" };
    const decision = evaluateInstructorAccess(user, "instructor");
    expect(decision).toEqual({
      status: "allow",
      role: "instructor",
    });
  });
});
