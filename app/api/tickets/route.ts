import { NextResponse } from "next/server";
import { z } from "zod";

import {
  generateTravelAdvice,
  predictCategoryAndPriority
} from "@/lib/ai/ticket-intelligence";
import { demoTickets } from "@/lib/demo-tickets";
import { getAdminDb } from "@/lib/firebase/admin";
import type { Ticket } from "@/types/ticket";

const ticketSchema = z.object({
  passengerName: z.string().trim().max(80).optional(),
  query: z.string().min(5, "Please enter a more detailed request.")
});

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getAdminDb();

  if (!db) {
    return NextResponse.json({
      tickets: demoTickets
    });
  }

  const snapshot = await db
    .collection("tickets")
    .orderBy("createdAtMs", "desc")
    .limit(50)
    .get();

  const tickets = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Ticket, "id">)
  }));

  return NextResponse.json({ tickets });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passengerName, query } = ticketSchema.parse(body);

    const classification = await predictCategoryAndPriority(query);
    const advice = await generateTravelAdvice(query, classification);
    const now = new Date();

    const baseTicket = {
      passengerName: passengerName || "Anonymous commuter",
      query,
      category: classification.category,
      priority: classification.priority,
      confidence: classification.confidence,
      status: "NEW" as const,
      advice,
      source: classification.source,
      createdAt: now.toISOString(),
      createdAtMs: now.getTime(),
      updatedAt: now.toISOString(),
      updatedAtMs: now.getTime()
    };

    const db = getAdminDb();

    if (!db) {
      return NextResponse.json({
        ticket: {
          id: crypto.randomUUID(),
          ...baseTicket
        }
      });
    }

    const docRef = db.collection("tickets").doc();
    await docRef.set(baseTicket);

    return NextResponse.json({
      ticket: {
        id: docRef.id,
        ...baseTicket
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to create the ticket."
      },
      { status: 400 }
    );
  }
}

