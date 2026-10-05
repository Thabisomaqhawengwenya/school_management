import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, PlusCircle, Bell, Send } from "lucide-react";

interface CommunicationPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export default async function CommunicationPage({ params }: CommunicationPageProps) {
  const { schoolSlug } = await params;

  const announcements = [
    {
      title: "Term 1 Examination Schedule Released",
      date: "Oct 04, 2026",
      target: "PARENTS & STUDENTS",
      content:
        "The finalized timetable for the upcoming mid-term examinations is now available on the student and parent portal. Morning sessions commence promptly at 08:30 AM.",
      author: "Office of the Principal",
    },
    {
      title: "Annual Science Fair & Innovation Expo 2026",
      date: "Oct 01, 2026",
      target: "ALL SCHOOL",
      content:
        "Learners from Grades 8 through 12 are invited to submit their science and robotics project briefs to the Science department head by next Friday.",
      author: "Marcus Sterling (Physics)",
    },
    {
      title: "Parent-Teacher Academic Consultation Day",
      date: "Sep 25, 2026",
      target: "PARENTS",
      content:
        "Individual academic consultations will take place on Saturday, October 24th. Booking slots will open through the portal beginning next Monday.",
      author: "Admissions & Pastoral Care",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-blue-600" />
            Institutional Announcements & Broadcasts
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch announcements via Resend email, SMS notifications, and student portal broadcasts.
          </p>
        </div>

        <Button variant="accent" size="sm" className="gap-1 text-xs">
          <PlusCircle className="h-3.5 w-3.5" /> New Announcement
        </Button>
      </div>

      <div className="space-y-4 max-w-4xl">
        {announcements.map((item, i) => (
          <Card key={i} className="hover:border-slate-300 transition-colors">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {item.target}
                  </Badge>
                  <span className="text-xs text-slate-400">{item.date}</span>
                </div>
                <CardTitle className="text-base font-bold text-slate-900">
                  {item.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-3">
              <p className="leading-relaxed">{item.content}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <span>Issued by: {item.author}</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Bell className="h-3 w-3" /> Dispatched via Email & SMS
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
