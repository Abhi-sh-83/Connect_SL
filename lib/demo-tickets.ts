import type { Ticket } from "@/types/ticket";

export const demoTickets: Ticket[] = [
  {
    id: "TKT-1024",
    passengerName: "Kavindi",
    query: "What is the cheapest way to travel from Veyangoda to Colombo 7 right now?",
    category: "Route Inquiry",
    priority: "LOW",
    status: "NEW",
    advice:
      "Take the 06:20 Veyangoda to Colombo Fort train, then transfer to Route 138 at Pettah/Fort. Estimated fare is around LKR 230 in total and it is the cheapest option in the mock knowledge base.",
    confidence: 0.94,
    source: "fallback",
    createdAt: "2026-03-30T04:10:00.000Z",
    createdAtMs: 1774843800000,
    updatedAt: "2026-03-30T04:10:00.000Z",
    updatedAtMs: 1774843800000
  },
  {
    id: "TKT-1025",
    passengerName: "Dilan",
    query: "The station ramp at Maradana is blocked and wheelchair access is difficult.",
    category: "Accessibility",
    priority: "HIGH",
    status: "IN PROGRESS",
    advice:
      "Escalate to the station manager immediately, redirect passengers to the nearest accessible entrance, and dispatch staff support because accessibility barriers can affect passenger safety.",
    confidence: 0.92,
    source: "fallback",
    createdAt: "2026-03-30T04:18:00.000Z",
    createdAtMs: 1774844280000,
    updatedAt: "2026-03-30T04:26:00.000Z",
    updatedAtMs: 1774844760000
  },
  {
    id: "TKT-1026",
    passengerName: "Ravin",
    query: "A train appears to have derailed near the yard. People are panicking.",
    category: "Safety Incident",
    priority: "CRITICAL",
    status: "ASSIGNED",
    advice:
      "Raise an emergency alert, isolate the affected area, direct commuters away from the line, and notify emergency services plus railway operations without delay.",
    confidence: 0.98,
    source: "fallback",
    createdAt: "2026-03-30T04:35:00.000Z",
    createdAtMs: 1774845300000,
    updatedAt: "2026-03-30T04:39:00.000Z",
    updatedAtMs: 1774845540000
  }
];

