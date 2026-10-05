"use server";

import { requireAuth } from "@/lib/permissions/guard";
import {
  CreateInvoiceSchema,
  FinanceService,
  RecordPaymentSchema,
} from "@/services/finance.service";
import { revalidatePath } from "next/cache";

export async function createInvoiceAction(formData: unknown, schoolSlug: string) {
  try {
    const authContext = await requireAuth("fees.create");
    const validation = CreateInvoiceSchema.safeParse(formData);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const service = new FinanceService(authContext.schoolId);
    const invoice = await service.createInvoice(validation.data);

    revalidatePath(`/${schoolSlug}/finance`);
    return { success: true, data: invoice };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function recordPaymentAction(formData: unknown, schoolSlug: string) {
  try {
    const authContext = await requireAuth("fees.update");
    const validation = RecordPaymentSchema.safeParse(formData);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const service = new FinanceService(authContext.schoolId);
    const payment = await service.recordPayment(validation.data);

    revalidatePath(`/${schoolSlug}/finance`);
    return { success: true, data: payment };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
