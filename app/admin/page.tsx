import Link from "next/link";
import { ArrowLeft, Activity, LayoutDashboard } from "lucide-react";

import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
  return (
    <main className="section-shell py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <span className="eyebrow">Operations Desk</span>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-950">
                Smart Transit Desk Dashboard
              </h1>
              <p className="text-sm text-slate-600">
                Live ticket triage, priority visibility, and operator status tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-2 text-sm font-medium text-success">
            <Activity className="h-4 w-4" />
            Firestore-powered realtime feed
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </Link>
        </div>
      </div>

      <AdminDashboard />
    </main>
  );
}

