import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Upload, Download, Shield, HardDrive } from "lucide-react";

interface DocumentsPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { schoolSlug } = await params;

  const documents = [
    {
      name: "Term_1_Academic_Report_Card_Template.pdf",
      type: "REPORT_CARD",
      size: "2.4 MB",
      date: "Oct 03, 2026",
      mime: "application/pdf",
    },
    {
      name: "School_Code_of_Conduct_2026.pdf",
      type: "SCHOOL_POLICY",
      size: "1.1 MB",
      date: "Sep 15, 2026",
      mime: "application/pdf",
    },
    {
      name: "Liam_Vance_Birth_Certificate.pdf",
      type: "STUDENT_DOCUMENT",
      size: "840 KB",
      date: "Oct 01, 2026",
      mime: "application/pdf",
    },
    {
      name: "Science_Curriculum_Syllabus_G10.docx",
      type: "CURRICULUM",
      size: "420 KB",
      date: "Aug 28, 2026",
      mime: "application/vnd.docx",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-blue-600" />
            Document Registry & Object Storage
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Secure Supabase Object Storage with PostgreSQL metadata tracking and RBAC download permissions.
          </p>
        </div>

        <Button variant="accent" size="sm" className="gap-1 text-xs">
          <Upload className="h-3.5 w-3.5" /> Upload Document
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Document Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">File Size</th>
              <th className="py-3 px-4">Upload Date</th>
              <th className="py-3 px-4 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {documents.map((doc, i) => (
              <tr key={i} className="hover:bg-slate-50/70">
                <td className="py-3 px-4 flex items-center gap-2 font-semibold text-slate-900">
                  <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{doc.name}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                    {doc.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-500">{doc.size}</td>
                <td className="py-3 px-4 text-slate-500">{doc.date}</td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
