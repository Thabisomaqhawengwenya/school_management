import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Shield, Building, Globe, Bell } from "lucide-react";

interface SettingsPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { schoolSlug } = await params;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          Institutional Configuration & Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage institution profile, multi-tenant branding, notification credentials, and session policies.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" /> Institution Profile
            </CardTitle>
            <CardDescription className="text-xs">
              Primary identification parameters and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">School Legal Name</label>
                <Input defaultValue="Crestview International Academy" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Tenant Domain Slug</label>
                <Input defaultValue={schoolSlug} disabled className="bg-slate-50" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Institutional Code</label>
                <Input defaultValue="CIA-2026" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Default Billing Currency</label>
                <select className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="ZAR">ZAR (R)</option>
                  <option value="KES">KES (KSh)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="accent" size="sm" className="text-xs">
                Save Profile Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" /> Notification Channels & Gateways
            </CardTitle>
            <CardDescription className="text-xs">
              Configure Resend email sender and SMS messaging provider credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-900">Resend Email Gateway</p>
                <p className="text-slate-500">Connected: notifications@schoolportal.com</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-slate-900">SMS Broadcast Adapter</p>
                <p className="text-slate-500">Provider: Twilio / Africa&apos;s Talking Gateway</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Ready
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
