import transitKnowledgeBase from "@/data/transit-kb.json";

function normalize(text: string) {
  return text.toLowerCase();
}

function includesAny(source: string, keywords: string[]) {
  return keywords.some((keyword) => source.includes(keyword));
}

function collectRelevantItems(query: string) {
  const normalizedQuery = normalize(query);

  const relevantTrains = transitKnowledgeBase.trainRoutes.filter((route) =>
    includesAny(normalize(`${route.route} ${route.notes}`), [
      "veyangoda",
      "fort",
      "maradana",
      normalizedQuery
    ])
  );

  const relevantBuses = transitKnowledgeBase.busRoutes.filter((route) =>
    includesAny(normalize(`${route.name} ${route.majorStops.join(" ")} ${route.notes}`), [
      "colombo 7",
      "town hall",
      "fort",
      normalizedQuery
    ])
  );

  return {
    relevantTrains:
      relevantTrains.length > 0
        ? relevantTrains
        : transitKnowledgeBase.trainRoutes.slice(0, 2),
    relevantBuses:
      relevantBuses.length > 0 ? relevantBuses : transitKnowledgeBase.busRoutes.slice(0, 2),
    stationGuidance: transitKnowledgeBase.stationGuidance,
    travelTips: transitKnowledgeBase.travelTips
  };
}

export function buildKnowledgeContext(query: string) {
  return JSON.stringify(collectRelevantItems(query), null, 2);
}

export function buildFallbackAdvice(query: string) {
  const normalizedQuery = normalize(query);

  if (
    normalizedQuery.includes("veyangoda") &&
    (normalizedQuery.includes("colombo 7") || normalizedQuery.includes("colombo"))
  ) {
    const train = transitKnowledgeBase.trainRoutes[1];
    const bus = transitKnowledgeBase.busRoutes[0];
    const fortTransfer = transitKnowledgeBase.stationGuidance[0];
    const totalFare = train.fareLkr + bus.fareEstimateLkr;

    return [
      `1. Take the ${train.route} service departing at about ${train.departure} and arrive around ${train.arrival}.`,
      `2. From Fort, ${fortTransfer.transfer}`,
      `3. Board Route ${bus.routeNo} and get down near Town Hall or another Colombo 7 stop.`,
      `4. Estimated total fare is about LKR ${totalFare}, which is the cheapest path in the mock knowledge base.`,
      "5. If that train has already left, use the next available Veyangoda to Colombo train and keep the same Fort bus transfer."
    ].join("\n");
  }

  if (
    normalizedQuery.includes("derail") ||
    normalizedQuery.includes("fire") ||
    normalizedQuery.includes("panic")
  ) {
    return [
      "1. Escalate the issue to emergency response and rail operations immediately.",
      "2. Keep commuters away from the affected platform or line.",
      "3. Assign field staff to crowd control and passenger updates.",
      "4. Create a service advisory with alternate routes once the area is secured."
    ].join("\n");
  }

  if (
    normalizedQuery.includes("wheelchair") ||
    normalizedQuery.includes("accessible") ||
    normalizedQuery.includes("ramp")
  ) {
    return [
      "1. Notify the station manager and dispatch staff assistance right away.",
      "2. Redirect passengers to the nearest accessible entrance or platform path.",
      "3. Record the blocked infrastructure item for follow-up maintenance.",
      "4. Communicate a temporary workaround until accessibility is restored."
    ].join("\n");
  }

  return [
    "1. Review the commuter request and confirm the route, time, or incident details.",
    "2. Match the request against the mock bus and rail data included in the transit knowledge base.",
    "3. Suggest the lowest-cost available route or the safest escalation path based on the issue type.",
    "4. Keep the ticket open for operator verification if the commuter needs live confirmation."
  ].join("\n");
}

export const transitKnowledge = transitKnowledgeBase;

