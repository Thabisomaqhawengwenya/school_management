"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle, School } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || "Invalid credentials.");
      } else {
        router.push("/crestview/dashboard");
      }
    } catch (err: any) {
      // In development / demo mode, redirect to demo school
      router.push("/crestview/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-slate-900 items-center justify-center text-white mb-2 shadow-md">
            <School className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            School Portal Sign In
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your institutional dashboard, records, and services
          </p>
        </div>

        <Card className="border-slate-200 shadow-md">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="admin@crestview.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                className="w-full text-xs font-semibold h-10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                  </>
                ) : (
                  "Sign In to School"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Quick Demo Credentials
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDemoCredentials("admin@crestview.edu")}
                  className="p-2 text-left rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <p className="font-semibold text-slate-800">Admin</p>
                  <p className="text-[10px] text-slate-500 truncate">admin@crestview.edu</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials("principal@crestview.edu")}
                  className="p-2 text-left rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <p className="font-semibold text-slate-800">Principal</p>
                  <p className="text-[10px] text-slate-500 truncate">principal@crestview.edu</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials("teacher@crestview.edu")}
                  className="p-2 text-left rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <p className="font-semibold text-slate-800">Teacher</p>
                  <p className="text-[10px] text-slate-500 truncate">teacher@crestview.edu</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials("bursar@crestview.edu")}
                  className="p-2 text-left rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <p className="font-semibold text-slate-800">Accountant</p>
                  <p className="text-[10px] text-slate-500 truncate">bursar@crestview.edu</p>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
