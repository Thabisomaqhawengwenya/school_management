"use client";

import { RoleBadge } from "./role-badge";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, School, Shield } from "lucide-react";
import { UserRole } from "@/types/permissions.types";

interface TenantHeaderProps {
  schoolName: string;
  userName?: string;
  userRole?: UserRole | string;
}

export function TenantHeader({
  schoolName,
  userName = "Administrator",
  userRole = "SCHOOL_ADMIN",
}: TenantHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <School className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-900 leading-tight">
            {schoolName}
          </h1>
          <p className="text-xs text-slate-500">Active Tenant</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <RoleBadge role={userRole} />

        <div className="h-4 w-px bg-slate-200" />

        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
          <Bell className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
            {userName.charAt(0)}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-medium text-slate-900">{userName}</span>
            <span className="text-[10px] text-slate-500">Verified User</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-slate-600"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
