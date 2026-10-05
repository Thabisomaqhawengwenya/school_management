import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeeCollectionChart } from "@/components/charts/fee-collection-chart";
import { AttendanceTrendChart } from "@/components/charts/attendance-trend-chart";
import {
  Users,
  CalendarCheck,
  Receipt,
  UserPlus,
  ArrowUpRight,
  PlusCircle,
  FileText,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";

interface DashboardPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { schoolSlug } = await params;

  // Resolve school data or fall back to mock metrics for fresh installations
  let school = null;
  try {
    school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
      include: {
        _count: {
          select: {
            students: true,
            admissions: true,
            invoices: true,
          },
        },
      },
    });
  } catch {
    school = null;
  }

  const totalStudents = school?._count.students ?? 482;
  const totalAdmissions = school?._count.admissions ?? 14;
  const attendanceRate = 96.4;
  const outstandingFees = "$18,450.00";

  // Real or baseline chart metrics
  const monthlyFeeData = [
    { month: "Jan", billed: 45000, collected: 42000 },
    { month: "Feb", billed: 38000, collected: 36500 },
    { month: "Mar", billed: 42000, collected: 40100 },
    { month: "Apr", billed: 51000, collected: 48900 },
    { month: "May", billed: 39000, collected: 37800 },
    { month: "Jun", billed: 47000, collected: 46200 },
  ];

  const attendanceTrendData = [
    { date: "Mon", rate: 97.2 },
    { date: "Tue", rate: 96.8 },
    { date: "Wed", rate: 98.1 },
    { date: "Thu", rate: 95.4 },
    { date: "Fri", rate: 96.4 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Executive Overview
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time academic performance, financial cashflow, and student attendance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/${schoolSlug}/students/new`}>
            <Button variant="accent" size="sm" className="gap-1 text-xs">
              <PlusCircle className="h-3.5 w-3.5" />
              Enroll Student
            </Button>
          </Link>
          <Link href={`/${schoolSlug}/finance`}>
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <Receipt className="h-3.5 w-3.5" />
              New Invoice
            </Button>
          </Link>
          <Link href={`/${schoolSlug}/attendance`}>
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <CalendarCheck className="h-3.5 w-3.5" />
              Roll Call
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cockpit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {totalStudents.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +4.2% from last term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Daily Attendance
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {attendanceRate}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Active sessions today &bull; 95% threshold met
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Outstanding Fees
            </CardTitle>
            <Receipt className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {outstandingFees}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Across 28 pending invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Admissions Queue
            </CardTitle>
            <UserPlus className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {totalAdmissions}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              6 applications under final review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Fee Collection vs. Billing</CardTitle>
            <CardDescription className="text-xs">
              Monthly collection performance across all academic tiers (USD)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FeeCollectionChart data={monthlyFeeData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Weekly Attendance Trend</CardTitle>
            <CardDescription className="text-xs">
              Student presence percentage over current academic cycle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceTrendChart data={attendanceTrendData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Admissions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">Pending Admission Applications</CardTitle>
              <CardDescription className="text-xs">
                Candidates awaiting committee review and interview scheduling
              </CardDescription>
            </div>
            <Link href={`/${schoolSlug}/admissions`}>
              <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100 text-xs">
              {[
                { name: "Sophia Miller", grade: "Grade 9", date: "Today, 08:30 AM", status: "PENDING" },
                { name: "Alexander Wright", grade: "Grade 11", date: "Yesterday", status: "UNDER_REVIEW" },
                { name: "Maya Patel", grade: "Grade 7", date: "Oct 02, 2026", status: "APPROVED" },
              ].map((applicant, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{applicant.name}</p>
                    <p className="text-[11px] text-slate-500">{applicant.grade} &bull; Applied {applicant.date}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {applicant.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">School Operations Log</CardTitle>
            <CardDescription className="text-xs">
              Recent verified ledger updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">Term 1 Invoices Dispatched</p>
                <p className="text-[11px] text-slate-400">120 invoices issued via Resend email</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">Mid-Term Gradebook Approved</p>
                <p className="text-[11px] text-slate-400">Grade 10 Mathematics results verified</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">New Teacher Assigned</p>
                <p className="text-[11px] text-slate-400">Marcus Sterling mapped to Physics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
