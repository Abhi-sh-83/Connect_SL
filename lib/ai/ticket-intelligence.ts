import { z } from "zod";

import { buildFallbackAdvice, buildKnowledgeContext } from "@/lib/knowledge-base";
import { openai, openaiModel } from "@/lib/ai/openai";
import type { TicketCategory, TicketPriority } from "@/types/ticket";

const categoryValues = [
  "Route Inquiry",
  "Infrastructure",
  "Delay",
  "Accessibility",
  "Safety Incident"
] as const;

const priorityValues = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

const classificationSchema = z.object({
  category: z.enum(categoryValues),
  priority: z.enum(priorityValues),
  confidence: z.number().min(0).max(1),
  reason: z.string()
});

export async function predictCategoryAndPriority(query: string) {
  if (!openai) {
    return getFallbackClassification(query);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: openaiModel,
      response_format: {
        type: "json_object"
      },
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `You classify Sri Lankan public transit service desk tickets.

Return valid JSON with this exact shape:
{
  "category": "Route Inquiry" | "Infrastructure" | "Delay" | "Accessibility" | "Safety Incident",
  "priority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence": number,
  "reason": string
}

Guidelines:
- Cheap route, fare, timetable, general guidance -> Route Inquiry, LOW unless safety risk exists.
- Delays, cancellations, congestion, missed departures -> Delay, usually HIGH.
- Broken ramps, blocked access, elevator failures -> Accessibility, HIGH.
- Station damage, broken facilities, lighting, platform issues -> Infrastructure, MEDIUM unless dangerous.
- Derailments, fires, collisions, panic, injury, harassment, unsafe conditions -> Safety Incident, CRITICAL.`
        },
        {
          role: "user",
          content: query
        }
      ]
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error("Empty AI response");
    }

    const parsed = classificationSchema.parse(JSON.parse(rawContent));

    return {
      ...parsed,
      source: "openai" as const
    };
  } catch {
    return getFallbackClassification(query);
  }
}

export async function generateTravelAdvice(
  query: string,
  classification: {
    category: TicketCategory;
    priority: TicketPriority;
    confidence: number;
    reason: string;
    source: "openai" | "fallback";
  }
) {
  if (!openai) {
    return buildFallbackAdvice(query);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: openaiModel,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `You are the AI assistant for ConnectSL - Smart Transit Desk.

Use only the supplied knowledge base to generate practical travel advice or suggested resolution steps.
Keep the answer concise, actionable, and written as numbered steps.
If the issue is safety-related, prioritize escalation and passenger safety over route advice.

Mock knowledge base:
${buildKnowledgeContext(query)}`
        },
        {
          role: "user",
          content: `Commuter request: ${query}
Predicted category: ${classification.category}
Predicted priority: ${classification.priority}

Generate suggested resolution steps or travel advice.`
        }
      ]
    });

    return (
      completion.choices[0]?.message?.content?.trim() || buildFallbackAdvice(query)
    );
  } catch {
    return buildFallbackAdvice(query);
  }
}

function getFallbackClassification(query: string) {
  const lowerQuery = query.toLowerCase();

  const ruleChecks: Array<{
    matches: string[];
    category: TicketCategory;
    priority: TicketPriority;
    confidence: number;
    reason: string;
  }> = [
    {
      matches: ["derail", "collision", "fire", "panic", "unsafe", "injury", "harass"],
      category: "Safety Incident",
      priority: "CRITICAL",
      confidence: 0.98,
      reason: "The language indicates an urgent safety risk or emergency event."
    },
    {
      matches: ["wheelchair", "ramp", "accessible", "blind", "elderly", "lift"],
      category: "Accessibility",
      priority: "HIGH",
      confidence: 0.92,
      reason: "The request describes an accessibility blocker affecting passenger movement."
    },
    {
      matches: ["delay", "late", "cancel", "crowded", "breakdown", "stuck"],
      category: "Delay",
      priority: "HIGH",
      confidence: 0.9,
      reason: "The request describes a time-sensitive service disruption."
    },
    {
      matches: ["platform", "station", "toilet", "seat", "light", "bridge", "broken"],
      category: "Infrastructure",
      priority: "MEDIUM",
      confidence: 0.86,
      reason: "The request focuses on a facility or maintenance issue."
    }
  ];

  const matchedRule = ruleChecks.find((rule) =>
    rule.matches.some((keyword) => lowerQuery.includes(keyword))
  );

  if (matchedRule) {
    return {
      category: matchedRule.category,
      priority: matchedRule.priority,
      confidence: matchedRule.confidence,
      reason: matchedRule.reason,
      source: "fallback" as const
    };
  }

  return {
    category: "Route Inquiry" as const,
    priority: "LOW" as const,
    confidence: 0.94,
    reason: "The request appears to be a general route or fare inquiry.",
    source: "fallback" as const
  };
}
