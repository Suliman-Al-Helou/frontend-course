const studentHome = ["student-home"] as const;

export const queryKeys = {
  studentHome: {
    stats: () => [...studentHome, "stats"] as const,
    zoomAll: () => [...studentHome, "zoom"] as const,
    zoom: (monthsSignature: string) => [...studentHome, "zoom", monthsSignature] as const,
  },
  courses: {
    all: ["courses"] as const,
    list: () => [...queryKeys.courses.all, "list"] as const,
    detail: (course: string | number) => [course, "course"] as const,
  },
} as const;
