"use server";

import { requireAuth } from "@/lib/permissions/guard";
import {
  AdmissionService,
  CreateAdmissionSchema,
} from "@/services/admission.service";
import { revalidatePath } from "next/cache";

export async function submitAdmissionAction(formData: unknown, schoolId: string) {
  try {
    const validation = CreateAdmissionSchema.safeParse(formData);
    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const service = new AdmissionService(schoolId);
    const result = await service.submitApplication(validation.data);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateAdmissionStatusAction(
  applicationId: string,
  status: "UNDER_REVIEW" | "INTERVIEW_SCHEDULED" | "APPROVED" | "REJECTED",
  remarks?: string
) {
  try {
    const authContext = await requireAuth("admissions.approve");
    const service = new AdmissionService(authContext.schoolId);
    const updated = await service.updateStatus(applicationId, status, remarks);

    revalidatePath("/admissions");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function convertAdmissionToStudentAction(
  applicationId: string,
  targetClassId: string
) {
  try {
    const authContext = await requireAuth("admissions.approve");
    const service = new AdmissionService(authContext.schoolId);
    const newStudent = await service.convertToStudent(applicationId, targetClassId);

    revalidatePath("/admissions");
    revalidatePath("/students");
    return { success: true, data: newStudent };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
