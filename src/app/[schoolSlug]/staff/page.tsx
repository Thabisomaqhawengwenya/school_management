import * as React from "react";
import { RoleBadge } from "@/components/layout/role-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db/prisma";
import { Users, Mail, Phone, PlusCircle } from "lucide-react";

interface StaffPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export default async function StaffPage({ params }: StaffPageProps) {
  const { schoolSlug } = await params;

  const staffMembers = [
    {
      name: "Dr. Arthur Vance",
      role: "PRINCIPAL",
      staffNumber: "STF-2024-001",
      email: "principal@crestview.edu",
      phone: "+1 (555) 019-2831",
      department: "School Administration",
    },
    {
      name: "Marcus Sterling",
      role: "TEACHER",
      staffNumber: "STF-2025-014",
      email: "m.sterling@crestview.edu",
      phone: "+1 (555) 482-1920",
      department: "Physics & Natural Sciences",
    },
    {
      name: "Elena Rostova",
      role: "TEACHER",
      staffNumber: "STF-2025-018",
      email: "e.rostova@crestview.edu",
      phone: "+1 (555) 839-2018",
      department: "Advanced Mathematics",
    },
    {
      name: "Robert Finch",
      role: "ACCOUNTANT",
      staffNumber: "STF-2024-005",
      email: "bursar@crestview.edu",
      phone: "+1 (555) 912-3849",
      department: "Finance & Bursar",
    },
    {
      name: "Clara Oswald",
      role: "LIBRARIAN",
      staffNumber: "STF-2025-022",
      email: "library@crestview.edu",
      phone: "+1 (555) 728-1930",
      department: "Library & Information Science",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Staff & Faculty Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Active faculty members, administrative leadership, bursars, and departmental allocations.
          </p>
        </div>

        <Button variant="accent" size="sm" className="gap-1 text-xs">
          <PlusCircle className="h-3.5 w-3.5" /> Add Staff Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffMembers.map((member, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs text-slate-500">{member.department}</p>
              </div>
              <RoleBadge role={member.role} />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-400">ID:</span>
                <span className="font-mono text-xs font-medium text-slate-700">{member.staffNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{member.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
