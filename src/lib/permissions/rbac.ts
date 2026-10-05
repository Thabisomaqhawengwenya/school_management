import { Permission, UserRole } from "@/types/permissions.types";

/**
 * Granular Permission Matrix for Application-Level Role-Based Access Control
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "students.read", "students.create", "students.update", "students.delete",
    "admissions.read", "admissions.create", "admissions.review", "admissions.approve",
    "fees.read", "fees.create", "fees.update", "fees.delete",
    "results.read", "results.create", "results.approve", "results.publish",
    "attendance.read", "attendance.mark", "attendance.update",
    "staff.read", "staff.manage",
    "school.settings", "audit.read"
  ],
  SCHOOL_ADMIN: [
    "students.read", "students.create", "students.update", "students.delete",
    "admissions.read", "admissions.create", "admissions.review", "admissions.approve",
    "fees.read", "fees.create", "fees.update", "fees.delete",
    "results.read", "results.create", "results.approve", "results.publish",
    "attendance.read", "attendance.mark", "attendance.update",
    "staff.read", "staff.manage",
    "school.settings", "audit.read"
  ],
  PRINCIPAL: [
    "students.read",
    "admissions.read", "admissions.review", "admissions.approve",
    "fees.read",
    "results.read", "results.approve", "results.publish",
    "attendance.read",
    "staff.read",
    "audit.read"
  ],
  TEACHER: [
    "students.read",
    "attendance.read", "attendance.mark", "attendance.update",
    "results.read", "results.create"
  ],
  ACCOUNTANT: [
    "students.read",
    "fees.read", "fees.create", "fees.update", "fees.delete"
  ],
  ADMISSIONS_OFFICER: [
    "students.read",
    "admissions.read", "admissions.create", "admissions.review", "admissions.approve"
  ],
  PARENT: [
    "students.read",
    "attendance.read",
    "results.read",
    "fees.read"
  ],
  STUDENT: [
    "attendance.read",
    "results.read",
    "fees.read"
  ],
  LIBRARIAN: [
    "students.read",
    "staff.read"
  ],
  RECEPTIONIST: [
    "students.read",
    "attendance.read",
    "admissions.read", "admissions.create"
  ]
};

export function hasPermission(role: UserRole | string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role as UserRole];
  if (!perms) return false;
  return perms.includes(permission);
}

export function hasAllPermissions(role: UserRole | string, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function hasAnyPermission(role: UserRole | string, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
