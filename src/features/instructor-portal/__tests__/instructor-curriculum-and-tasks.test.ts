import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import {
  getInstructorCourse,
  getInstructorSections,
  createInstructorSection,
  updateInstructorSection,
  deleteInstructorSection,
  createInstructorLesson,
  updateInstructorLesson,
  deleteInstructorLesson,
  getInstructorLessonTask,
  saveInstructorLessonTask,
  deleteInstructorLessonTask,
  getInstructorCourseYouTubeVideos,
} from "../api";
import {
  instructorPortalQueries,
  instructorPortalKeys,
} from "../queries/instructor-portal.queries";
import type { TaskQuestion } from "../types";
import {
  extractYouTubeVideoId,
  canMoveUp,
  canMoveDown,
  swapArrayItems,
  validateTaskQuestion,
} from "../utils";

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

describe("Instructor Curriculum and Tasks Feature Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("TanStack Query v5 Factory (instructorPortalQueries)", () => {
    it("generates correct queryKey and staleTime for single course detail", () => {
      const query = instructorPortalQueries.courseDetail(42);
      expect(query.queryKey).toEqual(["instructor-portal", "courses", "42"]);
      expect(query.staleTime).toBe(1000 * 60 * 5);
    });

    it("generates correct queryKey and staleTime for course sections", () => {
      const query = instructorPortalQueries.sections(42);
      expect(query.queryKey).toEqual(["instructor-portal", "sections", "42"]);
      expect(query.staleTime).toBe(1000 * 60 * 5);
    });

    it("generates correct queryKey and staleTime for lesson task", () => {
      const query = instructorPortalQueries.task(101);
      expect(query.queryKey).toEqual(["instructor-portal", "task", "101"]);
      expect(query.staleTime).toBe(1000 * 60 * 5);
    });

    it("generates correct queryKey for course YouTube playlist videos", () => {
      const query = instructorPortalQueries.youtubeVideos(42);
      expect(query.queryKey).toEqual(["instructor-portal", "youtube-videos", "42"]);
      expect(query.staleTime).toBe(1000 * 60 * 5);
    });
  });

  describe("Pure API Layer: Curriculum & Section Mutations", () => {
    it("fetches single course detail via GET /instructor/courses/:id", async () => {
      const mockCourse = { id: 42, title: "Course 42", students_count: 10 };
      mockApiGet.mockResolvedValueOnce({ data: { data: mockCourse } });

      const res = await getInstructorCourse(42);
      expect(mockApiGet).toHaveBeenCalledWith("/instructor/courses/42");
      expect(res).toEqual(mockCourse);
    });

    it("fetches course sections via GET /instructor/courses/:id/sections", async () => {
      const mockSections = [{ id: 1, title: "Intro", lessons: [] }];
      mockApiGet.mockResolvedValueOnce({ data: { data: mockSections } });

      const res = await getInstructorSections(42);
      expect(mockApiGet).toHaveBeenCalledWith("/instructor/courses/42/sections");
      expect(res).toEqual(mockSections);
    });

    it("creates a new section via POST /instructor/courses/:id/sections", async () => {
      const payload = { title: "New Section", order: 1 };
      mockApiPost.mockResolvedValueOnce({ data: { id: 10, ...payload } });

      const res = await createInstructorSection(42, payload);
      expect(mockApiPost).toHaveBeenCalledWith("/instructor/courses/42/sections", payload);
      expect(res.id).toBe(10);
    });

    it("updates an existing section via PUT /instructor/sections/:id", async () => {
      const payload = { title: "Updated Section", order: 2 };
      mockApiPut.mockResolvedValueOnce({ data: { id: 10, ...payload } });

      const res = await updateInstructorSection(10, payload);
      expect(mockApiPut).toHaveBeenCalledWith("/instructor/sections/10", payload);
      expect(res.title).toBe("Updated Section");
    });

    it("deletes a section via DELETE /instructor/sections/:id", async () => {
      mockApiDelete.mockResolvedValueOnce({ data: { message: "Deleted" } });

      const res = await deleteInstructorSection(10);
      expect(mockApiDelete).toHaveBeenCalledWith("/instructor/sections/10");
      expect(res.message).toBe("Deleted");
    });
  });

  describe("Pure API Layer: Lesson & Task Mutations", () => {
    it("creates a lesson under a section via POST /instructor/sections/:id/lessons", async () => {
      const payload = { title: "Lesson 1", order: 1, duration: 300, is_published: true };
      mockApiPost.mockResolvedValueOnce({ data: { id: 55, ...payload } });

      const res = await createInstructorLesson(10, payload);
      expect(mockApiPost).toHaveBeenCalledWith("/instructor/sections/10/lessons", payload);
      expect(res.id).toBe(55);
    });

    it("updates a lesson via PUT /instructor/lessons/:id", async () => {
      const payload = { title: "Updated Lesson", is_published: false };
      mockApiPut.mockResolvedValueOnce({ data: { id: 55, ...payload } });

      const res = await updateInstructorLesson(55, payload);
      expect(mockApiPut).toHaveBeenCalledWith("/instructor/lessons/55", payload);
      expect(res.is_published).toBe(false);
    });

    it("deletes a lesson via DELETE /instructor/lessons/:id", async () => {
      mockApiDelete.mockResolvedValueOnce({ data: { message: "Lesson deleted" } });

      const res = await deleteInstructorLesson(55);
      expect(mockApiDelete).toHaveBeenCalledWith("/instructor/lessons/55");
      expect(res.message).toBe("Lesson deleted");
    });

    it("fetches lesson task via GET /instructor/lessons/:id/task", async () => {
      const mockTask = { id: 1, pass_percentage: 70, max_attempts: 3, questions: [] };
      mockApiGet.mockResolvedValueOnce({ data: mockTask });

      const res = await getInstructorLessonTask(55);
      expect(mockApiGet).toHaveBeenCalledWith("/instructor/lessons/55/task");
      expect(res).toEqual(mockTask);
    });

    it("saves/creates lesson task via POST /instructor/lessons/:id/task", async () => {
      const payload = { pass_percentage: 80, max_attempts: 3, questions: [] };
      mockApiPost.mockResolvedValueOnce({ data: { id: 2, ...payload } });

      const res = await saveInstructorLessonTask(55, payload);
      expect(mockApiPost).toHaveBeenCalledWith("/instructor/lessons/55/task", payload);
      expect(res.pass_percentage).toBe(80);
    });

    it("deletes lesson task via DELETE /instructor/lessons/:id/task", async () => {
      mockApiDelete.mockResolvedValueOnce({ data: { message: "Task deleted" } });

      const res = await deleteInstructorLessonTask(55);
      expect(mockApiDelete).toHaveBeenCalledWith("/instructor/lessons/55/task");
      expect(res.message).toBe("Task deleted");
    });

    it("fetches YouTube playlist videos via GET /instructor/courses/:id/youtube-videos", async () => {
      const mockVideos = {
        playlist_id: "PL123",
        videos: [{ id: "vid1", title: "Video 1", duration_minutes: 10, is_already_added: false }],
      };
      mockApiGet.mockResolvedValueOnce({ data: mockVideos });

      const res = await getInstructorCourseYouTubeVideos(42);
      expect(mockApiGet).toHaveBeenCalledWith("/instructor/courses/42/youtube-videos");
      expect(res.videos).toHaveLength(1);
    });
  });

  describe("Utility: YouTube Video ID Extractor", () => {
    it("extracts 11-char ID from standard watch URL", () => {
      expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "dQw4w9WgXcQ",
      );
    });

    it("extracts 11-char ID from shortened youtu.be URL", () => {
      expect(extractYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("extracts 11-char ID from embed URL", () => {
      expect(extractYouTubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
        "dQw4w9WgXcQ",
      );
    });

    it("accepts raw 11-char alphanumeric ID directly", () => {
      expect(extractYouTubeVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("returns null for invalid or non-YouTube URLs", () => {
      expect(extractYouTubeVideoId("https://vimeo.com/12345678")).toBeNull();
      expect(extractYouTubeVideoId("not-a-valid-url")).toBeNull();
      expect(extractYouTubeVideoId("")).toBeNull();
    });
  });

  describe("Utility: Directional Arrow Ordering", () => {
    it("correctly identifies when an element can move up", () => {
      expect(canMoveUp(0)).toBe(false);
      expect(canMoveUp(1)).toBe(true);
      expect(canMoveUp(5)).toBe(true);
    });

    it("correctly identifies when an element can move down", () => {
      const total = 4;
      expect(canMoveDown(0, total)).toBe(true);
      expect(canMoveDown(2, total)).toBe(true);
      expect(canMoveDown(3, total)).toBe(false);
    });

    it("swaps items in array deterministically", () => {
      const items = ["A", "B", "C", "D"];
      const swapped = swapArrayItems(items, 1, 2);
      expect(swapped).toEqual(["A", "C", "B", "D"]);
    });
  });

  describe("Utility: Canonical TaskQuestion Contract Validation & Zero-Index Guard", () => {
    it("validates valid MCQ question with zero-index correct_answer", () => {
      const question: TaskQuestion = {
        id: "q1",
        type: "mcq",
        question: "ما هو React؟",
        options: ["مكتبة واجهات", "نظام تشغيل"],
        correct_answer: 0, // First option (0-indexed)
      };

      const result = validateTaskQuestion(question);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("validates valid True/False question", () => {
      const question: TaskQuestion = {
        id: "q2",
        type: "true_false",
        question: "المكونات خادمة نقية؟",
        options: ["صح", "خطأ"],
        correct_answer: 1,
      };

      const result = validateTaskQuestion(question);
      expect(result.isValid).toBe(true);
    });

    it("rejects question with empty question text", () => {
      const question: TaskQuestion = {
        id: "q3",
        type: "mcq",
        question: "   ",
        options: ["أ", "ب"],
        correct_answer: 0,
      };

      const result = validateTaskQuestion(question);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("نص السؤال مطلوب");
    });

    it("rejects MCQ with fewer than 2 options", () => {
      const question: TaskQuestion = {
        id: "q4",
        type: "mcq",
        question: "سؤال غير مكتمل",
        options: ["خيار وحيد"],
        correct_answer: 0,
      };

      const result = validateTaskQuestion(question);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("يجب توفير خيارين على الأقل لسؤال الاختيار من متعدد");
    });

    it("rejects question where correct_answer index is out of bounds", () => {
      const question: TaskQuestion = {
        id: "q5",
        type: "mcq",
        question: "سؤال بمؤشر خاطئ",
        options: ["خيار 1", "خيار 2"],
        correct_answer: 5, // Out of bounds
      };

      const result = validateTaskQuestion(question);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("الإجابة الصحيحة المحددة غير صالحة");
    });
  });
});
