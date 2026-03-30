"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, CheckCircle2, Clock3, Loader2, Radio, Ticket } from "lucide-react";
import {
  collection,
  onSnapshot,
  orderBy,
  query as firestoreQuery
} from "firebase/firestore";

import { CategoryBadge, PriorityBadge, StatusBadge } from "@/components/status-badges";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoTickets } from "@/lib/demo-tickets";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import type { Ticket as TicketType, TicketStatus } from "@/types/ticket";
import { statusValues } from "@/types/ticket";

const summaryCards = [
  {
    key: "new",
    title: "New tickets",
    icon: Ticket
  },
  {
    key: "critical",
    title: "Critical issues",
    icon: AlertTriangle
  },
  {
    key: "progress",
    title: "In progress",
    icon: Clock3
  },
  {
    key: "done",
    title: "Completed",
    icon: CheckCircle2
  }
] as const;

export function AdminDashboard() {
  const [tickets, setTickets] = useState<TicketType[]>(demoTickets);
  const [isLive, setIsLive] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const deferredTickets = useDeferredValue(tickets);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setIsLive(false);
      return;
    }

    const ticketQuery = firestoreQuery(
      collection(db, "tickets"),
      orderBy("createdAtMs", "desc")
    );

    const unsubscribe = onSnapshot(ticketQuery, (snapshot) => {
      setTickets(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<TicketType, "id">)
        }))
      );
      setIsLive(true);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (ticketId: string, status: TicketStatus) => {
    setUpdatingId(ticketId);

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error("Could not update the ticket.");
      }

      if (!isLive) {
        setTickets((currentTickets) =>
          currentTickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  status
                }
              : ticket
          )
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const summary = {
    new: deferredTickets.filter((ticket) => ticket.status === "NEW").length,
    critical: deferredTickets.filter((ticket) => ticket.priority === "CRITICAL").length,
    progress: deferredTickets.filter((ticket) => ticket.status === "IN PROGRESS").length,
    done: deferredTickets.filter((ticket) => ticket.status === "COMPLETED").length
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.key} className="glass-panel border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold text-slate-800">
                  {item.title}
                </CardTitle>
                <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-slate-950">
                  {summary[item.key]}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {item.key === "critical"
                    ? "Escalate first"
                    : item.key === "done"
                      ? "Ready to archive"
                      : "Requires team visibility"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-panel border-0">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl text-slate-950">Ticket queue</CardTitle>
            <p className="mt-2 text-sm text-slate-600">
              View submitted requests, monitor AI tagging, and move tickets across the
              support workflow.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={isLive ? "success" : "secondary"}>
              <Radio className="mr-2 h-3.5 w-3.5" />
              {isLive ? "Realtime Firestore" : "Demo dataset"}
            </Badge>
            {!isLive ? (
              <Badge variant="secondary">
                Configure Firebase keys to sync live requests from the commuter portal
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-3 py-4">Ticket ID</th>
                  <th className="px-3 py-4">User Query</th>
                  <th className="px-3 py-4">Category</th>
                  <th className="px-3 py-4">Priority</th>
                  <th className="px-3 py-4">Status</th>
                  <th className="px-3 py-4">Updated</th>
                </tr>
              </thead>
              <tbody>
                {deferredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-slate-100 align-top transition hover:bg-slate-50/70"
                  >
                    <td className="px-3 py-4 font-medium text-slate-800">{ticket.id}</td>
                    <td className="max-w-xl px-3 py-4">
                      <p className="line-clamp-2 text-slate-700">{ticket.query}</p>
                      <p className="mt-2 text-xs text-slate-500">{ticket.passengerName}</p>
                    </td>
                    <td className="px-3 py-4">
                      <CategoryBadge category={ticket.category} />
                    </td>
                    <td className="px-3 py-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-3 py-4">
                      <div className="space-y-2">
                        <StatusBadge status={ticket.status} />
                        <select
                          value={ticket.status}
                          onChange={(event) =>
                            updateStatus(ticket.id, event.target.value as TicketStatus)
                          }
                          disabled={updatingId === ticket.id}
                          aria-label={`Update status for ticket ${ticket.id}`}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none ring-0 transition focus:border-primary"
                        >
                          {statusValues.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-slate-500">
                      {updatingId === ticket.id ? (
                        <span className="inline-flex items-center gap-2 text-primary">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving
                        </span>
                      ) : (
                        formatTimeAgo(ticket.updatedAt || ticket.createdAt)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {deferredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{ticket.id}</p>
                    <p className="text-xs text-slate-500">{ticket.passengerName}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CategoryBadge category={ticket.category} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-700">{ticket.query}</p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <StatusBadge status={ticket.status} />
                  <span className="text-xs text-slate-500">
                    {formatTimeAgo(ticket.updatedAt || ticket.createdAt)}
                  </span>
                </div>

                <select
                  value={ticket.status}
                  onChange={(event) =>
                    updateStatus(ticket.id, event.target.value as TicketStatus)
                  }
                  disabled={updatingId === ticket.id}
                  className={cn(
                    "mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-primary",
                    updatingId === ticket.id && "cursor-not-allowed opacity-70"
                  )}
                >
                  {statusValues.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTimeAgo(timestamp?: string) {
  if (!timestamp) {
    return "Just now";
  }

  return `${formatDistanceToNow(new Date(timestamp), { addSuffix: true })}`;
}
