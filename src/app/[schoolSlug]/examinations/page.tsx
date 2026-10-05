import * as React from "react";
import { ExaminationsClient } from "./examinations-client";
import { prisma } from "@/lib/db/prisma";
import { FileSpreadsheet } from "lucide-react";

interface ExaminationsPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function ExaminationsPage({ params }: ExaminationsPageProps) {
  const { schoolSlug } = await params;

  let school = null;
  try {
    school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
      include: {
        subjects: {
          include: {
            exams: {
              include: {
                results: {
                  include: { student: true },
                },
              },
            },
          },
        },
      },
    });
  } catch {
    school = null;
  }

  const examsData = [
    {
      id: "exam-101",
      name: "Mid-Term Examination 2026",
      subjectName: "Advanced Mathematics",
      examDate: "2026-10-15T09:00:00.000Z",
      isPublished: false,
      results: [
        { studentName: "Liam Vance", admissionNumber: "STD-2026-0001", score: 94.0, grade: "A+", isApproved: true },
        { studentName: "Aria Montgomery", admissionNumber: "STD-2026-0002", score: 88.5, grade: "A", isApproved: true },
        { studentName: "Lucas Rivera", admissionNumber: "STD-2026-0003", score: 76.0, grade: "B", isApproved: false },
        { studentName: "Zoe Chen", admissionNumber: "STD-2026-0004", score: 91.0, grade: "A+", isApproved: true },
      ],
    },
    {
      id: "exam-102",
      name: "Mid-Term Examination 2026",
      subjectName: "Physics & Mechanics",
      examDate: "2026-10-17T09:00:00.000Z",
      isPublished: false,
      results: [
        { studentName: "Liam Vance", admissionNumber: "STD-2026-0001", score: 89.0, grade: "A", isApproved: false },
        { studentName: "Ethan Walker", admissionNumber: "STD-2026-0005", score: 82.0, grade: "A", isApproved: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-blue-600" />
          Examinations & Academic Gradebook
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review examination results, verify teacher grade submissions, and publish academic report cards.
        </p>
      </div>

      <ExaminationsClient exams={examsData} schoolSlug={schoolSlug} />
    </div>
  );
}
