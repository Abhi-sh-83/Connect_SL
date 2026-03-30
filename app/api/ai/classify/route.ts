import { NextResponse } from "next/server";
import { z } from "zod";

import { predictCategoryAndPriority } from "@/lib/ai/ticket-intelligence";

const classifySchema = z.object({
  query: z.string().min(5, "Please enter a more detailed request.")
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = classifySchema.parse(body);

    const classification = await predictCategoryAndPriority(query);

    return NextResponse.json(classification);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to classify this request."
      },
      { status: 400 }
    );
  }
}

