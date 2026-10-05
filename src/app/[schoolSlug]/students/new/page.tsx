import * as React from "react";
import { StudentEnrollmentForm } from "@/components/forms/student-enrollment-form";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { ChevronLeft, UserPlus } from "lucide-react";

interface NewStudentPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function NewStudentPage({ params }: NewStudentPageProps) {
  const { schoolSlug } = await params;

  let school = null;
  try {
    school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
      include: {
        classes: {
          select: { id: true, name: true },
        },
      },
    });
  } catch {
    school = null;
  }

  const classes = school?.classes && school.classes.length > 0
    ? school.classes
    : [
        { id: "class-10a", name: "Grade 10-A" },
        { id: "class-10b", name: "Grade 10-B" },
        { id: "class-9a", name: "Grade 9-A" },
        { id: "class-11a", name: "Grade 11-A" },
        { id: "class-12sci", name: "Grade 12-Science" },
      ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <Link
          href={`/${schoolSlug}/students`}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 mb-2 transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Students Directory
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          Enroll New Student
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Register a new learner, assign academic grade placement, and link emergency contact guardian.
        </p>
      </div>

      <StudentEnrollmentForm schoolSlug={schoolSlug} classes={classes} />
    </div>
  );
}
