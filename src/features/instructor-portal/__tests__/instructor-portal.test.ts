import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import { getInstructorCourses } from "../api";
import {
  instructorPortalQueries,
  instructorPortalKeys,
} from "../queries/instructor-portal.queries";

const mockApiGet = vi.fn();

vi.mock("@/lib/api", () => ({
  default: {
    get: (...args: unknown[]) => mockApiGet(...args),
  },
}));

describe("Instructor Portal Feature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("API: getInstructorCourses", () => {
    it("returns array of courses when backend responds with { data: [...] }", async () => {
      const mockCourses = [
        {
          id: 1,
          title: "Next.js 14 Course",
          description: "Full course description",
          cover_image: null,
          level: "advanced",
          total_duration: "10 hours",
          requirements: ["React"],
          target_audience: ["Frontend Developers"],
          what_you_learn: ["App Router"],
          rating: 4.8,
          students_count: 25,
          instructor: { id: 1, name: "Eng. Suliman" },
        },
      ];

      mockApiGet.mockResolvedValueOnce({
        data: { data: mockCourses, courses: mockCourses },
      });

      const result = await getInstructorCourses();
      expect(result).toEqual(mockCourses);
      expect(mockApiGet).toHaveBeenCalledWith("/instructor/courses");
    });

    it("returns array when backend responds with direct array", async () => {
      const mockCourses = [{ id: 2, title: "React Basics", students_count: 10 }];
      mockApiGet.mockResolvedValueOnce({ data: mockCourses });

      const result = await getInstructorCourses();
      expect(result).toEqual(mockCourses);
    });

    it("returns empty array when backend responds with empty payload", async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: [] } });

      const result = await getInstructorCourses();
      expect(result).toEqual([]);
    });
  });

  describe("Queries: instructorPortalQueries", () => {
    it("produces correct queryKey and staleTime", () => {
      const options = instructorPortalQueries.courses();
      expect(options.queryKey).toEqual(instructorPortalKeys.courses());
      expect(options.staleTime).toBe(1000 * 60 * 5);
    });
  });
});
