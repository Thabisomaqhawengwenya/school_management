import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { School, ShieldCheck, ArrowRight, Layers, Lock, Database, Sparkles } from "lucide-react";

export default function Home() {
  const demoTenants = [
    {
      name: "Crestview International Academy",
      slug: "crestview",
      students: 482,
      curriculum: "International Baccalaureate / Cambridge",
      badge: "Primary Tenant",
    },
    {
      name: "St. Jude Collegiate School",
      slug: "st-jude",
      students: 310,
      curriculum: "National Standard Curriculum",
      badge: "Secondary Tenant",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-800 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            E
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">EduSaaS Platform</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/platform/super-admin">
            <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              Platform Super Admin
            </Button>
          </Link>
          <Link href="/crestview/dashboard">
            <Button variant="accent" size="sm" className="text-xs gap-1.5">
              Launch School Cockpit <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-16">
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-medium">
            <Sparkles className="h-3 w-3" /> TypeScript-First Multi-Tenant Architecture
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Enterprise School Management System
          </h1>

          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            Designed as a high-density, multi-tenant SaaS platform supporting isolated schools, 
            granular RBAC authorization, automated tuition invoicing, and real-time student lifecycle tracking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/crestview/dashboard">
              <Button variant="accent" size="lg" className="h-11 px-6 text-sm font-semibold gap-2">
                Launch Crestview Cockpit <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/platform/super-admin">
              <Button variant="outline" size="lg" className="h-11 px-6 text-sm border-slate-700 bg-slate-800/70 text-slate-200 hover:bg-slate-800">
                Super Admin Fleet Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Tenant Selection Bento Grid */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Select an Active School Tenant
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoTenants.map((t) => (
              <Link key={t.slug} href={`/${t.slug}/dashboard`} className="group">
                <Card className="bg-slate-800/80 border-slate-700 hover:border-blue-500/60 transition-all p-6 group-hover:-translate-y-1 text-slate-100 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-md bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <School className="h-5 w-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700 text-slate-300">
                      {t.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{t.curriculum}</p>

                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-700/60 text-xs">
                    <span className="text-slate-400 tabular-nums">
                      {t.students} Active Learners
                    </span>
                    <span className="font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Enter Portal &rarr;
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Technical Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-800">
          <div className="space-y-2">
            <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center text-blue-400">
              <Database className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Partitioned Multi-Tenancy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every database operation enforces strict tenant boundaries using schoolId validation, guaranteeing zero cross-institution data contamination.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center text-emerald-400">
              <Lock className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Granular RBAC Authorization</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              10 discrete role profiles with server-enforced permission gates across student records, admissions, fee payments, and academic grade publishing.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center text-amber-400">
              <Layers className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Modular Monolith Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean unidirectional execution flow: UI &rarr; Server Actions &rarr; RBAC Guard &rarr; Zod Validator &rarr; Domain Service &rarr; Prisma ORM.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        School Management SaaS Architecture &bull; Built with Next.js App Router, Prisma ORM, PostgreSQL & shadcn/ui
      </footer>
    </div>
  );
}
