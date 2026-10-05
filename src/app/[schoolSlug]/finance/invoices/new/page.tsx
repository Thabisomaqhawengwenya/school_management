import * as React from "react";
import { InvoiceCreationForm } from "@/components/forms/invoice-creation-form";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { ChevronLeft, Receipt } from "lucide-react";

interface NewInvoicePageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function NewInvoicePage({ params }: NewInvoicePageProps) {
  const { schoolSlug } = await params;

  let school = null;
  try {
    school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
      include: {
        students: {
          select: { id: true, firstName: true, lastName: true, admissionNumber: true },
          take: 50,
        },
      },
    });
  } catch {
    school = null;
  }

  const students = school?.students && school.students.length > 0
    ? school.students.map((s) => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        admissionNumber: s.admissionNumber,
      }))
    : [
        { id: "std-001", name: "Liam Vance", admissionNumber: "STD-2026-0001" },
        { id: "std-002", name: "Aria Montgomery", admissionNumber: "STD-2026-0002" },
        { id: "std-003", name: "Lucas Rivera", admissionNumber: "STD-2026-0003" },
      ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <Link
          href={`/${schoolSlug}/finance`}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 mb-2 transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Fee Management
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-blue-600" />
          Create New Fee Invoice
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Issue a student invoice with itemized line items and payment due date.
        </p>
      </div>

      <InvoiceCreationForm schoolSlug={schoolSlug} students={students} />
    </div>
  );
}
