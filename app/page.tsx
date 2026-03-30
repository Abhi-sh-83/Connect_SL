import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Radar,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Waves
} from "lucide-react";

import { CommuterPortal } from "@/components/commuter-portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "AI triage",
    body: "Every request is auto-tagged by category and urgency before it reaches operators.",
    icon: Sparkles
  },
  {
    title: "Mock RAG assistant",
    body: "Travel advice is generated against a curated Sri Lankan bus and rail knowledge base.",
    icon: Bot
  },
  {
    title: "Realtime operations",
    body: "Firestore keeps the admin desk synced as tickets move from NEW to COMPLETED.",
    icon: Waves
  }
];

export default function HomePage() {
  return (
    <main className="pb-16 pt-6 sm:pt-8">
      <section className="section-shell">
        <div className="glass-panel overflow-hidden border-white/70">
          <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-10">
            <div className="space-y-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">Ignite 1.0 Demo</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Accessible, mobile first, AI-assisted
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3 text-teal-700">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <TrainFront className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
                    CONNECTSL - SMART TRANSIT DESK
                  </p>
                </div>
                <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-800 sm:text-5xl lg:text-[3.7rem]">
                  Give commuters a faster way to ask, route, and resolve transit issues.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
                  This is an LLM-powered commuter portal and realtime operations desk
                  tailored for Sri Lankan bus and rail workflows, designed to help teams
                  triage questions, route incidents, and respond faster.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#portal"
                  className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                  Launch Commuter Portal
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
                >
                  Open Admin Dashboard
                  <Radar className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="rounded-[2rem] border-0 bg-slate-900 text-white shadow-soft">
                <CardHeader className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Bot className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">AI Operations Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm text-slate-300">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Sample commuter request
                    </p>
                    <p className="mt-3 text-base leading-7 text-white">
                      &quot;What is the cheapest way to travel from Veyangoda to Colombo 7
                      right now?&quot;
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                        Category
                      </p>
                      <p className="mt-2 font-semibold text-white">Route Inquiry</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                        Priority
                      </p>
                      <p className="mt-2 font-semibold text-white">Low</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                        Status
                      </p>
                      <p className="mt-2 font-semibold text-white">NEW</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-3">
                {highlights.map((item, index) => {
                  const Icon = item.icon;

                  return (
                  <Card
                    key={item.title}
                    className="animate-fade-up border-white/70 bg-white/70 shadow-soft backdrop-blur-md"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg text-slate-800">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-6 text-slate-500">{item.body}</p>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portal" className="section-shell mt-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Commuter Portal</span>
            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              Submit a request and let the AI desk do the first pass.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-500">
            The assistant classifies urgency, suggests a likely transit resolution, and
            shows the response in a clean dashboard-ready workflow.
          </p>
        </div>

        <CommuterPortal />
      </section>
    </main>
  );
}
