import React from "react";
import { describe, it, expect, vi, beforeEach } from "vite-plus/test";

// Lightweight React hook state harness so we can test interactive component logic in Node without jsdom
const hookState = {
  states: [] as unknown[],
  refs: [] as Array<{ current: unknown }>,
  stateIndex: 0,
  refIndex: 0,
};

function resetHooks() {
  hookState.states = [];
  hookState.refs = [];
  hookState.stateIndex = 0;
  hookState.refIndex = 0;
}

function beginRender() {
  hookState.stateIndex = 0;
  hookState.refIndex = 0;
}

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    default: {
      ...actual,
      useState: <T,>(initial: T | (() => T)) => {
        const idx = hookState.stateIndex++;
        if (!(idx in hookState.states)) {
          hookState.states[idx] = typeof initial === "function" ? (initial as () => T)() : initial;
        }
        const setState = (next: T | ((prev: T) => T)) => {
          hookState.states[idx] =
            typeof next === "function"
              ? (next as (prev: T) => T)(hookState.states[idx] as T)
              : next;
        };
        return [hookState.states[idx] as T, setState] as const;
      },
      useRef: <T,>(initial: T) => {
        const idx = hookState.refIndex++;
        if (!(idx in hookState.refs)) {
          hookState.refs[idx] = { current: initial };
        }
        return hookState.refs[idx] as { current: T };
      },
      useEffect: () => {},
    },
    useState: <T,>(initial: T | (() => T)) => {
      const idx = hookState.stateIndex++;
      if (!(idx in hookState.states)) {
        hookState.states[idx] = typeof initial === "function" ? (initial as () => T)() : initial;
      }
      const setState = (next: T | ((prev: T) => T)) => {
        hookState.states[idx] =
          typeof next === "function" ? (next as (prev: T) => T)(hookState.states[idx] as T) : next;
      };
      return [hookState.states[idx] as T, setState] as const;
    },
    useRef: <T,>(initial: T) => {
      const idx = hookState.refIndex++;
      if (!(idx in hookState.refs)) {
        hookState.refs[idx] = { current: initial };
      }
      return hookState.refs[idx] as { current: T };
    },
    useEffect: () => {},
  };
});

const mockUseQuery = vi.fn();
const mockInvalidateQueries = vi.fn().mockResolvedValue(undefined);
const mockGetQueryData = vi.fn();
const mockSetQueryData = vi.fn();

vi.mock("@tanstack/react-query", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query");
  return {
    ...actual,
    useQuery: (...args: unknown[]) => mockUseQuery(...args),
    useQueryClient: () => ({
      invalidateQueries: mockInvalidateQueries,
      getQueryData: mockGetQueryData,
      setQueryData: mockSetQueryData,
    }),
  };
});

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

const mockDeleteInstructorSection = vi.fn().mockResolvedValue({ message: "ok" });
const mockDeleteInstructorLesson = vi.fn().mockResolvedValue({ message: "ok" });
const mockDeleteInstructorLessonTask = vi.fn().mockResolvedValue({ message: "ok" });
const mockUpdateInstructorCourse = vi.fn().mockResolvedValue({ id: 1 });

vi.mock("../queries/instructor-portal.mutations", () => ({
  useCreateInstructorSection: () => ({ mutateAsync: vi.fn() }),
  useUpdateInstructorSection: () => ({ mutateAsync: vi.fn() }),
  useDeleteInstructorSection: () => ({
    mutateAsync: ({ sectionId }: { sectionId: number }) => mockDeleteInstructorSection(sectionId),
  }),
  useCreateInstructorLesson: () => ({ mutateAsync: vi.fn() }),
  useUpdateInstructorLesson: () => ({ mutateAsync: vi.fn() }),
  useDeleteInstructorLesson: () => ({
    mutateAsync: ({ lessonId }: { lessonId: number }) => mockDeleteInstructorLesson(lessonId),
  }),
  useSaveInstructorTask: () => ({ mutateAsync: vi.fn() }),
  useDeleteInstructorTask: () => ({
    mutateAsync: ({ lessonId }: { lessonId: number }) => mockDeleteInstructorLessonTask(lessonId),
  }),
  useUpdateInstructorCourse: () => ({ mutateAsync: mockUpdateInstructorCourse }),
}));

vi.mock("../api", () => ({
  createInstructorSection: vi.fn(),
  updateInstructorSection: vi.fn(),
  deleteInstructorSection: (...args: unknown[]) => mockDeleteInstructorSection(...args),
  createInstructorLesson: vi.fn(),
  updateInstructorLesson: vi.fn(),
  deleteInstructorLesson: (...args: unknown[]) => mockDeleteInstructorLesson(...args),
  saveInstructorLessonTask: vi.fn(),
  deleteInstructorLessonTask: (...args: unknown[]) => mockDeleteInstructorLessonTask(...args),
  updateInstructorCourse: (...args: unknown[]) => mockUpdateInstructorCourse(...args),
}));

vi.mock("next/image", () => ({
  default: function MockNextImage(props: Record<string, unknown>) {
    return React.createElement("next-image", props);
  },
}));

vi.mock("@/components/shared/ConfirmModal", () => ({
  default: function MockConfirmModal(props: Record<string, unknown>) {
    return React.createElement("confirm-modal", props);
  },
}));

import { InstructorCurriculumView } from "../components/InstructorCurriculumView";
import { InstructorLessonTaskEditor } from "../components/InstructorLessonTaskEditor";
import { InstructorCourseContentEditor } from "../components/InstructorCourseContentEditor";
import type { InstructorCourse, InstructorSection } from "../types";

const isOpenConfirmModal = (el: React.ReactElement<Record<string, unknown>>) =>
  typeof el.type === "function" && el.type.name === "MockConfirmModal" && el.props.isOpen === true;

function findElements(
  node: unknown,
  predicate: (el: React.ReactElement<Record<string, unknown>>) => boolean,
  results: Array<React.ReactElement<Record<string, unknown>>> = [],
): Array<React.ReactElement<Record<string, unknown>>> {
  if (!node || typeof node !== "object") return results;
  if (Array.isArray(node)) {
    for (const child of node) findElements(child, predicate, results);
    return results;
  }
  const el = node as React.ReactElement<Record<string, unknown>>;
  if (el.props) {
    if (predicate(el)) results.push(el);
    if ("children" in el.props) {
      findElements(el.props.children, predicate, results);
    }
    if (
      typeof el.type === "function" &&
      typeof el.type.name === "string" &&
      el.type.name.startsWith("InstructorCurriculum")
    ) {
      try {
        const rendered = (el.type as (props: unknown) => unknown)(el.props);
        findElements(rendered, predicate, results);
      } catch (_) {
        // ignore if not a functional component that can execute in test
      }
    }
  }
  return results;
}

const sampleCourse: InstructorCourse = {
  id: 10,
  title: "دورة اختبار",
  description: "وصف الدورة",
  cover_image: "https://example.com/cover.jpg",
  level: "beginner",
  total_duration: "1h",
  requirements: ["معرفة أساسية"],
  target_audience: [],
  what_you_learn: ["بناء واجهات"],
  rating: 4.8,
  students_count: 12,
};

const sampleSections: InstructorSection[] = [
  {
    id: 101,
    title: "القسم الأول",
    order: 1,
    lessons: [
      {
        id: 201,
        section_id: 101,
        title: "الدرس الأول",
        duration: 600,
        video_id: null,
        is_published: true,
        order: 1,
      },
    ],
  },
];

describe("Instructor Modals and Content Editor (Edge Cases)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetHooks();
  });

  describe("InstructorCurriculumView ConfirmModal", () => {
    it("blocks deleting a non-empty section with an error toast and does not open ConfirmModal", () => {
      mockUseQuery.mockReturnValue({
        data: sampleSections,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      const renderView = () => {
        beginRender();
        return InstructorCurriculumView({ courseId: 10, course: sampleCourse });
      };

      let tree = renderView();
      const deleteSectionBtns = findElements(tree, (el) => el.props["aria-label"] === "حذف القسم");
      expect(deleteSectionBtns.length).toBe(1);
      expect(deleteSectionBtns[0].props.disabled).toBe(true);

      (deleteSectionBtns[0].props.onClick as () => void)();
      expect(mockToastError).toHaveBeenCalledWith(
        "لا يمكن حذف قسم يحتوي على دروس. يرجى حذف أو نقل الدروس أولاً.",
      );
      expect(mockDeleteInstructorSection).not.toHaveBeenCalled();
      expect(findElements(renderView(), isOpenConfirmModal).length).toBe(0);
    });

    it("opens ConfirmModal when deleting an empty section without calling window.confirm, and only deletes on confirm", async () => {
      const confirmSpy = vi.fn(() => true);
      (globalThis as unknown as { confirm: typeof confirmSpy }).confirm = confirmSpy;

      const sampleEmptySections: InstructorSection[] = [
        {
          id: 101,
          title: "القسم الفارغ",
          order: 1,
          lessons: [],
        },
      ];

      mockUseQuery.mockReturnValue({
        data: sampleEmptySections,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      const renderView = () => {
        beginRender();
        return InstructorCurriculumView({ courseId: 10, course: sampleCourse });
      };

      let tree = renderView();
      const deleteSectionBtns = findElements(tree, (el) => el.props["aria-label"] === "حذف القسم");
      expect(deleteSectionBtns.length).toBe(1);
      expect(deleteSectionBtns[0].props.disabled).toBe(false);

      // Click delete section
      (deleteSectionBtns[0].props.onClick as () => void)();
      expect(confirmSpy).not.toHaveBeenCalled();
      expect(mockDeleteInstructorSection).not.toHaveBeenCalled();

      tree = renderView();
      const modals = findElements(tree, isOpenConfirmModal);
      expect(modals.length).toBe(1);

      // Cancel should close without deleting
      (modals[0].props.onClose as () => void)();
      tree = renderView();
      expect(findElements(tree, isOpenConfirmModal).length).toBe(0);
      expect(mockDeleteInstructorSection).not.toHaveBeenCalled();

      // Open again and confirm
      const deleteSectionBtns2 = findElements(tree, (el) => el.props["aria-label"] === "حذف القسم");
      (deleteSectionBtns2[0].props.onClick as () => void)();
      tree = renderView();
      const openModal = findElements(tree, isOpenConfirmModal)[0];
      await (openModal.props.onConfirm as () => Promise<void>)();

      expect(mockDeleteInstructorSection).toHaveBeenCalledTimes(1);
      expect(mockDeleteInstructorSection).toHaveBeenCalledWith(101);
    });

    it("opens ConfirmModal when deleting a lesson without calling window.confirm, and only deletes on confirm", async () => {
      const confirmSpy = vi.fn(() => true);
      (globalThis as unknown as { confirm: typeof confirmSpy }).confirm = confirmSpy;

      mockUseQuery.mockReturnValue({
        data: sampleSections,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      const renderView = () => {
        beginRender();
        return InstructorCurriculumView({ courseId: 10, course: sampleCourse });
      };

      let tree = renderView();
      const deleteLessonBtns = findElements(tree, (el) => el.props["aria-label"] === "حذف الدرس");
      expect(deleteLessonBtns.length).toBe(1);

      (deleteLessonBtns[0].props.onClick as () => void)();
      expect(confirmSpy).not.toHaveBeenCalled();
      expect(mockDeleteInstructorLesson).not.toHaveBeenCalled();

      tree = renderView();
      const openModals = findElements(tree, isOpenConfirmModal);
      expect(openModals.length).toBe(1);

      await (openModals[0].props.onConfirm as () => Promise<void>)();
      expect(mockDeleteInstructorLesson).toHaveBeenCalledTimes(1);
      expect(mockDeleteInstructorLesson).toHaveBeenCalledWith(201);
    });
  });

  describe("InstructorLessonTaskEditor ConfirmModal", () => {
    it("opens ConfirmModal when deleting a task without calling window.confirm", async () => {
      const confirmSpy = vi.fn(() => true);
      (globalThis as unknown as { confirm: typeof confirmSpy }).confirm = confirmSpy;

      mockUseQuery.mockReturnValue({
        data: {
          id: 55,
          lesson_id: 201,
          pass_percentage: 70,
          max_attempts: 3,
          questions: [],
        },
        isLoading: false,
        isError: false,
      });

      const renderEditor = () => {
        beginRender();
        return InstructorLessonTaskEditor({
          lessonId: 201,
          lessonTitle: "الدرس الأول",
          courseId: 10,
          isOpen: true,
          onClose: vi.fn(),
        });
      };

      let tree = renderEditor();
      const deleteBtns = findElements(
        tree,
        (el) => el.props.variant === "destructive" && typeof el.props.onClick === "function",
      );
      expect(deleteBtns.length).toBe(1);

      (deleteBtns[0].props.onClick as () => void)();
      expect(confirmSpy).not.toHaveBeenCalled();
      expect(mockDeleteInstructorLessonTask).not.toHaveBeenCalled();

      tree = renderEditor();
      const openModals = findElements(tree, isOpenConfirmModal);
      expect(openModals.length).toBe(1);

      await (openModals[0].props.onConfirm as () => Promise<void>)();
      expect(mockDeleteInstructorLessonTask).toHaveBeenCalledTimes(1);
      expect(mockDeleteInstructorLessonTask).toHaveBeenCalledWith(201);
    });
  });

  describe("InstructorCourseContentEditor", () => {
    it("rejects image files > 2MB with toast error", () => {
      beginRender();
      const tree = InstructorCourseContentEditor({ course: sampleCourse });
      const fileInputs = findElements(
        tree,
        (el) => el.type === "input" && el.props.type === "file",
      );
      expect(fileInputs.length).toBe(1);
      expect(fileInputs[0].props.accept).toBe("image/jpeg,image/png,image/webp,image/jpg");

      const oversizedFile = new File([new Uint8Array(10)], "large.png", {
        type: "image/png",
      });
      Object.defineProperty(oversizedFile, "size", { value: 2 * 1024 * 1024 + 1 });

      const onChange = fileInputs[0].props.onChange as (e: {
        target: { files: File[]; value: string };
      }) => void;
      onChange({ target: { files: [oversizedFile], value: "C:\\fakepath\\large.png" } });

      expect(mockToastError).toHaveBeenCalled();
    });

    it("renders remove buttons with >= 44x44px touch targets (min-w-[44px] min-h-[44px])", () => {
      beginRender();
      const tree = InstructorCourseContentEditor({ course: sampleCourse });

      const removeOutcomeBtn = findElements(
        tree,
        (el) => el.props["aria-label"] === "حذف هذا المخرج",
      )[0];
      const removeReqBtn = findElements(
        tree,
        (el) => el.props["aria-label"] === "حذف هذا المتطلب",
      )[0];

      expect(removeOutcomeBtn).toBeDefined();
      expect(removeReqBtn).toBeDefined();

      expect(String(removeOutcomeBtn.props.className)).toContain("min-w-[44px]");
      expect(String(removeOutcomeBtn.props.className)).toContain("min-h-[44px]");
      expect(String(removeReqBtn.props.className)).toContain("min-w-[44px]");
      expect(String(removeReqBtn.props.className)).toContain("min-h-[44px]");
    });

    it("does not pass unoptimized to next/image and uses <img> for blob: preview URLs + submits FormData when file selected", async () => {
      const createObjectUrlSpy = vi
        .spyOn(URL, "createObjectURL")
        .mockReturnValue("blob:http://localhost/cover-preview");
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

      const renderContentEditor = () => {
        beginRender();
        return InstructorCourseContentEditor({ course: sampleCourse });
      };

      // Initial render with https:// URL uses next/image without unoptimized
      let tree = renderContentEditor();
      const nextImages = findElements(
        tree,
        (el) => typeof el.type === "function" && el.type.name === "MockNextImage",
      );
      expect(nextImages.length).toBe(1);
      expect(nextImages[0].props.unoptimized).toBeUndefined();

      // Select valid file <= 2MB
      const fileInput = findElements(
        tree,
        (el) => el.type === "input" && el.props.type === "file",
      )[0];
      const validFile = new File(["img-bytes"], "cover.png", { type: "image/png" });
      (fileInput.props.onChange as (e: { target: { files: File[]; value: string } }) => void)({
        target: { files: [validFile], value: "cover.png" },
      });

      tree = renderContentEditor();
      const blobImgs = findElements(
        tree,
        (el) => el.type === "img" && el.props.src === "blob:http://localhost/cover-preview",
      );
      expect(blobImgs.length).toBe(1);

      // Submit form -> sends FormData
      const form = findElements(tree, (el) => el.type === "form")[0];
      await (form.props.onSubmit as (e: { preventDefault: () => void }) => Promise<void>)({
        preventDefault: () => {},
      });

      expect(mockUpdateInstructorCourse).toHaveBeenCalledTimes(1);
      const [calledId, calledPayload] = mockUpdateInstructorCourse.mock.calls[0];
      expect(calledId).toBe(10);
      expect(calledPayload).toBeInstanceOf(FormData);
      expect((calledPayload as FormData).get("cover_image")).toBe(validFile);
      expect((calledPayload as FormData).getAll("what_you_learn[]")).toEqual(["بناء واجهات"]);
      expect((calledPayload as FormData).getAll("requirements[]")).toEqual(["معرفة أساسية"]);

      createObjectUrlSpy.mockRestore();
    });
  });
});
