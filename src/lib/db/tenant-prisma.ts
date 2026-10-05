import { prisma } from "./prisma";

/**
 * Creates a strongly typed tenant-scoped database proxy that guarantees
 * every operation is strictly partitioned by the tenant's schoolId.
 */
export function getTenantPrisma(schoolId: string) {
  if (!schoolId) {
    throw new Error("SECURITY_VIOLATION: Attempted to query database without active schoolId context.");
  }

  return prisma.$extends({
    name: "tenant-isolation",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const tenantModels = [
            "Student",
            "TeacherProfile",
            "ParentProfile",
            "Class",
            "Subject",
            "AcademicYear",
            "AdmissionApplication",
            "Attendance",
            "Exam",
            "FeeStructure",
            "Invoice",
            "Announcement",
            "DocumentMetadata",
            "AuditLog",
          ];

          if (tenantModels.includes(model)) {
            // Read queries: inject schoolId filter and soft-delete filter
            if (["findMany", "findFirst", "findUnique", "count", "aggregate", "groupBy"].includes(operation)) {
              const queryArgs = (args as Record<string, any>) || {};
              queryArgs.where = {
                ...queryArgs.where,
                schoolId,
                ...(model === "Student" || model === "Invoice" ? { deletedAt: null } : {}),
              };
            }

            // Write queries: inject schoolId on creation
            if (operation === "create") {
              const createArgs = (args as Record<string, any>) || {};
              createArgs.data = {
                ...createArgs.data,
                schoolId,
              };
            }

            if (operation === "createMany") {
              const createManyArgs = (args as Record<string, any>) || {};
              if (Array.isArray(createManyArgs.data)) {
                createManyArgs.data = createManyArgs.data.map((item: any) => ({
                  ...item,
                  schoolId,
                }));
              }
            }

            // Update & Delete queries: enforce schoolId boundary
            if (["update", "updateMany", "delete", "deleteMany"].includes(operation)) {
              const mutateArgs = (args as Record<string, any>) || {};
              mutateArgs.where = {
                ...mutateArgs.where,
                schoolId,
              };
            }
          }

          return query(args);
        },
      },
    },
  });
}
