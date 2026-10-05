"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { markAttendanceAction } from "@/actions/attendance.actions";
import { CheckCircle2, XCircle, Clock, AlertCircle, Loader2 } from "lucide-react";

interface StudentRosterItem {
  id: string;
  name: string;
  admissionNumber: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
}

interface AttendanceRosterClientProps {
  initialStudents: StudentRosterItem[];
  termId: string;
  schoolSlug: string;
}

export function AttendanceRosterClient({
  initialStudents,
  termId,
  schoolSlug,
}: AttendanceRosterClientProps) {
  const [students, setStudents] = React.useState<StudentRosterItem[]>(initialStudents);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  const toggleStatus = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "PRESENT" })));
  };

  const handleSaveAttendance = async () => {
    setIsSubmitting(true);
    setFeedbackMsg(null);

    const payload = {
      termId,
      date: new Date(selectedDate),
      records: students.map((s) => ({
        studentId: s.id,
        status: s.status,
      })),
    };

    const res = await markAttendanceAction(payload, schoolSlug);

    if (res.success) {
      setFeedbackMsg(`Successfully recorded attendance for ${res.count} students.`);
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      setFeedbackMsg(res.message || "Failed to record attendance.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 rounded-md border border-slate-300 px-3 text-xs bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllPresent}
            className="text-xs"
          >
            Mark All Present
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={handleSaveAttendance}
            disabled={isSubmitting}
            className="text-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Saving...
              </>
            ) : (
              "Save Daily Attendance"
            )}
          </Button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 text-xs rounded bg-blue-50 border border-blue-200 text-blue-700">
          {feedbackMsg}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Admission ID</th>
              <th className="py-3 px-4 text-center">Status Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900">{student.name}</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-600">{student.admissionNumber}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleStatus(student.id, "PRESENT")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                        student.status === "PRESENT"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(student.id, "LATE")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                        student.status === "LATE"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Late
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(student.id, "ABSENT")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                        student.status === "ABSENT"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(student.id, "EXCUSED")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                        student.status === "EXCUSED"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Excused
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
