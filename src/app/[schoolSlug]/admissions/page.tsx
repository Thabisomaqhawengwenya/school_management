import * as React from "react";
import { AdmissionsClient } from "./admissions-client";
import { prisma } from "@/lib/db/prisma";
import { UserCheck } from "lucide-react";

interface AdmissionsPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdmissionsPage({ params }: AdmissionsPageProps) {
  const { schoolSlug } = await params;

  let applicationsData: any[] = [];
  let school = null;

  try {
    school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
      include: {
        classes: { select: { id: true, name: true } },
      },
    });

    if (school) {
      const rawApps = await prisma.admissionApplication.findMany({
        where: { schoolId: school.id },
        orderBy: { createdAt: "desc" },
      });

      applicationsData = rawApps.map((a) => ({
        id: a.id,
        applicantName: a.applicantName,
        applicantDob: a.applicantDob.toISOString(),
        applicantGender: a.applicantGender,
        targetGrade: a.targetGrade,
        parentName: a.parentName,
        parentEmail: a.parentEmail,
        parentPhone: a.parentPhone,
        status: a.status,
        convertedStudentId: a.convertedStudentId,
        createdAt: a.createdAt.toISOString(),
      }));
    }
  } catch {
    applicationsData = [];
  }


  // Fallback demo data
  if (applicationsData.length === 0) {
    applicationsData = [
      {
        id: "adm-001",
        applicantName: "Sophia Miller",
        applicantDob: "2011-04-12T00:00:00.000Z",
        applicantGender: "FEMALE",
        targetGrade: 9,
        parentName: "David Miller",
        parentEmail: "david.miller@example.com",
        parentPhone: "+1 (555) 789-0123",
        status: "PENDING",
        createdAt: "2026-10-04T08:30:00.000Z",
      },
      {
        id: "adm-002",
        applicantName: "Alexander Wright",
        applicantDob: "2009-08-19T00:00:00.000Z",
        applicantGender: "MALE",
        targetGrade: 11,
        parentName: "Karen Wright",
        parentEmail: "karen.wright@example.com",
        parentPhone: "+1 (555) 456-7890",
        status: "APPROVED",
        createdAt: "2026-10-02T14:15:00.000Z",
      },
      {
        id: "adm-003",
        applicantName: "Maya Patel",
        applicantDob: "2013-11-03T00:00:00.000Z",
        applicantGender: "FEMALE",
        targetGrade: 7,
        parentName: "Raj Patel",
        parentEmail: "raj.patel@example.com",
        parentPhone: "+1 (555) 123-4567",
        status: "APPROVED",
        createdAt: "2026-09-28T10:00:00.000Z",
      },
    ];
  }

  const classes = school?.classes && school.classes.length > 0
    ? school.classes
    : [
        { id: "class-1", name: "Grade 10-A" },
        { id: "class-2", name: "Grade 9-A" },
      ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-blue-600" />
          Admissions Pipeline
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review candidate admissions, record committee decisions, and convert approved candidates into enrolled students.
        </p>
      </div>

      <AdmissionsClient
        applications={applicationsData}
        classes={classes}
        schoolSlug={schoolSlug}
      />
    </div>
  );
}
