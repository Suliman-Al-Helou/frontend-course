import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import { getInstructorCourseStudents, updateInstructorCourse } from "../api";
import {
  instructorPortalQueries,
  instructorPortalKeys,
} from "../queries/instructor-portal.queries";
import {
  useUpdateInstructorCourse,
  useCreateInstructorSection,
  useUpdateInstructorSection,
  useDeleteInstructorSection,
  useCreateInstructorLesson,
  useUpdateInstructorLesson,
  useDeleteInstructorLesson,
  useSaveInstructorTask,
  useDeleteInstructorTask,
} from "../queries/instructor-portal.mutations";
import { EnrolledStudentsView } from "../components/InstructorCourseWorkspace";
import type { InstructorCourse, InstructorCourseStudent } from "../types";

const mockApiGet = vi.fn();
const mockApiPost = vi.fn();
const mockApiPut = vi.fn();
const mockApiDelete = vi.fn();

vi.mock("@/lib/api", () => ({
  default: {
    get: (...args: unknown[]) => mockApiGet(...args),
    post: (...args: unknown[]) => mockApiPost(...args),
    put: (...args: unknown[]) => mockApiPut(...args),
    delete: (...args: unknown[]) => mockApiDelete(...args),
  },
}));

const mockUseQuery = vi.fn();
const mockInvalidateQueries = vi.fn();

type CapturedMutationConfig<TData = unknown, TVariables = unknown> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
};

vi.mock("@tanstack/react-query", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query");
  return {
    ...actual,
    useQuery: (options: unknown) => mockUseQuery(options),
    useQueryClient: () => ({
      invalidateQueries: mockInvalidateQueries,
    }),
    useMutation: <TData, TVariables>(config: CapturedMutationConfig<TData, TVariables>) => ({
      mutateAsync: async (variables: TVariables) => {
        const result = await config.mutationFn(variables);
        config.onSuccess?.(result, variables);
        return result;
      },
      mutate: async (variables: TVariables) => {
        const result = await config.mutationFn(variables);
        config.onSuccess?.(result, variables);
        return result;
      },
      isPending: false,
    }),
  };
});

const mockCourse: InstructorCourse = {
  id: 42,
  title: "Next.js 16 Architecture",
  description: "Deep dive",
  cover_image: null,
  level: "advanced",
  total_duration: "12h",
  requirements: [],
  target_audience: [],
  what_you_learn: [],
  rating: 4.9,
  students_count: 2,
};

describe("Instructor Mutations & Students Roster (TDD)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("API: getInstructorCourseStudents & updateInstructorCourse", () => {
    it("calls GET /instructor/courses/:id/students and normalizes paginated response", async () => {
      const students: InstructorCourseStudent[] = [
        {
          id: 1,
          name: "أحمد محمد",
          enrolled_at: "2026-01-15T10:00:00Z",
          progress_percent: 75,
          completed_lessons_count: 6,
          total_lessons_count: 8,
        },
      ];
      mockApiGet.mockResolvedValueOnce({
        data: {
          data: students,
          meta: { current_page: 1, last_page: 2, per_page: 15, total: 20 },
        },
      });

      const result = await getInstructorCourseStudents(42);
      expect(mockApiGet).toHaveBeenCalledWith("/instructor/courses/42/students");
      expect(result.data).toEqual(students);
      expect(result.meta).toEqual({
        current_page: 1,
        last_page: 2,
        per_page: 15,
        total: 20,
      });
    });

    it("passes page param when page is provided and normalizes direct array response", async () => {
      const students: InstructorCourseStudent[] = [
        {
          id: 2,
          name: "سارة علي",
          enrolled_at: "2026-02-01T08:00:00Z",
          progress_percent: 50,
          completed_lessons_count: 4,
          total_lessons_count: 8,
        },
      ];
      mockApiGet.mockResolvedValueOnce({ data: students });

      const result = await getInstructorCourseStudents(42, 2);
      expect(mockApiGet).toHaveBeenCalledWith("/instructor/courses/42/students", {
        params: { page: 2 },
      });
      expect(result.data).toEqual(students);
    });

    it("sends multipart/form-data header when updateInstructorCourse receives FormData", async () => {
      const formData = new FormData();
      formData.append("title", "Updated Course");
      mockApiPut.mockResolvedValueOnce({
        data: { data: { ...mockCourse, title: "Updated Course" } },
      });

      const res = await updateInstructorCourse(42, formData);
      expect(mockApiPut).toHaveBeenCalledWith("/instructor/courses/42", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(res.title).toBe("Updated Course");
    });
  });

  describe("Queries: instructorPortalQueries.students", () => {
    it("produces expected queryKey and 5m staleTime", () => {
      const options = instructorPortalQueries.students(42);
      expect(options.queryKey).toEqual(instructorPortalKeys.students(42));
      expect(options.queryKey).toEqual(["instructor-portal", "students", "42"]);
      expect(options.staleTime).toBe(1000 * 60 * 5);
    });
  });

  describe("Component: EnrolledStudentsView", () => {
    it("renders loading skeleton while fetching students", () => {
      mockUseQuery.mockReturnValueOnce({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      const html = renderToStaticMarkup(
        React.createElement(EnrolledStudentsView, { course: mockCourse }),
      );
      expect(html).toContain("animate-pulse");
    });

    it("renders error state with retry button when query fails", () => {
      mockUseQuery.mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("Network error"),
        refetch: vi.fn(),
      });

      const html = renderToStaticMarkup(
        React.createElement(EnrolledStudentsView, { course: mockCourse }),
      );
      expect(html).toContain("إعادة المحاولة");
      expect(html).toContain("Network error");
    });

    it("renders empty state when 0 students are enrolled", () => {
      mockUseQuery.mockReturnValueOnce({
        data: { data: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      const html = renderToStaticMarkup(
        React.createElement(EnrolledStudentsView, { course: mockCourse }),
      );
      expect(html).toContain("لا يوجد طلاب مسجلون");
    });

    it("renders student rows with name, enrollment date, and progress bar", () => {
      mockUseQuery.mockReturnValueOnce({
        data: {
          data: [
            {
              id: 1,
              name: "أحمد محمد",
              enrolled_at: "2026-01-15",
              progress_percent: 75,
              completed_lessons_count: 6,
              total_lessons_count: 8,
            },
          ],
        },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      const html = renderToStaticMarkup(
        React.createElement(EnrolledStudentsView, { course: mockCourse }),
      );
      expect(html).toContain("أحمد محمد");
      expect(html).toContain("75%");
      expect(html).toContain("6 / 8");
      expect(html).toContain('role="progressbar"');
    });
  });

  describe("Mutations: instructor-portal.mutations.ts", () => {
    it("useUpdateInstructorCourse calls updateInstructorCourse and invalidates courseDetail & courses", async () => {
      mockApiPut.mockResolvedValueOnce({
        data: { data: { ...mockCourse, title: "Updated" } },
      });

      const mutation = useUpdateInstructorCourse();
      await mutation.mutateAsync({
        courseId: 42,
        payload: { title: "Updated" },
      });

      expect(mockApiPut).toHaveBeenCalledWith("/instructor/courses/42", {
        title: "Updated",
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: instructorPortalKeys.courseDetail(42),
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: instructorPortalKeys.courses(),
      });
    });

    it("useCreateInstructorSection calls createInstructorSection and invalidates sections", async () => {
      mockApiPost.mockResolvedValueOnce({
        data: { data: { id: 10, title: "Intro", order: 1, lessons: [] } },
      });

      const mutation = useCreateInstructorSection();
      await mutation.mutateAsync({
        courseId: 42,
        payload: { title: "Intro", order: 1 },
      });

      expect(mockApiPost).toHaveBeenCalledWith("/instructor/courses/42/sections", {
        title: "Intro",
        order: 1,
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: instructorPortalKeys.sections(42),
      });
    });

    it("section, lesson, and task mutations call their respective APIs and invalidate keys", async () => {
      mockApiPut.mockResolvedValue({ data: { id: 10, title: "Sec" } });
      mockApiPost.mockResolvedValue({ data: { id: 20, title: "Les" } });
      mockApiDelete.mockResolvedValue({ data: { message: "ok" } });

      await useUpdateInstructorSection().mutateAsync({
        sectionId: 10,
        courseId: 42,
        payload: { title: "Sec" },
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: instructorPortalKeys.sections(42),
      });

      await useDeleteInstructorSection().mutateAsync({
        sectionId: 10,
        courseId: 42,
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: instructorPortalKeys.sections(42),
      });

      await useCreateInstructorLesson().mutateAsync({
        sectionId: 10,
        courseId: 42,
        payload: { title: "Les" },
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: instructorPortalKeys.sections(42),
      });

      await useUpdateInstructorLesson().mutateAsync({
        lessonId: 20,
        courseId: 42,
        payload: { title: "Les 2" },
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: instructorPortalKeys.sections(42),
      });

      await useDeleteInstructorLesson().mutateAsync({
        lessonId: 20,
        courseId: 42,
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: instructorPortalKeys.sections(42),
      });

      await useSaveInstructorTask().mutateAsync({
        lessonId: 20,
        courseId: 42,
        payload: { pass_percentage: 80 },
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: instructorPortalKeys.task(20),
      });

      await useDeleteInstructorTask().mutateAsync({
        lessonId: 20,
        courseId: 42,
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: instructorPortalKeys.task(20),
      });
    });
  });
});
