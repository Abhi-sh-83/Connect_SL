import OpenAI from "openai";

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null;

export const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

