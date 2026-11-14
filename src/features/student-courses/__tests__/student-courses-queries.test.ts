import { describe, it, expect, vi } from "vite-plus/test";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { studentCourseQueries } from "../queries/studentCourses.queries";

describe("studentCourseQueries factory", () => {
  it("generates correct query key for lesson query", () => {
    const query = studentCourseQueries.lesson(42);
    expect(query.queryKey).toEqual(["student-courses", "lesson", "42"]);
  });

  it("generates correct query key for in-progress lessons", () => {
    const query = studentCourseQueries.inProgressLessons();
    expect(query.queryKey).toEqual(["student-courses", "in-progress-lessons"]);
  });

  it("generates correct query key for course progress summary", () => {
    const query = studentCourseQueries.courseSummary("10");
    expect(query.queryKey).toEqual(["student-courses", "summary", "10"]);
  });

  it("generates correct query key for completed lessons", () => {
    const query = studentCourseQueries.completedLessons("10");
    expect(query.queryKey).toEqual(["student-courses", "completed-lessons", "10"]);
  });
});
