import { create } from 'zustand';

const useStore = create((set) => ({
  departments: {},
  currentDept: null,
  isLoading: true,
  setDepartments: (departments) => set({ departments }),
  setCurrentDept: (deptId) => set({ currentDept: deptId }),
  setLoading: (loading) => set({ isLoading: loading }),
  addDepartment: (id, dept) => set((state) => ({
    departments: { ...state.departments, [id]: dept }
  })),
}));

export { useStore };