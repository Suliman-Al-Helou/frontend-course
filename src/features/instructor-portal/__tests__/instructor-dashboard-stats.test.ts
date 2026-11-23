import { describe, it, expect } from "vite-plus/test";
import { calculateInstructorStats } from "../utils/stats";
import type { InstructorCourse } from "../types";

describe("Instructor Dashboard Stats Calculator (Phase 5.2 / Ticket 10)", () => {
  it("computes empty stats safely for zero courses", () => {
    const stats = calculateInstructorStats([]);
    expect(stats).toEqual({
      assignedCoursesCount: 0,
      totalStudentsEnrolled: 0,
      averageRating: null,
      recentCourses: [],
      hasCourses: false,
    });
  });

  it("aggregates student counts, course counts, and extracts recent courses", () => {
    const mockCourses: InstructorCourse[] = [
      {
        id: 1,
        title: "Course 1",
        description: null,
        cover_image: null,
        level: "beginner",
        total_duration: "5h",
        requirements: [],
        target_audience: [],
        what_you_learn: [],
        rating: 4.5,
        students_count: 25,
      },
      {
        id: 2,
        title: "Course 2",
        description: null,
        cover_image: null,
        level: "intermediate",
        total_duration: "8h",
        requirements: [],
        target_audience: [],
        what_you_learn: [],
        rating: 5.0,
        students_count: 45,
      },
      {
        id: 3,
        title: "Course 3",
        description: null,
        cover_image: null,
        level: "advanced",
        total_duration: "12h",
        requirements: [],
        target_audience: [],
        what_you_learn: [],
        rating: 4.0,
        students_count: 30,
      },
      {
        id: 4,
        title: "Course 4",
        description: null,
        cover_image: null,
        level: "advanced",
        total_duration: "15h",
        requirements: [],
        target_audience: [],
        what_you_learn: [],
        rating: null,
        students_count: 10,
      },
    ];

    const stats = calculateInstructorStats(mockCourses);
    expect(stats.assignedCoursesCount).toBe(4);
    expect(stats.totalStudentsEnrolled).toBe(110);
    // Average rating of courses with rating: (4.5 + 5.0 + 4.0) / 3 = 4.5
    expect(stats.averageRating).toBe(4.5);
    expect(stats.hasCourses).toBe(true);
    // Recent courses capped to top 3
    expect(stats.recentCourses).toHaveLength(3);
    expect(stats.recentCourses[0].id).toBe(1);
    expect(stats.recentCourses[2].id).toBe(3);
  });

  it("handles missing or zero students_count gracefully", () => {
    const coursesWithZero: InstructorCourse[] = [
      {
        id: 5,
        title: "New Course",
        description: null,
        cover_image: null,
        level: null,
        total_duration: null,
        requirements: [],
        target_audience: [],
        what_you_learn: [],
        rating: null,
        students_count: 0,
      },
    ];

    const stats = calculateInstructorStats(coursesWithZero);
    expect(stats.assignedCoursesCount).toBe(1);
    expect(stats.totalStudentsEnrolled).toBe(0);
    expect(stats.averageRating).toBeNull();
    expect(stats.hasCourses).toBe(true);
  });
});
