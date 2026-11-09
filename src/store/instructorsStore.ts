import { create } from "zustand";
import api from "@/lib/api";
import type { Instructor } from "@/types";

interface InstructorsStore {
  instructors: Instructor[];
  loading: boolean;
  fetchInstructors: () => Promise<void>;
  getInstructorNameById: (id: number) => string | undefined;
}

export const useInstructorsStore = create<InstructorsStore>((set, get) => ({
  instructors: [],
  loading: false,

  fetchInstructors: async () => {
    // إذا كانت البيانات موجودة بالفعل، لا تقم بالطلب مجدداً
    if (get().instructors.length > 0) return;

    set({ loading: true });
    try {
      const res = await api.get("/admin/instructors");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      set({ instructors: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch instructors", error);
      set({ loading: false });
    }
  },

  getInstructorNameById: (id: number) => {
    const instructor = get().instructors.find((inst) => inst.id === id);
    return instructor?.name;
  },
}));
