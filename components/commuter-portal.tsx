"use client";

import { type FormEvent, useState, useTransition } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPinned,
  Sparkles
} from "lucide-react";

import { CategoryBadge, PriorityBadge, StatusBadge } from "@/components/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Ticket } from "@/types/ticket";

const suggestedPrompts = [
  "What is the cheapest way to travel from Veyangoda to Colombo 7 right now?",
  "The 6:20 train from Veyangoda is delayed again. Can someone check?",
  "The station ramp at Maradana is blocked and wheelchair access is difficult."
];

export function CommuterPortal() {
  const [passengerName, setPassengerName] = useState("");
  const [query, setQuery] = useState(suggestedPrompts[0]);
  const [result, setResult] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            passengerName,
            query
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Ticket creation failed.");
        }

        setResult(data.ticket);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Something went wrong while sending your request."
        );
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="glass-panel border-0">
        <CardHeader className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <MapPinned className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl text-slate-800">
              Ask for travel help or report an issue
            </CardTitle>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              The desk will predict ticket priority, assign a category, and generate
              suggested next steps using a mock transit knowledge base.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="name">
                  Passenger name
                </label>
                <Input
                  id="name"
                  value={passengerName}
                  onChange={(event) => setPassengerName(event.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="rounded-[1.5rem] border border-teal-100 bg-white/65 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Demo mode
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Works best with Firebase and OpenAI keys, but includes a fallback mode
                  so the flow still demos cleanly during judging.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="query">
                Your request
              </label>
              <Textarea
                id="query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Describe a delay, route question, safety incident, or station issue..."
                className="min-h-[164px]"
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Quick prompts
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setQuery(prompt)}
                    className="rounded-full border border-white/80 bg-white/80 px-3.5 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-teal-200 hover:text-teal-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <p>{error}</p>
              </div>
            ) : null}

            <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating smart ticket...
                </>
              ) : (
                <>
                  Submit Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border border-white/50 bg-white/35 shadow-soft backdrop-blur-xl">
        <CardHeader className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-slate-500">
            <Clock3 className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl text-slate-800">
              {result ? "AI Response Preview" : "Awaiting Submission"}
            </CardTitle>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              {result
                ? "The AI classification and mock-RAG recommendation appear here after a request is submitted."
                : "The AI classification and mock-RAG response will appear here once a request is submitted."}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/80 p-4 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-800">Ticket created successfully</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Ticket <span className="font-semibold text-slate-700">{result.id}</span> is
                    ready for operator review.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/70 bg-white/65 p-5 backdrop-blur">
                <div className="flex flex-wrap gap-2">
                  <CategoryBadge category={result.category} />
                  <PriorityBadge priority={result.priority} />
                  <StatusBadge status={result.status} />
                  <Badge variant="secondary">{result.source.toUpperCase()}</Badge>
                </div>

                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Original request
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{result.query}</p>

                <div className="mt-5 rounded-[1.5rem] border border-teal-100 bg-teal-50/70 p-4">
                  <div className="flex items-center gap-2 text-teal-700">
                    <Sparkles className="h-4 w-4" />
                    <p className="text-sm font-semibold">Suggested resolution steps</p>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {result.advice}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col justify-center rounded-[1.75rem] border border-dashed border-white/80 bg-white/25 px-6 py-10 text-center backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                AWAITING SUBMISSION
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
                The AI classification, priority prediction, and mock-RAG travel guidance
                will appear here once a commuter request is submitted.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
