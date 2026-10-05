import * as React from "react";
import { AttendanceRosterClient } from "./attendance-roster-client";
import { prisma } from "@/lib/db/prisma";
import { CalendarCheck } from "lucide-react";

interface AttendancePageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AttendancePage({ params }: AttendancePageProps) {
  const { schoolSlug } = await params;

  let school = null;
  try {
    school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
      include: {
        students: {
          where: { deletedAt: null },
          take: 30,
          select: { id: true, firstName: true, lastName: true, admissionNumber: true },
        },
        academicYears: {
          where: { isCurrent: true },
          include: { terms: { where: { isCurrent: true } } },
        },
      },
    });
  } catch {
    school = null;
  }

  const rosterStudents = school?.students && school.students.length > 0
    ? school.students.map((s) => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        admissionNumber: s.admissionNumber,
        status: "PRESENT" as const,
      }))
    : [
        { id: "std-001", name: "Liam Vance", admissionNumber: "STD-2026-0001", status: "PRESENT" as const },
        { id: "std-002", name: "Aria Montgomery", admissionNumber: "STD-2026-0002", status: "PRESENT" as const },
        { id: "std-003", name: "Lucas Rivera", admissionNumber: "STD-2026-0003", status: "LATE" as const },
        { id: "std-004", name: "Zoe Chen", admissionNumber: "STD-2026-0004", status: "PRESENT" as const },
        { id: "std-005", name: "Ethan Walker", admissionNumber: "STD-2026-0005", status: "ABSENT" as const },
      ];

  const termId = school?.academicYears[0]?.terms[0]?.id || "term-default-1";

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-blue-600" />
          Daily Roll Call & Attendance
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Record, update, and audit student daily attendance statuses.
        </p>
      </div>

      <AttendanceRosterClient
        initialStudents={rosterStudents}
        termId={termId}
        schoolSlug={schoolSlug}
      />
    </div>
  );
}
