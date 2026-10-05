"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approveResultsAction, publishResultsAction } from "@/actions/examinations.actions";
import { CheckCircle2, Send, Loader2 } from "lucide-react";

interface ExamItem {
  id: string;
  name: string;
  subjectName: string;
  examDate: string;
  isPublished: boolean;
  results: Array<{
    studentName: string;
    admissionNumber: string;
    score: number;
    grade: string;
    isApproved: boolean;
  }>;
}

interface ExaminationsClientProps {
  exams: ExamItem[];
  schoolSlug: string;
}

export function ExaminationsClient({ exams, schoolSlug }: ExaminationsClientProps) {
  const [activeExamId, setActiveExamId] = React.useState(exams[0]?.id || "");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const currentExam = exams.find((e) => e.id === activeExamId) || exams[0];

  const handleApprove = async () => {
    if (!currentExam) return;
    setIsProcessing(true);
    setFeedback(null);
    const res = await approveResultsAction(currentExam.id, schoolSlug);
    if (res.success) {
      setFeedback("Results verified and approved by administration.");
    } else {
      setFeedback(res.message || "Approval failed.");
    }
    setIsProcessing(false);
  };

  const handlePublish = async () => {
    if (!currentExam) return;
    setIsProcessing(true);
    setFeedback(null);
    const res = await publishResultsAction(currentExam.id, schoolSlug);
    if (res.success) {
      setFeedback("Results published and notified to student guardians.");
    } else {
      setFeedback(res.message || "Publishing failed.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Exam Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Exam Assessment:</label>
          <select
            value={activeExamId}
            onChange={(e) => setActiveExamId(e.target.value)}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-xs"
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} - {ex.subjectName}
              </option>
            ))}
          </select>
        </div>

        {currentExam && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleApprove}
              disabled={isProcessing}
              className="text-xs gap-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Approve Results
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={handlePublish}
              disabled={isProcessing || currentExam.isPublished}
              className="text-xs gap-1"
            >
              {isProcessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  {currentExam.isPublished ? "Published" : "Publish to Parents"}
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {feedback && (
        <div className="p-3 text-xs rounded bg-blue-50 border border-blue-200 text-blue-700">
          {feedback}
        </div>
      )}

      {currentExam && (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700">
              {currentExam.name} &bull; {currentExam.subjectName}
            </span>
            <span className="text-slate-500">
              Status: {currentExam.isPublished ? "Published" : "Pending Review"}
            </span>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Admission ID</th>
                <th className="py-3 px-4 text-right">Score (/100)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentExam.results.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">{r.studentName}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">{r.admissionNumber}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900 tabular-nums">
                    {r.score}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                      {r.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={r.isApproved ? "success" : "warning"}>
                      {r.isApproved ? "Approved" : "Pending Approval"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
