import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Layers, PlusCircle } from "lucide-react";

interface AcademicsPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export default async function AcademicsPage({ params }: AcademicsPageProps) {
  const { schoolSlug } = await params;

  const classes = [
    { name: "Grade 10-A", level: 10, capacity: 40, enrolled: 34, classTeacher: "Elena Rostova" },
    { name: "Grade 10-B", level: 10, capacity: 40, enrolled: 32, classTeacher: "Marcus Sterling" },
    { name: "Grade 9-A", level: 9, capacity: 35, enrolled: 35, classTeacher: "Sarah Jenkins" },
    { name: "Grade 11-A", level: 11, capacity: 35, enrolled: 29, classTeacher: "David Kim" },
    { name: "Grade 12-Science", level: 12, capacity: 30, enrolled: 26, classTeacher: "Dr. Arthur Vance" },
  ];

  const subjects = [
    { name: "Advanced Mathematics", code: "MTH-101", department: "Mathematics", assignedTeachers: 3 },
    { name: "Physics & Mechanics", code: "PHY-201", department: "Science", assignedTeachers: 2 },
    { name: "English Literature", code: "ENG-102", department: "Humanities", assignedTeachers: 4 },
    { name: "Computer Science & Python", code: "CSC-301", department: "Technology", assignedTeachers: 2 },
    { name: "World History", code: "HIS-101", department: "Humanities", assignedTeachers: 2 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Academics & Curriculum
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Class sections, curriculum subjects, educator allocations, and enrollment thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <PlusCircle className="h-3.5 w-3.5" /> Add Subject
          </Button>
          <Button variant="accent" size="sm" className="gap-1 text-xs">
            <PlusCircle className="h-3.5 w-3.5" /> Create Class
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600" /> Classrooms & Grade Sections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls, i) => (
            <Card key={i} className="hover:border-slate-300 transition-colors">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">{cls.name}</CardTitle>
                  <CardDescription className="text-xs">Grade Level {cls.level}</CardDescription>
                </div>
                <Badge variant={cls.enrolled >= cls.capacity ? "destructive" : "success"}>
                  {cls.enrolled >= cls.capacity ? "At Capacity" : "Seats Open"}
                </Badge>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Class Teacher:</span>
                  <span className="font-semibold text-slate-800">{cls.classTeacher}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Enrolled:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {cls.enrolled} / {cls.capacity}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" /> Academic Subjects
        </h3>
        <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Academic Department</th>
                <th className="py-3 px-4 text-right">Faculty Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {subjects.map((sub, i) => (
                <tr key={i} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-slate-900">{sub.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{sub.code}</td>
                  <td className="py-3 px-4 text-slate-600">{sub.department}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900 tabular-nums">
                    {sub.assignedTeachers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
