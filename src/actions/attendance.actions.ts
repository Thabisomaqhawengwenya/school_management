"use server";

import { requireAuth } from "@/lib/permissions/guard";
import {
  AttendanceService,
  MarkAttendanceSchema,
} from "@/services/attendance.service";
import { revalidatePath } from "next/cache";

export async function markAttendanceAction(formData: unknown, schoolSlug: string) {
  try {
    const authContext = await requireAuth("attendance.mark");
    const validation = MarkAttendanceSchema.safeParse(formData);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const service = new AttendanceService(authContext.schoolId);
    const result = await service.markAttendance(validation.data);

    revalidatePath(`/${schoolSlug}/attendance`);
    return { success: true, count: result.length };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
