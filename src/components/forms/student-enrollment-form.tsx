"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStudentSchema, CreateStudentInput } from "@/services/student.service";
import { enrollStudentAction } from "@/actions/students.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface StudentEnrollmentFormProps {
  schoolSlug: string;
  classes: Array<{ id: string; name: string }>;
}

type StudentFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  classId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  relationship: string;
};

export function StudentEnrollmentForm({ schoolSlug, classes }: StudentEnrollmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    defaultValues: {
      relationship: "Parent",
      gender: "MALE",
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await enrollStudentAction(data, schoolSlug);

    if (res.success && res.data) {
      setSuccessMsg(`Student enrolled successfully with ID: ${res.data.admissionNumber}`);
      reset();
      router.refresh();
      setTimeout(() => {
        router.push(`/${schoolSlug}/students`);
      }, 1500);
    } else {
      setErrorMsg(res.message || "Failed to complete enrollment.");
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

      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-md">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-slate-900 border-b pb-2 mb-4">
          1. Student Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">First Name *</label>
            <Input {...register("firstName")} placeholder="e.g. Liam" />
            {errors.firstName && <p className="text-[11px] text-rose-600 mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Last Name *</label>
            <Input {...register("lastName")} placeholder="e.g. Vance" />
            {errors.lastName && <p className="text-[11px] text-rose-600 mt-1">{errors.lastName.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Date of Birth *</label>
            <Input type="date" {...register("dateOfBirth")} />
            {errors.dateOfBirth && <p className="text-[11px] text-rose-600 mt-1">{errors.dateOfBirth.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Gender *</label>
            <select
              {...register("gender")}
              className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-700 block mb-1">Assign Class / Grade *</label>
            <select
              {...register("classId")}
              className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <option value="">Select a class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.classId && <p className="text-[11px] text-rose-600 mt-1">{errors.classId.message}</p>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 border-b pb-2 mb-4">
          2. Primary Parent / Guardian Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Parent Full Name *</label>
            <Input {...register("parentName")} placeholder="e.g. Evelyn Vance" />
            {errors.parentName && <p className="text-[11px] text-rose-600 mt-1">{errors.parentName.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Relationship</label>
            <Input {...register("relationship")} placeholder="e.g. Mother, Father, Guardian" />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Email Address *</label>
            <Input type="email" {...register("parentEmail")} placeholder="parent@example.com" />
            {errors.parentEmail && <p className="text-[11px] text-rose-600 mt-1">{errors.parentEmail.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Phone Number *</label>
            <Input {...register("parentPhone")} placeholder="+1 (555) 000-0000" />
            {errors.parentPhone && <p className="text-[11px] text-rose-600 mt-1">{errors.parentPhone.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${schoolSlug}/students`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="accent" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enrolling...
            </>
          ) : (
            "Complete Enrollment"
          )}
        </Button>
      </div>
    </form>
  );
}
