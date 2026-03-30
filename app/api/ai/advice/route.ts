import { NextResponse } from "next/server";
import { z } from "zod";

import {
  generateTravelAdvice,
  predictCategoryAndPriority
} from "@/lib/ai/ticket-intelligence";

const adviceSchema = z.object({
  query: z.string().min(5, "Please enter a more detailed request.")
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = adviceSchema.parse(body);

    const classification = await predictCategoryAndPriority(query);
    const advice = await generateTravelAdvice(query, classification);

    return NextResponse.json({
      ...classification,
      advice
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate travel advice."
      },
      { status: 400 }
    );
  }
}

