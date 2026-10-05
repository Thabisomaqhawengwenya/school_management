export type UserRole =
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "ACCOUNTANT"
  | "ADMISSIONS_OFFICER"
  | "PARENT"
  | "STUDENT"
  | "LIBRARIAN"
  | "RECEPTIONIST";

export type Permission =
  | "students.read"
  | "students.create"
  | "students.update"
  | "students.delete"
  | "admissions.read"
  | "admissions.create"
  | "admissions.review"
  | "admissions.approve"
  | "fees.read"
  | "fees.create"
  | "fees.update"
  | "fees.delete"
  | "results.read"
  | "results.create"
  | "results.approve"
  | "results.publish"
  | "attendance.read"
  | "attendance.mark"
  | "attendance.update"
  | "staff.read"
  | "staff.manage"
  | "school.settings"
  | "audit.read";

export interface TenantSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    schoolId?: string | null;
  };
  school?: {
    id: string;
    name: string;
    slug: string;
    currency: string;
  } | null;
}
