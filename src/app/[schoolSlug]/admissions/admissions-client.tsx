"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  updateAdmissionStatusAction,
  convertAdmissionToStudentAction,
} from "@/actions/admissions.actions";
import { formatDate } from "@/lib/utils";
import { Check, X, ArrowRightCircle, Loader2 } from "lucide-react";

interface AdmissionRow {
  id: string;
  applicantName: string;
  applicantDob: string;
  applicantGender: string;
  targetGrade: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  status: "PENDING" | "UNDER_REVIEW" | "INTERVIEW_SCHEDULED" | "APPROVED" | "REJECTED" | "ENROLLED";
  convertedStudentId?: string | null;
  createdAt: string;
}

interface AdmissionsClientProps {
  applications: AdmissionRow[];
  classes: Array<{ id: string; name: string }>;
  schoolSlug: string;
}

export function AdmissionsClient({ applications, classes, schoolSlug }: AdmissionsClientProps) {
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    setLoadingId(id);
    await updateAdmissionStatusAction(id, status);
    setLoadingId(null);
  };

  const handleConvert = async (id: string) => {
    const targetClassId = classes[0]?.id || "default-class";
    setLoadingId(id);
    await convertAdmissionToStudentAction(id, targetClassId);
    setLoadingId(null);
  };

  const columns: ColumnDef<AdmissionRow>[] = [
    {
      accessorKey: "applicantName",
      header: "Applicant",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-900">{row.getValue("applicantName")}</p>
          <p className="text-[11px] text-slate-500">
            Target Grade: {row.original.targetGrade} &bull; Born: {formatDate(row.original.applicantDob)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "parentName",
      header: "Parent / Contact",
      cell: ({ row }) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800">{row.getValue("parentName")}</p>
          <p className="text-[11px] text-slate-500">{row.original.parentEmail}</p>
          <p className="text-[11px] text-slate-500">{row.original.parentPhone}</p>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Applied Date",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {formatDate(row.getValue("createdAt"))}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "default" | "success" | "warning" | "destructive" | "secondary" | "info" = "secondary";
        if (status === "APPROVED") variant = "success";
        if (status === "ENROLLED") variant = "info";
        if (status === "PENDING") variant = "warning";
        if (status === "REJECTED") variant = "destructive";
        return <Badge variant={variant}>{status.replace("_", " ")}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Decisions",
      cell: ({ row }) => {
        const app = row.original;
        const isLoading = loadingId === app.id;

        if (app.status === "ENROLLED") {
          return (
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              Enrolled Student
            </span>
          );
        }

        return (
          <div className="flex items-center gap-1">
            {app.status === "PENDING" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-emerald-700 hover:bg-emerald-50"
                  onClick={() => handleStatusUpdate(app.id, "APPROVED")}
                  disabled={isLoading}
                >
                  <Check className="h-3 w-3 mr-1" /> Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-rose-700 hover:bg-rose-50"
                  onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            )}

            {app.status === "APPROVED" && (
              <Button
                variant="accent"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => handleConvert(app.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <ArrowRightCircle className="h-3 w-3" /> Convert to Student
                  </>
                )}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={applications}
      searchKey="applicantName"
      searchPlaceholder="Search applicants..."
    />
  );
}
