"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  FileSpreadsheet,
  Receipt,
  UserCheck,
  Megaphone,
  Settings,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { UserRole } from "@/types/permissions.types";

interface SidebarProps {
  schoolSlug: string;
  userRole?: UserRole | string;
}

export function AppSidebar({ schoolSlug, userRole = "SCHOOL_ADMIN" }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      group: "Core",
      items: [
        {
          name: "Dashboard",
          href: `/${schoolSlug}/dashboard`,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      group: "Academics",
      items: [
        {
          name: "Students",
          href: `/${schoolSlug}/students`,
          icon: Users,
        },
        {
          name: "Admissions",
          href: `/${schoolSlug}/admissions`,
          icon: UserCheck,
        },
        {
          name: "Attendance",
          href: `/${schoolSlug}/attendance`,
          icon: CalendarCheck,
        },
        {
          name: "Examinations",
          href: `/${schoolSlug}/examinations`,
          icon: FileSpreadsheet,
        },
        {
          name: "Academics",
          href: `/${schoolSlug}/academics`,
          icon: GraduationCap,
        },
      ],
    },
    {
      group: "Operations & Finance",
      items: [
        {
          name: "Finance & Fees",
          href: `/${schoolSlug}/finance`,
          icon: Receipt,
        },
        {
          name: "Staff Directory",
          href: `/${schoolSlug}/staff`,
          icon: Users,
        },
        {
          name: "Announcements",
          href: `/${schoolSlug}/communication`,
          icon: Megaphone,
        },
        {
          name: "Documents",
          href: `/${schoolSlug}/documents`,
          icon: FileText,
        },
      ],
    },
    {
      group: "Configuration",
      items: [
        {
          name: "School Settings",
          href: `/${schoolSlug}/settings`,
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link href={`/${schoolSlug}/dashboard`} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-slate-900">EduSaaS Platform</span>
              <span className="text-[11px] text-slate-500 capitalize">{schoolSlug}</span>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-6">
          {navigation.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {group.group}
              </p>
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          {userRole === "SUPER_ADMIN" && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <p className="px-3 text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                Platform Admin
              </p>
              <Link
                href="/platform/super-admin"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-amber-700 hover:bg-amber-50"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Super Admin Panel</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200 text-xs text-slate-400 text-center">
        v1.0.0 &bull; Multi-Tenant Enterprise
      </div>
    </aside>
  );
}
