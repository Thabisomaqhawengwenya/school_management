import * as React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TenantHeader } from "@/components/layout/tenant-header";
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    schoolSlug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { schoolSlug } = await params;

  // Resolve school tenant
  let school = null;
  try {
    school = await prisma.school.findUnique({
      where: { slug: schoolSlug, deletedAt: null },
      select: { id: true, name: true, slug: true, currency: true },
    });
  } catch {
    school = null;
  }

  // Provide initial fallback if database has not been seeded yet
  if (!school) {
    if (schoolSlug === "demo" || schoolSlug === "crestview") {
      school = {
        id: "demo-school-id",
        name: "Crestview Academy",
        slug: schoolSlug,
        currency: "USD",
      };
    } else {
      notFound();
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <AppSidebar schoolSlug={school.slug} userRole="SCHOOL_ADMIN" />

      <div className="flex flex-col flex-1 min-w-0">
        <TenantHeader
          schoolName={school.name}
          userName="Jane Doe (Head of Academics)"
          userRole="SCHOOL_ADMIN"
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
