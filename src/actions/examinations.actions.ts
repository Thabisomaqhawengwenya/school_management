"use server";

import { requireAuth } from "@/lib/permissions/guard";
import {
  CreateExamSchema,
  ExaminationService,
  SubmitResultSchema,
} from "@/services/examination.service";
import { revalidatePath } from "next/cache";

export async function createExamAction(formData: unknown, schoolSlug: string) {
  try {
    const authContext = await requireAuth("results.create");
    const validation = CreateExamSchema.safeParse(formData);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const service = new ExaminationService(authContext.schoolId);
    const exam = await service.createExam(validation.data);

    revalidatePath(`/${schoolSlug}/examinations`);
    return { success: true, data: exam };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function submitResultAction(formData: unknown, schoolSlug: string) {
  try {
    const authContext = await requireAuth("results.create");
    const validation = SubmitResultSchema.safeParse(formData);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const service = new ExaminationService(authContext.schoolId);
    const result = await service.submitResult(validation.data);

    revalidatePath(`/${schoolSlug}/examinations`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function approveResultsAction(examId: string, schoolSlug: string) {
  try {
    const authContext = await requireAuth("results.approve");
    const service = new ExaminationService(authContext.schoolId);
    const result = await service.approveResults(examId, authContext.userId);

    revalidatePath(`/${schoolSlug}/examinations`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function publishResultsAction(examId: string, schoolSlug: string) {
  try {
    const authContext = await requireAuth("results.publish");
    const service = new ExaminationService(authContext.schoolId);
    const result = await service.publishExamResults(examId);

    revalidatePath(`/${schoolSlug}/examinations`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
