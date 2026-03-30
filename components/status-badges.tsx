import { cn } from "@/lib/utils";
import type { TicketCategory, TicketPriority, TicketStatus } from "@/types/ticket";

type BadgeTone = {
  base: string;
  dark: string;
};

const categoryStyles: Record<TicketCategory, BadgeTone> = {
  "Route Inquiry": {
    base: "bg-sky-50 text-sky-700 border-sky-200",
    dark: "bg-sky-400/15 text-sky-200 border-sky-400/20"
  },
  Infrastructure: {
    base: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "bg-amber-400/15 text-amber-200 border-amber-400/20"
  },
  Delay: {
    base: "bg-orange-50 text-orange-700 border-orange-200",
    dark: "bg-orange-400/15 text-orange-200 border-orange-400/20"
  },
  Accessibility: {
    base: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "bg-emerald-400/15 text-emerald-200 border-emerald-400/20"
  },
  "Safety Incident": {
    base: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "bg-rose-400/15 text-rose-200 border-rose-400/20"
  }
};

const priorityStyles: Record<TicketPriority, BadgeTone> = {
  LOW: {
    base: "bg-slate-100 text-slate-700 border-slate-200",
    dark: "bg-slate-300/10 text-slate-200 border-slate-300/15"
  },
  MEDIUM: {
    base: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "bg-amber-400/15 text-amber-200 border-amber-400/20"
  },
  HIGH: {
    base: "bg-orange-50 text-orange-700 border-orange-200",
    dark: "bg-orange-400/15 text-orange-200 border-orange-400/20"
  },
  CRITICAL: {
    base: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "bg-rose-400/15 text-rose-200 border-rose-400/20"
  }
};

const statusStyles: Record<TicketStatus, BadgeTone> = {
  NEW: {
    base: "bg-sky-50 text-sky-700 border-sky-200",
    dark: "bg-sky-400/15 text-sky-200 border-sky-400/20"
  },
  ASSIGNED: {
    base: "bg-violet-50 text-violet-700 border-violet-200",
    dark: "bg-violet-400/15 text-violet-200 border-violet-400/20"
  },
  "IN PROGRESS": {
    base: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "bg-amber-400/15 text-amber-200 border-amber-400/20"
  },
  COMPLETED: {
    base: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "bg-emerald-400/15 text-emerald-200 border-emerald-400/20"
  }
};

function TicketBadge({
  value,
  tone,
  dark = false
}: {
  value: string;
  tone: BadgeTone;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        dark ? tone.dark : tone.base
      )}
    >
      {value}
    </span>
  );
}

export function CategoryBadge({
  category,
  dark = false
}: {
  category: TicketCategory;
  dark?: boolean;
}) {
  return <TicketBadge value={category} tone={categoryStyles[category]} dark={dark} />;
}

export function PriorityBadge({
  priority,
  dark = false
}: {
  priority: TicketPriority;
  dark?: boolean;
}) {
  return <TicketBadge value={priority} tone={priorityStyles[priority]} dark={dark} />;
}

export function StatusBadge({
  status,
  dark = false
}: {
  status: TicketStatus;
  dark?: boolean;
}) {
  return <TicketBadge value={status} tone={statusStyles[status]} dark={dark} />;
}
