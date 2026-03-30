import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminDb } from "@/lib/firebase/admin";
import { statusValues } from "@/types/ticket";

const updateStatusSchema = z.object({
  status: z.enum(statusValues)
});

export async function PATCH(
  request: Request,
  context: { params: { ticketId: string } }
) {
  try {
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);

    const db = getAdminDb();

    if (!db) {
      return NextResponse.json({
        ok: true,
        ticketId: context.params.ticketId,
        status
      });
    }

    const now = new Date();

    await db.collection("tickets").doc(context.params.ticketId).set(
      {
        status,
        updatedAt: now.toISOString(),
        updatedAtMs: now.getTime()
      },
      { merge: true }
    );

    return NextResponse.json({
      ok: true,
      ticketId: context.params.ticketId,
      status
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to update the ticket."
      },
      { status: 400 }
    );
  }
}
