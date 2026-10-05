import { getTenantPrisma } from "@/lib/db/tenant-prisma";
import { z } from "zod";

export const CreateStudentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date()),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  classId: z.string().min(1, "Class selection is required"),
  parentName: z.string().min(2, "Parent/Guardian name is required"),
  parentPhone: z.string().min(7, "Valid phone number required"),
  parentEmail: z.string().email("Valid email required"),
  relationship: z.string().default("Parent"),
});

export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;

export class StudentService {
  constructor(private readonly schoolId: string) {}

  /**
   * Enrolls a student within this school tenant with auto-generated admission number
   * and links or creates guardian profile.
   */
  async enrollStudent(input: CreateStudentInput) {
    const db = getTenantPrisma(this.schoolId);

    return await db.$transaction(async (tx) => {
      // 1. Generate unique school-scoped admission number
      const count = await tx.student.count({
        where: { schoolId: this.schoolId },
      });
      const year = new Date().getFullYear();
      const admissionNumber = `STD-${year}-${(count + 1).toString().padStart(4, "0")}`;

      // 2. Find or create parent user and parent profile
      let parentUser = await tx.user.findFirst({
        where: { email: input.parentEmail, schoolId: this.schoolId },
        include: { parentProfile: true },
      });

      if (!parentUser) {
        parentUser = await tx.user.create({
          data: {
            email: input.parentEmail,
            name: input.parentName,
            role: "PARENT",
            schoolId: this.schoolId,
            parentProfile: {
              create: {
                schoolId: this.schoolId,
                phone: input.parentPhone,
              },
            },
          },
          include: { parentProfile: true },
        });
      }

      // 3. Create Student
      const student = await tx.student.create({
        data: {
          schoolId: this.schoolId,
          admissionNumber,
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          classId: input.classId,
        },
      });

      // 4. Link Guardian
      if (parentUser.parentProfile) {
        await tx.studentGuardian.create({
          data: {
            studentId: student.id,
            parentId: parentUser.parentProfile.id,
            relationship: input.relationship,
          },
        });
      }

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          schoolId: this.schoolId,
          action: "STUDENT_ENROLLED",
          resource: "Student",
          details: { studentId: student.id, admissionNumber },
        },
      });

      return student;
    });
  }

  /**
   * Returns paginated students list with class relation and search filtering
   */
  async getPaginatedStudents(page = 1, pageSize = 20, search?: string) {
    const db = getTenantPrisma(this.schoolId);
    const skip = (page - 1) * pageSize;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { admissionNumber: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      db.student.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          class: true,
          guardians: {
            include: {
              parent: {
                include: { user: true },
              },
            },
          },
        },
      }),
      db.student.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Retrieves single student details with complete academic, guardian, and financial records
   */
  async getStudentById(id: string) {
    const db = getTenantPrisma(this.schoolId);
    return await db.student.findFirst({
      where: { id },
      include: {
        class: true,
        guardians: {
          include: {
            parent: { include: { user: true } },
          },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        examResults: {
          include: { exam: true },
          take: 10,
        },
      },
    });
  }
}
