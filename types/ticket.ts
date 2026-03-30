export const ticketCategories = [
  "Route Inquiry",
  "Infrastructure",
  "Delay",
  "Accessibility",
  "Safety Incident"
] as const;

export const priorityValues = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const statusValues = ["NEW", "ASSIGNED", "IN PROGRESS", "COMPLETED"] as const;

export type TicketCategory = (typeof ticketCategories)[number];
export type TicketPriority = (typeof priorityValues)[number];
export type TicketStatus = (typeof statusValues)[number];

export type Ticket = {
  id: string;
  passengerName?: string;
  query: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  advice: string;
  confidence: number;
  source: "openai" | "fallback";
  createdAt?: string;
  createdAtMs?: number;
  updatedAt?: string;
  updatedAtMs?: number;
};
