import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { hasPermission, ROLE_PERMISSIONS } from "./rbac";
import { Permission, UserRole } from "@/types/permissions.types";

export interface AuthenticatedContext {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  schoolId: string;
}

/**
 * Server-side Authorization Guard.
 * Enforces authentication, tenant membership, and granular role permissions.
 * Throws structured errors if unauthorized.
 */
export async function requireAuth(permission?: Permission, explicitSchoolId?: string): Promise<AuthenticatedContext> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED: Authentication required.");
  }

  const user = session.user as unknown as {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId?: string | null;
  };

  const role = user.role as UserRole;
  const schoolId = explicitSchoolId || user.schoolId;

  // Super Admin has platform-wide authority
  if (role === "SUPER_ADMIN") {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role,
      schoolId: schoolId || "platform",
    };
  }

  // Cross-tenant protection: verify user belongs to the requested school
  if (explicitSchoolId && user.schoolId !== explicitSchoolId) {
    throw new Error("FORBIDDEN: Cross-school data access is strictly prohibited.");
  }

  if (!schoolId) {
    throw new Error("FORBIDDEN: User is not assigned to an active school.");
  }

  // Permission check
  if (permission && !hasPermission(role, permission)) {
    throw new Error(`FORBIDDEN: Role '${role}' lacks required permission '${permission}'.`);
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role,
    schoolId,
  };
}
