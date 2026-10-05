import { describe, it, expect } from "vitest";
import { hasPermission, ROLE_PERMISSIONS } from "@/lib/permissions/rbac";
import { UserRole } from "@/types/permissions.types";

describe("Role-Based Access Control (RBAC) Permission Matrix", () => {
  it("should grant full access to SUPER_ADMIN", () => {
    expect(hasPermission("SUPER_ADMIN", "students.create")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "fees.delete")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "results.publish")).toBe(true);
  });

  it("should enforce boundaries for TEACHER role", () => {
    expect(hasPermission("TEACHER", "attendance.mark")).toBe(true);
    expect(hasPermission("TEACHER", "results.create")).toBe(true);
    // Teacher must NOT have fee management or student deletion permissions
    expect(hasPermission("TEACHER", "fees.create")).toBe(false);
    expect(hasPermission("TEACHER", "students.delete")).toBe(false);
  });

  it("should grant finance permissions exclusively to ACCOUNTANT and admins", () => {
    expect(hasPermission("ACCOUNTANT", "fees.create")).toBe(true);
    expect(hasPermission("ACCOUNTANT", "fees.read")).toBe(true);
    expect(hasPermission("ACCOUNTANT", "attendance.mark")).toBe(false);
    expect(hasPermission("STUDENT", "fees.create")).toBe(false);
  });

  it("should prevent parents and students from modifying grades", () => {
    expect(hasPermission("PARENT", "results.read")).toBe(true);
    expect(hasPermission("PARENT", "results.create")).toBe(false);
    expect(hasPermission("PARENT", "results.publish")).toBe(false);
    expect(hasPermission("STUDENT", "results.create")).toBe(false);
  });

  it("should verify ADMISSIONS_OFFICER permissions", () => {
    expect(hasPermission("ADMISSIONS_OFFICER", "admissions.read")).toBe(true);
    expect(hasPermission("ADMISSIONS_OFFICER", "admissions.approve")).toBe(true);
    expect(hasPermission("ADMISSIONS_OFFICER", "fees.delete")).toBe(false);
  });
});
