"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateInvoiceSchema, CreateInvoiceInput } from "@/services/finance.service";
import { createInvoiceAction } from "@/actions/finance.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, AlertCircle } from "lucide-react";

interface InvoiceCreationFormProps {
  schoolSlug: string;
  students: Array<{ id: string; name: string; admissionNumber: string }>;
}

interface InvoiceFormValues {
  studentId: string;
  dueDate: string;
  items: Array<{
    description: string;
    amount: number;
    feeStructureId?: string;
  }>;
}

export function InvoiceCreationForm({ schoolSlug, students }: InvoiceCreationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    defaultValues: {
      items: [{ description: "Term Tuition Fee", amount: 1200 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items") || [];
  const totalAmount = watchedItems.reduce((acc, curr) => acc + (Number(curr?.amount) || 0), 0);

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await createInvoiceAction(data, schoolSlug);

    if (res.success) {
      router.push(`/${schoolSlug}/finance`);
      router.refresh();
    } else {
      setErrorMsg(res.message || "Failed to create invoice.");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border border-slate-200">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Select Student *</label>
          <select
            {...register("studentId")}
            className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <option value="">Choose a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.admissionNumber})
              </option>
            ))}
          </select>
          {errors.studentId && <p className="text-[11px] text-rose-600 mt-1">{errors.studentId.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Due Date *</label>
          <Input type="date" {...register("dueDate")} />
          {errors.dueDate && <p className="text-[11px] text-rose-600 mt-1">{errors.dueDate.message}</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between border-b pb-2 mb-3">
          <h4 className="text-sm font-semibold text-slate-900">Line Items</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ description: "", amount: 0 })}
            className="h-7 text-xs gap-1"
          >
            <Plus className="h-3 w-3" /> Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  {...register(`items.${idx}.description` as const)}
                  placeholder="e.g. Science Lab Fee"
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  step="0.01"
                  {...register(`items.${idx}.amount` as const, { valueAsNumber: true })}
                  placeholder="0.00"
                  className="text-right tabular-nums"
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-slate-400 hover:text-rose-600"
                  onClick={() => remove(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-4">
          <span className="text-sm font-semibold text-slate-700">Total Invoice Amount:</span>
          <span className="text-base font-bold text-slate-900 tabular-nums">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${schoolSlug}/finance`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="accent" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create & Issue Invoice"
          )}
        </Button>
      </div>
    </form>
  );
}
