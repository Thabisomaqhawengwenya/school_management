"use server";

import { requireAuth } from "@/lib/permissions/guard";
import { CreateStudentSchema, StudentService } from "@/services/student.service";
import { revalidatePath } from "next/cache";

export async function enrollStudentAction(formData: unknown, schoolSlug: string) {
  try {
    // 1. Authorization
    const authContext = await requireAuth("students.create");

    // 2. Validation
    const validation = CreateStudentSchema.safeParse(formData);
    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    // 3. Service execution
    const service = new StudentService(authContext.schoolId);
    const student = await service.enrollStudent(validation.data);

    revalidatePath(`/${schoolSlug}/students`);
    return {
      success: true,
      data: student,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to enroll student.",
    };
  }
}
