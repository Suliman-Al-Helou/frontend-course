// Client-safe barrel export for Admin Users & Students Domain

export * from "./types";
export * from "./api";
export * from "./queries/adminUsers.queries";
export * from "./queries/adminUsers.mutations";
export { default as StudentsManagementTab } from "./components/StudentsManagementTab";
export { default as StudentDetailsModal } from "./components/StudentDetailsModal";
export { default as DeleteStudentDialog } from "./components/DeleteStudentDialog";
