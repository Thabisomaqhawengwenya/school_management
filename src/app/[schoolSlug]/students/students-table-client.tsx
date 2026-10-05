"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";

interface StudentRecord {
  id: string;
  admissionNumber: string;
  name: string;
  gender: string;
  className: string;
  guardianName: string;
  guardianPhone: string;
  status: string;
}

interface StudentsTableClientProps {
  data: StudentRecord[];
  schoolSlug: string;
}

export function StudentsTableClient({ data, schoolSlug }: StudentsTableClientProps) {
  const columns: ColumnDef<StudentRecord>[] = [
    {
      accessorKey: "admissionNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 -ml-3 text-xs font-semibold gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Admission ID
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-slate-800">
          {row.getValue("admissionNumber")}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Student Name",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">
          {row.getValue("name")}
        </span>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <span className="text-xs text-slate-600 capitalize">
          {String(row.getValue("gender")).toLowerCase()}
        </span>
      ),
    },
    {
      accessorKey: "className",
      header: "Class",
      cell: ({ row }) => (
        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {row.getValue("className")}
        </span>
      ),
    },
    {
      accessorKey: "guardianName",
      header: "Guardian",
      cell: ({ row }) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800">{row.getValue("guardianName")}</p>
          <p className="text-[11px] text-slate-500">{row.original.guardianPhone}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "ACTIVE" ? "success" : "secondary"}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/${schoolSlug}/students/${row.original.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Filter students by name..."
    />
  );
}
